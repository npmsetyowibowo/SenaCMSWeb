import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cityName = body.cityName ? String(body.cityName).trim() : '';
    const provinceName = body.provinceName ? String(body.provinceName).trim() : '';

    if (!cityName) {
      return NextResponse.json({ error: 'Nama kota wajib diisi terlebih dahulu' }, { status: 400 });
    }

    const cityLower = cityName.toLowerCase();
    const provLower = provinceName ? provinceName.toLowerCase() : '';

    // Smart default fallback
    const fallbackKeywords = [
      `jasa pembuatan website ${cityLower}`,
      `jasa website ${cityLower}`,
      `bikin web ${cityLower}`,
      `jasa web developer ${cityLower}`,
      `web umkm ${cityLower}${provLower ? ' ' + provLower : ''}`,
      `jasa seo ${cityLower}`,
      `jasa landing page ${cityLower}`,
      `biaya buat website di ${cityLower}`,
    ].join(', ');

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `Berikan 7-10 frasa keyword SEO lokal berbahasa Indonesia dengan intent komersial tinggi untuk jasa pembuatan website di wilayah Kota: "${cityName}", Provinsi: "${provinceName}".
Format balasan HANYA daftar frasa keyword yang dipisahkan koma, tanpa penomoran baris, tanpa tanda bintang/bullet, tanpa tanda kutip, dan tanpa kalimat pembuka/penutup.
Contoh: jasa website ${cityLower}, jasa pembuatan website ${cityLower}, bikin web profesional di ${cityLower}, jasa web developer ${cityLower}, web umkm ${cityLower}, jasa seo ${cityLower}, jasa landing page ${cityLower}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const text = response.text ? response.text.trim() : '';
        if (text) {
          const cleaned = text
            .replace(/[\n\r]+/g, ', ')
            .replace(/[•\-\*]/g, '')
            .replace(/,\s*,/g, ',')
            .replace(/\s*,\s*/g, ', ')
            .trim();
          return NextResponse.json({ keywords: cleaned });
        }
      } catch (geminiErr) {
        console.error('Gemini API call failed, using smart fallback:', geminiErr);
        return NextResponse.json({ keywords: fallbackKeywords });
      }
    }

    return NextResponse.json({ keywords: fallbackKeywords });
  } catch (error: any) {
    console.error('Error generating keywords:', error);
    return NextResponse.json({ error: error.message || 'Gagal menghasilkan keyword' }, { status: 500 });
  }
}
