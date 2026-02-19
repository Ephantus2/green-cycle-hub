import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Recycle, Flame, MapPin, Phone, Search, Star, CheckCircle2, Truck } from "lucide-react";
import { useState } from "react";
import { companies, type Company } from "@/data/companies";
import PickupRequestDialog from "@/components/PickupRequestDialog";

const Companies = () => {
  const [filter, setFilter] = useState<"all" | "recycling" | "incineration">("all");
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [pickupOpen, setPickupOpen] = useState(false);

  const filtered = companies.filter((c) => {
    if (filter !== "all" && c.type !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleRequestPickup = (company: Company) => {
    setSelectedCompany(company);
    setPickupOpen(true);
  };

  return (
    <Layout>
      <section className="py-12 min-h-[85vh]">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Partner Companies</h1>
            <p className="text-muted-foreground">Verified recycling and incineration companies near you</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
            <div className="flex gap-2">
              {(["all", "recycling", "incineration"] as const).map((f) => (
                <Button key={f} variant={filter === f ? "hero" : "secondary"} size="sm" onClick={() => setFilter(f)}>
                  {f === "recycling" && <Recycle className="w-4 h-4" />}
                  {f === "incineration" && <Flame className="w-4 h-4" />}
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 hover:glow-border transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${company.type === "recycling" ? "bg-primary/10" : "bg-warning/10"}`}>
                      {company.type === "recycling" ? <Recycle className="w-5 h-5 text-primary" /> : <Flame className="w-5 h-5 text-warning" />}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-sm">{company.name}</h3>
                      <span className="text-xs text-muted-foreground capitalize">{company.type}</span>
                    </div>
                  </div>
                  {company.verified && (
                    <div className="flex items-center gap-1 text-primary text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" /> {company.location} • {company.distance}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-3.5 h-3.5 text-warning" /> {company.rating}/5
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" /> {company.phone}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {company.materials.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{m}</span>
                  ))}
                </div>

                <Button variant="hero" size="sm" className="w-full" onClick={() => handleRequestPickup(company)}>
                  <Truck className="w-4 h-4" /> Request Pickup
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PickupRequestDialog
        open={pickupOpen}
        onOpenChange={setPickupOpen}
        company={selectedCompany}
      />
    </Layout>
  );
};

export default Companies;
