import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Recycle, Flame, Leaf, AlertTriangle, RotateCcw, CheckCircle2, MapPin, Loader2, TreePine, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CompanyListDialog from "@/components/CompanyListDialog";

type WasteType = "recyclable" | "organic" | "hazardous" | "burnable" | "reusable";

interface AnalysisItem {
  type: WasteType;
  confidence: number;
  item: string;
  recommendation: string;
  environmental_impact: string;
}

interface AnalysisResponse {
  items: AnalysisItem[];
  summary: string;
}

const wasteConfig: Record<WasteType, { icon: typeof Recycle; label: string; color: string }> = {
  recyclable: { icon: Recycle, label: "Recyclable", color: "text-blue-500" },
  organic: { icon: Leaf, label: "Organic", color: "text-green-500" },
  hazardous: { icon: AlertTriangle, label: "Hazardous", color: "text-red-500" },
  burnable: { icon: Flame, label: "To Be Burned", color: "text-orange-500" },
  reusable: { icon: RotateCcw, label: "Reusable", color: "text-emerald-500" },
};

const AIAnalysis = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [companyDialogMode, setCompanyDialogMode] = useState<"find" | "pickup">("find");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setResult(null);
      setSelectedItem(0);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const analyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-waste", {
        body: { imageBase64: preview },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data as AnalysisResponse);
      setSelectedItem(0);
    } catch (err: any) {
      toast.error(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setSelectedItem(0);
  };

  const current = result?.items?.[selectedItem];

  return (
    <Layout>
      <section className="py-12 min-h-[85vh]">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">AI Waste Analysis</h1>
            <p className="text-muted-foreground">Upload a photo and let AI classify your waste instantly</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
              <h2 className="font-display font-semibold text-foreground mb-4">Upload Image</h2>

              {!preview ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center cursor-pointer hover:border-primary/60 transition-colors"
                >
                  <Upload className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Drop your image here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-border">
                    <img src={preview} alt="Waste" className="w-full h-64 object-cover" />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="hero" className="flex-1" onClick={analyze} disabled={analyzing}>
                      {analyzing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </span>
                      ) : (
                        <><Camera className="w-4 h-4" /> Analyze</>
                      )}
                    </Button>
                    <Button variant="secondary" onClick={reset}>
                      <RotateCcw className="w-4 h-4" /> Reset
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Result Area */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
              <h2 className="font-display font-semibold text-foreground mb-4">Analysis Result</h2>

              <AnimatePresence mode="wait">
                {analyzing ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">AI is analyzing your waste...</p>
                  </motion.div>
                ) : result && current ? (
                  <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {/* Summary */}
                    {result.summary && (
                      <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">{result.summary}</p>
                    )}

                    {/* Item Tabs */}
                    {result.items.length > 1 && (
                      <div className="flex gap-2 flex-wrap">
                        {result.items.map((item, i) => {
                          const cfg = wasteConfig[item.type];
                          const Icon = cfg.icon;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedItem(i)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                selectedItem === i
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border text-muted-foreground hover:border-primary/30"
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {item.item}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Type Badge */}
                    <AnimatePresence mode="wait">
                      <motion.div key={selectedItem} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="green-card p-5 flex items-center gap-4">
                          {(() => { const Ic = wasteConfig[current.type].icon; return <Ic className="w-8 h-8" />; })()}
                          <div>
                            <div className="text-sm opacity-80">Classified as</div>
                            <div className="text-xl font-display font-bold">{wasteConfig[current.type].label}</div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                            <span className="text-sm text-muted-foreground">Item Detected</span>
                            <span className="text-sm font-medium text-foreground">{current.item}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                            <span className="text-sm text-muted-foreground">Confidence</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                  className="h-full bg-primary rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${current.confidence}%` }}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-primary">{current.confidence}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">Recommendation</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{current.recommendation}</p>
                        </div>

                        {/* Environmental Impact */}
                        {current.environmental_impact && (
                          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
                            <div className="flex items-center gap-2 mb-2">
                              <TreePine className="w-4 h-4 text-destructive" />
                              <span className="text-sm font-semibold text-foreground">Environmental Impact</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{current.environmental_impact}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button variant="hero" size="sm" className="flex-1" onClick={() => { setCompanyDialogMode("find"); setCompanyDialogOpen(true); }}>
                            <MapPin className="w-4 h-4" /> Find Companies
                          </Button>
                          <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setCompanyDialogMode("pickup"); setCompanyDialogOpen(true); }}>
                            <Truck className="w-4 h-4" /> Request Pickup
                          </Button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                    <Camera className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">Upload an image and click "Analyze" to see results</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <CompanyListDialog
          open={companyDialogOpen}
          onOpenChange={setCompanyDialogOpen}
          wasteType={current?.type}
          wasteItem={current?.item}
          mode={companyDialogMode}
        />
      </section>
    </Layout>
  );
};

export default AIAnalysis;
