import React from "react";
import { GatsbyImage, getImage, type IGatsbyImageData } from "gatsby-plugin-image";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface EntityImageData {
  childImageSharp?: {
    gatsbyImageData?: IGatsbyImageData | null;
  } | null;
}

interface EntityImageProps {
  image?: EntityImageData | null;
  alt: string;
  icon: LucideIcon;
  className?: string;
}

/**
 * Renders a GatsbyImage when a processed image is available, otherwise a
 * themed CSS fallback card with the entity's icon. Vault notes frequently
 * have no image or point at PlaceholderImage.png (normalized to null), so the
 * fallback is the common case, not the exception.
 */
export function EntityImage({ image, alt, icon: Icon, className }: EntityImageProps) {
  const gatsbyImage = image ? getImage(image as any) : null;

  if (gatsbyImage) {
    return (
      <GatsbyImage
        image={gatsbyImage}
        alt={alt}
        className={cn("h-full w-full", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary via-card to-background",
        className,
      )}
      aria-label={alt}
      role="img"
    >
      <Icon className="h-1/4 w-1/4 max-h-16 max-w-16 text-primary/30" />
    </div>
  );
}
