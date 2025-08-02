import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
      </main>
    </div>
  );
};

export default Index;
