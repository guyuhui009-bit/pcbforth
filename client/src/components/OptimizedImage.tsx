import { useState } from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  eager?: boolean;
}

/**
 * Optimized image component:
 * - Defaults to lazy loading (set eager=true for above-the-fold images)
 * - Falls back to a placeholder on error
 */
export default function OptimizedImage({
  src,
  alt,
  fallback,
  eager = false,
  className = "",
  ...props
}: OptimizedImageProps) {
  const [errored, setErrored] = useState(false);

  const defaultFallback =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23EBF3FF'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236B8CB8' font-size='14' font-family='sans-serif'%3EPCB Image%3C/text%3E%3C/svg%3E";

  return (
    <img
      src={errored ? (fallback ?? defaultFallback) : src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
