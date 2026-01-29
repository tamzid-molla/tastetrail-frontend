"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

const DefaultFallback = ({ className }) => (
  <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className || ""}`}>
    <span className="text-gray-400">No Image</span>
  </div>
);

export default function SafeImage({ src, alt, fallback, ...props }) {
  const [errored, setErrored] = useState(false);

  const isValid = useMemo(() => {
    return typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"));
  }, [src]);

  if (!isValid || errored) {
    return fallback || <DefaultFallback />;
  }

  return <Image src={src} alt={alt || ""} onError={() => setErrored(true)} {...props} />;
}
