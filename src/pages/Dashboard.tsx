import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Camera, Package, Truck, CreditCard, MessageCircle,
  Upload, BarChart3, Recycle, Flame, AlertTriangle, Bell
} from "lucide-react";

const summaryCards = [
  { label: "Waste Uploads", value: "24", icon: Upload, color: "text-primary" },
  { label: "Pending Pickups", value: "3", icon: Truck, color: "text-warning" },
  { label: "Completed Orders", value: "18", icon: Package, color: "text-info" },
  { label: "Total Spent", value: "KES 4,200", icon: CreditCard, color: "text-primary" },
];

const recentAnalysis = [
  { type: "Recyclable", icon: Recycle, confidence: 96, item: "Plastic bottles", date: "2 hours ago" },
  { type: "Hazardous", icon: AlertTriangle, confidence: 89, item: "Old batteries", date: "Yesterday" },
  { type: "Burnable", icon: Flame, confidence: 92, item: "Paper waste", date: "2 days ago" },
];

const quickActions = [
  { label: "Upload Waste", icon: Camera, path: "/ai-analysis", variant: "hero" as const },
  { label: "My Orders", icon: Package, path: "/dashboard", variant: "secondary" as const },
  { label: "Chat", icon: MessageCircle, path: "/dashboard", variant: "secondary" as const },
  { label: "Companies", icon: Recycle, path: "/companies", variant: "secondary" as const },
];

const Dashboard = () => {
  return (
    <Layout>
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Welcome back, John</p>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">3</span>
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {summaryCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <card.icon className={`w-6 h-6 ${card.color} mb-3`} />
                <div className="text-2xl font-display font-bold text-foreground">{card.value}</div>
                <div className="text-xs text-muted-foreground">{card.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.path}>
                    <Button variant={action.variant} className="w-full h-auto py-4 flex-col gap-2">
                      <action.icon className="w-5 h-5" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Analysis */}
            <div className="lg:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-foreground">Recent AI Analysis</h2>
                <Link to="/ai-analysis">
                  <Button variant="ghost" size="sm" className="text-primary">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {recentAnalysis.map((item) => (
                  <div key={item.item} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm">{item.item}</div>
                      <div className="text-xs text-muted-foreground">{item.type} • {item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">{item.confidence}%</div>
                      <div className="text-xs text-muted-foreground">confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nearby Companies Preview */}
          <div className="mt-6 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-foreground">Nearby Companies</h2>
              <Link to="/companies"><Button variant="ghost" size="sm" className="text-primary">See All</Button></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["GreenCycle Ltd", "EcoFlame Industries", "CleanCity Recyclers"].map((name, i) => (
                <div key={name} className="p-4 rounded-lg bg-secondary/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {i === 1 ? <Flame className="w-5 h-5 text-primary" /> : <Recycle className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{name}</div>
                    <div className="text-xs text-muted-foreground">{i === 1 ? "Incineration" : "Recycling"} • 2.{i + 1}km away</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
