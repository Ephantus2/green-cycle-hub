import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import {
  Star, Gift, ShoppingCart, Phone, Tag, History,
  Loader2, CheckCircle2, Zap, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

type RedemptionType = "supermarket" | "airtime" | "brand_offer";

interface RedemptionOption {
  type: RedemptionType;
  label: string;
  description: string;
  icon: typeof ShoppingCart;
  minPoints: number;
  color: string;
  bgColor: string;
  examples: string[];
}

const redemptionOptions: RedemptionOption[] = [
  {
    type: "supermarket",
    label: "Supermarket Discount",
    description: "Redeem points for vouchers at Naivas, Carrefour & Quickmart",
    icon: ShoppingCart,
    minPoints: 50,
    color: "text-primary",
    bgColor: "bg-primary/10",
    examples: ["Naivas", "Carrefour", "Quickmart"],
  },
  {
    type: "airtime",
    label: "Airtime Top-Up",
    description: "Convert points directly to airtime on Safaricom, Airtel or Telkom",
    icon: Phone,
    minPoints: 20,
    color: "text-info",
    bgColor: "bg-info/10",
    examples: ["Safaricom", "Airtel", "Telkom"],
  },
  {
    type: "brand_offer",
    label: "Brand Offers",
    description: "Exclusive deals from Java, KFC, Jumia, Uber & more",
    icon: Tag,
    minPoints: 100,
    color: "text-warning",
    bgColor: "bg-warning/10",
    examples: ["Java House", "KFC", "Jumia", "Uber"],
  },
];

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

interface Redemption {
  id: string;
  points_used: number;
  redemption_type: string;
  qr_code: string;
  status: string;
  created_at: string;
}

const Points = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"redeem" | "history">("redeem");

  // Redemption flow state
  const [selectedOption, setSelectedOption] = useState<RedemptionOption | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  // QR dialog
  const [qrData, setQrData] = useState<{ qr: string; type: string; points: number } | null>(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [{ data: bal }, { data: txns }, { data: reds }] = await Promise.all([
        supabase.rpc("get_user_points_balance", { _user_id: user.id }),
        supabase.from("points_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
        supabase.from("redemptions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      setBalance(bal ?? 0);
      setTransactions(txns ?? []);
      setRedemptions(reds ?? []);
    } catch {
      toast.error("Failed to load points data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRedeem = async () => {
    if (!user || !selectedOption) return;
    const pts = parseInt(pointsToRedeem, 10);
    if (!pts || pts < selectedOption.minPoints) {
      toast.error(`Minimum ${selectedOption.minPoints} points required.`);
      return;
    }
    if (pts > balance) {
      toast.error("Insufficient points balance.");
      return;
    }

    setRedeeming(true);
    try {
      // Generate unique QR payload
      const qrPayload = JSON.stringify({
        redemption_id: crypto.randomUUID(),
        user_id: user.id,
        type: selectedOption.type,
        points: pts,
        timestamp: Date.now(),
      });

      const [txnRes, redRes] = await Promise.all([
        supabase.from("points_transactions").insert({
          user_id: user.id,
          amount: pts,
          type: "redeemed",
          description: `Redeemed for ${selectedOption.label}`,
        }),
        supabase.from("redemptions").insert({
          user_id: user.id,
          points_used: pts,
          redemption_type: selectedOption.type,
          qr_code: qrPayload,
        }).select().single(),
      ]);

      if (txnRes.error) throw txnRes.error;
      if (redRes.error) throw redRes.error;

      setQrData({ qr: qrPayload, type: selectedOption.label, points: pts });
      setSelectedOption(null);
      setPointsToRedeem("");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Redemption failed.");
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <Layout>
      <section className="py-12 min-h-[85vh]">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Loyalty Points</h1>
            <p className="text-muted-foreground">Earn 20 points for every KES 1,000 spent. Redeem for discounts, airtime & more.</p>
          </motion.div>

          {/* Balance Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="green-card p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)" }} />
            <Star className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <div className="text-6xl font-display font-bold mb-1">
              {loading ? <Loader2 className="w-10 h-10 animate-spin mx-auto" /> : balance.toLocaleString()}
            </div>
            <div className="text-primary-foreground/80 text-sm">Available Points</div>
            <div className="mt-3 text-xs text-primary-foreground/60">≈ KES {(balance * 1).toLocaleString()} value</div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["redeem", "history"] as const).map((t) => (
              <Button key={t} variant={tab === t ? "hero" : "secondary"} size="sm" onClick={() => setTab(t)}>
                {t === "redeem" ? <><Gift className="w-4 h-4" /> Redeem Points</> : <><History className="w-4 h-4" /> History</>}
              </Button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "redeem" ? (
              <motion.div key="redeem" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {!selectedOption ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">Choose how you'd like to redeem your points:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {redemptionOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <motion.button
                            key={opt.type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setSelectedOption(opt); setPointsToRedeem(""); }}
                            className="glass-card p-5 text-left hover:glow-border transition-all"
                          >
                            <div className={`w-12 h-12 rounded-xl ${opt.bgColor} flex items-center justify-center mb-4`}>
                              <Icon className={`w-6 h-6 ${opt.color}`} />
                            </div>
                            <h3 className="font-display font-semibold text-foreground mb-1">{opt.label}</h3>
                            <p className="text-xs text-muted-foreground mb-3">{opt.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {opt.examples.map((ex) => (
                                <span key={ex} className={`px-2 py-0.5 rounded-full ${opt.bgColor} ${opt.color} text-xs`}>{ex}</span>
                              ))}
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground">Min. {opt.minPoints} points</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="glass-card p-6 max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-xl ${selectedOption.bgColor} flex items-center justify-center`}>
                        <selectedOption.icon className={`w-5 h-5 ${selectedOption.color}`} />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">{selectedOption.label}</h3>
                        <p className="text-xs text-muted-foreground">Min. {selectedOption.minPoints} pts • Balance: {balance.toLocaleString()} pts</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">Points to Redeem</label>
                        <Input
                          type="number"
                          placeholder={`Enter points (min ${selectedOption.minPoints})`}
                          value={pointsToRedeem}
                          onChange={(e) => setPointsToRedeem(e.target.value)}
                          min={selectedOption.minPoints}
                          max={balance}
                        />
                        {pointsToRedeem && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ≈ KES {parseInt(pointsToRedeem || "0", 10).toLocaleString()} value
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Button variant="hero" className="flex-1" onClick={handleRedeem} disabled={redeeming}>
                          {redeeming ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating QR...</> : <><Zap className="w-4 h-4" /> Redeem & Get QR</>}
                        </Button>
                        <Button variant="secondary" onClick={() => setSelectedOption(null)}>Back</Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Points Transactions */}
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Points History</h3>
                  {transactions.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">No transactions yet. Complete a waste pickup to earn points!</p>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((txn) => (
                        <div key={txn.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${txn.type === "earned" ? "bg-primary/10" : "bg-destructive/10"}`}>
                            {txn.type === "earned"
                              ? <ArrowUpRight className="w-4 h-4 text-primary" />
                              : <ArrowDownRight className="w-4 h-4 text-destructive" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{txn.description || (txn.type === "earned" ? "Points Earned" : "Points Redeemed")}</div>
                            <div className="text-xs text-muted-foreground">{format(new Date(txn.created_at), "dd MMM yyyy, HH:mm")}</div>
                          </div>
                          <div className={`font-display font-bold text-sm ${txn.type === "earned" ? "text-primary" : "text-destructive"}`}>
                            {txn.type === "earned" ? "+" : "-"}{txn.amount} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Redemptions */}
                {redemptions.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-display font-semibold text-foreground mb-4">My Redemptions</h3>
                    <div className="space-y-3">
                      {redemptions.map((red) => (
                        <div key={red.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                          <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center">
                            <Gift className="w-4 h-4 text-warning" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground capitalize">{red.redemption_type.replace("_", " ")} Redemption</div>
                            <div className="text-xs text-muted-foreground">{format(new Date(red.created_at), "dd MMM yyyy")} • {red.points_used} pts</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${red.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                              {red.status}
                            </span>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setQrData({ qr: red.qr_code, type: red.redemption_type, points: red.points_used })}
                            >
                              View QR
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* QR Code Dialog */}
      <Dialog open={!!qrData} onOpenChange={() => setQrData(null)}>
        <DialogContent className="sm:max-w-sm bg-card border-border text-center">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Your Redemption QR
            </DialogTitle>
          </DialogHeader>
          {qrData && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{qrData.type} • {qrData.points} points</p>
              <div className="flex justify-center p-4 bg-white rounded-xl">
                <QRCodeSVG value={qrData.qr} size={200} level="H" />
              </div>
              <p className="text-xs text-muted-foreground">
                Show this QR code at the partner outlet to redeem your reward. Valid until scanned.
              </p>
              <Button variant="hero" className="w-full" onClick={() => setQrData(null)}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Points;
