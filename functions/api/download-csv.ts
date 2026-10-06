interface Env {
  R2_BUCKET: R2Bucket;
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const fileName = url.searchParams.get('file');

  // Validate file parameter
  if (!fileName) {
    return new Response('Missing file parameter', { status: 400 });
  }

  // Security: Only allow CSV files from data directory
  if (!fileName.endsWith('.csv') || fileName.includes('..') || fileName.includes('/')) {
    return new Response('Invalid file name', { status: 400 });
  }

  // Check authentication via session cookie
  const cookies = request.headers.get('Cookie') || '';
  const sessionCookie = cookies.split(';').find(c => c.trim().startsWith('intelsol_session='));

  if (!sessionCookie) {
    return new Response('Unauthorized - Please log in', { status: 401 });
  }

  // Extract client ID from filename (e.g., "intelsol-database.csv" -> "intelsol")
  const clientId = fileName.replace('-database.csv', '').replace('-leads.csv', '');

  // Verify user has access to this client's data
  const sessionData = sessionCookie.split('=')[1];
  if (!sessionData || !sessionData.includes(clientId)) {
    // For admin users, allow access to all clients
    if (!sessionData.includes('admin')) {
      return new Response('Forbidden - No access to this client', { status: 403 });
    }
  }

  try {
    // Fetch file from R2
    const object = await env.R2_BUCKET.get(`data/${fileName}`);

    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    // Stream the file to the client
    return new Response(object.body, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour (private = not cached by CDN)
      },
    });
  } catch (error) {
    console.error('Error fetching from R2:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
