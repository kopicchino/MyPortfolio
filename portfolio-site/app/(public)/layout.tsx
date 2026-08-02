/**
 * app/(public)/layout.tsx
 * Layout for all public-facing portfolio pages.
 * Server component — reads profile + settings server-side.
 * Dynamically hides navigation links for empty data sections.
 */

import {
  getProfile,
  getSettings,
  getCertifications,
  getGallery,
  getExperience,
  getEvents,
} from "@/lib/data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const profile = getProfile();
  const settings = getSettings();

  const certs = getCertifications();
  const gallery = getGallery();
  const exp = getExperience();
  const events = getEvents();

  // Filter out nav links for sections that are empty
  const activeNavLinks = settings.nav.links.filter((link) => {
    if (link.href === "/certifications" && certs.length === 0) return false;
    if (link.href === "/gallery" && gallery.length === 0) return false;
    if (link.href === "/experience" && exp.length === 0) return false;
    if (link.href === "/events" && events.length === 0) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar siteName={settings.nav.logo} links={activeNavLinks} />
      <main className="flex-1">{children}</main>
      <Footer profile={profile} settings={settings} />
    </div>
  );
}
