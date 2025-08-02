import { UserCheck, MessageCircle, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserCheck,
      title: "Choose Your Role & Level",
      description:
        "Select your target position, experience level, and industry to get personalized interview questions.",
      step: "01",
    },
    {
      icon: MessageCircle,
      title: "Start Talking to Our AI Interviewer",
      description:
        "Engage in natural conversation with our advanced AI that adapts to your responses in real-time.",
      step: "02",
    },
    {
      icon: TrendingUp,
      title: "Get Instant Feedback & Improve",
      description:
        "Receive detailed analysis of your performance with actionable tips to enhance your interview skills.",
      step: "03",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 font-inter">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get interview-ready in three simple steps with our AI-powered
            platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-accent to-gold transform -translate-x-1/2 z-0"></div>
                )}

                <div className="relative z-10 bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#566E8F]  rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-4 font-inter">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-gold/5 rounded-2xl p-8 border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4 font-inter">
              Ready to Start Practicing?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of successful candidates who've improved their
              interview skills with our AI platform.
            </p>
            <button className="bg-[#566E8F] hover:to-gold/90 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
