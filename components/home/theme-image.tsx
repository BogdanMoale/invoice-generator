"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image, { ImageProps } from "next/image";

interface ThemedImageProps extends Omit<ImageProps, "src"> {
  srcLightDesktop: string;
  srcDarkDesktop: string;
  srcLightMobile?: string;
  srcDarkMobile?: string;
  disableOnMobile?: boolean;
}

const ThemedImage: React.FC<ThemedImageProps> = ({
  srcLightDesktop,
  srcDarkDesktop,
  srcLightMobile,
  srcDarkMobile,
  alt,
  width,
  height,
  disableOnMobile = false,
  ...props
}) => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile or desktop screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    setIsMobile(mediaQuery.matches);

    // Add event listener for screen size changes
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  if (disableOnMobile && isMobile) {
    return null;
  }

  const getImageSrc = (): string => {
    if (theme === "dark") {
      return isMobile && srcDarkMobile ? srcDarkMobile : srcDarkDesktop;
    } else {
      return isMobile && srcLightMobile ? srcLightMobile : srcLightDesktop;
    }
  };

  return (
    <Image
      src={getImageSrc()}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default ThemedImage;
