import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Recycle, Flame, MapPin, Star, CheckCircle2, Phone, Truck } from "lucide-react";
import { companies, type Company } from "@/data/companies";
import PickupRequestDialog from "./PickupRequestDialog";

interface CompanyListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wasteType?: string;
  wasteItem?: string;
  mode: "find" | "pickup";
}

const CompanyListDialog = ({ open, onOpenChange, wasteType, wasteItem, mode }: CompanyListDialogProps) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [pickupOpen, setPickupOpen] = useState(false);

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setPickupOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {mode === "find" ? "Nearby Companies" : "Select a Company for Pickup"}
            </DialogTitle>
            {wasteType && (
              <p className="text-sm text-muted-foreground">For: {wasteItem || wasteType}</p>
            )}
          </DialogHeader>

          <div className="space-y-3">
            {companies.map((company) => (
              <div
                key={company.id}
                className="p-4 rounded-lg border border-border/50 bg-secondary/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${company.type === "recycling" ? "bg-primary/10" : "bg-warning/10"}`}>
                      {company.type === "recycling" ? <Recycle className="w-4 h-4 text-primary" /> : <Flame className="w-4 h-4 text-warning" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{company.name}</h3>
                      <span className="text-xs text-muted-foreground capitalize">{company.type}</span>
                    </div>
                  </div>
                  {company.verified && (
                    <span className="flex items-center gap-1 text-primary text-xs">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {company.location} • {company.distance}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning" /> {company.rating}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {company.phone}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {company.materials.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{m}</span>
                  ))}
                </div>

                <Button variant="hero" size="sm" className="w-full" onClick={() => handleSelectCompany(company)}>
                  <Truck className="w-3.5 h-3.5" /> Request Pickup
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <PickupRequestDialog
        open={pickupOpen}
        onOpenChange={setPickupOpen}
        company={selectedCompany}
        wasteType={wasteType}
        wasteItem={wasteItem}
      />
    </>
  );
};

export default CompanyListDialog;
