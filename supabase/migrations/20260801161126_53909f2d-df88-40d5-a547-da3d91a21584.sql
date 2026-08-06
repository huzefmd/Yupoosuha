CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.free_learning_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  video_url text NOT NULL,
  thumbnail_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.free_learning_videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.free_learning_videos TO authenticated;
GRANT ALL ON public.free_learning_videos TO service_role;
ALTER TABLE public.free_learning_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view videos" ON public.free_learning_videos FOR SELECT USING (true);
CREATE POLICY "Admins manage videos" ON public.free_learning_videos FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.shopping_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  price text,
  discount text,
  link text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shopping_deals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shopping_deals TO authenticated;
GRANT ALL ON public.shopping_deals TO service_role;
ALTER TABLE public.shopping_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view deals" ON public.shopping_deals FOR SELECT USING (true);
CREATE POLICY "Admins manage deals" ON public.shopping_deals FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.insurance_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.insurance_types TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.insurance_types TO authenticated;
GRANT ALL ON public.insurance_types TO service_role;
ALTER TABLE public.insurance_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view insurance" ON public.insurance_types FOR SELECT USING (true);
CREATE POLICY "Admins manage insurance" ON public.insurance_types FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.finance_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  highlights text[] NOT NULL DEFAULT '{}',
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.finance_offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_offers TO authenticated;
GRANT ALL ON public.finance_offers TO service_role;
ALTER TABLE public.finance_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view finance" ON public.finance_offers FOR SELECT USING (true);
CREATE POLICY "Admins manage finance" ON public.finance_offers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

INSERT INTO public.free_learning_videos (title, description, video_url, thumbnail_url) VALUES
('Stock Market Basics for Beginners','Understand what shares are, how exchanges work, and how to place your first trade safely.','https://www.youtube.com/watch?v=p7HKvqRI_Bo',NULL),
('How to Read a Company Balance Sheet','A simple walkthrough of assets, liabilities and equity before you invest in any stock.','https://www.youtube.com/watch?v=Gr8kQ1MnEkE',NULL),
('SIP vs Lumpsum Investing','Which approach suits your income pattern and risk appetite? A practical comparison.','https://www.youtube.com/watch?v=Y1x2Kd0Ok3Y',NULL);

INSERT INTO public.shopping_deals (title, image_url, price, discount, link) VALUES
('Everyday Essentials Combo',NULL,'₹499','35% OFF','https://example.com'),
('Budget Smartwatch',NULL,'₹1,299','50% OFF','https://example.com');

INSERT INTO public.insurance_types (title, description, image_url, link) VALUES
('Term Insurance','Pure protection at the lowest cost. High cover for your family at a small yearly premium.',NULL,NULL),
('Life Insurance','Long-term savings combined with life cover, useful for disciplined goal-based planning.',NULL,NULL),
('Health Insurance','Cashless hospitalisation cover that protects your savings from medical emergencies.',NULL,NULL),
('General Insurance','Motor, travel and home cover for the everyday risks most people forget to plan for.',NULL,NULL);

INSERT INTO public.finance_offers (title, image_url, highlights, link) VALUES
('Open a Free Demat Account',NULL,ARRAY['Zero account opening charges','Paperless KYC in minutes','Invest in stocks, IPOs and mutual funds'],'https://example.com'),
('GM Financial Account',NULL,ARRAY['Simple onboarding','Dedicated relationship support','Transparent charges'],'https://example.com'),
('Home Loan Assistance',NULL,ARRAY['Compare rates across lenders','Guidance on documents','Help with eligibility checks'],'https://example.com');