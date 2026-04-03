import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Auth middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const router = express.Router();

// --- Auth Endpoints ---
router.post("/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

// --- Pages Endpoints (Authenticated) ---
router.get("/pages", authMiddleware, async (req: any, res: any) => {
  const pages = await prisma.page.findMany({ where: { userId: req.user.userId } });
  res.json(pages);
});

router.post("/pages", authMiddleware, async (req: any, res: any) => {
  const { title, slug, theme, sections } = req.body;
  try {
    const page = await prisma.page.create({
      data: {
        title, slug, theme, sections: JSON.stringify(sections),
        userId: req.user.userId
      }
    });
    res.json(page);
  } catch (err) {
    res.status(400).json({ error: "Could not create page" });
  }
});

router.get("/pages/:id", authMiddleware, async (req: any, res: any) => {
  const page = await prisma.page.findFirst({
    where: { id: req.params.id, userId: req.user.userId }
  });
  if (!page) return res.status(404).json({ error: "Not found" });
  res.json({ ...page, sections: JSON.parse(page.sections) });
});

router.put("/pages/:id", authMiddleware, async (req: any, res: any) => {
  const { title, slug, theme, sections } = req.body;
  try {
    const page = await prisma.page.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data: { title, slug, theme, sections: JSON.stringify(sections) }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

router.post("/pages/:id/publish", authMiddleware, async (req: any, res: any) => {
  await prisma.page.updateMany({
    where: { id: req.params.id, userId: req.user.userId },
    data: { isPublished: true }
  });
  res.json({ success: true });
});

router.post("/pages/:id/unpublish", authMiddleware, async (req: any, res: any) => {
  await prisma.page.updateMany({
    where: { id: req.params.id, userId: req.user.userId },
    data: { isPublished: false }
  });
  res.json({ success: true });
});

router.post("/pages/:id/duplicate", authMiddleware, async (req: any, res: any) => {
  const page = await prisma.page.findFirst({ where: { id: req.params.id, userId: req.user.userId } });
  if (!page) return res.status(404).json({ error: "Not found" });
  const newPage = await prisma.page.create({
    data: {
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy-${Date.now()}`,
      theme: page.theme,
      sections: page.sections,
      userId: req.user.userId
    }
  });
  res.json({ ...newPage, sections: JSON.parse(newPage.sections) });
});

// --- Public Endpoints ---
router.get("/public/pages/:slug", async (req: any, res: any) => {
  const page = await prisma.page.findFirst({
    where: { slug: req.params.slug, isPublished: true }
  });
  if (!page) return res.status(404).json({ error: "Not found" });
  res.json({ ...page, sections: JSON.parse(page.sections) });
});

router.post("/public/pages/:slug/view", async (req: any, res: any) => {
  const page = await prisma.page.findFirst({ where: { slug: req.params.slug } });
  if (!page) return res.status(404).json({ error: "Not found" });
  await prisma.page.update({
    where: { id: page.id },
    data: { viewCount: page.viewCount + 1 }
  });
  res.json({ success: true });
});

router.post("/public/pages/:slug/contact", async (req: any, res: any) => {
  const page = await prisma.page.findFirst({ where: { slug: req.params.slug } });
  if (!page) return res.status(404).json({ error: "Not found" });
  
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  await prisma.contactSubmission.create({
    data: { name, email, message, pageId: page.id }
  });
  res.json({ success: true });
});

app.use(["/.netlify/functions/api", "/api"], router);

export const handler = serverless(app);
