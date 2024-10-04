import { Button } from "@/components/ui/button";
import { LogginButton } from "@/components/auth/loggin-button";
import Image from "next/image";
import ThemedImage from "@/components/home/theme-image";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow space-y-6 pt-16">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg animate-pulse">
        Invoiceraptor
      </h1>
      <p className="text-white text-lg text-center max-w-2xl px-4">
        Generate professional invoices in seconds with our easy-to-use platform.
        Perfect for freelancers, small businesses, and entrepreneurs.
      </p>
      <ThemedImage
        srcLightDesktop="/hero/desktop/light/hero1.png"
        srcDarkDesktop="/hero/desktop/dark/hero1.png"
        srcLightMobile="/hero/mobile/light/hero1.png"
        srcDarkMobile="/hero/mobile/dark/hero1.png"
        alt="Page Hero1"
        width={1024}
        height={632}
        priority
        className="w-full h-auto"
      />
      <ThemedImage
        srcLightDesktop="/hero/desktop/light/hero2.png"
        srcDarkDesktop="/hero/desktop/dark/hero2.png"
        alt="Page Hero2"
        width={1024}
        height={632}
        priority
        disableOnMobile={true}
        className="w-full h-auto"
      />

      <div className="flex justify-center space-x-6">
        <LogginButton>
          <Button
            variant="secondary"
            className="text-xl px-8 py-4 shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </Button>
        </LogginButton>
      </div>
    </div>
  );
};

export default HeroSection;
