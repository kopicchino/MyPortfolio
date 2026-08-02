/**
 * app/admin/page.tsx — Redirect /admin → /admin/dashboard
 */
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export default function AdminRoot() {
  redirect("/admin/dashboard");
}
