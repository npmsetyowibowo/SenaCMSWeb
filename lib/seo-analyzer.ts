export interface SeoCheckItem {
  id: string;
  category: 'technical' | 'content' | 'keyword' | 'readability' | 'linking' | 'images';
  status: 'good' | 'improvement' | 'problem';
  title: string;
  message: string;
  points: number;
  maxPoints: number;
}

export interface SeoAnalysisResult {
  score: number; // 0 - 100
  rating: 'Good' | 'Needs Improvement' | 'Poor';
  breakdown: {
    technicalSeo: number; // max 20
    contentSeo: number; // max 25
    keywordOptimization: number; // max 20
    readability: number; // max 15
    internalLinking: number; // max 10
    imageSeo: number; // max 10
  };
  metrics: {
    wordCount: number;
    charCount: number;
    readingTimeMinutes: number;
    keywordOccurrences: number;
    keywordDensityPercent: number;
    headingsCount: { h1: number; h2: number; h3: number };
    internalLinksCount: number;
    externalLinksCount: number;
    imagesCount: number;
    imagesWithAltCount: number;
    imagesWithKeywordAltCount: number;
    sentencesCount: number;
    avgWordsPerSentence: number;
  };
  checks: {
    problems: SeoCheckItem[];
    improvements: SeoCheckItem[];
    good: SeoCheckItem[];
  };
}

export function analyzeSeo(input: {
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
  focusKeyword: string;
  content: string; // HTML or Markdown
}): SeoAnalysisResult {
  const { title, slug } = input;
  const seoTitle = (input.seoTitle || title || '').trim();
  const seoDescription = (input.seoDescription || '').trim();
  const keyword = (input.focusKeyword || '').trim().toLowerCase();
  const content = input.content || '';

  // Extract clean text from HTML
  const plainText = content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = plainText ? plainText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = plainText.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Extract links
  const linkMatches = content.match(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  let internalLinksCount = 0;
  let externalLinksCount = 0;

  linkMatches.forEach(tag => {
    const hrefMatch = tag.match(/href=["']([^"']*)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      const href = hrefMatch[1].trim();
      if (href.startsWith('/') || href.startsWith('#') || href.includes('senaweb.id') || href.includes('localhost')) {
        internalLinksCount++;
      } else if (href.startsWith('http')) {
        externalLinksCount++;
      }
    }
  });

  // Extract headings
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h2Matches = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  const h3Matches = content.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];

  // Extract images
  const imgMatches = content.match(/<img\s+[^>]*>/gi) || [];
  const imagesCount = imgMatches.length;
  let imagesWithAltCount = 0;
  let imagesWithKeywordAltCount = 0;

  imgMatches.forEach(tag => {
    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    if (altMatch && altMatch[1] && altMatch[1].trim().length > 0) {
      imagesWithAltCount++;
      if (keyword && altMatch[1].toLowerCase().includes(keyword)) {
        imagesWithKeywordAltCount++;
      }
    }
  });

  // Sentences analysis
  const sentences = plainText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  const sentencesCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = wordCount > 0 ? Math.round((wordCount / sentencesCount) * 10) / 10 : 0;

  // Keyword analysis
  let keywordOccurrences = 0;
  if (keyword.length > 0) {
    const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'gi');
    const matches = plainText.match(regex);
    keywordOccurrences = matches ? matches.length : 0;
  }
  const keywordDensityPercent = wordCount > 0 && keyword
    ? Math.round((keywordOccurrences / wordCount) * 1000) / 10
    : 0;

  // Track checks
  const checks: SeoCheckItem[] = [];

  // 1. Technical SEO (Max 20 pts)
  // Title Length (8 pts)
  const titleLen = seoTitle.length;
  if (titleLen >= 40 && titleLen <= 65) {
    checks.push({
      id: 'tech_title_len',
      category: 'technical',
      status: 'good',
      title: 'Panjang SEO Title Optimal',
      message: `SEO Title memiliki panjang ${titleLen} karakter (ideal: 40-65 karakter).`,
      points: 8,
      maxPoints: 8,
    });
  } else if (titleLen > 65) {
    checks.push({
      id: 'tech_title_len',
      category: 'technical',
      status: 'improvement',
      title: 'SEO Title Terlalu Panjang',
      message: `SEO Title (${titleLen} karakter) berpotensi terpotong di hasil pencarian Google. Disarankan maksimal 65 karakter.`,
      points: 4,
      maxPoints: 8,
    });
  } else if (titleLen > 0) {
    checks.push({
      id: 'tech_title_len',
      category: 'technical',
      status: 'improvement',
      title: 'SEO Title Terlalu Pendek',
      message: `SEO Title (${titleLen} karakter) sebaiknya dioptimalkan hingga minimal 40 karakter.`,
      points: 4,
      maxPoints: 8,
    });
  } else {
    checks.push({
      id: 'tech_title_len',
      category: 'technical',
      status: 'problem',
      title: 'SEO Title Kosong',
      message: 'Belum ada SEO Title yang ditetapkan.',
      points: 0,
      maxPoints: 8,
    });
  }

  // Meta Description Length (8 pts)
  const descLen = seoDescription.length;
  if (descLen >= 120 && descLen <= 160) {
    checks.push({
      id: 'tech_desc_len',
      category: 'technical',
      status: 'good',
      title: 'Panjang Meta Description Sempurna',
      message: `Meta Description memiliki panjang ${descLen} karakter (ideal: 120-160 karakter).`,
      points: 8,
      maxPoints: 8,
    });
  } else if (descLen > 160) {
    checks.push({
      id: 'tech_desc_len',
      category: 'technical',
      status: 'improvement',
      title: 'Meta Description Terlalu Panjang',
      message: `Meta Description memiliki ${descLen} karakter dan kemungkinan terpotong di Google snippet.`,
      points: 4,
      maxPoints: 8,
    });
  } else if (descLen >= 60) {
    checks.push({
      id: 'tech_desc_len',
      category: 'technical',
      status: 'improvement',
      title: 'Meta Description Bisa Lebih Rinci',
      message: `Meta Description memiliki ${descLen} karakter. Sebaiknya ditambah hingga 120-160 karakter.`,
      points: 4,
      maxPoints: 8,
    });
  } else {
    checks.push({
      id: 'tech_desc_len',
      category: 'technical',
      status: 'problem',
      title: 'Meta Description Kurang Optimal atau Kosong',
      message: 'Meta Description sangat penting untuk mendongkrak Click-Through-Rate (CTR) di Google.',
      points: 0,
      maxPoints: 8,
    });
  }

  // Slug Format (4 pts)
  const cleanSlug = slug.toLowerCase().trim();
  const isSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug);
  if (isSlugValid && cleanSlug.length >= 3 && cleanSlug.length <= 75) {
    checks.push({
      id: 'tech_slug_fmt',
      category: 'technical',
      status: 'good',
      title: 'Struktur URL Slug Ramah SEO',
      message: `Slug '${cleanSlug}' menggunakan format kebab-case standar tanpa karakter khusus.`,
      points: 4,
      maxPoints: 4,
    });
  } else {
    checks.push({
      id: 'tech_slug_fmt',
      category: 'technical',
      status: 'problem',
      title: 'Format Slug Perlu Diperbaiki',
      message: 'Gunakan hanya huruf kecil, angka, dan tanda hubung (-) untuk permalink SEO.',
      points: 1,
      maxPoints: 4,
    });
  }

  // 2. Content SEO (Max 25 pts)
  // Word count (15 pts)
  if (wordCount >= 600) {
    checks.push({
      id: 'content_word_count',
      category: 'content',
      status: 'good',
      title: 'Jumlah Kata Sangat Memuaskan',
      message: `Artikel memiliki ${wordCount} kata. Konten mendalam memiliki peluang lebih tinggi untuk ranking.`,
      points: 15,
      maxPoints: 15,
    });
  } else if (wordCount >= 300) {
    checks.push({
      id: 'content_word_count',
      category: 'content',
      status: 'improvement',
      title: 'Jumlah Kata Memenuhi Syarat Minimal',
      message: `Konten memiliki ${wordCount} kata. Disarankan menambahkan lebih banyak studi kasus atau poin penjelas agar mencapai 600+ kata.`,
      points: 9,
      maxPoints: 15,
    });
  } else {
    checks.push({
      id: 'content_word_count',
      category: 'content',
      status: 'problem',
      title: 'Konten Terlalu Singkat (Thin Content)',
      message: `Konten hanya ${wordCount} kata (di bawah standar minimal 300 kata Google). Tambahkan materi pembahasan lebih mendalam.`,
      points: 3,
      maxPoints: 15,
    });
  }

  // Heading Structure (5 pts)
  const totalSubheadings = h2Matches.length + h3Matches.length;
  if (totalSubheadings >= 2) {
    checks.push({
      id: 'content_headings',
      category: 'content',
      status: 'good',
      title: 'Distribusi Subheading (H2 & H3) Bagus',
      message: `Ditemukan ${h2Matches.length} tag H2 dan ${h3Matches.length} tag H3 yang memecah artikel dengan rapi.`,
      points: 5,
      maxPoints: 5,
    });
  } else if (totalSubheadings === 1) {
    checks.push({
      id: 'content_headings',
      category: 'content',
      status: 'improvement',
      title: 'Tambahkan Lebih Banyak Subheading',
      message: 'Baru ada 1 subjudul. Gunakan lebih banyak tag H2 untuk mempermudah pemindaian artikel oleh pembaca.',
      points: 2,
      maxPoints: 5,
    });
  } else {
    checks.push({
      id: 'content_headings',
      category: 'content',
      status: 'problem',
      title: 'Tidak Ada Subheading H2/H3',
      message: 'Teks panjang tanpa subjudul sangat sulit dibaca dan kurang disukai algoritma pencari.',
      points: 0,
      maxPoints: 5,
    });
  }

  // Paragraph length (5 pts)
  const paragraphs = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  const longParagraphs = paragraphs.filter(p => p.replace(/<[^>]+>/g, '').split(/\s+/).length > 80);
  if (paragraphs.length >= 3 && longParagraphs.length === 0) {
    checks.push({
      id: 'content_paragraphs',
      category: 'content',
      status: 'good',
      title: 'Panjang Paragraf Terjaga',
      message: 'Paragraf tidak terlalu padat dan nyaman dibaca di layar smartphone.',
      points: 5,
      maxPoints: 5,
    });
  } else if (longParagraphs.length > 0) {
    checks.push({
      id: 'content_paragraphs',
      category: 'content',
      status: 'improvement',
      title: 'Terdapat Paragraf yang Terlalu Panjang',
      message: `Ada ${longParagraphs.length} paragraf dengan lebih dari 80 kata. Pecah menjadi paragraf yang lebih ringkas.`,
      points: 2,
      maxPoints: 5,
    });
  } else {
    checks.push({
      id: 'content_paragraphs',
      category: 'content',
      status: 'improvement',
      title: 'Variasi Paragraf Terbatas',
      message: 'Bentuk beberapa paragraf pembuka, inti, dan penutup untuk alur baca yang alami.',
      points: 2,
      maxPoints: 5,
    });
  }

  // 3. Keyword Optimization (Max 20 pts)
  if (!keyword) {
    checks.push({
      id: 'kw_none',
      category: 'keyword',
      status: 'problem',
      title: 'Focus Keyword Belum Diisi',
      message: 'Tentukan Focus Keyword utama agar mesin SEO dapat mengukur relevansi konten.',
      points: 0,
      maxPoints: 20,
    });
  } else {
    // In Title (5 pts)
    if (seoTitle.toLowerCase().includes(keyword)) {
      checks.push({
        id: 'kw_in_title',
        category: 'keyword',
        status: 'good',
        title: 'Focus Keyword Ada di SEO Title',
        message: `Kata kunci '${keyword}' ditemukan pada judul halaman.`,
        points: 5,
        maxPoints: 5,
      });
    } else {
      checks.push({
        id: 'kw_in_title',
        category: 'keyword',
        status: 'problem',
        title: 'Focus Keyword Tidak Ada di SEO Title',
        message: `Sisipkan kata kunci '${keyword}' pada SEO Title untuk relevansi maksimal.`,
        points: 0,
        maxPoints: 5,
      });
    }

    // In Meta Description (4 pts)
    if (seoDescription.toLowerCase().includes(keyword)) {
      checks.push({
        id: 'kw_in_desc',
        category: 'keyword',
        status: 'good',
        title: 'Focus Keyword Ada di Meta Description',
        message: `Kata kunci '${keyword}' tercantum dalam deskripsi penelusuran.`,
        points: 4,
        maxPoints: 4,
      });
    } else {
      checks.push({
        id: 'kw_in_desc',
        category: 'keyword',
        status: 'improvement',
        title: 'Focus Keyword Belum Ada di Deskripsi',
        message: `Sertakan kata kunci '${keyword}' pada Meta Description.`,
        points: 1,
        maxPoints: 4,
      });
    }

    // In Slug (3 pts)
    const normalizedKeywordSlug = keyword.replace(/\s+/g, '-');
    if (cleanSlug.includes(normalizedKeywordSlug) || cleanSlug.includes(keyword)) {
      checks.push({
        id: 'kw_in_slug',
        category: 'keyword',
        status: 'good',
        title: 'Focus Keyword Tertera di URL Slug',
        message: `URL mengandung kata kunci sasaran.`,
        points: 3,
        maxPoints: 3,
      });
    } else {
      checks.push({
        id: 'kw_in_slug',
        category: 'keyword',
        status: 'improvement',
        title: 'Focus Keyword Belum Ada di URL Slug',
        message: `Tambahkan '${normalizedKeywordSlug}' ke dalam URL permalink artikel.`,
        points: 1,
        maxPoints: 3,
      });
    }

    // In First Paragraph (4 pts)
    const firstParagraph = (paragraphs[0] || plainText.slice(0, 300)).toLowerCase();
    if (firstParagraph.includes(keyword)) {
      checks.push({
        id: 'kw_in_intro',
        category: 'keyword',
        status: 'good',
        title: 'Keyword Hadir di Paragraf Pembuka',
        message: 'Pengunjung dan Google langsung mengetahui topik utama sejak awal artikel.',
        points: 4,
        maxPoints: 4,
      });
    } else {
      checks.push({
        id: 'kw_in_intro',
        category: 'keyword',
        status: 'problem',
        title: 'Keyword Belum Muncul di Pembukaan',
        message: 'Masukkan Focus Keyword pada 100 kata pertama artikel.',
        points: 0,
        maxPoints: 4,
      });
    }

    // Keyword Density (4 pts)
    if (keywordDensityPercent >= 0.8 && keywordDensityPercent <= 2.5) {
      checks.push({
        id: 'kw_density',
        category: 'keyword',
        status: 'good',
        title: 'Densitas Kata Kunci Ideal',
        message: `Kerapatan kata kunci adalah ${keywordDensityPercent}% (${keywordOccurrences} kali muncul). Sangat alami.`,
        points: 4,
        maxPoints: 4,
      });
    } else if (keywordDensityPercent > 2.5) {
      checks.push({
        id: 'kw_density',
        category: 'keyword',
        status: 'improvement',
        title: 'Peringatan Keyword Stuffing',
        message: `Kerapatan kata kunci ${keywordDensityPercent}% terlalu tinggi. Kurangi pengulangan agar tidak dianggap spam.`,
        points: 1,
        maxPoints: 4,
      });
    } else {
      checks.push({
        id: 'kw_density',
        category: 'keyword',
        status: 'improvement',
        title: 'Densitas Kata Kunci Masih Rendah',
        message: `Kata kunci baru muncul ${keywordOccurrences} kali (${keywordDensityPercent}%). Dianjurkan antara 0.8% - 2.5%.`,
        points: 2,
        maxPoints: 4,
      });
    }
  }

  // 4. Readability (Max 15 pts)
  // Sentence Length (8 pts)
  if (avgWordsPerSentence > 0 && avgWordsPerSentence <= 20) {
    checks.push({
      id: 'read_sentence_len',
      category: 'readability',
      status: 'good',
      title: 'Kalimat Singkat & Mudah Dipahami',
      message: `Rata-rata panjang kalimat adalah ${avgWordsPerSentence} kata (standar ideal: < 20 kata).`,
      points: 8,
      maxPoints: 8,
    });
  } else if (avgWordsPerSentence <= 25) {
    checks.push({
      id: 'read_sentence_len',
      category: 'readability',
      status: 'improvement',
      title: 'Kalimat Agak Terlalu Panjang',
      message: `Rata-rata kata per kalimat adalah ${avgWordsPerSentence}. Pertimbangkan memecah beberapa kalimat majemuk.`,
      points: 4,
      maxPoints: 8,
    });
  } else {
    checks.push({
      id: 'read_sentence_len',
      category: 'readability',
      status: 'problem',
      title: 'Struktur Kalimat Terlalu Rumit',
      message: `Rata-rata ${avgWordsPerSentence} kata per kalimat. Persingkat kalimat agar tidak melelahkan pembaca.`,
      points: 2,
      maxPoints: 8,
    });
  }

  // Indonesian Transition Words (4 pts)
  const indonesianTransitions = [
    'karena', 'oleh karena itu', 'namun', 'selain itu', 'sehingga',
    'bahkan', 'misalnya', 'contohnya', 'dengan demikian', 'walaupun',
    'meskipun', 'kemudian', 'selanjutnya', 'terlebih lagi', 'singkatnya',
  ];
  let transitionCount = 0;
  indonesianTransitions.forEach(tw => {
    if (plainText.toLowerCase().includes(tw)) {
      transitionCount++;
    }
  });

  if (transitionCount >= 3) {
    checks.push({
      id: 'read_transitions',
      category: 'readability',
      status: 'good',
      title: 'Alur Penghubung (Transition Words) Sangat Baik',
      message: `Ditemukan ${transitionCount} variasi kata transisi yang memperhalus alur logika baca.`,
      points: 4,
      maxPoints: 4,
    });
  } else {
    checks.push({
      id: 'read_transitions',
      category: 'readability',
      status: 'improvement',
      title: 'Gunakan Lebih Banyak Kata Transisi',
      message: 'Tambahkan kata penghubung seperti "oleh karena itu", "selain itu", atau "namun" untuk menghubungkan ide antar kalimat.',
      points: 2,
      maxPoints: 4,
    });
  }

  // Subheading distribution (3 pts)
  if (h2Matches.length >= 2) {
    checks.push({
      id: 'read_subheadings',
      category: 'readability',
      status: 'good',
      title: 'Pemisahan Bagian Jelas',
      message: 'Artikel memiliki pembagian bab yang jelas dengan tag Heading.',
      points: 3,
      maxPoints: 3,
    });
  } else {
    checks.push({
      id: 'read_subheadings',
      category: 'readability',
      status: 'improvement',
      title: 'Tambahkan Pembatas Topik',
      message: 'Gunakan Heading 2 untuk memandu alur pembahasan.',
      points: 1,
      maxPoints: 3,
    });
  }

  // 5. Internal & External Linking (Max 10 pts)
  // Internal Links (6 pts)
  if (internalLinksCount >= 1) {
    checks.push({
      id: 'link_internal',
      category: 'linking',
      status: 'good',
      title: 'Tautan Internal (Internal Link) Ditemukan',
      message: `Terdapat ${internalLinksCount} internal link yang mengarahkan pembaca ke halaman lain di website Anda.`,
      points: 6,
      maxPoints: 6,
    });
  } else {
    checks.push({
      id: 'link_internal',
      category: 'linking',
      status: 'problem',
      title: 'Belum Ada Tautan Internal',
      message: 'Tambahkan link ke layanan, portfolio, atau artikel terkait lainnya untuk memperkuat struktur SEO internal.',
      points: 0,
      maxPoints: 6,
    });
  }

  // External Links (4 pts)
  if (externalLinksCount >= 1) {
    checks.push({
      id: 'link_external',
      category: 'linking',
      status: 'good',
      title: 'Tautan Eksternal Otoritatif Ada',
      message: `Terdapat ${externalLinksCount} outbound link sebagai referensi terpercaya.`,
      points: 4,
      maxPoints: 4,
    });
  } else {
    checks.push({
      id: 'link_external',
      category: 'linking',
      status: 'improvement',
      title: 'Tambahkan Referensi Tautan Luar',
      message: 'Memberikan link referensi ke sumber kredibel (misal Wikipedia atau riset) dapat meningkatkan otoritas artikel.',
      points: 1,
      maxPoints: 4,
    });
  }

  // 6. Image SEO (Max 10 pts)
  if (imagesCount === 0) {
    checks.push({
      id: 'img_none',
      category: 'images',
      status: 'improvement',
      title: 'Artikel Belum Memiliki Gambar',
      message: 'Menyisipkan minimal 1 gambar visual dapat meningkatkan engagement dan memperkaya hasil pencarian Google Images.',
      points: 2,
      maxPoints: 10,
    });
  } else {
    // Image presence (4 pts)
    checks.push({
      id: 'img_presence',
      category: 'images',
      status: 'good',
      title: 'Media Visual Disematkan',
      message: `Ditemukan ${imagesCount} gambar dalam konten artikel.`,
      points: 4,
      maxPoints: 4,
    });

    // Alt text coverage (4 pts)
    if (imagesWithAltCount === imagesCount) {
      checks.push({
        id: 'img_alt_all',
        category: 'images',
        status: 'good',
        title: 'Semua Gambar Memiliki Alt Text',
        message: 'Seluruh tag gambar telah dilengkapi deskripsi alternatif untuk aksesibilitas dan SEO.',
        points: 4,
        maxPoints: 4,
      });
    } else {
      checks.push({
        id: 'img_alt_missing',
        category: 'images',
        status: 'problem',
        title: 'Ada Gambar Tanpa Alt Text',
        message: `${imagesCount - imagesWithAltCount} dari ${imagesCount} gambar tidak memiliki atribut alt text.`,
        points: 1,
        maxPoints: 4,
      });
    }

    // Keyword in Alt text (2 pts)
    if (imagesWithKeywordAltCount > 0) {
      checks.push({
        id: 'img_alt_kw',
        category: 'images',
        status: 'good',
        title: 'Focus Keyword Tercantum di Alt Text Gambar',
        message: `Atribut alt pada gambar telah dioptimalkan dengan kata kunci '${keyword}'.`,
        points: 2,
        maxPoints: 2,
      });
    } else if (keyword) {
      checks.push({
        id: 'img_alt_kw',
        category: 'images',
        status: 'improvement',
        title: 'Sertakan Keyword di Alt Text Gambar',
        message: `Sertakan kata kunci '${keyword}' pada salah satu atribut alt gambar Anda.`,
        points: 0,
        maxPoints: 2,
      });
    }
  }

  // Calculate category totals
  let technicalSeo = 0;
  let contentSeo = 0;
  let keywordOptimization = 0;
  let readability = 0;
  let internalLinking = 0;
  let imageSeo = 0;

  checks.forEach(c => {
    if (c.category === 'technical') technicalSeo += c.points;
    if (c.category === 'content') contentSeo += c.points;
    if (c.category === 'keyword') keywordOptimization += c.points;
    if (c.category === 'readability') readability += c.points;
    if (c.category === 'linking') internalLinking += c.points;
    if (c.category === 'images') imageSeo += c.points;
  });

  const totalScore = Math.min(100, Math.round(technicalSeo + contentSeo + keywordOptimization + readability + internalLinking + imageSeo));

  const rating = totalScore >= 80 ? 'Good' : totalScore >= 50 ? 'Needs Improvement' : 'Poor';

  return {
    score: totalScore,
    rating,
    breakdown: {
      technicalSeo: Math.min(20, technicalSeo),
      contentSeo: Math.min(25, contentSeo),
      keywordOptimization: Math.min(20, keywordOptimization),
      readability: Math.min(15, readability),
      internalLinking: Math.min(10, internalLinking),
      imageSeo: Math.min(10, imageSeo),
    },
    metrics: {
      wordCount,
      charCount,
      readingTimeMinutes,
      keywordOccurrences,
      keywordDensityPercent,
      headingsCount: {
        h1: h1Matches.length,
        h2: h2Matches.length,
        h3: h3Matches.length,
      },
      internalLinksCount,
      externalLinksCount,
      imagesCount,
      imagesWithAltCount,
      imagesWithKeywordAltCount,
      sentencesCount,
      avgWordsPerSentence,
    },
    checks: {
      problems: checks.filter(c => c.status === 'problem'),
      improvements: checks.filter(c => c.status === 'improvement'),
      good: checks.filter(c => c.status === 'good'),
    },
  };
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
