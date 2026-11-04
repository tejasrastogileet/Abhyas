import { useEffect } from "react";
import { BRAND_NAME } from "../config/brand";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://devs-olive.vercel.app";

interface PageSeoOptions {
  title: string;
  description: string;
  noIndex?: boolean;
  image?: string;
}

const setMeta = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
};

export const usePageSeo = ({
  title,
  description,
  noIndex = false,
  image = "/assets/logo-full.svg",
}: PageSeoOptions) => {
  useEffect(() => {
    const pageTitle = `${title} | ${BRAND_NAME}`;
    const canonicalUrl = new URL(window.location.pathname, SITE_URL).toString();
    const imageUrl = new URL(image, SITE_URL).toString();

    document.title = pageTitle;
    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex,nofollow" : "index,follow");
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [title, description, noIndex, image]);
};