-- ۱. اتصال جدول سفارشات به احراز هویت کاربران
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- ۲. ایجاد ایندکس برای افزایش سرعت جستجوی سوابق خرید
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- ۳. ایجاد جدول پروفایل کاربران برای ذخیره اطلاعات تکمیلی
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ۴. فعال‌سازی امنیت سطح ردیف (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ۵. سیاست‌های دسترسی (Policies)
-- هر کاربر فقط می‌تواند پروفایل خودش را ببیند
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" ON public.profiles
        FOR SELECT USING (auth.uid() = id);
    END IF;
END $$;

-- هر کاربر فقط می‌تواند پروفایل خودش را ویرایش کند
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- ۶. ساخت پروفایل خودکار هنگام ثبت‌نام (Trigger)
-- تابعی که هنگام ثبت‌نام کاربر جدید صدا زده می‌شود
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- اتصال تابع به رویداد ثبت‌نام در auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ۷. امنیت سفارشات (اختیاری - برای حریم خصوصی بیشتر)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own orders'
    ) THEN
        CREATE POLICY "Users can view their own orders" ON public.orders
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- ادمین‌ها باید تمام سفارشات را ببینند
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins can see everything'
    ) THEN
        CREATE POLICY "Admins can see everything" ON public.orders
        FOR ALL USING (
            (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
        );
    END IF;
END $$;
