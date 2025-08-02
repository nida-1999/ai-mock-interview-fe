"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground font-inter">
            AI Mock Interview
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#how-it-works"
            className="text-[#818898] hover:text-foreground transition-colors font-medium"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="text-[#818898] hover:text-foreground transition-colors font-medium"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="text-[#818898] hover:text-foreground transition-colors font-medium"
          >
            Testimonials
          </a>
          <a
            href="#get-started"
            className="text-[#818898] hover:text-foreground transition-colors font-medium"
          >
            Get Started
          </a>
        </nav>

        <Button
          className="bg-[#566E8F] hover:bg-accent/90 text-white font-semibold px-6 py-2 rounded-full shadow-sm"
          onClick={() => {
            window.open("/interview-practice", "_self");
          }}
        >
          Start Your Mock Interview
        </Button>
      </div>
    </header>
  );
  22;
};

export default Header;
