-- ==============================================================================
-- LEGEND GAMES / NAIJAPLAY — MASTER SUPABASE DATABASE MIGRATION
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. TABLES DEFINITION
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 9.0,
    release_year INTEGER DEFAULT 2022,
    badge TEXT,
    ps4_size_gb INTEGER DEFAULT 0,
    pc_size_gb INTEGER DEFAULT 0,
    cd_price NUMERIC(10, 2) NOT NULL DEFAULT 15000.00,
    online_price NUMERIC(10, 2) NOT NULL DEFAULT 5000.00,
    modded_price NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
    cover_path TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.game_platforms (
    id SERIAL PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    UNIQUE(game_id, platform)
);

CREATE TABLE IF NOT EXISTS public.consoles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT,
    tagline TEXT,
    badge TEXT,
    platform TEXT,
    image TEXT,
    description TEXT,
    has_modded_option BOOLEAN DEFAULT true,
    has_fc_bundle BOOLEAN DEFAULT true,
    accent_color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.console_variants (
    id TEXT PRIMARY KEY,
    console_id TEXT NOT NULL REFERENCES public.consoles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    storage TEXT,
    base_price NUMERIC(12, 2) NOT NULL,
    spec_blurb TEXT,
    popular BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.accessories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    description TEXT,
    compatibility TEXT,
    stock_status TEXT DEFAULT 'In Stock'
);

CREATE TABLE IF NOT EXISTS public.hard_drives (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    capacity_gb INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    game_count_est INTEGER,
    popular BOOLEAN DEFAULT false,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.orders (
    order_id TEXT PRIMARY KEY,
    customer_name TEXT,
    whatsapp_number TEXT NOT NULL,
    meetup_location TEXT,
    items_json JSONB NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    status TEXT DEFAULT 'Pending WhatsApp Confirmation',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consoles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.console_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hard_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public games view" ON public.games;
    CREATE POLICY "Public games view" ON public.games FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Public platforms view" ON public.game_platforms;
    CREATE POLICY "Public platforms view" ON public.game_platforms FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public consoles view" ON public.consoles;
    CREATE POLICY "Public consoles view" ON public.consoles FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public variants view" ON public.console_variants;
    CREATE POLICY "Public variants view" ON public.console_variants FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public accessories view" ON public.accessories;
    CREATE POLICY "Public accessories view" ON public.accessories FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public hard_drives view" ON public.hard_drives;
    CREATE POLICY "Public hard_drives view" ON public.hard_drives FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public orders insert" ON public.orders;
    CREATE POLICY "Public orders insert" ON public.orders FOR INSERT WITH CHECK (true);
END $$;

-- 3. SEED PRODUCTS (130+ Games)
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('a-way-out', 'A Way Out', 'Co-op / Action Adventure', 8.8, 2018, 'Best Co-op', 18, 25, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/a-way-out.jpg', 'A cinematic split-screen co-op adventure about two prisoners escaping together.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('a-way-out', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('a-way-out', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('a-way-out', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('bloodborne', 'Bloodborne (PlayStation Hits)', 'Action RPG / Souls-like', 9.7, 2015, 'PlayStation Hit', 30, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/bloodborne.jpg', 'Hunt your nightmares in the gothic city of Yharnam. FromSoftware classic.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('bloodborne', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('cod-mw2', 'Call of Duty: Modern Warfare II', 'FPS / Action', 9.2, 2022, 'Blockbuster', 75, 85, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/cod-mw2.jpg', 'Task Force 141 returns with intense tactical campaigns and Warzone firefights.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-mw2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-mw2', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-mw2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-mw2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('pes-2021', 'eFootball PES 2021 Season Update', 'Sports / Football', 8.9, 2020, 'Football Classic', 40, 42, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/pes-2021.jpg', 'Master League, iconic football gameplay, and realistic stadium atmospheres.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('pes-2021', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('pes-2021', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('pes-2021', 'PS3') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('cod-cold-war', 'Call of Duty: Black Ops Cold War', 'FPS / Action', 9.0, 2020, 'Zombies & Campaign', 95, 110, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/cod-cold-war.jpg', 'Gripping Cold War conspiracies, intense multiplayer, and classic Round-based Zombies.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-cold-war', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-cold-war', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-cold-war', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-cold-war', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('cod-vanguard', 'Call of Duty: Vanguard', 'FPS / WWII Action', 8.5, 2021, 'WWII Shooter', 60, 70, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/cod-vanguard.jpg', 'Experience pivotal WWII battles across the Eastern, Western, Pacific, and North African fronts.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-vanguard', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-vanguard', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-vanguard', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-vanguard', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('ac-mirage', 'Assassin', 'Action / Stealth', 8.9, 2023, 'Back to Roots', 38, 40, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ac-mirage.jpg', 'A homage to the original stealth roots in 9th-century Golden Age Baghdad.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-mirage', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-mirage', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-mirage', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-mirage', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('cod-bo3', 'Call of Duty: Black Ops III', 'FPS / Sci-Fi Action', 9.1, 2015, 'Zombies Chronicles', 55, 60, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/cod-bo3.jpg', 'Advanced cybernetic warfare and the fan-favorite Zombies Chronicles collection.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-bo3', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-bo3', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cod-bo3', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('captain-tsubasa', 'Captain Tsubasa: Rise of New Champions', 'Anime / Sports', 8.7, 2020, 'Anime Soccer', 30, 32, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/captain-tsubasa.jpg', 'Over-the-top arcade soccer action featuring iconic special shots and storylines.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('captain-tsubasa', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('captain-tsubasa', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('ctr-nitro-fueled', 'Crash Team Racing Nitro-Fueled', 'Arcade Racing / Family', 9.1, 2019, 'Family Favorite', 22, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ctr-nitro-fueled.jpg', 'The authentic CTR experience plus tons of remastered tracks, karts, and characters.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ctr-nitro-fueled', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ctr-nitro-fueled', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('far-cry-6', 'Far Cry 6', 'Open World / FPS', 8.8, 2021, 'Open World', 60, 65, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/far-cry-6.jpg', 'Join a modern guerrilla revolution to liberate the tropical paradise of Yara.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-6', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-6', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-6', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-6', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('gta-v', 'Grand Theft Auto V', 'Action / Open World', 9.9, 2022, 'All-Time Classic', 95, 110, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/gta-v.jpg', 'Los Santos and Blaine County in ultra high definition. The ultimate heist sandbox.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gta-v', 'PS3') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gta-v', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gta-v', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gta-v', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gta-v', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('days-gone', 'Days Gone', 'Survival / Open World', 9.0, 2019, 'Freaker Hordes', 68, 70, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/days-gone.jpg', 'Ride and fight across a brutal Pacific Northwest wilderness crawling with infected hordes.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('days-gone', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('days-gone', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('ea-sports-fc-26', 'EA SPORTS FC 26', 'Sports / Football', 9.4, 2025, 'Trending #1', 48, 55, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ea-sports-fc-26.jpg', 'HyperMotionV realism, updated clubs, Ultimate Team, and Career mode.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ea-sports-fc-26', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ea-sports-fc-26', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ea-sports-fc-26', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ea-sports-fc-26', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('horizon-forbidden-west', 'Horizon Forbidden West', 'Open World / Action RPG', 9.6, 2022, 'Stunning Visuals', 98, 120, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/horizon-forbidden-west.jpg', 'Explore distant lands, fight bigger awe-inspiring machines, and encounter new tribes.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('horizon-forbidden-west', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('horizon-forbidden-west', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('horizon-forbidden-west', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('dirt-5', 'DIRT 5', 'Racing / Off-Road', 8.6, 2020, 'Off-Road Thrills', 42, 45, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/dirt-5.jpg', 'Extreme off-road arcade racing across stunning global routes from NYC to Brazil.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dirt-5', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dirt-5', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dirt-5', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dirt-5', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('ghost-of-tsushima', 'Ghost of Tsushima', 'Action / Samurai Adventure', 9.8, 2020, 'PlayStation Masterpiece', 60, 75, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ghost-of-tsushima.jpg', 'Unconventional samurai warfare to protect feudal Japan from the Mongol invasion.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ghost-of-tsushima', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ghost-of-tsushima', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ghost-of-tsushima', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('hot-wheels-unleashed', 'Hot Wheels Unleashed', 'Arcade Racing / Party', 8.7, 2021, 'High-Octane Fun', 20, 22, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/hot-wheels-unleashed.jpg', 'Collect the best Hot Wheels vehicles, build extraordinary tracks, and race in split-screen.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hot-wheels-unleashed', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hot-wheels-unleashed', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hot-wheels-unleashed', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hot-wheels-unleashed', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('injustice-2', 'Injustice 2: Legendary Edition', 'Fighting / DC Universe', 9.2, 2017, 'DC Fighting', 52, 55, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/injustice-2.jpg', 'Power up and build the ultimate version of your favorite DC superheroes and villains.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('injustice-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('injustice-2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('injustice-2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('tlou-1', 'The Last of Us Remastered', 'Action / Narrative Survival', 9.9, 2014, 'Over 200 GOTY Awards', 48, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/tlou-1.jpg', 'Joel and Ellie journey across a post-pandemic United States. Unforgettable story.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tlou-1', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('minecraft', 'Minecraft (PlayStation 4 Edition)', 'Sandbox / Survival', 9.5, 2019, 'Top Sandbox', 6, 8, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/minecraft.jpg', 'Endless creativity and survival. Build anything you can imagine with infinite blocks.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('minecraft', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('minecraft', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('minecraft', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('minecraft', 'PS3') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('it-takes-two', 'It Takes Two', 'Co-op Platformer / Adventure', 9.8, 2021, 'Game of the Year', 45, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/it-takes-two.jpg', 'A genre-bending platform adventure created purely for two-player co-op gameplay.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('it-takes-two', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('it-takes-two', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('it-takes-two', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('it-takes-two', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('tlou-2', 'The Last of Us Part II', 'Action / Survival Horror', 9.7, 2020, 'PlayStation Masterpiece', 80, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/tlou-2.jpg', 'An emotional, visceral journey of vengeance across post-apocalyptic Seattle.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tlou-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tlou-2', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('motogp-24', 'MotoGP 24', 'Motorcycle Racing / Sim', 8.8, 2024, 'Official MotoGP', 28, 30, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/motogp-24.jpg', 'Official 2024 season with riders market transfers and dynamic weather physics.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('motogp-24', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('motogp-24', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('motogp-24', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('motogp-24', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('kena-bridge-of-spirits', 'Kena: Bridge of Spirits', 'Action Adventure / Indie', 9.1, 2021, 'Deluxe Edition', 25, 28, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/kena-bridge-of-spirits.jpg', 'A story-driven action adventure combining fast-paced combat with magical Rot companions.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('kena-bridge-of-spirits', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('kena-bridge-of-spirits', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('kena-bridge-of-spirits', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('kena-bridge-of-spirits', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('mafia-3', 'Mafia III', 'Crime / Open World', 8.4, 2016, 'Crime Drama', 50, 52, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/mafia-3.jpg', 'Lincoln Clay builds a criminal empire in 1968 New Bordeaux to exact revenge.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('mafia-3', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('mafia-3', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('mafia-3', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('naruto-storm-connections', 'Naruto x Boruto Ultimate Ninja Storm Connections', 'Anime / Fighting', 8.9, 2023, 'Anime Fighting', 35, 38, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/naruto-storm-connections.jpg', 'The largest ninja roster in history celebrating the anime 20th anniversary.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('naruto-storm-connections', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('naruto-storm-connections', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('naruto-storm-connections', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('naruto-storm-connections', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('nfs-heat', 'Need for Speed Heat', 'Street Racing', 8.9, 2019, 'Street Racing', 35, 40, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/nfs-heat.jpg', 'Hustle by day in Speedhunters Showdown and risk it all by night in illicit street races.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nfs-heat', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nfs-heat', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nfs-heat', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('re7-biohazard', 'Resident Evil 7: Biohazard', 'Survival Horror / First Person', 9.4, 2017, 'VR Compatible', 28, 30, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/re7-biohazard.jpg', 'Ethan Winters searches for his wife in a derelict Louisiana plantation. Pure terror.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re7-biohazard', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re7-biohazard', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re7-biohazard', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re7-biohazard', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('sleeping-dogs', 'Sleeping Dogs: Definitive Edition', 'Martial Arts / Open World', 9.1, 2014, 'Martial Arts Classic', 20, 22, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/sleeping-dogs.jpg', 'Undercover cop Wei Shen infiltrates the Sun On Yee Triad in neon-lit Hong Kong.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sleeping-dogs', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sleeping-dogs', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sleeping-dogs', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('nfs-payback', 'Need for Speed Payback', 'Action Racing', 8.4, 2017, 'Action Driving', 30, 32, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/nfs-payback.jpg', 'Take down the cartel ruling Fortune Valley casino underworld in blockbuster heist missions.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nfs-payback', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nfs-payback', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nfs-payback', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('sekiro', 'Sekiro: Shadows Die Twice', 'Action / Souls-like', 9.8, 2019, 'Game of the Year', 25, 25, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/sekiro.jpg', 'Carve your own clever path to vengeance as the One-Armed Wolf in Sengoku Japan.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sekiro', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sekiro', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sekiro', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('spiderman-ps4', 'Marvel', 'Action / Superhero', 9.7, 2018, 'PS4 Must-Play', 50, 65, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/spiderman-ps4.jpg', 'A seasoned Peter Parker fights iconic villains across Manhattan with acrobatics and fluid webs.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spiderman-ps4', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spiderman-ps4', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spiderman-ps4', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('re2-remake', 'Resident Evil 2 Remake', 'Survival Horror', 9.6, 2019, 'GOTY Nominee', 26, 28, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/re2-remake.jpg', 'Raccoon City Police Station survival reimagined with modern over-the-shoulder perspective.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re2-remake', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re2-remake', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re2-remake', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re2-remake', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('shadow-tomb-raider', 'Shadow of the Tomb Raider: Definitive Edition', 'Action Adventure', 8.9, 2018, 'Definitive Edition', 40, 45, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/shadow-tomb-raider.jpg', 'Lara Croft races to save the world from a Maya apocalypse in the deadliest jungles.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('shadow-tomb-raider', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('shadow-tomb-raider', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('shadow-tomb-raider', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('spiderman-miles-morales', 'Marvel', 'Action / Superhero', 9.2, 2020, 'Must Play', 40, 45, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/spiderman-miles-morales.jpg', 'Bio-electric venom blast attacks and covert camouflage power in snow-covered Harlem.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spiderman-miles-morales', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spiderman-miles-morales', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spiderman-miles-morales', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('tennis-world-tour', 'Tennis World Tour', 'Sports / Tennis', 7.8, 2018, 'Tennis Pro', 10, 12, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/tennis-world-tour.jpg', 'Play as Roger Federer and 30 other tennis stars across all major court surfaces.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tennis-world-tour', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tennis-world-tour', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tennis-world-tour', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('ac-valhalla', 'Assassin', 'Action RPG / Open World', 9.1, 2020, 'Viking Saga', 85, 95, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ac-valhalla.jpg', 'Lead legendary Viking raids against Saxon fortresses and conquer 9th-century England.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-valhalla', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-valhalla', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-valhalla', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-valhalla', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('god-of-war-2018', 'God of War (2018)', 'Action Adventure / Norse', 9.9, 2018, 'Game of the Year', 45, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/god-of-war-2018.jpg', 'Kratos and Atreus journey through the brutal realm of Norse gods and monsters.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('god-of-war-2018', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('god-of-war-2018', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('ufc-4', 'EA SPORTS UFC 4', 'Combat Sports / MMA', 8.9, 2020, 'Fight Champion', 40, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ufc-4.jpg', 'Fluid clinch-to-strike combinations and responsive takedown grappling in the Octagon.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ufc-4', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ufc-4', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('dmc-5', 'Devil May Cry 5', 'Hack & Slash / Action', 9.4, 2019, 'Stylish Action', 35, 40, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/dmc-5.jpg', 'High-octane stylized combat featuring Dante, Nero, and V battling demonic hordes.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dmc-5', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dmc-5', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dmc-5', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dmc-5', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('hogwarts-legacy', 'Hogwarts Legacy', 'Open World RPG / Magic', 9.3, 2023, 'Wizarding World', 80, 85, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/hogwarts-legacy.jpg', 'Live the unwritten in 1800s Hogwarts. Master spells, brew potions, and tame beasts.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hogwarts-legacy', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hogwarts-legacy', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hogwarts-legacy', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hogwarts-legacy', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('wwe-2k23', 'WWE 2K23', 'Sports / Wrestling', 8.9, 2023, 'Even Stronger', 65, 75, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/wwe-2k23.jpg', 'WarGames match debut, John Cena 20-year Showcase, and deep Superstar roster.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wwe-2k23', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wwe-2k23', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wwe-2k23', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wwe-2k23', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('god-of-war-ragnarok', 'God of War Ragnarök', 'Action / Mythological', 9.8, 2022, 'Masterpiece', 107, 190, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/gow-ragnarok.jpg', 'Fimbulwinter is underway. Kratos and Atreus must journey to each of the Nine Realms.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('god-of-war-ragnarok', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('god-of-war-ragnarok', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('god-of-war-ragnarok', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('infamous-second-son', 'inFAMOUS Second Son', 'Superhero / Action', 8.8, 2014, 'Superpowers', 24, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/infamous-second-son.jpg', 'Delsin Rowe wields smoke, neon, and video superpowers in locked-down Seattle.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('infamous-second-son', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('jurassic-world-evolution', 'Jurassic World Evolution', 'Dinosaur Simulation / Strategy', 8.7, 2018, 'Park Builder', 15, 16, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/jurassic-world-evolution.jpg', 'Bioengineer new dinosaurs and build attractions on legendary islands of the Muertes Archipelago.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('jurassic-world-evolution', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('jurassic-world-evolution', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('jurassic-world-evolution', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('motogp-19', 'MotoGP 19', 'Motorcycle Racing / Sim', 8.5, 2019, 'Racing Sim', 20, 22, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/motogp-19.jpg', 'Neural AI racing and historical challenges featuring legendary riders.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('motogp-19', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('motogp-19', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('motogp-19', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('rdr2', 'Red Dead Redemption 2', 'Western / Open World', 9.9, 2018, 'Rockstar Masterpiece', 105, 120, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/rdr2.jpg', 'Arthur Morgan and the Van der Linde gang on the run across the rugged heart of America.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('rdr2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('rdr2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('rdr2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('lego-marvel-collection', 'LEGO Marvel Collection', 'Action / Adventure / LEGO', 9.0, 2019, '3 Games in 1', 45, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/lego-marvel-collection.jpg', 'Includes LEGO Marvel Super Heroes 1 & 2 and LEGO Marvel Avengers with all season passes.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lego-marvel-collection', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lego-marvel-collection', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lego-marvel-collection', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('naruto-storm-4', 'Naruto Shippuden: Ultimate Ninja Storm 4', 'Anime / Fighting', 9.5, 2016, 'Anime Classic', 40, 42, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/naruto-storm-4.jpg', 'The epic climax of the Fourth Great Ninja War with huge cinematic boss battles.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('naruto-storm-4', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('naruto-storm-4', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('naruto-storm-4', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('re4-remake', 'Resident Evil 4 Remake', 'Action Horror', 9.7, 2023, 'Survival Hit', 68, 72, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/re4-remake.jpg', 'Leon S. Kennedy rescues the president daughter from a horrifying European cult.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re4-remake', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re4-remake', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re4-remake', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re4-remake', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('lego-incredibles', 'LEGO The Incredibles', 'Family / Co-op Adventure', 8.6, 2018, 'Family Co-op', 18, 20, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/lego-incredibles.jpg', 'Experience the thrilling adventures of the Parr superhero family across both Incredibles films.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lego-incredibles', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lego-incredibles', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lego-incredibles', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('overcooked-2', 'Overcooked! 2', 'Co-op Party / Cooking Arcade', 9.2, 2018, 'Chaotic Party Game', 8, 10, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/overcooked-2.jpg', 'Chop, cook, and serve dishes in hilarious high-pressure cooperative kitchens.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('overcooked-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('overcooked-2', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('overcooked-2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('overcooked-2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('team-sonic-racing', 'Team Sonic Racing', 'Kart Racing / Party', 8.5, 2019, 'Sonic Racing', 18, 20, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/team-sonic-racing.jpg', 'Team-based arcade racing where sharing power-ups and speed boosts unlocks victory.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('team-sonic-racing', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('team-sonic-racing', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('team-sonic-racing', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('spongebob-cosmic-shake', 'SpongeBob SquarePants: The Cosmic Shake', '3D Platformer / Kids & Family', 8.7, 2023, 'Bikini Bottom Fun', 16, 18, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/spongebob-cosmic-shake.jpg', 'Wish-granting Mermaid Tears open portals to 7 distinct Wishworlds in Bikini Bottom.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spongebob-cosmic-shake', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spongebob-cosmic-shake', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spongebob-cosmic-shake', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spongebob-cosmic-shake', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('metal-slug-tactics', 'Metal Slug Tactics', 'Tactical Strategy / Roguelite', 8.6, 2024, 'Retro Tactics', 10, 12, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/metal-slug-tactics.jpg', 'Classic explosive run-and-gun combat reimagined as a dynamic tactical grid RPG.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('metal-slug-tactics', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('metal-slug-tactics', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('metal-slug-tactics', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('metal-slug-tactics', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('watch-dogs-legion', 'Watch Dogs: Legion', 'Hacking / Open World', 8.5, 2020, 'Play as Anyone', 45, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/watch-dogs-legion.jpg', 'Build a resistance of anyone you see in near-future London facing collapse.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-legion', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-legion', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-legion', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-legion', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('stray', 'Stray', 'Cyberpunk Adventure / Cat', 9.3, 2022, 'Award Winning', 14, 15, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/stray.jpg', 'A stray cat untangles an ancient mystery to escape a cybercity populated by droids.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('stray', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('stray', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('stray', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('stray', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('batman-arkham-knight', 'Batman: Arkham Knight', 'Action / Superhero', 9.6, 2015, 'PlayStation Hit', 50, 55, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/batman-arkham-knight.jpg', 'Drive the Batmobile through Gotham City to confront Scarecrow and the Arkham Knight.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('batman-arkham-knight', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('batman-arkham-knight', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('batman-arkham-knight', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('like-a-dragon-infinite-wealth', 'Like a Dragon: Infinite Wealth', 'Turn-Based RPG / Yakuza', 9.4, 2024, 'Epic RPG', 60, 70, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/like-a-dragon-infinite-wealth.jpg', 'Two larger-than-life heroes, Ichiban Kasuga and Kazuma Kiryu, team up in Hawaii.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('like-a-dragon-infinite-wealth', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('like-a-dragon-infinite-wealth', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('like-a-dragon-infinite-wealth', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('like-a-dragon-infinite-wealth', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('watch-dogs-2', 'Watch Dogs 2', 'Hacking / Open World', 9.0, 2016, 'San Francisco Hacker', 38, 42, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/watch-dogs-2.jpg', 'Play as brilliant young hacker Marcus Holloway in the San Francisco Bay Area.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('gow-3-remastered', 'God of War III Remastered', 'Hack & Slash / Greek Myth', 9.4, 2015, 'Only on PlayStation', 40, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/gow-3-remastered.jpg', 'Kratos scales Mount Olympus to take down Zeus in brutal 1080p 60fps glory.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gow-3-remastered', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('tekken-7', 'Tekken 7', 'Fighting / Martial Arts', 9.3, 2017, 'King of Iron Fist', 50, 55, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/tekken-7.jpg', 'Discover the epic conclusion of the 20-year Mishima clan feud and Rage Art finishers.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tekken-7', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tekken-7', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tekken-7', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('elden-ring', 'Elden Ring', 'Dark Fantasy / Open World RPG', 9.9, 2022, 'Game of the Year', 50, 60, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/elden-ring.jpg', 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('elden-ring', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('elden-ring', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('elden-ring', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('elden-ring', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('upin-ipin-universe', 'Upin & Ipin Universe', 'Kids & Family / Adventure', 8.4, 2023, 'Kids Favorite', 12, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/upin-ipin-universe.jpg', 'Join the twin brothers in fun Kampung adventures, mini-games, and village exploration.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('upin-ipin-universe', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('witcher-3', 'The Witcher 3: Wild Hunt', 'Dark Fantasy / Action RPG', 9.9, 2015, 'Over 300 GOTY Awards', 50, 55, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/witcher-3.jpg', 'Play as Geralt of Rivia, monster slayer for hire, hunting the Child of Prophecy.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('witcher-3', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('witcher-3', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('witcher-3', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('witcher-3', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('dbz-kakarot', 'Dragon Ball Z: Kakarot', 'Anime / Action RPG', 9.1, 2020, 'Anime RPG', 38, 40, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/dbz-kakarot.jpg', 'Relive the story of Goku and other Z Fighters. Fish, eat, train, and battle Saiyans.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dbz-kakarot', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dbz-kakarot', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dbz-kakarot', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dbz-kakarot', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('re8-village', 'Resident Evil Village', 'Survival Horror / Action', 9.4, 2021, 'Award Winner', 35, 40, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/re8-village.jpg', 'Ethan Winters battles terrifying new adversaries in a snow-capped European village.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re8-village', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re8-village', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re8-village', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re8-village', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('re3-remake', 'Resident Evil 3 Remake', 'Survival Horror / Action', 8.8, 2020, 'Escape Nemesis', 25, 28, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/re3-remake.jpg', 'Jill Valentine attempts a desperate escape from Raccoon City while pursued by Nemesis.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re3-remake', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re3-remake', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re3-remake', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re3-remake', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('gta-trilogy', 'Grand Theft Auto: The Trilogy – The Definitive Edition', 'Open World / Crime Action', 8.6, 2021, '3 Classic Games', 40, 45, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/gta-trilogy.jpg', 'Play the genre-defining classics: GTA III, GTA Vice City, and GTA San Andreas remastered.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gta-trilogy', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gta-trilogy', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gta-trilogy', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gta-trilogy', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('uncharted-4', 'Uncharted 4: A Thief', 'Cinematic Action Adventure', 9.8, 2016, 'Only on PlayStation', 50, 60, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/uncharted-4.jpg', 'Nathan Drake is pulled back into the dangerous world of thieves in search of Libertalia.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('uncharted-4', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('uncharted-4', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('uncharted-4', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('re6', 'Resident Evil 6', 'Action Horror / Co-op', 8.4, 2016, '4 Campaigns', 20, 22, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/re6.jpg', 'Four intertwined campaigns featuring Leon, Chris, Jake, and Ada Wong battling global bioterrorism.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re6', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re6', 'PS3') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re6', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('re6', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('mortal-kombat-11', 'Mortal Kombat 11 Ultimate', 'Fighting / Martial Arts', 9.6, 2020, 'Ultimate Edition', 45, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/mortal-kombat-11.jpg', 'Custom Character Variations, cinematic story mode, and iconic Fatalities in brutal high definition.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('mortal-kombat-11', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('mortal-kombat-11', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('mortal-kombat-11', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('mortal-kombat-11', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('batman-telltale-series', 'Batman: The Telltale Series', 'Narrative Adventure / Superhero', 8.8, 2016, 'Choice & Consequence', 22, 24, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/batman-telltale-series.jpg', 'Enter the fractured psyche of Bruce Wayne and shape Gotham destiny through moral choices.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('batman-telltale-series', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('batman-telltale-series', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('batman-telltale-series', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('kof-xv', 'The King of Fighters XV', 'Fighting / 2D Arcade', 8.9, 2022, '3v3 Team Battles', 32, 35, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/kof-xv.jpg', 'SNK legendary 39-fighter roster, SHATTER ALL EXPECTATIONS combat, and rollback netcode.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('kof-xv', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('kof-xv', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('kof-xv', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('kof-xv', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('horizon-zero-dawn', 'Horizon Zero Dawn: Complete Edition', 'Open World RPG / Sci-Fi', 9.7, 2017, 'PlayStation Hit', 48, 52, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/horizon-zero-dawn.jpg', 'Aloy legendary origin quest across a vibrant post-apocalyptic world ruled by deadly machines.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('horizon-zero-dawn', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('horizon-zero-dawn', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('uncharted-nathan-drake-collection', 'Uncharted: The Nathan Drake Collection', 'Cinematic Action Adventure', 9.6, 2015, '3 Remastered Classics', 45, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/uncharted-nathan-drake-collection.jpg', 'Includes Drakes Fortune, Among Thieves, and Drakes Deception fully remastered at 1080p 60fps.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('uncharted-nathan-drake-collection', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('gran-turismo-7', 'Gran Turismo 7', 'Racing Simulation', 9.5, 2022, 'The Real Driving Sim', 110, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/gran-turismo-7.jpg', 'Over 400 cars, legendary circuits, and deep automotive tuning with hyper-realistic physics.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gran-turismo-7', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('gran-turismo-7', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('ac-odyssey', 'Assassin', 'Open World Action RPG', 9.3, 2018, 'Ancient Greece', 55, 60, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ac-odyssey.jpg', 'Forge your destiny as a Spartan mercenary in the Peloponnesian War across Ancient Greece.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-odyssey', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-odyssey', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ac-odyssey', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('cyberpunk-2077', 'Cyberpunk 2077', 'Open World Sci-Fi RPG', 9.2, 2020, 'Night City', 70, 75, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/cyberpunk-2077.jpg', 'Become V, a cyber-enhanced mercenary outlaw navigating the dangerous power struggles of Night City.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cyberpunk-2077', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cyberpunk-2077', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cyberpunk-2077', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('cyberpunk-2077', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('dying-light-2', 'Dying Light 2: Stay Human', 'Parkour Survival Horror / Action', 8.9, 2022, 'Parkour & Zombies', 40, 45, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/dying-light-2.jpg', 'Use agility and brutal combat skills to survive the infected hordes in The City.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dying-light-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dying-light-2', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dying-light-2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dying-light-2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('crash-bandicoot-n-sane-trilogy', 'Crash Bandicoot N. Sane Trilogy', '3D Platformer / Classic', 9.3, 2017, '3 Full Games', 24, 28, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/crash-bandicoot-n-sane-trilogy.jpg', 'Spin, jump, and wump through fully remastered versions of Crash 1, Cortex Strikes Back, and Warped.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('crash-bandicoot-n-sane-trilogy', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('crash-bandicoot-n-sane-trilogy', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('crash-bandicoot-n-sane-trilogy', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('fifa-23', 'EA SPORTS FIFA 23', 'Sports / Football', 9.0, 2022, 'World Cup Edition', 45, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/fifa-23.jpg', 'Features Mens and Womens FIFA World Cup tournaments, HyperMotion2 technology, and cross-play.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('fifa-23', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('fifa-23', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('fifa-23', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('fifa-23', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('ufc-5', 'EA SPORTS UFC 5', 'Combat Sports / MMA', 9.1, 2023, 'Next-Gen Combat', 0, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ufc-5.jpg', 'Real Impact System damage rendering, seamless submissions, and cinematic K.O. replays.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ufc-5', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ufc-5', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('wwe-2k24', 'WWE 2K24', 'Sports / Wrestling', 9.2, 2024, '40 Years of WrestleMania', 70, 80, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/wwe-2k24.jpg', 'Relive 40 years of WrestleMania greatest moments with match types including Casket and Ambulance matches.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wwe-2k24', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wwe-2k24', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wwe-2k24', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wwe-2k24', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('final-fantasy-7-remake', 'Final Fantasy VII Remake', 'JRPG / Action RPG', 9.5, 2020, 'Iconic Masterpiece', 85, 90, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/final-fantasy-7-remake.jpg', 'A breathtaking reimagining of the iconic Midgar adventure with real-time hybrid combat.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('final-fantasy-7-remake', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('final-fantasy-7-remake', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('final-fantasy-7-remake', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('monster-hunter-world', 'Monster Hunter: World', 'Action RPG / Co-op Hunting', 9.4, 2018, 'Co-op Hunter', 48, 52, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/monster-hunter-world.jpg', 'Hunt giant monsters across living ecosystems solo or with up to 3 hunters in online co-op.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('monster-hunter-world', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('monster-hunter-world', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('monster-hunter-world', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('star-wars-jedi-survivor', 'Star Wars Jedi: Survivor', 'Action Adventure / Sci-Fi', 9.3, 2023, 'Jedi Knight', 140, 155, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/star-wars-jedi-survivor.jpg', 'Cal Kestis continues his fight against the Empire with expanded lightsaber combat stances and Force powers.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-jedi-survivor', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-jedi-survivor', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-jedi-survivor', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-jedi-survivor', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('star-wars-jedi-fallen-order', 'Star Wars Jedi: Fallen Order', 'Action Adventure / Sci-Fi', 9.1, 2019, 'Jedi Adventure', 45, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/star-wars-jedi-fallen-order.jpg', 'Survive Order 66, complete your training, and rebuild the fallen Jedi Order.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-jedi-fallen-order', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-jedi-fallen-order', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-jedi-fallen-order', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-jedi-fallen-order', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('death-stranding', 'Death Stranding', 'Sci-Fi Adventure / Action', 9.2, 2019, 'Hideo Kojima Game', 55, 65, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/death-stranding.jpg', 'Sam Bridges must brave a world utterly transformed by the Death Stranding to reconnect isolated cities.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('death-stranding', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('death-stranding', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('death-stranding', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('persona-5-royal', 'Persona 5 Royal', 'JRPG / Turn-Based', 9.8, 2020, 'Masterpiece RPG', 38, 42, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/persona-5-royal.jpg', 'Don the mask of Joker, join the Phantom Thieves of Hearts, and steal corrupted desires across Tokyo.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('persona-5-royal', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('persona-5-royal', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('persona-5-royal', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('persona-5-royal', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('sifu', 'Sifu: Vengeance Edition', 'Martial Arts / Action', 9.0, 2022, 'Kung Fu Master', 18, 20, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/sifu.jpg', 'One life, endless kung fu mastery. Hunt down your familys assassins in intense hand-to-hand combat.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sifu', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sifu', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sifu', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sifu', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('hitman-3', 'Hitman World of Assassination', 'Stealth / Sandbox Action', 9.3, 2021, 'Ultimate Hitman', 65, 70, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/hitman-3.jpg', 'Agent 47 returns to execute contracts across high-profile international sandbox playgrounds.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hitman-3', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hitman-3', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hitman-3', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('hitman-3', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('doom-eternal', 'DOOM Eternal', 'FPS / Fast-Paced Action', 9.6, 2020, 'Rip & Tear', 42, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/doom-eternal.jpg', 'Become the Slayer and conquer demons across dimensions in relentless high-speed first-person combat.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('doom-eternal', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('doom-eternal', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('doom-eternal', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('doom-eternal', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('far-cry-5', 'Far Cry 5', 'Open World FPS', 8.9, 2018, 'Hope County Resistance', 45, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/far-cry-5.jpg', 'Lead a resistance against a fanatical doomsday cult in Hope County, Montana.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-5', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-5', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-5', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('just-cause-4', 'Just Cause 4: Complete Edition', 'Action Sandbox / Destruction', 8.4, 2018, 'Extreme Weather Action', 48, 52, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/just-cause-4.jpg', 'Rico Rodriguez brings chaos to Solis with wingsuit gliding, grapples, and dynamic tornadoes.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('just-cause-4', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('just-cause-4', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('just-cause-4', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('rise-of-the-tomb-raider', 'Rise of the Tomb Raider: 20 Year Celebration', 'Action Adventure', 9.2, 2016, '20 Year Celebration', 35, 40, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/rise-of-the-tomb-raider.jpg', 'Lara Croft explores the treacherous Siberian wilderness in search of the lost city of Kitezh.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('rise-of-the-tomb-raider', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('rise-of-the-tomb-raider', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('rise-of-the-tomb-raider', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('battlefield-1', 'Battlefield 1: Revolution', 'FPS / WWI Warfare', 9.3, 2016, 'WWI Masterpiece', 50, 55, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/battlefield-1.jpg', 'Experience all-out war with 64-player infantry skirmishes, tanks, airships, and armored trains.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('battlefield-1', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('battlefield-1', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('battlefield-1', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('ratchet-and-clank', 'Ratchet & Clank (PlayStation Hits)', '3D Action Platformer', 9.1, 2016, 'Galactic Fun', 28, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ratchet-and-clank.jpg', 'Blast your way through an adrenaline-charged space adventure packed with outrageous weaponry.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('ratchet-and-clank', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('nfs-unbound', 'Need for Speed Unbound', 'Street Racing / Anime Effects', 8.8, 2022, 'Lakeshore Street Race', 0, 35, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/nfs-unbound.jpg', 'Graffiti-inspired driving effects, high-stakes bets, and relentless police pursuits in Lakeshore.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nfs-unbound', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nfs-unbound', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nfs-unbound', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('black-myth-wukong', 'Black Myth: Wukong', 'Action RPG / Chinese Mythology', 9.6, 2024, 'Global Sensation', 0, 130, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/black-myth-wukong.jpg', 'Journey to the West as the Destined One with mythical staff techniques and shapeshifting spells.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('black-myth-wukong', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('black-myth-wukong', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('tekken-8', 'Tekken 8', 'Fighting / 3D Versus', 9.5, 2024, 'Heat System Fighter', 0, 100, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/tekken-8.jpg', 'Fist Meets Fate. Explosive next-gen graphics, Heat System mechanics, and legendary Mishima rivalry.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tekken-8', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tekken-8', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('tekken-8', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('street-fighter-6', 'Street Fighter 6', 'Fighting / Drive System', 9.4, 2023, 'Evolution Champ', 45, 60, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/street-fighter-6.jpg', 'Capcom fighting masterclass featuring Drive Gauge, Battle Hub, and World Tour single-player mode.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('street-fighter-6', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('street-fighter-6', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('street-fighter-6', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('street-fighter-6', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('dragon-ball-sparking-zero', 'Dragon Ball: Sparking! ZERO', 'Anime / 3D Arena Fighter', 9.5, 2024, 'Budokai Tenkaichi Return', 0, 30, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/dragon-ball-sparking-zero.jpg', 'The legendary Budokai Tenkaichi series returns with earth-shattering battles and massive character rosters.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dragon-ball-sparking-zero', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dragon-ball-sparking-zero', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dragon-ball-sparking-zero', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('metal-gear-solid-v', 'Metal Gear Solid V: The Phantom Pain', 'Tactical Stealth Action', 9.6, 2015, 'Kojima Masterpiece', 28, 28, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/metal-gear-solid-v.jpg', 'Open-world stealth espionage sandbox in Afghanistan and Africa with Mother Base Fulton extractions.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('metal-gear-solid-v', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('metal-gear-solid-v', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('metal-gear-solid-v', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('assassins-creed-origins', 'Assassin', 'Action RPG / Ancient Egypt', 9.1, 2017, 'Birth of Brotherhood', 45, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/ac-origins.jpg', 'Uncover the origins of the Assassin Brotherhood with Bayek across the pyramids and deserts of Egypt.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('assassins-creed-origins', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('assassins-creed-origins', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('assassins-creed-origins', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('watch-dogs-2', 'Watch Dogs 2', 'Open World / Hacker Action', 8.9, 2016, 'San Francisco Hack', 32, 40, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/watch-dogs-2.jpg', 'Play as Marcus Holloway with DedSec in the San Francisco Bay Area using drones, cars, and phone hacks.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('watch-dogs-legion', 'Watch Dogs: Legion', 'Open World / Resistance', 8.4, 2020, 'Play as Anyone', 40, 45, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/watch-dogs-legion.jpg', 'Build a resistance force in dystopian near-future London where every citizen can be recruited and played.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-legion', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-legion', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-legion', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('watch-dogs-legion', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('far-cry-primal', 'Far Cry Primal (Apex Edition)', 'Stone Age Survival Action', 8.7, 2016, 'Beast Master', 18, 20, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/far-cry-primal.jpg', 'Conquer the savage land of Oros with tamed sabretooth tigers, woolly mammoths, and stone spears.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-primal', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-primal', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('far-cry-primal', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('the-crew-motorfest', 'The Crew Motorfest', 'Open World Festival Racing', 8.9, 2023, 'Hawaii Island Festival', 40, 45, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/the-crew-motorfest.jpg', 'High-speed motorsport festival across the tropical island of O’ahu in Hawaii with supercars and planes.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('the-crew-motorfest', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('the-crew-motorfest', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('the-crew-motorfest', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('the-crew-motorfest', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('dirt-rally-2', 'DiRT Rally 2.0', 'Rally Simulation / Off-Road', 9.0, 2019, 'Ultimate Rally Sim', 48, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/dirt-rally-2.jpg', 'Precision off-road rally driving through iconic stages in New Zealand, Argentina, Spain, and Poland.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dirt-rally-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dirt-rally-2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dirt-rally-2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('sniper-elite-4', 'Sniper Elite 4', 'WWII Tactical Stealth Shooter', 9.0, 2017, 'X-Ray Kill Cam', 34, 35, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/sniper-elite-4.jpg', 'Unrivalled sniping freedom across sun-drenched Italian coastal towns and Nazi fortresses.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sniper-elite-4', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sniper-elite-4', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sniper-elite-4', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('sniper-elite-5', 'Sniper Elite 5', 'WWII Infiltration Shooter', 8.9, 2022, 'Enhanced Ballistics', 55, 85, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/sniper-elite-5.jpg', 'Karl Fairburne fights alongside the French Resistance with enhanced traversal and invasion multiplayer.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sniper-elite-5', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sniper-elite-5', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sniper-elite-5', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('sniper-elite-5', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('battlefield-v', 'Battlefield V: Definitive Edition', 'WWII All-Out Warfare', 8.8, 2018, 'WWII Grand Ops', 50, 55, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/battlefield-v.jpg', 'World War 2 on an epic scale with Pacific theater expansions, destruction physics, and vehicle combat.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('battlefield-v', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('battlefield-v', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('battlefield-v', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('call-of-duty-wwii', 'Call of Duty: WWII', 'Historic WWII FPS', 8.9, 2017, 'Normandy Landing', 56, 90, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/cod-wwii.jpg', 'Storm Normandy beach and battle across Europe with gritty boots-on-the-ground World War II combat.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('call-of-duty-wwii', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('call-of-duty-wwii', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('call-of-duty-wwii', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('star-wars-battlefront-2', 'Star Wars Battlefront II: Celebration Edition', 'Galactic Sci-Fi Shooter', 8.8, 2017, 'Complete Star Wars', 50, 60, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/star-wars-battlefront-2.jpg', 'Pilot X-wings, wield lightsabers as Darth Vader or Luke Skywalker across prequel, original, and sequel eras.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-battlefront-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-battlefront-2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('star-wars-battlefront-2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('control-ultimate-edition', 'Control: Ultimate Edition', 'Supernatural Action Adventure', 9.3, 2020, 'Remedy Masterpiece', 38, 42, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/control.jpg', 'Unleash telekinetic powers and shape-shifting weapons inside the mysterious Oldest House.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('control-ultimate-edition', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('control-ultimate-edition', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('control-ultimate-edition', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('control-ultimate-edition', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('alan-wake-remastered', 'Alan Wake Remastered', 'Psychological Action Thriller', 9.0, 2021, 'Light vs Darkness', 30, 36, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/alan-wake-remastered.jpg', 'A troubled author searches for his missing wife in Bright Falls, fighting the shadows with his flashlight.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('alan-wake-remastered', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('alan-wake-remastered', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('alan-wake-remastered', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('alan-wake-remastered', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('dishonored-2', 'Dishonored 2', 'Supernatural Stealth Assassin', 9.3, 2016, 'Arkane Classic', 36, 60, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/dishonored-2.jpg', 'Play as Emily Kaldwin or Corvo Attano in the coastal city of Karnaca with extraordinary supernatural abilities.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dishonored-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dishonored-2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dishonored-2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('wolfenstein-2-the-new-colossus', 'Wolfenstein II: The New Colossus', 'Cinematic FPS Action', 9.1, 2017, 'Action Masterpiece', 50, 55, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/wolfenstein-2.jpg', 'BJ Blazkowicz sparks the second American revolution with high-powered dual-wielded arsenal.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wolfenstein-2-the-new-colossus', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wolfenstein-2-the-new-colossus', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('wolfenstein-2-the-new-colossus', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('until-dawn', 'Until Dawn', 'Cinematic Slasher Horror', 9.2, 2015, 'Butterfly Effect', 38, 0, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/until-dawn.jpg', 'Eight friends trapped on Blackwood Mountain. Every choice dynamically decides who lives until dawn.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('until-dawn', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('until-dawn', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('the-callisto-protocol', 'The Callisto Protocol', 'Sci-Fi Survival Horror', 8.5, 2022, 'Black Iron Prison', 44, 75, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/the-callisto-protocol.jpg', 'Brutal close-quarters combat against mutated prisoners on Jupiter’s dead moon Callisto.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('the-callisto-protocol', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('the-callisto-protocol', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('the-callisto-protocol', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('the-callisto-protocol', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('dead-island-2', 'Dead Island 2', 'Zombie Slasher / Co-op Action', 8.8, 2023, 'FLESH Gore System', 48, 70, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/dead-island-2.jpg', 'Gory zombie-slaying action through iconic Los Angeles neighborhoods with procedural dismemberment.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dead-island-2', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dead-island-2', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dead-island-2', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dead-island-2', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('dead-space-remake', 'Dead Space Remake', 'Sci-Fi Horror / Plasma Cutter', 9.4, 2023, 'USG Ishimura Terror', 0, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/dead-space-remake.jpg', 'Isaac Clarke survives the slaughter aboard the USG Ishimura rebuilt from the ground up with stunning visuals.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dead-space-remake', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dead-space-remake', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('dead-space-remake', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('lies-of-p', 'Lies of P', 'Dark Gothic Souls-like', 9.3, 2023, 'Pinocchio Souls-like', 35, 50, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/lies-of-p.jpg', 'Guide the puppet Pinocchio through the blood-soaked city of Krat with weapon crafting and Legion arms.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lies-of-p', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lies-of-p', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lies-of-p', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('lies-of-p', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('nioh-2-complete-edition', 'Nioh 2: Complete Edition', 'Samurai Yokai Action RPG', 9.4, 2020, 'Yokai Shift Combat', 45, 85, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/nioh-2.jpg', 'Master lethal samurai martial arts and unleash Yokai Shift powers in dark fantasy Sengoku-era Japan.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nioh-2-complete-edition', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nioh-2-complete-edition', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('nioh-2-complete-edition', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('demon-slayer-the-hinokami-chronicles', 'Demon Slayer: Kimetsu no Yaiba – The Hinokami Chronicles', 'Anime / Arena Fighter', 9.0, 2021, 'Hinokami Kagura', 28, 30, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/demon-slayer.jpg', 'Relive Tanjiro Kamado’s journey with breathing techniques and stunning anime animation in arena battles.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('demon-slayer-the-hinokami-chronicles', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('demon-slayer-the-hinokami-chronicles', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('demon-slayer-the-hinokami-chronicles', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('demon-slayer-the-hinokami-chronicles', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('one-piece-pirate-warriors-4', 'One Piece: Pirate Warriors 4', 'Anime / Musou Action', 8.9, 2020, 'Straw Hat Musou', 25, 25, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/one-piece-pw4.jpg', 'Smash through thousands of pirate enemies with Luffy, Zoro, and Kaido in explosive Musou combat.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('one-piece-pirate-warriors-4', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('one-piece-pirate-warriors-4', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('one-piece-pirate-warriors-4', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('crash-bandicoot-4-its-about-time', 'Crash Bandicoot 4: It', 'Precision 3D Platformer', 9.2, 2020, 'Quantum Masks', 30, 30, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/crash-4.jpg', 'Wield the four Quantum Masks to bend time, gravity, and dimensions in an all-new Crash Bandicoot adventure.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('crash-bandicoot-4-its-about-time', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('crash-bandicoot-4-its-about-time', 'PS5') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('crash-bandicoot-4-its-about-time', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('crash-bandicoot-4-its-about-time', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.games (id, title, genre, rating, release_year, badge, ps4_size_gb, pc_size_gb, cd_price, online_price, modded_price, cover_path, description)
VALUES ('spyro-reignited-trilogy', 'Spyro Reignited Trilogy', '3D Classic Platformer', 9.1, 2018, '3-in-1 Classic', 68, 40, 18000.0, 5000.0, 2000.0, '../shared/assets/covers/spyro-reignited-trilogy.jpg', 'All 3 original Spyro games remastered in glorious HD: Spyro the Dragon, Ripto’s Rage!, and Year of the Dragon.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title, genre = EXCLUDED.genre, rating = EXCLUDED.rating, release_year = EXCLUDED.release_year,
    badge = EXCLUDED.badge, ps4_size_gb = EXCLUDED.ps4_size_gb, pc_size_gb = EXCLUDED.pc_size_gb,
    cd_price = EXCLUDED.cd_price, online_price = EXCLUDED.online_price, modded_price = EXCLUDED.modded_price,
    cover_path = EXCLUDED.cover_path, description = EXCLUDED.description;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spyro-reignited-trilogy', 'PS4') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spyro-reignited-trilogy', 'XBOX') ON CONFLICT (game_id, platform) DO NOTHING;
INSERT INTO public.game_platforms (game_id, platform) VALUES ('spyro-reignited-trilogy', 'PC') ON CONFLICT (game_id, platform) DO NOTHING;

-- 4. SEED CONSOLES & VARIANTS
INSERT INTO public.consoles (id, name, short_name, tagline, badge, platform, image, description, has_modded_option, has_fc_bundle, accent_color) VALUES
('ps3', 'PlayStation 3', 'PS3', 'Classic Seventh-Gen Gaming Powerhouse', 'Retro Value', 'PlayStation', 'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=800&q=80', 'Relive iconic classics, jailbroken setups, and massive local game libraries with smooth performance.', true, false, '#3b82f6'),
('ps4', 'PlayStation 4', 'PS4', 'The Ultimate Modern Gaming Workhorse', 'Best Seller', 'PlayStation', 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80', 'Immerse yourself in blockbuster PS4 titles in 1080p and HDR with immense library support & hard drive expansions.', true, true, '#006FCD'),
('ps5', 'PlayStation 5', 'PS5', 'Next-Gen 4K 120FPS & Ultra-Fast NVMe SSD Speed', 'Flagship Next-Gen', 'PlayStation', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.', false, true, '#00439c')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description;

INSERT INTO public.console_variants (id, console_id, name, storage, base_price, spec_blurb, popular) VALUES
('ps3-fat', 'ps3', 'PS3 Fat (Original)', '80GB - 160GB HDD', 65000, 'Classic original body design, backward compatibility capabilities, high durability hardware.', false),
('ps3-slim', 'ps3', 'PS3 Slim', '160GB - 320GB HDD', 85000, 'The community favorite: quiet whisper cooling, low power consumption, perfect for full CFW jailbreak & multiMAN.', true),
('ps3-superslim', 'ps3', 'PS3 Super Slim', '250GB - 500GB HDD', 95000, 'Ultra-compact sliding disc tray design, newest production run with enhanced reliability & cool temps.', false),
('ps4-fat', 'ps4', 'PS4 Fat (Original Matte/Gloss)', '500GB HDD', 185000, 'Solid 1080p gaming, HDMI HDR support, dual front USB 3.0 ports.', false),
('ps4-slim', 'ps4', 'PS4 Slim', '500GB / 1TB HDD', 220000, 'Compact aerodynamic chassis, lower heat output, energy efficient with 5GHz Wi-Fi.', true),
('ps4-pro', 'ps4', 'PS4 Pro (4K Enhanced)', '1TB HDD', 285000, '4.2 Teraflops GPU for 4K dynamic gaming, faster boost mode frame rates, rear optical & extra USB port.', true),
('ps5-digital', 'ps5', 'PS5 Digital Edition (Original)', '825GB Custom NVMe SSD', 560000, 'All-digital future: streamlined symmetrical design, ultra-fast 5.5GB/s I/O throughput.', false),
('ps5-disc', 'ps5', 'PS5 Standard Disc Edition (Original)', '825GB Custom NVMe SSD', 630000, 'Full Ultra-HD 4K Blu-ray disc drive + digital capabilities. Play both physical discs and digital games.', true),
('ps5-slim-digital', 'ps5', 'PS5 Slim Digital', '1TB Internal SSD', 610000, '30% smaller volume, upgraded 1TB base storage, attachable disc drive capability.', false),
('ps5-slim-disc', 'ps5', 'PS5 Slim Disc Edition', '1TB Internal SSD', 695000, 'Upgraded 1TB storage, sleek modular form factor with pre-installed Ultra-HD Blu-ray disc drive.', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, base_price = EXCLUDED.base_price, storage = EXCLUDED.storage;

-- 5. SEED HARD DRIVES
INSERT INTO public.hard_drives (id, name, capacity_gb, price, game_count_est, popular, description) VALUES
('hdd-500gb', '500GB Seagate/WD USB 3.0 External HDD', 500, 22000, 12, false, 'Pre-formatted plug-and-play drive loaded with up to 12 top PS4/PS3 titles of your choice.'),
('hdd-1tb', '1TB Seagate Expansion / WD Elements USB 3.0', 1000, 38000, 25, true, 'Our most popular capacity: loaded with 25+ high-demand AAA blockbusters.'),
('hdd-2tb', '2TB Toshiba / Seagate Ultra-Slim USB 3.0', 2000, 58000, 55, true, 'The ultimate vault: 55+ full games ready for offline plug-and-play gaming.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, capacity_gb = EXCLUDED.capacity_gb;

-- 6. SEED ACCESSORIES
INSERT INTO public.accessories (id, name, category, price, image, description, compatibility, stock_status) VALUES
('dualsense-white', 'PS5 DualSense Wireless Controller (White)', 'Controllers', 68000, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80', 'Original Sony DualSense controller with dynamic haptic feedback and adaptive triggers.', 'PS5, PC, iOS, Android', 'In Stock'),
('dualsense-midnight-black', 'PS5 DualSense Wireless Controller (Midnight Black)', 'Controllers', 70000, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80', 'Sleek matte midnight black finish with precision analog sticks.', 'PS5, PC, iOS, Android', 'In Stock'),
('dualshock4-v2-black', 'PS4 DualShock 4 V2 Wireless Controller (Jet Black)', 'Controllers', 24000, 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=600&q=80', 'Original OEM DualShock 4 with glowing touchpad light bar and long battery life.', 'PS4, PC, PS3', 'In Stock'),
('dualsense-charging-station', 'PS5 DualSense Fast Charging Dock Station', 'Charging', 28000, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80', 'Click-in design: charges up to two DualSense controllers simultaneously without tying up USB ports.', 'PS5 DualSense', 'In Stock'),
('pulse-3d-headset', 'Sony PULSE 3D Wireless Gaming Headset', 'Audio', 85000, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80', 'Fine-tuned for 3D Audio on PS5 consoles with dual noise-cancelling microphones.', 'PS5, PS4, PC', 'In Stock')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price;
