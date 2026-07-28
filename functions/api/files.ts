/**
 * Cloudflare Pages Function - List Files
 *
 * Lists all files for a specific client from R2 storage
 * GET /api/files?clientId=tslab
 */

interface Env {
  DOCUMENTS_BUCKET: R2Bucket;
  DOCUMENT_METADATA: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const clientId = url.searchParams.get('clientId');

    if (!clientId) {
      return new Response(JSON.stringify({ error: 'Missing clientId parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // List all files for this client from R2
    const listed = await context.env.DOCUMENTS_BUCKET.list({
      prefix: `${clientId}/`,
    });

    // Get metadata for each file
    const files = await Promise.all(
      listed.objects.map(async (obj) => {
        const metadataJson = await context.env.DOCUMENT_METADATA.get(obj.key);
        if (metadataJson) {
          return JSON.parse(metadataJson);
        }
        // Fallback if no metadata
        return {
          fileName: obj.key,
          customName: obj.key.split('/').pop(),
          size: obj.size,
          uploadedAt: obj.uploaded.toISOString(),
        };
      })
    );

    return new Response(JSON.stringify({
      success: true,
      files: files.sort((a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('List files error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to list files',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
