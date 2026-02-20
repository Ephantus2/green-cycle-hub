
-- Points ledger for tracking all point transactions
CREATE TABLE public.points_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed')),
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own points transactions"
ON public.points_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points transactions"
ON public.points_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Redemptions table with QR codes
CREATE TABLE public.redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points_used INTEGER NOT NULL,
  redemption_type TEXT NOT NULL CHECK (redemption_type IN ('supermarket', 'airtime', 'brand_offer')),
  qr_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'scanned', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions"
ON public.redemptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions"
ON public.redemptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to get user's current point balance
CREATE OR REPLACE FUNCTION public.get_user_points_balance(_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    SUM(CASE WHEN type = 'earned' THEN amount ELSE -amount END),
    0
  )::INTEGER
  FROM public.points_transactions
  WHERE user_id = _user_id
$$;
