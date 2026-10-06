import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const p = await params;
  const pathString = p.path.join('/');
  
  // Extract base backend URL (e.g. "http://backend:8080") from INTERNAL_API_URL or default to "http://backend:8080"
  const apiUrl = process.env.INTERNAL_API_URL || 'http://backend:8080/api/v1';
  let backendBase = 'http://backend:8080';
  try {
    const url = new URL(apiUrl);
    backendBase = `${url.protocol}//${url.host}`;
  } catch (e) {
    // fallback
  }
  
  const targetUrl = `${backendBase}/uploads/${pathString}`;

  try {
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return new NextResponse('File not found', { status: response.status });
    }

    const headers = new Headers();
    // Copy content-type from the backend
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    
    // Set caching headers for Next.js image optimization and browser caching
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Proxy upload fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
