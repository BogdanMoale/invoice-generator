import Navbar from "@/components/navbar/navbar";
import HeroSection from "@/components/home/hero";
import FeatureSection from "@/components/home/features";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-between min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sky-600 via-blue-500 to-indigo-600">
        <HeroSection></HeroSection>
        <FeatureSection></FeatureSection>
      </main>
    </>
  );
}
