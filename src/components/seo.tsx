import React from "react";
import { useStaticQuery, graphql } from "gatsby";

interface SeoProps {
  title?: string;
  description?: string;
}

export function Seo({ title, description }: SeoProps) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  const siteTitle = site.siteMetadata.title;
  const siteDescription = site.siteMetadata.description;
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || siteDescription;

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="theme-color" content="#1a1612" />
    </>
  );
}
