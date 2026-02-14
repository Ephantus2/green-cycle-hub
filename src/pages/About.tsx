import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Target, Eye, Heart, Recycle, Brain, Shield, Users } from "lucide-react";

const values = [
  { icon: Brain, title: "AI Innovation", desc: "Leveraging cutting-edge AI to classify waste accurately and efficiently." },
  { icon: Shield, title: "Environmental Safety", desc: "Ensuring hazardous waste is handled by licensed, verified companies." },
  { icon: Users, title: "Community First", desc: "Building a cleaner future together through accessible technology." },
  { icon: Recycle, title: "Sustainability", desc: "Promoting circular economy through smart recycling and reuse." },
];

const About = () => (
  <Layout>
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">About EcoSort AI</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to revolutionize waste management in Kenya and beyond using artificial intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="green-card p-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-7 h-7" />
              <h2 className="text-xl font-display font-bold">Our Vision</h2>
            </div>
            <p className="opacity-90">
              A world where every piece of waste is properly classified and directed to the right disposal channel — powered by technology, driven by community action.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="green-card p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-7 h-7" />
              <h2 className="text-xl font-display font-bold">Our Mission</h2>
            </div>
            <p className="opacity-90">
              To provide an accessible, AI-powered platform that connects waste producers with recycling and incineration services, reducing environmental pollution.
            </p>
          </motion.div>
        </div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-card p-8 mb-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4 text-center">How the System Works</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>EcoSort AI uses advanced image recognition and machine learning models to classify waste materials from photos uploaded by users.</p>
            <p>Once classified, the system recommends the best disposal method — whether that's recycling, composting, or controlled incineration — and connects you with verified local companies who can handle the waste responsibly.</p>
            <p>Users can request pickups, track their orders, make payments, and chat with service providers — all within one unified platform.</p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Our Values</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
