import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";
// import heroImage from "@/assets/hero-laptop.jpg";

const HeroSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-secondary/30 to-muted">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-gold/20  px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-[#363D49] leading-tight font-inter">
                Nail Your Next Interview with{" "}
                <span className="text-[#566E8F]">Confidence</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Practice real-time AI mock interviews with instant feedback,
                tailored to your career goals and industry requirements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#566E8F] text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Play className="w-5 h-5 mr-2" />
                Try for Free
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-200"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">
                  Interviews Practiced
                </div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">4.9★</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="relative z-10 bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
              <img
                src={"hero-laptop.jpg"}
                alt="AI Mock Interview Platform"
                className="w-full h-auto"
              />
            </div>

            {/* Floating elements for visual appeal */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
