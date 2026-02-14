import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Recycle, Flame, Leaf, AlertTriangle, RotateCcw, CheckCircle2, MapPin } from "lucide-react";

type WasteType = "recyclable" | "organic" | "hazardous" | "burnable" | "reusable";

interface AnalysisResult {
  type: WasteType;
  confidence: number;
  item: string;
  recommendation: string;
}

const wasteConfig: Record<WasteType, { icon: typeof Recycle; label: string }> = {
  recyclable: { icon: Recycle, label: "Recyclable" },
  organic: { icon: Leaf, label: "Organic" },
  hazardous: { icon: AlertTriangle, label: "Hazardous" },
  burnable: { icon: Flame, label: "To Be Burned" },
  reusable: { icon: RotateCcw, label: "Reusable" },
};

const mockResults: AnalysisResult[] = [
  { type: "recyclable", confidence: 94, item: "Plastic Bottle (PET)", recommendation: "Send to nearest recycling center. PET plastic is highly recyclable." },
  { type: "organic", confidence: 87, item: "Food Waste", recommendation: "Compost or send to organic processing facility." },
  { type: "hazardous", confidence: 91, item: "Battery (Lithium-ion)", recommendation: "Do NOT dispose in regular waste. Contact hazardous waste handler." },
];

const AIAnalysis = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const analyze = () => {
    setAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
      setAnalyzing(false);
    }, 2500);
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
  };

  return (
    <Layout>
      <section className="py-12 min-h-[85vh]">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">AI Waste Analysis</h1>
            <p className="text-muted-foreground">Upload a photo and let AI classify your waste instantly</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
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
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="font-display font-semibold text-foreground mb-4">Analysis Result</h2>

              <AnimatePresence mode="wait">
                {analyzing ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">AI is analyzing your waste...</p>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                    {/* Type Badge */}
                    <div className="green-card p-5 flex items-center gap-4">
                      {(() => { const Ic = wasteConfig[result.type].icon; return <Ic className="w-8 h-8" />; })()}
                      <div>
                        <div className="text-sm opacity-80">Classified as</div>
                        <div className="text-xl font-display font-bold">{wasteConfig[result.type].label}</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <span className="text-sm text-muted-foreground">Item Detected</span>
                        <span className="text-sm font-medium text-foreground">{result.item}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${result.confidence}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-primary">{result.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Recommendation</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button variant="hero" size="sm" className="flex-1">
                        <MapPin className="w-4 h-4" /> Find Companies
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1">
                        Request Pickup
                      </Button>
                    </div>
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
      </section>
    </Layout>
  );
};

export default AIAnalysis;
