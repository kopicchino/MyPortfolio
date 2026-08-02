/**
 * app/api/auth/[...nextauth]/route.ts
 * NextAuth.js route handler — handles sign in, sign out, session, etc.
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
