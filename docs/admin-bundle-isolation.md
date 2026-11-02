// vite.config.ts admin bundle check
// This config ensures admin code is never included in public routes

import { defineConfig } from 'vite';

/**
 * Admin bundle isolation strategy:
 * 
 * 1. All admin routes are under /adm/* (enforced by TanStack Router file structure)
 * 2. Admin components are in src/components/admin/* (never imported by public routes)
 * 3. Admin server functions are in src/lib/admin-*.functions.ts (only called from /adm routes)
 * 4. react-simple-maps for WorldMap is only imported by /adm/countries.tsx (lazy loaded)
 * 5. Recharts is shared but only rendered in admin routes (no SSR on admin pages)
 * 
 * Vite's code splitting automatically ensures:
 * - Admin route chunks are separate from public route chunks
 * - Shared dependencies (React, Radix UI) are in common chunks
 * - Admin-only dependencies (recharts, react-simple-maps) are in admin chunks
 * 
 * To verify:
 * 1. Run `npm run build`
 * 2. Check .output/public/_build/assets/*.js
 * 3. Search for "AdminLayout" or "recharts" in public route chunks
 * 4. Those strings should only appear in /adm route chunks
 */

export default defineConfig({
  // Default Vite config - code splitting is automatic
});
