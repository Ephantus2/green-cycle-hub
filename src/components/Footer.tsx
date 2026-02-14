import { Link } from "react-router-dom";
import { Recycle, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 bg-card/50">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Recycle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">EcoSort AI</span>
          </div>
          <p className="text-muted-foreground text-sm">AI-powered waste management for a cleaner, greener future.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            <Link to="/companies" className="text-muted-foreground hover:text-primary transition-colors">Companies</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Services</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/ai-analysis" className="text-muted-foreground hover:text-primary transition-colors">AI Analysis</Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Register</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> info@ecosort.ai</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +254 700 000 000</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Nairobi, Kenya</div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/30 mt-8 pt-6 text-center text-sm text-muted-foreground">
        © 2026 EcoSort AI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
