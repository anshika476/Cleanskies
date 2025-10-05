import { Button } from "@/components/ui/button";
import { ArrowRight, Wind } from "lucide-react";
import { Link } from "react-router-dom";
{/*import heroBg from "/assets/hero-bg.jpg";*/}
import FactStrip from "./FactStrip";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      

      {/* Animated Cloud Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
          <Wind className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">Powered by NASA's TEMPO Satellite</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Predicting Cleaner,
          <br />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Safer Skies
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Real-time forecasts powered by NASA's TEMPO + AI
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="gradient-clean text-primary-foreground group">
              Check Air Quality Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="border-primary/20 hover:border-primary/40">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Inline Facts below CTA */}
        <div className="mt-10 flex justify-center">
          <FactStrip />
        </div>
      </div>
    </section>
  );
};

export default Hero;
