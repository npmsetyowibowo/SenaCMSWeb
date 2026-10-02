import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getMediaList, addMedia } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDirectory() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    const list = await getMediaList();
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const contentType = req.headers.get('content-type') || '';

    // Check if multipart form data (file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const altText = (formData.get('alt_text') as string) || '';

      if (!file) {
        return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
      }

      // MIME Validation
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!allowedMimes.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipe file '${file.type}' tidak didukung. Harap unggah gambar JPG, PNG, WebP, atau SVG.` },
          { status: 400 }
        );
      }

      // Max size validation (5MB)
      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return NextResponse.json(
          { error: 'Ukuran gambar melebihi batas maksimal 5MB.' },
          { status: 400 }
        );
      }

      ensureUploadDirectory();
      const buffer = Buffer.from(await file.arrayBuffer());
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${Date.now()}_${sanitizedName}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFileName);

      fs.writeFileSync(filePath, buffer);
      const fileUrl = `/uploads/${uniqueFileName}`;

      const mediaEntry = await addMedia({
        filename: uniqueFileName,
        original_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        url: fileUrl,
        alt_text: altText || file.name.replace(/\.[^/.]+$/, ''),
      });

      return NextResponse.json(mediaEntry, { status: 201 });
    }

    // Direct JSON URL upload
    const body = await req.json();
    const { url, alt_text, name } = body;
    if (!url) {
      return NextResponse.json({ error: 'URL gambar wajib diisi' }, { status: 400 });
    }

    const mediaEntry = await addMedia({
      filename: (name || 'external-image').replace(/[^a-zA-Z0-9.-]/g, '_'),
      original_name: name || 'external-image',
      mime_type: 'image/jpeg',
      size_bytes: 120000,
      url,
      alt_text: alt_text || name || 'Gambar Media',
    });

    return NextResponse.json(mediaEntry, { status: 201 });
  } catch (err: any) {
    console.error('Upload media error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
