"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src?: string;
  alt: string;
}

export default function SafeImage({ src, alt }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || "/img/placeholder.jpg");
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setImgSrc("/img/placeholder.jpg")}
    />
  );
}
