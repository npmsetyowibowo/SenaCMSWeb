import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

export async function GET() {
  const settings = await getSettings();
  const domain = settings.site_domain || 'https://senaweb.id';

  const content = `# Robots.txt for SenaWeb
# Generated dynamically from database settings
User-agent: *
Allow: /
Disallow: /senacms/
Disallow: /api/

# Sitemap location
Sitemap: ${domain}/sitemap.xml
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
