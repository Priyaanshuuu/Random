import { Hero } from "@/components/Landing/Hero";
import { Features } from "@/components/Landing/Features";
import { Architecture } from "@/components/Landing/Architecture";
import { Footer } from "@/components/Landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <Hero />
        <Features />
        <Architecture />
      </main>
      <Footer />
    </div>
  );
}
