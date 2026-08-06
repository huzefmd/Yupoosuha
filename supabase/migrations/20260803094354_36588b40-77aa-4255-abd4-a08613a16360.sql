CREATE TABLE public.learn_links (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  label text not null,
  description text not null default '',
  url text not null,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.learn_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learn_links TO authenticated;
GRANT ALL ON public.learn_links TO service_role;
ALTER TABLE public.learn_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learn links are public" ON public.learn_links FOR SELECT USING (true);
CREATE POLICY "Admins manage learn links" ON public.learn_links FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.learn_links (topic, label, description, url) VALUES
('stock','Open a free demat account','Start investing with a zero-cost demat account.','https://www.nseindia.com/'),
('credit-card','Check your credit score free','Know your score before applying for a card.','https://www.cibil.com/'),
('insurance','Compare term insurance plans','Compare cover and premiums across insurers.','https://www.policybazaar.com/'),
('finance','Home loan eligibility calculator','Estimate how much loan you can get.','https://www.hdfc.com/');