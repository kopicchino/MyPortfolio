/**
 * lib/seo.ts
 * SEO metadata generators for all pages.
 */

import type { Metadata } from "next";
import type { Profile, Settings } from "@/types";

const BASE_META = {
  robots: { index: true, follow: true },
  referrer: "origin-when-cross-origin" as const,
  formatDetection: { email: false, address: false, telephone: false },
};

export function generateHomeMetadata(profile: Profile): Metadata {
  const title = `${profile.name} | ${profile.title}`;
  const description = profile.tagline + " " + profile.bio.slice(0, 120) + "...";

  return {
    ...BASE_META,
    title,
    description,
    keywords: [
      profile.name,
      profile.title,
      "portfolio",
      "developer",
      "BSIT",
      "TUP",
      "web development",
      "Philippines",
    ],
    authors: [{ name: profile.name }],
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: profile.avatar || "/og-image.jpg", width: 1200, height: 630, alt: profile.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [profile.avatar || "/og-image.jpg"],
    },
  };
}

export function generatePageMetadata(
  pageTitle: string,
  description: string,
  settings: Settings
): Metadata {
  const title = `${pageTitle} | ${settings.siteTitle}`;

  return {
    ...BASE_META,
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: settings.siteTitle,
      images: [{ url: settings.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [settings.ogImage],
    },
  };
}
