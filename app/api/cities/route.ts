import { NextRequest, NextResponse } from 'next/server';
import { getCities, createCity } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const cities = await getCities();
    return NextResponse.json(cities);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      city_name,
      province_name,
      slug,
      hero_title,
      hero_subtitle,
      badge_text,
      local_keywords,
      faqs,
      meta_title,
      meta_description,
      status,
    } = body;

    if (!city_name || !province_name) {
      return NextResponse.json({ error: 'Nama kota dan provinsi wajib diisi' }, { status: 400 });
    }

    const cleanSlug = (slug || city_name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCity = await createCity({
      city_name,
      province_name,
      slug: cleanSlug,
      hero_title: hero_title || `Jasa Pembuatan Website ${city_name} – Profesional & Cepat`,
      hero_subtitle: hero_subtitle || `Layanan pembuatan website berkualitas untuk bisnis, UMKM, dan profil usaha di wilayah ${city_name}, ${province_name}.`,
      badge_text: badge_text || `Pusat Layanan Web Resmi Wilayah ${city_name}, ${province_name}`,
      local_keywords: Array.isArray(local_keywords) ? local_keywords : (typeof local_keywords === 'string' ? local_keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : []),
      faqs: Array.isArray(faqs) ? faqs : [],
      meta_title: meta_title || `Jasa Pembuatan Website ${city_name} – SenaWeb`,
      meta_description: meta_description || hero_subtitle,
      status: status === 'draft' ? 'draft' : 'published',
    });

    return NextResponse.json(newCity, { status: 201 });
  } catch (err: any) {
    console.error('Error creating city:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
