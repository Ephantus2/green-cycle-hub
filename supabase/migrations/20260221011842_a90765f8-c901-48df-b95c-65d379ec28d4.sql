
-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pickup_request_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT,
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text' | 'agreement_pdf' | 'system'
  attachment_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages for pickup requests they own
CREATE POLICY "Users can view chat messages for their pickup requests"
  ON public.chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pickup_requests
      WHERE id = pickup_request_id AND user_id = auth.uid()
    )
  );

-- Users can insert messages for pickup requests they own
CREATE POLICY "Users can send chat messages for their pickup requests"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.pickup_requests
      WHERE id = pickup_request_id AND user_id = auth.uid()
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create agreement_signatures table
CREATE TABLE public.agreement_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pickup_request_id UUID NOT NULL,
  user_id UUID NOT NULL,
  signature_data TEXT NOT NULL, -- base64 signature or typed name
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signer_role TEXT NOT NULL DEFAULT 'user' -- 'user' | 'company'
);

ALTER TABLE public.agreement_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own signatures"
  ON public.agreement_signatures
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own signatures"
  ON public.agreement_signatures
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
