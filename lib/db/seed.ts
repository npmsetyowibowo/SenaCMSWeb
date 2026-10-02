import bcrypt from 'bcryptjs';
import { DatabaseSchema } from './types';

export function getInitialSeedData(): DatabaseSchema {
  // Hash for 'admin'
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('admin', salt);
  const now = new Date().toISOString();

  return {
    users: [
      {
        id: 1,
        username: 'admin',
        email: 'admin@senaweb.id',
        password_hash: adminPasswordHash,
        full_name: 'Administrator SenaWeb',
        role: 'admin',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        created_at: now,
        updated_at: now,
      },
    ],
    sessions: [],
    categories: [
      {
        id: 1,
        name: 'Web Development',
        slug: 'web-development',
        description: 'Panduan, tips teknis, dan arsitektur website modern Next.js dan Tailwind.',
        color: '#2563eb',
        created_at: now,
      },
      {
        id: 2,
        name: 'Tips Bisnis & UMKM',
        slug: 'tips-bisnis-umkm',
        description: 'Strategi digitalisasi bisnis, company profile, dan peningkatan omset online.',
        color: '#10b981',
        created_at: now,
      },
      {
        id: 3,
        name: 'SEO & Optimasi',
        slug: 'seo-dan-optimasi',
        description: 'Teknik menduduki halaman satu Google, riset keyword, dan Core Web Vitals.',
        color: '#f59e0b',
        created_at: now,
      },
    ],
    tags: [
      { id: 1, name: 'Next.js', slug: 'nextjs', created_at: now },
      { id: 2, name: 'SEO Lokal', slug: 'seo-lokal', created_at: now },
      { id: 3, name: 'Company Profile', slug: 'company-profile', created_at: now },
      { id: 4, name: 'UMKM Indonesia', slug: 'umkm-indonesia', created_at: now },
      { id: 5, name: 'Desain Responsif', slug: 'desain-responsif', created_at: now },
    ],
    articles: [
      {
        id: 1,
        title: '7 Alasan UMKM Wajib Punya Website Profesional di Era Digital',
        slug: 'alasan-umkm-wajib-punya-website-profesional',
        excerpt: 'Mengapa media sosial saja tidak cukup untuk membangun kredibilitas bisnis jangka panjang? Simak analisis mendalam dan keuntungannya.',
        content: `<h2>Mengapa Website Sangat Krusial untuk Bisnis Anda?</h2>
<p>Di era digital modern saat ini, memiliki kehadiran online bukan lagi sekadar pilihan alternatif, melainkan fondasi utama reputasi bisnis. Banyak pemilik usaha UMKM merasa cukup hanya mengandalkan akun media sosial seperti Instagram, TikTok, atau WhatsApp Business.</p>
<p>Namun tahukah Anda bahwa lebih dari <strong>82% calon konsumen</strong> melakukan riset terlebih dahulu di Google sebelum memutuskan untuk membeli produk atau menyewa jasa?</p>

<h3>1. Kredibilitas dan Brand Trust yang Tak Tertandingi</h3>
<p>Website dengan domain resmi (seperti .com atau .id) langsung memancarkan aura profesionalisme. Calon klien akan memandang bisnis Anda mapan, serius, dan dapat dipercaya dibanding kompetitor yang hanya memiliki link bio media sosial.</p>

<h3>2. Kontrol Penuh Tanpa Ketergantungan Algoritma</h3>
<p>Algoritma media sosial bisa berubah sewaktu-waktu. Jangkauan organik bisa anjlok dalam semalam. Dengan memiliki website mandiri, Anda memegang kendali penuh atas aset digital, katalog produk, dan database pelanggan Anda.</p>

<h3>3. Bekerja 24 Jam Nonstop Sebagai Tenaga Penjualan Otomatis</h3>
<p>Website Anda tidak pernah tidur. Informasi layanan, portofolio testimoni, hingga tombol pemesanan WhatsApp dapat diakses calon pembeli kapan saja, bahkan saat Anda sedang istirahat.</p>

<h2>Kesimpulan</h2>
<p>Investasi pada website profesional adalah langkah paling tepat untuk membawa bisnis Anda naik kelas. Bersama <strong>SenaWeb</strong>, kami siap mewujudkan website impian Anda yang cepat, responsif, dan siap menghasilkan omset.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        status: 'published',
        category_id: 2,
        author_id: 1,
        focus_keyword: 'website profesional',
        seo_title: '7 Alasan UMKM Wajib Punya Website Profesional di Era Digital',
        seo_description: 'Pelajari mengapa UMKM wajib memiliki website profesional untuk meningkatkan kredibilitas, penjualan, dan kepercayaan pelanggan online.',
        seo_score: 95,
        reading_time: 4,
        views: 342,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        title: 'Panduan Lengkap SEO Lokal: Cara Mendominasi Pencarian Google di Kota Anda',
        slug: 'panduan-lengkap-seo-lokal-kota-anda',
        excerpt: 'Kuasai teknik optimasi mesin pencari lokal untuk menarik pelanggan di kota Anda, mulai dari Google Business hingga struktur website.',
        content: `<h2>Apa Itu SEO Lokal dan Mengapa Penting?</h2>
<p>SEO Lokal adalah strategi pengoptimalan website agar bisnis Anda muncul di peringkat teratas pencarian Google ketika pengguna mencari produk atau jasa di area geografis tertentu, misalnya "Jasa Pembuatan Website Surabaya" atau "Bengkel Mobil Sidoarjo".</p>

<h3>Langkah Kunci Optimasi SEO Lokal</h3>
<ol>
  <li><strong>Riset Keyword Berbasis Kota:</strong> Targetkan kata kunci yang menyertakan nama kota spesifik.</li>
  <li><strong>Landing Page Khusus Wilayah:</strong> Buat halaman pendaratan (landing page) untuk masing-masing kota sasaran dengan konten relevan dan otentik.</li>
  <li><strong>Struktur Data LocalBusiness (Schema.org):</strong> Bantu Google memahami lokasi fisik, nomor telepon, dan jam operasional bisnis Anda.</li>
  <li><strong>Kecepatan Loading dan Mobile-Friendly:</strong> Sebagian besar pencarian lokal dilakukan melalui smartphone. Website yang cepat dan responsif menjadi penentu utama ranking.</li>
</ol>

<h2>Solusi Cepat Bersama Tim SenaWeb</h2>
<p>Tim pengembang di SenaWeb menerapkan standar SEO teknis tingkat tinggi, mulai dari kompresi gambar otomatis, sitemap dinamis, hingga meta tags optimal di setiap kota.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&auto=format&fit=crop&q=80',
        status: 'published',
        category_id: 3,
        author_id: 1,
        focus_keyword: 'SEO lokal',
        seo_title: 'Panduan Lengkap SEO Lokal untuk Merajai Mesin Pencari Google',
        seo_description: 'Strategi praktis SEO lokal untuk membantu website bisnis Anda menduduki halaman 1 Google di kota Anda secara berkelanjutan.',
        seo_score: 92,
        reading_time: 5,
        views: 489,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        title: 'Tren Desain Website Modern: Mengapa Konsep Neumorphism Begitu Memikat?',
        slug: 'tren-desain-website-modern-neumorphism',
        excerpt: 'Bedah estetika UI Neumorphism: perpaduan bayangan lembut, kedalaman visual taktis, dan kenyamanan mata pengguna.',
        content: `<h2>Kelahiran Kembali Kedalaman Visual (Soft UI)</h2>
<p>Setelah bertahun-tahun didominasi oleh flat design yang serba datar, dunia desain antarmuka digital menyambut tren <strong>Neumorphism (Soft UI)</strong>. Gaya ini menggabungkan kesederhanaan minimalis dengan efek bayangan ganda (highlight & shadow) yang membuat elemen tampak timbul halus dari latar belakang.</p>

<h3>Keunggulan Neumorphism untuk Website Bisnis</h3>
<ul>
  <li><strong>Estetika Mewah dan Bersih:</strong> Memberikan impresi futuristik namun tetap elegan dan ramah pengguna.</li>
  <li><strong>Taktilitas Tinggi:</strong> Tombol dan kartu interaktif terasa nyata saat disentuh atau di-klik.</li>
  <li><strong>Kenyamanan Visual:</strong> Palet warna lembut yang tidak melelahkan mata pengguna saat berselancar lama di website.</li>
</ul>

<p>Di <em>SenaWeb</em>, kami memadukan prinsip Neumorphism modern dengan aksesibilitas dan performa loading super cepat.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        status: 'published',
        category_id: 1,
        author_id: 1,
        focus_keyword: 'desain website modern',
        seo_title: 'Tren Desain Website Modern Neumorphism untuk Pengalaman Terbaik',
        seo_description: 'Eksplorasi konsep desain UI Neumorphism yang modern, elegan, dan membuat website bisnis Anda tampil beda dan memikat klien.',
        seo_score: 94,
        reading_time: 3,
        views: 278,
        published_at: now,
        created_at: now,
        updated_at: now,
      },
    ],
    article_tags: [
      { id: 1, article_id: 1, tag_id: 3 },
      { id: 2, article_id: 1, tag_id: 4 },
      { id: 3, article_id: 2, tag_id: 2 },
      { id: 4, article_id: 2, tag_id: 1 },
      { id: 5, article_id: 3, tag_id: 5 },
      { id: 6, article_id: 3, tag_id: 1 },
    ],
    pages: [
      {
        id: 1,
        title: 'Tentang Kami',
        slug: 'tentang-kami',
        content: `<h2>Mengenal Lebih Dekat SenaWeb</h2>
<p>SenaWeb adalah agensi digital penyedia jasa pembuatan website profesional, cepat, dan ramah SEO di Indonesia. Kami berfokus membantu para pelaku usaha, UMKM, korporasi, hingga instansi pendidikan membangun kehadiran digital yang berkelas dan berdampak nyata bagi pertumbuhan omset.</p>
<h3>Visi Kami</h3>
<p>Menjadi mitra transformasi digital nomor satu bagi pengusaha Indonesia melalui teknologi web mutakhir, desain modern, dan pelayanan purna jual terbaik.</p>`,
        excerpt: 'Profil agensi digital SenaWeb dan komitmen kami memberikan website terbaik.',
        status: 'published',
        seo_title: 'Tentang SenaWeb – Solusi Jasa Pembuatan Website Profesional',
        seo_description: 'Kenali visi, misi, dan tim profesional SenaWeb dalam menghadirkan solusi website berkualitas tinggi untuk bisnis Anda.',
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        title: 'Kebijakan Privasi',
        slug: 'kebijakan-privasi',
        content: `<h2>Kebijakan Privasi SenaWeb</h2>
<p>Kami sangat menghargai privasi setiap klien dan pengunjung website kami. Segala data kontak atau informasi yang Anda kirimkan melalui formulir konsultasi hanya digunakan untuk keperluan komunikasi profesional dan tidak akan pernah disebarluaskan kepada pihak ketiga.</p>`,
        status: 'published',
        seo_title: 'Kebijakan Privasi SenaWeb',
        seo_description: 'Kebijakan privasi resmi SenaWeb terkait perlindungan data pengguna dan klien.',
        created_at: now,
        updated_at: now,
      },
    ],
    portfolio: [
      {
        id: 1,
        title: 'Bintang Logistik Nusantara – Company Profile',
        slug: 'bintang-logistik-nusantara',
        category: 'Company Profile',
        client: 'PT Bintang Logistik Nusantara',
        thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
        url: 'https://demo-logistik.senaweb.id',
        description: 'Pengembangan website korporasi logistik nasional dengan fitur pelacakan armada terintegrasi, kalkulator tarif ekspedisi, dan multi-bahasa.',
        tech_stack: ['Next.js', 'Tailwind CSS', 'PostgreSQL', 'Google Maps API'],
        is_featured: true,
        created_at: now,
      },
      {
        id: 2,
        title: 'Kopi Kenangan Senja – E-Commerce UMKM',
        slug: 'kopi-kenangan-senja',
        category: 'E-Commerce',
        client: 'CV Kenangan Senja Roastery',
        thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
        url: 'https://demo-coffee.senaweb.id',
        description: 'Toko online biji kopi artisanal lokal dengan integrasi checkout otomatis WhatsApp, kalkulator ongkos kirim RajaOngkir, dan payment gateway.',
        tech_stack: ['Next.js', 'Tailwind CSS', 'WhatsApp API', 'SEO On-Page'],
        is_featured: true,
        created_at: now,
      },
      {
        id: 3,
        title: 'SMK Taruna Bangsa – Portal Pendidikan & PPDB',
        slug: 'smk-taruna-bangsa-portal',
        category: 'Sekolah & Institusi',
        client: 'Yayasan Taruna Bangsa',
        thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
        url: 'https://demo-school.senaweb.id',
        description: 'Portal resmi sekolah modern dengan sistem pendaftaran siswa baru (PPDB Online), pengumuman kelulusan, dan galeri kegiatan prestasi siswa.',
        tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PDF Generator'],
        is_featured: true,
        created_at: now,
      },
    ],
    media: [
      {
        id: 1,
        filename: 'senaweb-logo.png',
        original_name: 'senaweb-logo.png',
        mime_type: 'image/png',
        size_bytes: 45200,
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        alt_text: 'Logo Resmi SenaWeb Jasa Pembuatan Website',
        width: 300,
        height: 100,
        created_at: now,
      },
      {
        id: 2,
        filename: 'brand-ambassador.jpg',
        original_name: 'senaweb-ambassador.jpg',
        mime_type: 'image/jpeg',
        size_bytes: 185000,
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Brand Ambassador SenaWeb - Pakar Konsultan Web & Digitalisasi Bisnis',
        width: 600,
        height: 800,
        created_at: now,
      },
    ],
    settings: {
      site_name: 'SenaWeb',
      site_tagline: 'JASA PEMBUATAN WEBSITE',
      site_description: 'Jasa pembuatan website profesional, modern Neumorphic, SEO-friendly, dan responsif untuk UMKM, Company Profile, dan Bisnis Indonesia.',
      site_domain: 'https://senaweb.id',
      site_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      site_favicon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&auto=format&fit=crop&q=80',
      brand_ambassador_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      brand_ambassador_name: 'Clarissa Sena, S.Kom., M.M.',
      brand_ambassador_role: 'Lead Digital Strategist & Brand Ambassador',
      whatsapp_number: '6281234567890',
      whatsapp_default_message: 'Halo SenaWeb, saya tertarik untuk konsultasi pembuatan website bisnis saya.',
      contact_email: 'halo@senaweb.id',
      contact_phone: '+62 812-3456-7890',
      contact_address: 'Gedung Cyber One Lt. 4, Jl. Kemakmuran Digital No. 88, Indonesia',
      instagram_url: 'https://instagram.com/senaweb.id',
      facebook_url: 'https://facebook.com/senaweb.id',
      linkedin_url: 'https://linkedin.com/company/senaweb',
      navigation_menu: JSON.stringify([
        { label: 'Home', url: '/' },
        { label: 'Layanan', url: '/#layanan' },
        { label: 'Paket Harga', url: '/#paket' },
        { label: 'Portfolio', url: '/#portfolio' },
        { label: 'Blog', url: '/blog' },
        { label: 'Tentang Kami', url: '/tentang-kami' },
        { label: 'Kontak', url: '/#kontak' },
      ]),
      city_pages: JSON.stringify([
        { city: 'Sidoarjo', slug: 'sidoarjo' },
        { city: 'Lumajang', slug: 'lumajang' },
        { city: 'Surabaya', slug: 'surabaya' },
        { city: 'Purwokerto', slug: 'purwokerto' },
        { city: 'Solo', slug: 'solo' },
      ]),
    },
    seo_metadata: [
      {
        id: 1,
        page_path: '/',
        meta_title: 'SenaWeb – JASA PEMBUATAN WEBSITE Profesional & Cepat No. 1',
        meta_description: 'Jasa pembuatan website profesional, responsif, dan SEO friendly untuk UMKM, Company Profile, dan Toko Online. Konsultasi gratis sekarang!',
        canonical_url: 'https://senaweb.id',
        og_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
        structured_data: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'SenaWeb – JASA PEMBUATAN WEBSITE',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
          telephone: '+6281234567890',
          email: 'halo@senaweb.id',
          priceRange: 'Rp750.000 - Rp3.200.000',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Gedung Cyber One Lt. 4',
            addressCountry: 'ID',
          },
        }),
        created_at: now,
        updated_at: now,
      },
    ],
    testimonials: [
      {
        id: 1,
        name: 'Hendra Gunawan',
        role: 'Direktur Operasional',
        company: 'PT Bintang Logistik Nusantara',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        content: 'Website company profile dari SenaWeb benar-benar mengubah persepsi klien besar terhadap perusahaan kami. Desainnya sangat mewah, cepat dibuka, dan tim SenaWeb sangat kooperatif!',
        rating: 5,
        is_featured: true,
        created_at: now,
      },
      {
        id: 2,
        name: 'Siti Rahmawati',
        role: 'Owner & Founder',
        company: 'Kenangan Senja Coffee Roastery',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
        content: 'Omset penjualan online naik lebih dari 180% setelah beralih ke website e-commerce buatan SenaWeb. Tombol direct WhatsApp mempermudah customer memesan langsung. Mantap!',
        rating: 5,
        is_featured: true,
        created_at: now,
      },
      {
        id: 3,
        name: 'Drs. Wahyudi Pratama, M.Pd.',
        role: 'Kepala Sekolah',
        company: 'SMK Taruna Bangsa',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        content: 'Sistem PPDB online yang dibuat tim SenaWeb sangat stabil dan memudahkan ribuan calon siswa mendaftar tanpa server down. Dukungan teknisnya luar biasa memuaskan.',
        rating: 5,
        is_featured: true,
        created_at: now,
      },
    ],
    pricing_plans: [
      {
        id: 1,
        name: 'Paket Basic',
        price: 'Rp750.000',
        price_numeric: 750000,
        period: 'Sekali Bayar',
        description: 'Cocok untuk UMKM pemula, landing page promosi, portofolio pribadi, atau bisnis kuliner.',
        features: [
          'Landing Page 1 Halaman Responsif',
          'Domain .my.id / .biz.id Gratis 1 Tahun',
          'Hosting SSD Super Cepat',
          'Integrasi Tombol WhatsApp Direct',
          'SEO Basic Setup Google',
          'Garansi & Panduan Penggunaan',
        ],
        is_popular: false,
        cta_text: 'Pilih Paket Basic',
        created_at: now,
      },
      {
        id: 2,
        name: 'Paket Medium',
        price: 'Rp1.800.000',
        price_numeric: 1800000,
        period: 'Sekali Bayar',
        description: 'Pilihan paling populer untuk Company Profile, klinik, instansi, atau bisnis berkembang.',
        features: [
          'Hingga 5 Halaman Dinamis',
          'Domain .COM / .ID Gratis 1 Tahun',
          'Cloud Hosting Unlimited Bandwidth',
          'Desain Modern Neumorphic Eksklusif',
          'Sistem Blog & Artikel Terintegrasi',
          'SEO On-Page & Schema Markup Lengkap',
          'Email Bisnis Profesional (info@domain.com)',
          'Dukungan Maintenance 3 Bulan',
        ],
        is_popular: true,
        cta_text: 'Pilih Paket Medium',
        created_at: now,
      },
      {
        id: 3,
        name: 'Paket Premium',
        price: 'Rp3.200.000',
        price_numeric: 3200000,
        period: 'Sekali Bayar',
        description: 'Solusi lengkap bisnis korporasi, toko online katalog lengkap, atau website custom sekolah.',
        features: [
          'Hingga 10+ Halaman Kustom',
          'Domain .COM / .CO.ID Gratis 1 Tahun',
          'Dedicated Server Hosting Turbo Speed',
          'Dashboard CMS Admin SenaWeb Mandiri',
          'Fitur E-Commerce / Katalog / Booking',
          'Realtime SEO Analyzer Terpasang',
          'Google Analytics & Traffic Tracker',
          'Garansi Keamanan & Backup Berkala',
          'Dukungan VIP & Maintenance 6 Bulan',
        ],
        is_popular: false,
        cta_text: 'Pilih Paket Premium',
        created_at: now,
      },
    ],
    faqs: [
      {
        id: 1,
        question: 'Berapa lama proses pembuatan website di SenaWeb?',
        answer: 'Untuk paket Basic pengerjaan memakan waktu 2–3 hari kerja. Paket Medium berkisar antara 4–7 hari kerja, sedangkan paket Premium dan Custom membutuhkan waktu 7–14 hari kerja tergantung kompleksitas fitur.',
        category: 'Umum',
        order_index: 1,
        created_at: now,
      },
      {
        id: 2,
        question: 'Apakah saya bisa mengelola konten dan artikel sendiri setelah jadi?',
        answer: 'Tentu saja! Kami menyediakan dashboard admin SenaCMS yang sangat mudah digunakan (user-friendly) bahkan untuk pemula tanpa latar belakang coding. Anda bisa menambah artikel, mengganti harga, menambah portofolio, dan mengedit konten kapan saja.',
        category: 'Fitur',
        order_index: 2,
        created_at: now,
      },
      {
        id: 3,
        question: 'Apakah website sudah termasuk nama domain dan hosting?',
        answer: 'Ya, seluruh paket pembuatan website di SenaWeb sudah termasuk domain resmi (seperti .com, .id, atau .biz.id) dan hosting berkecepatan tinggi selama 1 tahun pertama tanpa biaya tersembunyi.',
        category: 'Biaya',
        order_index: 3,
        created_at: now,
      },
      {
        id: 4,
        question: 'Apakah website yang dibuat dijamin ramah SEO dan mobile-friendly?',
        answer: 'Pasti! Kami menerapkan standar desain responsif untuk semua layar (smartphone, tablet, laptop) serta SEO teknis lengkap dengan sitemap, robots.txt, dan Schema.org JSON-LD agar website Anda cepat terindeks di halaman pertama Google.',
        category: 'SEO',
        order_index: 4,
        created_at: now,
      },
      {
        id: 5,
        question: 'Bagaimana jika website mengalami kendala teknis setelah selesai dibuat?',
        answer: 'Kami memberikan garansi purna jual dan layanan maintenance berkala. Tim support SenaWeb selalu siap sedia membantu Anda via WhatsApp dan konsultasi teknis kapan saja.',
        category: 'Layanan',
        order_index: 5,
        created_at: now,
      },
    ],
    inquiries: [
      {
        id: 1,
        name: 'Budi Santoso',
        email: 'budi@santoso-group.com',
        phone: '081298765432',
        service: 'Company Profile',
        budget: 'Rp1.800.000',
        message: 'Halo SenaWeb, kami ingin merombak website perusahaan logistik kami agar tampil lebih modern.',
        status: 'unread',
        created_at: now,
      },
    ],
    traffic_logs: [
      {
        id: 1,
        path: '/',
        ip_hash: 'anon-101',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        device: 'desktop',
        referrer: 'https://google.com',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 2,
        path: '/blog',
        ip_hash: 'anon-102',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        device: 'mobile',
        referrer: 'Direct',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        path: '/surabaya',
        ip_hash: 'anon-103',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        device: 'desktop',
        referrer: 'https://google.com',
        timestamp: now,
      },
    ],
    cities: getInitialCities(now),
  };
}

export function getInitialCities(now: string = new Date().toISOString()) {
  return [
    {
      id: 1,
      city_name: 'Sidoarjo',
      province_name: 'Jawa Timur',
      slug: 'sidoarjo',
      hero_title: 'Jasa Pembuatan Website Sidoarjo – Profesional & Siap Ranking 1 Google',
      hero_subtitle: 'Bantu pertumbuhan usaha industri, manufaktur, perdagangan, dan UMKM di Sidoarjo dengan website modern yang teroptimasi SEO lokal dan direct WhatsApp.',
      badge_text: 'Pusat Layanan Web Resmi Wilayah Sidoarjo, Jawa Timur',
      local_keywords: ['jasa website sidoarjo', 'bikin web sidoarjo', 'web umkm sidoarjo', 'company profile sidoarjo', 'jasa web waru gempol'],
      faqs: [
        {
          id: 1,
          question: 'Apakah tim SenaWeb melayani konsultasi langsung / online di Sidoarjo?',
          answer: 'Tentu saja! Kami melayani klien di seluruh wilayah Sidoarjo (Waru, Gedangan, Candi, Krian, Porong, Sedati) baik secara online via WhatsApp & Zoom meeting maupun tatap muka langsung sesuai jadwal kesepakatan.'
        },
        {
          id: 2,
          question: 'Berapa lama website bisnis di Sidoarjo bisa tayang di Google?',
          answer: 'Website paket Basic dan Medium rata-rata selesai dalam 3–7 hari kerja. Proses indexing awal Google umumnya memakan waktu 24–48 jam setelah kami mendaftarkan sitemap ke Google Search Console.'
        },
        {
          id: 3,
          question: 'Apakah website cocok untuk pabrik, pergudangan, dan UMKM di Sidoarjo?',
          answer: 'Sangat cocok! Kami merancang fitur katalog produk industri, inquiry quotation, profil legalitas PT/CV, serta integrasi tombol direct WhatsApp untuk sales tim Anda.'
        }
      ],
      meta_title: 'Jasa Pembuatan Website Sidoarjo – Profesional, Murah & Bergaransi',
      meta_description: 'Jasa pembuatan website profesional di Sidoarjo untuk industri, UMKM, dan toko online. Desain responsif Neumorphic, cepat, dan siap menduduki halaman satu Google.',
      status: 'published' as const,
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      city_name: 'Surabaya',
      province_name: 'Jawa Timur',
      slug: 'surabaya',
      hero_title: 'Jasa Pembuatan Website Surabaya – Solusi Digital Terbaik Perusahaan & UMKM',
      hero_subtitle: 'Tingkatkan kredibilitas bisnis Anda di Kota Pahlawan dengan website berkecepatan tinggi, desain Neumorphic eksklusif, dan integrasi WhatsApp.',
      badge_text: 'Pusat Layanan Web Resmi Wilayah Surabaya, Jawa Timur',
      local_keywords: ['jasa website surabaya', 'bikin web surabaya', 'web umkm surabaya', 'jasa pembuatan website surabaya'],
      faqs: [
        {
          id: 1,
          question: 'Apakah melayani pembuatan website untuk korporasi di Surabaya Pusat, Barat, dan Timur?',
          answer: 'Ya! SenaWeb berpengalaman menangani puluhan klien korporasi, distributor, klinik, dan startup di kawasan Surabaya dengan kontrak kerja profesional dan invoice resmi.'
        },
        {
          id: 2,
          question: 'Berapa biaya pembuatan website di Surabaya?',
          answer: 'Paket investasi website di SenaWeb sangat transparan: Basic Rp750.000, Medium Rp1.800.000, dan Premium Rp3.200.000 sudah termasuk gratis domain, hosting, dan SSL.'
        }
      ],
      meta_title: 'Jasa Pembuatan Website Surabaya – No. 1 Agensi Digital',
      meta_description: 'Jasa bikin website profesional di Surabaya dengan standar internasional, loading cepat, dan optimasi SEO Google.',
      status: 'published' as const,
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      city_name: 'Lumajang',
      province_name: 'Jawa Timur',
      slug: 'lumajang',
      hero_title: 'Jasa Pembuatan Website Lumajang – Murah, Profesional & Bergaransi',
      hero_subtitle: 'Kembangkan potensi wisata, perkebunan, kuliner, dan UMKM Lumajang ke pasar digital nasional dengan website cepat dan ramah Google.',
      badge_text: 'Pusat Layanan Web Resmi Wilayah Lumajang, Jawa Timur',
      local_keywords: ['jasa website lumajang', 'bikin web lumajang', 'web umkm lumajang'],
      faqs: [
        {
          id: 1,
          question: 'Bagaimana cara pemesanan website bagi warga Lumajang?',
          answer: 'Pemesanan sangat mudah! Anda cukup menghubungi kami via WhatsApp di 0812-3456-7890. Tim kami akan memandu pemilihan paket, pengumpulan materi konten, hingga website online.'
        },
        {
          id: 2,
          question: 'Apakah ada panduan mengelola website sendiri?',
          answer: 'Pasti! Kami menyediakan tutorial video dan panduan tertulis penggunaan admin dashboard SenaCMS sehingga Anda dapat memperbarui foto produk dan artikel dengan sangat mudah.'
        }
      ],
      meta_title: 'Jasa Pembuatan Website Lumajang – Solusi Go Digital UMKM',
      meta_description: 'Bikin website terjangkau dan berkualitas di Lumajang. Desain elegan, cepat, dan terdaftar di Google.',
      status: 'published' as const,
      created_at: now,
      updated_at: now,
    },
    {
      id: 4,
      city_name: 'Purwokerto',
      province_name: 'Jawa Tengah',
      slug: 'purwokerto',
      hero_title: 'Jasa Pembuatan Website Purwokerto & Banyumas – Terpercaya & SEO Friendly',
      hero_subtitle: 'Hadirkan identitas digital modern bagi pelaku bisnis, kuliner, pendidikan, dan jasa di Purwokerto dengan website elegan dan responsif.',
      badge_text: 'Pusat Layanan Web Resmi Wilayah Purwokerto, Jawa Tengah',
      local_keywords: ['jasa website purwokerto', 'bikin web purwokerto', 'jasa web banyumas'],
      faqs: [
        {
          id: 1,
          question: 'Apakah SenaWeb melayani pembuatan website untuk sekolah dan perguruan tinggi di Purwokerto?',
          answer: 'Ya, kami melayani website portal akademik, PPDB online, profil sekolah/kampus, serta portal alumni dengan keamanan database terjamin.'
        },
        {
          id: 2,
          question: 'Apakah ada garansi maintenance website di Purwokerto?',
          answer: 'Semua paket website SenaWeb dilengkapi garansi pemeliharaan teknis, monitoring server, dan backup berkala.'
        }
      ],
      meta_title: 'Jasa Pembuatan Website Purwokerto – Banyumas Digital Solution',
      meta_description: 'Jasa pembuatan website profesional di Purwokerto & Banyumas. Desain modern, responsive, dan SEO optimal.',
      status: 'published' as const,
      created_at: now,
      updated_at: now,
    },
    {
      id: 5,
      city_name: 'Solo',
      province_name: 'Jawa Tengah',
      slug: 'solo',
      hero_title: 'Jasa Pembuatan Website Solo (Surakarta) – Eksklusif & Siap Go Digital',
      hero_subtitle: 'Wujudkan website elegan untuk batik, kerajinan, kuliner, UMKM, dan korporasi di Solo Raya dengan teknologi modern dan optimasi SEO lokal.',
      badge_text: 'Pusat Layanan Web Resmi Wilayah Solo (Surakarta), Jawa Tengah',
      local_keywords: ['jasa website solo', 'bikin web solo surakarta', 'web umkm solo raya'],
      faqs: [
        {
          id: 1,
          question: 'Apakah bisa integrasi dengan toko online batik & fashion Solo?',
          answer: 'Tentu saja! Kami bisa mengintegrasikan keranjang belanja, direct WhatsApp checkout, penghitungan ongkir otomatis ke seluruh Indonesia, dan katalog galeri high-res.'
        },
        {
          id: 2,
          question: 'Berapa lama proses pengerjaan website di Solo?',
          answer: 'Pengerjaan berkisar antara 3 hingga 7 hari kerja. Anda juga akan mendapatkan pratinjau live sebelum website diluncurkan secara resmi.'
        }
      ],
      meta_title: 'Jasa Pembuatan Website Solo Surakarta – Elegan & Siap Bersaing',
      meta_description: 'Jasa pembuatan website terbaik di Solo Surakarta untuk UMKM, batik, wisata, dan company profile bisnis modern.',
      status: 'published' as const,
      created_at: now,
      updated_at: now,
    },
  ];
}
