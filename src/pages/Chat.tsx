import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Send, FileText, MessageCircle, Truck, CheckCircle,
  Download, PenLine, Loader2, ArrowLeft
} from "lucide-react";
import { generateAgreementPdf } from "@/lib/generateAgreementPdf";

interface PickupRequest {
  id: string;
  company_name: string;
  company_id: number;
  waste_type: string;
  waste_description: string | null;
  location: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
  agreement_signed_user: boolean;
  agreement_signed_company: boolean;
}

interface ChatMessage {
  id: string;
  pickup_request_id: string;
  sender_id: string;
  sender_name: string;
  message: string | null;
  message_type: string;
  attachment_url: string | null;
  metadata: any;
  created_at: string;
}

const Chat = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [selected, setSelected] = useState<PickupRequest | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [signDialog, setSignDialog] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signing, setSigning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load pickup requests
  useEffect(() => {
    if (!user) return;
    supabase
      .from("pickup_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPickups(data as PickupRequest[]);
      });
  }, [user]);

  // Load messages for selected pickup
  useEffect(() => {
    if (!selected) return;
    supabase
      .from("chat_messages")
      .select("*")
      .eq("pickup_request_id", selected.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as ChatMessage[]);
      });

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${selected.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `pickup_request_id=eq.${selected.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user || !selected) return;
    setSending(true);
    const { error } = await supabase.from("chat_messages").insert({
      pickup_request_id: selected.id,
      sender_id: user.id,
      sender_name: user.user_metadata?.full_name || user.email || "User",
      message: input.trim(),
      message_type: "text",
    });
    if (error) toast.error("Failed to send message");
    else setInput("");
    setSending(false);
  };

  const generateAndShareAgreement = async () => {
    if (!user || !selected) return;
    setSending(true);

    const pdfDataUri = generateAgreementPdf({
      pickupRequestId: selected.id,
      userName: user.user_metadata?.full_name || user.email || "Client",
      companyName: selected.company_name,
      wasteType: selected.waste_type,
      wasteDescription: selected.waste_description || "",
      location: selected.location,
      preferredDate: selected.preferred_date,
      preferredTime: selected.preferred_time,
      createdAt: selected.created_at,
    });

    // Send as chat message with PDF attachment
    const { error } = await supabase.from("chat_messages").insert({
      pickup_request_id: selected.id,
      sender_id: user.id,
      sender_name: user.user_metadata?.full_name || user.email || "User",
      message: "📄 Waste Collection Agreement generated. Please review and sign below.",
      message_type: "agreement_pdf",
      attachment_url: pdfDataUri,
      metadata: { requiresSignature: true },
    });

    if (error) toast.error("Failed to share agreement");
    else toast.success("Agreement shared in chat!");
    setSending(false);
  };

  const handleSign = async () => {
    if (!signatureName.trim() || !user || !selected) return;
    setSigning(true);

    const { error } = await supabase.from("agreement_signatures").insert({
      pickup_request_id: selected.id,
      user_id: user.id,
      signature_data: signatureName.trim(),
      signer_role: "user",
    });

    if (error) {
      toast.error("Failed to sign agreement");
      setSigning(false);
      return;
    }

    // Update pickup_request
    await supabase
      .from("pickup_requests")
      .update({ agreement_signed_user: true })
      .eq("id", selected.id);

    // Send system message
    await supabase.from("chat_messages").insert({
      pickup_request_id: selected.id,
      sender_id: user.id,
      sender_name: "System",
      message: `✅ ${user.user_metadata?.full_name || "Client"} has digitally signed the agreement.`,
      message_type: "system",
    });

    setSelected({ ...selected, agreement_signed_user: true });
    setSignDialog(false);
    setSignatureName("");
    toast.success("Agreement signed successfully!");
    setSigning(false);
  };

  const downloadPdf = (dataUri: string) => {
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = `agreement-${selected?.id?.slice(0, 8)}.pdf`;
    link.click();
  };

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Please sign in to access chat.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            Chat & Agreements
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
            {/* Conversations list */}
            <div className="glass-card p-4 overflow-hidden flex flex-col">
              <h2 className="font-display font-semibold text-foreground text-sm mb-3">
                Pickup Requests ({pickups.length})
              </h2>
              <ScrollArea className="flex-1">
                <div className="space-y-2 pr-2">
                  {pickups.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-8">No pickup requests yet</p>
                  )}
                  {pickups.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selected?.id === p.id
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-secondary/30 hover:bg-secondary/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-medium text-foreground text-sm truncate">
                          {p.company_name}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {p.waste_type} • {p.preferred_date}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            p.status === "pending"
                              ? "bg-warning/20 text-warning"
                              : p.status === "completed"
                              ? "bg-primary/20 text-primary"
                              : "bg-info/20 text-info"
                          }`}
                        >
                          {p.status}
                        </span>
                        {p.agreement_signed_user && (
                          <CheckCircle className="w-3 h-3 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat area */}
            <div className="lg:col-span-2 glass-card flex flex-col overflow-hidden">
              {selected ? (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSelected(null)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {selected.company_name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground text-sm">{selected.company_name}</div>
                        <div className="text-xs text-muted-foreground">{selected.waste_type} pickup</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={generateAndShareAgreement}
                        disabled={sending}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        Generate Agreement
                      </Button>
                      {!selected.agreement_signed_user && (
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() => setSignDialog(true)}
                        >
                          <PenLine className="w-3.5 h-3.5 mr-1" />
                          Sign
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {messages.length === 0 && (
                        <div className="text-center py-12">
                          <FileText className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                          <p className="text-muted-foreground text-sm">
                            Start the conversation or generate an agreement
                          </p>
                        </div>
                      )}
                      {messages.map((msg) => {
                        const isMe = msg.sender_id === user.id;
                        const isSystem = msg.message_type === "system";
                        const isPdf = msg.message_type === "agreement_pdf";

                        if (isSystem) {
                          return (
                            <div key={msg.id} className="text-center">
                              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                                {msg.message}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-xl p-3 ${
                                isMe
                                  ? "bg-primary/20 border border-primary/30"
                                  : "bg-secondary/50 border border-border/30"
                              }`}
                            >
                              <div className="text-xs text-muted-foreground mb-1">
                                {msg.sender_name} • {formatTime(msg.created_at)}
                              </div>
                              {msg.message && (
                                <p className="text-foreground text-sm">{msg.message}</p>
                              )}
                              {isPdf && msg.attachment_url && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => downloadPdf(msg.attachment_url!)}
                                >
                                  <Download className="w-3.5 h-3.5 mr-1" />
                                  Download Agreement PDF
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t border-border/30">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        disabled={sending}
                      />
                      <Button type="submit" variant="hero" size="icon" disabled={sending || !input.trim()}>
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Select a pickup request to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Signature Dialog */}
      <Dialog open={signDialog} onOpenChange={setSignDialog}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <PenLine className="w-5 h-5 text-primary" />
              Digital Signature
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Type your full name below to digitally sign the waste collection agreement with{" "}
              <span className="text-foreground font-medium">{selected?.company_name}</span>.
            </p>
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
              <label className="text-xs text-muted-foreground">Your Full Name (as signature)</label>
              <Input
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="e.g. John Kamau"
                className="mt-2 font-display text-lg italic"
              />
            </div>
            {signatureName && (
              <div className="text-center p-3 border border-dashed border-primary/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Signature Preview</p>
                <p className="font-display text-xl italic text-primary">{signatureName}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="hero"
                className="flex-1"
                onClick={handleSign}
                disabled={!signatureName.trim() || signing}
              >
                {signing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing...</>
                ) : (
                  <><CheckCircle className="w-4 h-4 mr-1" /> Confirm & Sign</>
                )}
              </Button>
              <Button variant="secondary" onClick={() => setSignDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Chat;
