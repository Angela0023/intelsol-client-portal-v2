/**
 * Cloudflare Pages Function - Download File
 *
 * Downloads a file from R2 storage
 * GET /api/download/:filename
 */

interface Env {
  DOCUMENTS_BUCKET: R2Bucket;
  DOCUMENT_METADATA: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    // Get filename from path parameter
    const filename = context.params.filename as string;

    if (!filename) {
      return new Response(JSON.stringify({ error: 'Missing filename' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get file from R2
    const object = await context.env.DOCUMENTS_BUCKET.get(filename);

    if (!object) {
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get metadata to get custom name
    const metadataJson = await context.env.DOCUMENT_METADATA.get(filename);
    let customName = filename.split('/').pop() || filename;

    if (metadataJson) {
      const metadata = JSON.parse(metadataJson);
      const extension = filename.split('.').pop();
      customName = `${metadata.customName}.${extension}`;
    }

    // Return file with proper headers
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Content-Disposition', `attachment; filename="${customName}"`);

    return new Response(object.body, {
      headers,
    });

  } catch (error) {
    console.error('Download error:', error);
    return new Response(JSON.stringify({
      error: 'Download failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
