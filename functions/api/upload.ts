/**
 * Cloudflare Pages Function - File Upload to GitHub
 *
 * Uploads files by committing them to the GitHub repository
 * POST /api/upload
 */

interface Env {
  GITHUB_TOKEN: string;
}

const GITHUB_OWNER = 'Angela0023';
const GITHUB_REPO = 'intelsol-client-portal';
const GITHUB_BRANCH = 'main';

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

    // Check for GitHub token
    if (!context.env.GITHUB_TOKEN) {
      return new Response(JSON.stringify({ error: 'GitHub token not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const safeCustomName = customName.replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `${timestamp}-${safeCustomName}.${fileExtension}`;
    const filePath = `public/uploads/${clientId}/${fileName}`;

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Prepare metadata
    const metadata = {
      originalName: file.name,
      customName: customName,
      fileName: fileName,
      filePath: filePath,
      clientId: clientId,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };

    // Commit file to GitHub
    const commitResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Intelsol-Portal'
        },
        body: JSON.stringify({
          message: `Upload: ${customName} (${clientId})`,
          content: base64Content,
          branch: GITHUB_BRANCH
        })
      }
    );

    if (!commitResponse.ok) {
      const errorData = await commitResponse.json();
      throw new Error(`GitHub API error: ${errorData.message || 'Upload failed'}`);
    }

    // Update metadata file
    const metadataPath = `public/uploads/${clientId}/.metadata.json`;

    // Get current metadata file
    let existingMetadata: any[] = [];
    const getMetadataResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${metadataPath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'User-Agent': 'Intelsol-Portal'
        }
      }
    );

    let metadataFileSha: string | undefined;

    if (getMetadataResponse.ok) {
      const metadataFile = await getMetadataResponse.json();
      metadataFileSha = metadataFile.sha;
      const metadataContent = atob(metadataFile.content);
      existingMetadata = JSON.parse(metadataContent);
    }

    // Add new file metadata
    existingMetadata.push(metadata);

    // Update metadata file
    const updatedMetadataContent = btoa(JSON.stringify(existingMetadata, null, 2));
    await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${metadataPath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Intelsol-Portal'
        },
        body: JSON.stringify({
          message: `Update metadata: ${customName} (${clientId})`,
          content: updatedMetadataContent,
          branch: GITHUB_BRANCH,
          ...(metadataFileSha && { sha: metadataFileSha })
        })
      }
    );

    return new Response(JSON.stringify({
      success: true,
      fileName: fileName,
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
