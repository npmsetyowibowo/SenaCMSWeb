import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getMediaList, addMedia } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

function getStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'senaweb-media';

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diset di environment Vercel.');
  }

  return { supabaseUrl, serviceRoleKey, bucket };
}

function sanitizeFileName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 160);
}

export async function GET() {
  try {
    const list = await getMediaList();
    return NextResponse.json(list);
  } catch (err: any) {
    console.error('Media GET error:', err);
    return NextResponse.json({ error: err.message || 'Gagal mengambil media' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const altText = (formData.get('alt_text') as string) || '';

      if (!file) {
        return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
      }

      const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
      ];

      if (!allowedMimes.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipe file '${file.type}' tidak didukung. Harap unggah JPG, PNG, WebP, GIF, atau SVG.` },
          { status: 400 }
        );
      }

      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return NextResponse.json(
          { error: 'Ukuran gambar melebihi batas maksimal 5MB.' },
          { status: 400 }
        );
      }

      const { supabaseUrl, serviceRoleKey, bucket } = getStorageConfig();
      const safeName = sanitizeFileName(file.name) || 'image';
      const objectPath = `media/${Date.now()}_${crypto.randomUUID()}_${safeName}`;

      const uploadResponse = await fetch(
        `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            apikey: serviceRoleKey,
            'Content-Type': file.type || 'application/octet-stream',
            'x-upsert': 'false',
          },
          body: await file.arrayBuffer(),
          cache: 'no-store',
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Supabase Storage upload gagal (${uploadResponse.status}): ${errorText}`);
      }

      const fileUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${objectPath}`;

      const mediaEntry = await addMedia({
        filename: objectPath,
        original_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        url: fileUrl,
        alt_text: altText || file.name.replace(/\.[^/.]+$/, ''),
      });

      return NextResponse.json(mediaEntry, { status: 201 });
    }

    const body = await req.json();
    const { url, alt_text, name } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL gambar wajib diisi' }, { status: 400 });
    }

    const mediaEntry = await addMedia({
      filename: sanitizeFileName(name || 'external-image'),
      original_name: name || 'external-image',
      mime_type: 'image/jpeg',
      size_bytes: 120000,
      url,
      alt_text: alt_text || name || 'Gambar Media',
    });

    return NextResponse.json(mediaEntry, { status: 201 });
  } catch (err: any) {
    console.error('Upload media error:', err);
    return NextResponse.json({ error: err.message || 'Upload media gagal' }, { status: 500 });
  }
}
