# VibeKit Studio

VibeKit Studio is a full-stack project building a sophisticated themed page-builder utilizing React, Netlify Functions, and PostgreSQL!

## Deliverables

### 1. Netlify Live URL
[INSERT YOUR NETLIFY DEPLOYED URL HERE]

### 2. GitHub Repository
[INSERT YOUR GITHUB REPO URL HERE]

### 3. Local setup instructions
To run the setup locally:
1. Ensure your `.env` contains the required keys (see below).
2. Install dependencies: `npm install`
3. Provision the database schema targeting your external PostgreSQL Database via Prisma:
   ```sh
   npx prisma db push
   ```
4. Run the development server (which spins up Vite alongside a mock Netlify Function environment):
   ```sh
   npx netlify dev
   ```

### 4. Env vars required
You must include the following variables inside the explicitly generated `.env` file or within the Netlify Production configuration respectively:
```env
DATABASE_URL="postgres://username:password@hostname/dbname?sslmode=require"
JWT_SECRET="your-development-secret-string"
```

### 5. Deployed URL
*(Same as the Netlify Live URL above)*
[INSERT YOUR NETLIFY DEPLOYED URL HERE]

### 6. Test user credentials
You can securely sign up via the app itself (the auth flow includes native client/server integration), however, you can utilize the following for testing if manually seeded:
**Email:** `test@vibekit.com`
**Password:** `password123`

### 7. Tradeoffs + what I'd improve next
- **Tradeoff: Simplified Component Payload**: Editor sections are stored as JSON strings rather than explicitly mapped relational entities for absolute layout fluidity, however, mapping these to strict schema tables would theoretically enable deep searchability.
- **Tradeoff: Local State for Builder vs Server Action Integration**: I utilize a standard React batch update strategy when reorganizing pages rather than syncing per-drag action to save concurrent server stress, meaning explicit saves are prioritized over arbitrary auto-saving.
- **Improvement: Drag and Drop capabilities**: Implementing `dnd-kit` to visually lift blocks within the Editor side panel instead of up/down arrow shifting.
- **Improvement: Image Asset storage**: Incorporating a standard S3 bucket or Supabase Storage API for direct user image uploads within the builder rather than solely accepting external URI pointers. 
- **Improvement: Granular Theme editing**: Expanding the "Vibe" configuration panel to securely expose explicit `--bg-color` or `--font-family` custom overwrites over preset themes! 
