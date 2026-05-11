import { useMemo, useState } from "react";
import { Image } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  /** Target render width in CSS px. Used to request a smaller image from Supabase. */
  width?: number;
  /** Image quality 1-100 (default 80). */
  quality?: number;
  /** fetchpriority hint for the browser. */
  priority?: "high" | "low" | "auto";
}

/**
 * Rewrites a Supabase public-object URL to the on-the-fly image render endpoint
 * so we serve a resized/compressed version instead of the full original.
 * Falls back to the original URL for non-Supabase or already-transformed URLs.
 */
const transformSupabaseUrl = (src: string, width?: number, quality = 80): string => {
  if (!src || !width) return src;
  if (!src.includes("/storage/v1/object/public/")) return src;
  // Skip SVG/GIF — transform doesn't support animated/vector well.
  if (/\.(svg|gif)(\?|$)/i.test(src)) return src;
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const w = Math.round(width * dpr);
  const rendered = src.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  const sep = rendered.includes("?") ? "&" : "?";
  return `${rendered}${sep}width=${w}&quality=${quality}&resize=cover`;
};

const SafeImage = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  width,
  quality = 80,
  priority,
}: SafeImageProps) => {
  const [fallback, setFallback] = useState(false);
  const [error, setError] = useState(false);
  const transformed = useMemo(() => transformSupabaseUrl(src, width, quality), [src, width, quality]);
  const finalSrc = fallback ? src : transformed;
  const fetchPriority = priority ?? (loading === "eager" ? "high" : "low");

  if (error || !src)
    return (
      <div className={`bg-secondary flex items-center justify-center ${className}`}>
        <Image size={24} className="text-muted-foreground" />
      </div>
    );
  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      // @ts-expect-error fetchpriority is a valid HTML attribute, types lag behind
      fetchpriority={fetchPriority}
      onError={() => {
        // If the transform endpoint fails (project without image transforms),
        // fall back to the original URL once before showing the placeholder.
        if (!fallback && transformed !== src) setFallback(true);
        else setError(true);
      }}
    />
  );
};

export default SafeImage;
