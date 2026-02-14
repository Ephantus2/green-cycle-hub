import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { Mail, Lock, User, Phone, MapPin, Building2, Eye, EyeOff } from "lucide-react";

const userTypes = [
  { id: "producer", label: "Waste Producer", icon: User },
  { id: "recycling", label: "Recycling Company", icon: Building2 },
  { id: "incineration", label: "Incineration Company", icon: Building2 },
  { id: "admin", label: "Waste Management Co.", icon: Building2 },
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedType, setSelectedType] = useState("producer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const isCompany = selectedType !== "producer";

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg px-4"
        >
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-display font-bold text-foreground">Create Account</h1>
              <p className="text-muted-foreground text-sm mt-1">Join EcoSort AI today</p>
            </div>

            {/* User Type Selector */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedType === type.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{isCompany ? "Company Name" : "Full Name"}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder={isCompany ? "Company name" : "John Doe"} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="you@example.com" className="pl-10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="tel" placeholder="+254 700..." className="pl-10" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location / County</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Nairobi" className="pl-10" />
                </div>
              </div>

              {isCompany && (
                <div className="space-y-2">
                  <Label>Business License Number</Label>
                  <Input placeholder="License number" />
                </div>
              )}

              <Button variant="hero" type="submit" className="w-full mt-2">Create Account</Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Register;
