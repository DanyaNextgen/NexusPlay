import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    return new NextResponse('User-agent: *\nDisallow: /admin\nsitemap: https://nexusplay.uz/sitemap.xml', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    }
    )
}