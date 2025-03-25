import Image from 'next/image';
import { useState } from 'react';

interface TokenIconProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export default function TokenIcon({ src, alt, size = 24, className = '' }: TokenIconProps) {
  const [error, setError] = useState(false);

  const fallbackIcon = '/icons/default-token.svg';

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-[#1F2937] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={error ? fallbackIcon : src}
        alt={alt}
        width={size}
        height={size}
        className="object-contain"
        onError={() => setError(true)}
        priority
      />
    </div>
  );
}