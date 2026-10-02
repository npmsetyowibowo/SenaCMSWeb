# SenaWeb – JASA PEMBUATAN WEBSITE
> **CMS & Web Platform Pembuatan Website Profesional Modern Berbasis Next.js, TypeScript, Tailwind CSS Neumorphic, Relational Database, Realtime SEO Analyzer (Konsep Yoast), dan Sistem Multi-Kota.**

---

## 🌟 Ikhtisar Aplikasi

**SenaWeb** adalah platform Content Management System (CMS) dan Landing Page komersial full-stack yang dirancang khusus untuk agensi jasa pembuatan website di Indonesia. SenaWeb tidak sekadar template frontend semata, melainkan sistem CMS yang berfungsi 100% secara nyata dengan database relasional terintegrasi, autentikasi sesi aman, library media upload, realtime visitor traffic tracking, dan SEO realtime analyzer otomatis berbobot 100 poin.

### 🎯 Fitur Unggulan
1. **Desain Modern Neumorphism (Soft UI):**
   - Estetika bayangan ganda (highlight & dual-shadow) yang bersih, profesional, dan futuristik.
   - Dark Mode & Light Mode switcher dengan penyimpanan persistensi `localStorage`.
   - Responsif optimal di semua layar (Smartphone, Tablet, Laptop, Desktop).
2. **Landing Page Publik Terpadu:**
   - Hero section interaktif dengan CTA WhatsApp & Portfolio.
   - 8 Layanan Unggulan (Company Profile, UMKM, Landing Page, E-Commerce, Sekolah, Organisasi, Portfolio, Custom Web).
   - 9 Keunggulan Layanan Teknis.
   - Paket Harga Transparan (Basic Rp750.000, Medium Rp1.800.000, Premium Rp3.200.000) yang dapat diedit langsung dari database.
   - Portofolio Klien dengan filter kategori interaktif.
   - Testimoni Klien dengan rating bintang 5.
   - FAQ Accordion interaktif.
   - Reusable `ContactForm` dengan validasi lengkap, toast notifikasi, dan animasi confetti.
   - Floating collapsible WhatsApp widget di pojok kanan bawah dengan opsi template konsultasi cepat.
3. **5 Halaman Landing Page Wilayah Khusus (Local SEO Dominance):**
   - `/sidoarjo`: Target keyword jasa pembuatan website Sidoarjo & UMKM industri.
   - `/lumajang`: Target keyword jasa pembuatan website Lumajang.
   - `/surabaya`: Target keyword korporasi, startup, dan e-commerce Surabaya.
   - `/purwokerto`: Target keyword edukasi & UMKM Purwokerto Banyumas.
   - `/solo`: Target keyword industri kreatif & batik Solo Surakarta.
4. **Blog & Artikel Lengkap:**
   - `/blog`: Pencarian kata kunci realtime, filter kategori, tag, featured article, dan pagination.
   - `/blog/[slug]`: Artikel lengkap, perhitungan waktu baca otomatis, Table of Contents (TOC) otomatis dari H2/H3, breadcrumbs, tombol share sosial, navigasi prev/next, dan **Related Posts** grid rekomendasi.
   - Schema.org JSON-LD (Article, BreadcrumbList, WebSite, Organization).
5. **Realtime SEO Analyzer (Konsep Yoast 100 Poin):**
   - Bobot Skor:
     - Technical SEO: 20
     - Content SEO: 25
     - Keyword Optimization: 20
     - Readability: 15
     - Internal Linking: 10
     - Image SEO: 10
   - Google Search Preview SERP realtime (Desktop & Mobile view).
   - Pengecekan Focus Keyword pada title, slug, meta description, paragraf pertama, dan densitas.
   - Pengelompokan hasil: 🔴 Problems, 🟡 Improvements, 🟢 Good.
6. **SenaCMS Admin Dashboard (`/senacms`):**
   - Autentikasi sesi aman berbasis cookies terenkripsi.
   - Default credential dev: `Username: admin` &bull; `Password: admin` (tersimpan dalam hash bcrypt, dapat diubah di menu Akun).
   - Realtime Visitor & Pageview Traffic Tracking dengan grafik visual 7 hari terakhir.
   - CRUD Artikel dengan Rich Text Editor (Heading, Bold, Italic, Link, Image, Table, Code, Source Mode).
   - CRUD Kategori & Tag.
   - Media Library: Upload gambar lokal (validasi MIME & ukuran max 5MB), simpan URL Unsplash, salin URL, preview modal, dan kelola alt text SEO.
   - CRUD Portofolio, Testimoni, Paket Harga, FAQ, Halaman Kustom.
   - Leads Manager (Inbox formulir konsultasi masuk) dengan tombol direct chat WhatsApp.
   - Website Settings: Edit Favicon, Logo, Foto Brand Ambassador, Menu Navigasi (tambah, edit, geser urutan, hapus), nomor WhatsApp, dan kontak resmi tanpa perlu recode.
7. **SEO Teknis:**
   - Dynamic `/sitemap.xml` Route.
   - Dynamic `/robots.txt` Route mengambil domain dari database.

---

## 📁 Struktur Direktori

```
├── app/
│   ├── [slug]/page.tsx           # Halaman kustom dinamis (Tentang Kami, Kebijakan, dll.)
│   ├── api/
│   │   ├── articles/             # API CRUD Artikel & hitung SEO
│   │   ├── auth/                 # API Login, Logout, Session check
│   │   ├── categories/           # API CRUD Kategori
│   │   ├── faq/                  # API CRUD FAQ
│   │   ├── inquiries/            # API Formulir Kontak / Leads
│   │   ├── media/                # API Upload & Galeri Media
│   │   ├── pages/                # API CRUD Halaman
│   │   ├── portfolio/            # API CRUD Portofolio
│   │   ├── pricing/              # API CRUD Paket Harga
│   │   ├── settings/             # API Website Settings & Menu Navigasi
│   │   ├── tags/                 # API CRUD Tag
│   │   ├── testimonials/         # API CRUD Testimoni
│   │   ├── traffic/              # API Traffic Logger & Analytics
│   │   └── users/                # API Ganti Password & Profil Admin
│   ├── blog/
│   │   ├── [slug]/page.tsx       # Detail Artikel + RelatedPosts + TOC
│   │   └── page.tsx              # Arsip Blog, Search, Kategori, Pagination
│   ├── category/[slug]/page.tsx  # Arsip Kategori Blog
│   ├── error.tsx                 # Halaman Error 500
│   ├── globals.css               # Neumorphic Soft UI & Dark Mode Variables
│   ├── layout.tsx                # Root Layout, Metadata, Schema.org, Providers
│   ├── lumajang/page.tsx         # Landing Page Kota Lumajang
│   ├── not-found.tsx             # Halaman 404
│   ├── page.tsx                  # Beranda Landing Page Publik SenaWeb
│   ├── portfolio/[slug]/page.tsx # Detail Portofolio
│   ├── purwokerto/page.tsx       # Landing Page Kota Purwokerto
│   ├── robots.txt/route.ts       # Dynamic robots.txt
│   ├── senacms/                  # Admin Dashboard Area
│   │   ├── AdminHeader.tsx       # Navigation bar & tabs admin
│   │   ├── articles/             # List & Editor Artikel (SEO Analyzer)
│   │   ├── categories/           # Kategori manager
│   │   ├── dashboard/            # Traffic chart, statistik ringkas
│   │   ├── faq/                  # FAQ manager
│   │   ├── inquiries/            # Konsultasi masuk / Leads
│   │   ├── layout.tsx            # Protected layout
│   │   ├── login/page.tsx        # Halaman Login Admin
│   │   ├── media/                # Media Library
│   │   ├── pages/                # Halaman kustom
│   │   ├── portfolio/            # Portofolio manager
│   │   ├── pricing/              # Paket harga manager
│   │   ├── seo/                  # Global SEO settings
│   │   ├── settings/             # Pengaturan website & menu navigasi
│   │   ├── tags/                 # Tag manager
│   │   ├── testimonials/         # Testimoni manager
│   │   └── users/                # Akun admin & ganti password
│   ├── sidoarjo/page.tsx         # Landing Page Kota Sidoarjo
│   ├── sitemap.xml/route.ts      # Dynamic XML Sitemap
│   ├── solo/page.tsx             # Landing Page Kota Solo
│   ├── surabaya/page.tsx         # Landing Page Kota Surabaya
│   └── tag/[slug]/page.tsx       # Arsip Tag Blog
├── components/
│   ├── CityLandingTemplate.tsx   # Reusable City Landing Page Component
│   ├── ContactForm.tsx           # Formulir Konsultasi + Validasi + Toast
│   ├── FaqSection.tsx            # FAQ Accordion
│   ├── Footer.tsx                # Footer website
│   ├── HeroSection.tsx           # Hero Banner + Brand Ambassador
│   ├── Navbar.tsx                # Dynamic Neumorphic Navbar
│   ├── PortfolioSection.tsx      # Portfolio Showcase + Filter
│   ├── PricingSection.tsx        # Pricing Table
│   ├── RelatedPosts.tsx          # 3 Rekomendasi Artikel Terkait
│   ├── RichTextEditor.tsx        # WYSIWYG & Source Code HTML Editor
│   ├── SeoAnalyzerPanel.tsx      # Panel Realtime Yoast SEO Analyzer
│   ├── ServicesSection.tsx       # 8 Layanan Utama
│   ├── TestimonialSection.tsx    # Testimoni Klien
│   ├── ThemeToggle.tsx           # Dark/Light Mode Switcher
│   ├── Toast.tsx                 # Toast Notification System
│   ├── WhatsAppWidget.tsx        # Floating Collapsible WhatsApp Widget
│   └── WhyUsSection.tsx          # 9 Keunggulan SenaWeb
├── data/
│   └── senaweb_db.json           # File Database Relasional (Auto-seed)
├── lib/
│   ├── auth.ts                   # Bcrypt hashing, sessions, cookie guard
│   ├── db/
│   │   ├── index.ts              # Database Persistence Manager & Query Engine
│   │   ├── schema.sql            # PostgreSQL DDL Production Script
│   │   ├── seed.ts               # Seed data bawaan (Admin, artikel, portfolio, dll.)
│   │   └── types.ts              # TypeScript relational schema interfaces
│   └── seo-analyzer.ts           # 6-pillar weighted SEO scoring engine
```

---

## 🗄️ Skema Database Relasional

Aplikasi menggunakan skema relasional dengan tabel-tabel utama:
- `users`: Administrator dan penulis artikel (password_hash bcrypt, role, avatar).
- `sessions`: Token sesi cookie terenkripsi dengan waktu kedaluwarsa.
- `categories`: Kategori artikel dengan slug dan warna label.
- `tags`: Label tag artikel.
- `articles`: Konten artikel blog, slug, excerpt, focus keyword, reading time, skor SEO, status (draft/published).
- `article_tags`: Relasi many-to-many antara artikel dan tag.
- `portfolio`: Proyek karya klien, klien, thumbnail, live demo URL, dan tech stack.
- `testimonials`: Ulasan klien, rating bintang, jabatan, perusahaan, dan avatar.
- `pricing_plans`: Paket harga (Basic, Medium, Premium), fitur list, status populer, cta text.
- `faqs`: Pertanyaan dan jawaban FAQ dengan nomor urutan.
- `media`: File library gambar, MIME type, ukuran bytes, URL, dan deskripsi alt text.
- `pages`: Halaman statis tambahan (Tentang Kami, Kebijakan Privasi).
- `settings`: Konfigurasi global situs (logo, favicon, ambassador, WhatsApp, navigasi menu JSON).
- `inquiries`: Formulir pesan konsultasi masuk dari pengunjung.
- `traffic_logs`: Log kunjungan website realtime untuk grafik statistik.

File SQL DDL lengkap siap pakai untuk PostgreSQL tersedia di: `/lib/db/schema.sql`.

---

## 🚀 Panduan Instalasi Lokal

1. **Clone & Masuk ke Folder Project:**
   ```bash
   git clone <repo-url>
   cd senaweb
   ```

2. **Instal Dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Atur `APP_URL` ke `http://localhost:3000`.

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka peramban pada `http://localhost:3000`.

5. **Login ke SenaCMS Admin:**
   - Akses URL: `http://localhost:3000/senacms/login`
   - **Username:** `admin`
   - **Password:** `admin`
   - *(Setelah login, Anda dapat langsung mengganti kata sandi di menu **Akun & Password**)*.

---

## 🌐 Panduan Deploy ke Vercel (Step-by-Step)

### Langkah 1: Siapkan Database Produksi (PostgreSQL)
Anda dapat menggunakan database PostgreSQL gratis seperti:
- **Supabase** (supabase.com)
- **Neon Serverless Postgres** (neon.tech)
- **Vercel Postgres**

1. Buat project database baru di dashboard Supabase / Neon.
2. Buka menu **SQL Editor**.
3. Buka file `lib/db/schema.sql` dari project ini, salin seluruh isi kodenya, dan jalankan (Run) di SQL Editor untuk membuat tabel dan indeks secara otomatis.
4. Salin **Connection String URI** database Anda (misal: `postgres://postgres:[PASSWORD]@[HOST]:5432/[DB]`).

### Langkah 2: Deploy ke Vercel
1. Unggah kode ke repository GitHub / GitLab Anda.
2. Buka [Vercel Dashboard](https://vercel.com) dan klik **Add New Project**.
3. Import repository GitHub SenaWeb Anda.
4. Pada bagian **Environment Variables**, tambahkan:
   - `APP_URL`: Domain resmi Vercel Anda (contoh: `https://senaweb.vercel.app` atau `https://senaweb.id`).
   - `POSTGRES_URL`: Connection string PostgreSQL Anda.
   - `GEMINI_API_KEY`: API Key Gemini AI Studio Anda.
5. Klik tombol **Deploy**. Vercel akan otomatis melakukan proses build Next.js.

### Langkah 3: Pengaturan Domain Kustom di Vercel
1. Di dashboard project Vercel, masuk ke **Settings > Domains**.
2. Masukkan domain resmi Anda (misal `senaweb.id` atau `www.senaweb.id`).
3. Tambahkan DNS Record yang diberikan Vercel (A Record / CNAME) ke registrar domain Anda (Niagahoster, Domainesia, Rumahweb, Cloudflare, dll.).
4. Setelah status domain valid, buka menu `/senacms/settings` di admin dan ubah **Domain Utama** sesuai nama domain Anda.
5. Sitemap (`/sitemap.xml`) dan Robots (`/robots.txt`) akan otomatis mengarah ke domain baru Anda.

---

## 🛠️ Troubleshooting & Pertanyaan Umum

- **Lupa Password Admin:**
  Jika Anda lupa kata sandi admin pada environment development, Anda dapat mereset nilai `password_hash` pada file `/data/senaweb_db.json` dengan hash bawaan `'admin'` atau menghapus file `senaweb_db.json` agar sistem melakukan auto-reseed awal.
- **Upload Gambar Gagal:**
  Pastikan tipe file adalah JPG, PNG, WebP, atau SVG dengan ukuran maksimal 5MB. Anda juga dapat menggunakan opsi **Simpan dari URL** untuk memasukkan gambar beresolusi tinggi langsung tanpa membebani penyimpanan server.
- **SEO Score Rendah:**
  Gunakan panel **Realtime Yoast-Style SEO Analyzer** saat mengedit artikel. Pastikan Focus Keyword terdapat pada SEO Title, Permalink Slug, Paragraf pertama, dan tambahkan minimal 1 gambar dengan Alt Text yang relevan.

---

**Dikembangkan dengan bangga untuk para pebisnis dan agensi digital Indonesia oleh SenaWeb.**
