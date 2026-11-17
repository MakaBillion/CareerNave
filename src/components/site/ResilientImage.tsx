import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ResilientImage({ src, alt, className = "" }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-neutral-100 to-neutral-200 p-6 text-center text-ink/50 ${className}`}
      >
        <ImageOff className="h-8 w-8 text-crimson/60" strokeWidth={1.5} />
        <span className="max-w-xs text-xs font-medium leading-relaxed">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
