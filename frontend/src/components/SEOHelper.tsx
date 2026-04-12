"use client";

import { useEffect } from "react";

interface SEOHelperProps {
  pageType: "roadmap" | "analytics" | "dashboard" | "home";
  data?: any;
}

export default function SEOHelper({ pageType, data }: SEOHelperProps) {
  useEffect(() => {
    // This would typically involve a call to the automation_service
    // For this prototype, we generate the JSON-LD client-side
    const schema = {
      "@context": "https://schema.org",
      "@type": pageType === "roadmap" ? "Course" : "WebPage",
      "name": data?.title || "AI Interview Prep",
      "description": data?.description || "Master your next interview with Precision.",
      "provider": {
        "@type": "Organization",
        "name": "PrepAI"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [pageType, data]);

  return null;
}
