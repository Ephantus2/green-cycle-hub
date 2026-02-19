
-- Create pickup_requests table
CREATE TABLE public.pickup_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL,
  company_name TEXT NOT NULL,
  waste_type TEXT NOT NULL,
  waste_description TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  amount NUMERIC(10,2),
  agreement_signed_user BOOLEAN NOT NULL DEFAULT false,
  agreement_signed_company BOOLEAN NOT NULL DEFAULT false,
  agreement_pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pickup requests"
ON public.pickup_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pickup requests"
ON public.pickup_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pickup requests"
ON public.pickup_requests FOR UPDATE
USING (auth.uid() = user_id);

CREATE TRIGGER update_pickup_requests_updated_at
BEFORE UPDATE ON public.pickup_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
