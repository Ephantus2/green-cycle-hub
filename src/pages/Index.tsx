import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Camera, Recycle, Flame, Truck, Brain, Shield, BarChart3, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const steps = [
  { icon: Camera, title: "Upload Photo", desc: "Take a photo of your waste material" },
  { icon: Brain, title: "AI Analyzes", desc: "Our AI identifies the waste type instantly" },
  { icon: Recycle, title: "Get Recommendation", desc: "Receive recycling or disposal guidance" },
  { icon: Truck, title: "Request Pickup", desc: "Schedule a pickup from nearby companies" },
];

const stats = [
  { value: "50K+", label: "Waste Items Analyzed" },
  { value: "200+", label: "Partner Companies" },
  { value: "95%", label: "AI Accuracy" },
  { value: "30+", label: "Counties Covered" },
];

const features = [
  { icon: Brain, title: "AI Classification", desc: "Instantly classify waste as recyclable, organic, hazardous, or burnable with high accuracy." },
  { icon: Recycle, title: "Smart Recycling", desc: "Connect with verified recycling companies near you for responsible waste disposal." },
  { icon: Flame, title: "Safe Incineration", desc: "Find licensed incineration facilities for waste that cannot be recycled." },
  { icon: Shield, title: "Verified Companies", desc: "All partner companies are license-verified and quality-assured." },
  { icon: Truck, title: "Pickup Service", desc: "Request waste pickup and track it in real-time from your dashboard." },
  { icon: BarChart3, title: "Analytics", desc: "Track your waste footprint and contribute to city-wide environmental data." },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Brain className="w-4 h-4" /> AI-Powered Waste Management
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Smart Waste Sorting for a{" "}
              <span className="text-gradient">Cleaner Future</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Upload waste photos, let AI classify them, and connect with recycling and incineration companies — all in one platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button variant="hero" size="lg">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="hero-outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Four simple steps to responsible waste management</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="green-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-sm font-medium opacity-70 mb-1">Step {i + 1}</div>
                <h3 className="text-lg font-display font-semibold mb-2">{step.title}</h3>
                <p className="text-sm opacity-80">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Platform Features</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Everything you need for smart waste management</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:glow-border transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="green-card p-10 md:p-16 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg opacity-80 mb-8 max-w-lg mx-auto">
              Join thousands of users and companies working together for cleaner cities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                  Register Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
