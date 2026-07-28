/**
 * Cloudflare Pages Function - File Upload
 *
 * Handles file uploads to R2 storage
 * POST /api/upload
 */

interface Env {
  DOCUMENTS_BUCKET: R2Bucket;
  DOCUMENT_METADATA: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const formData = await context.request.formData();
    const file = formData.get('file') as File;
    const customName = formData.get('name') as string;
    const clientId = formData.get('clientId') as string;

    if (!file || !customName || !clientId) {
      return new Response(JSON.stringify({ error: 'Missing file, name, or clientId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${clientId}/${timestamp}-${customName.replace(/[^a-zA-Z0-9-_]/g, '_')}.${fileExtension}`;

    // Upload to R2
    await context.env.DOCUMENTS_BUCKET.put(uniqueFileName, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Store metadata in KV
    const metadata = {
      originalName: file.name,
      customName: customName,
      fileName: uniqueFileName,
      clientId: clientId,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };

    await context.env.DOCUMENT_METADATA.put(uniqueFileName, JSON.stringify(metadata));

    return new Response(JSON.stringify({
      success: true,
      fileName: uniqueFileName,
      metadata
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
