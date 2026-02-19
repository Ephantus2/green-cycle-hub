import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, MapPin, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Company } from "@/data/companies";

interface PickupRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  wasteType?: string;
  wasteItem?: string;
}

const PickupRequestDialog = ({ open, onOpenChange, company, wasteType, wasteItem }: PickupRequestDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    preferred_date: "",
    preferred_time: "morning",
    location: "",
    waste_description: wasteItem || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !company) {
      toast.error("Please sign in to request a pickup.");
      return;
    }
    if (!form.preferred_date || !form.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("pickup_requests").insert({
        user_id: user.id,
        company_id: company.id,
        company_name: company.name,
        waste_type: wasteType || "general",
        waste_description: form.waste_description.slice(0, 500),
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        location: form.location.slice(0, 255),
        status: "pending",
      });

      if (error) throw error;
      toast.success("Pickup request sent! The company will review your request.");
      onOpenChange(false);
      setForm({ preferred_date: "", preferred_time: "morning", location: "", waste_description: wasteItem || "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Request Pickup from {company.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-lg bg-secondary/50 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {company.location} • {company.distance} away
            </div>
            {wasteType && (
              <div className="mt-1 text-xs text-primary">Waste type: {wasteType}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Pickup Location *</Label>
            <Input
              id="location"
              placeholder="e.g. Westlands, Nairobi"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              maxLength={255}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={form.preferred_date}
                onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time *
              </Label>
              <select
                id="time"
                value={form.preferred_time}
                onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="morning">Morning (8-12)</option>
                <option value="afternoon">Afternoon (12-5)</option>
                <option value="evening">Evening (5-8)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              placeholder="Describe the waste items..."
              value={form.waste_description}
              onChange={(e) => setForm({ ...form, waste_description: e.target.value })}
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="hero" className="flex-1" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Request"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PickupRequestDialog;
