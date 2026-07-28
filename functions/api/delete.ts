/**
 * Cloudflare Pages Function - Delete File
 *
 * Deletes a file from R2 storage
 * DELETE /api/delete
 */

interface Env {
  DOCUMENTS_BUCKET: R2Bucket;
  DOCUMENT_METADATA: KVNamespace;
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const { fileName } = await context.request.json();

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'Missing fileName' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete from R2
    await context.env.DOCUMENTS_BUCKET.delete(fileName);

    // Delete metadata from KV
    await context.env.DOCUMENT_METADATA.delete(fileName);

    return new Response(JSON.stringify({
      success: true,
      message: 'File deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({
      error: 'Delete failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
