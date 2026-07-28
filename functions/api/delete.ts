/**
 * Cloudflare Pages Function - Delete File from GitHub
 *
 * Deletes a file from the GitHub repository
 * DELETE /api/delete
 */

interface Env {
  GITHUB_TOKEN: string;
}

const GITHUB_OWNER = 'Angela0023';
const GITHUB_REPO = 'intelsol-client-portal';
const GITHUB_BRANCH = 'main';

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const { fileName, clientId } = await context.request.json();

    if (!fileName || !clientId) {
      return new Response(JSON.stringify({ error: 'Missing fileName or clientId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!context.env.GITHUB_TOKEN) {
      return new Response(JSON.stringify({ error: 'GitHub token not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filePath = `public/uploads/${clientId}/${fileName}`;

    // Get file SHA (required for deletion)
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'User-Agent': 'Intelsol-Portal'
        }
      }
    );

    if (!getFileResponse.ok) {
      throw new Error('File not found');
    }

    const fileData = await getFileResponse.json();

    // Delete file from GitHub
    const deleteResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Intelsol-Portal'
        },
        body: JSON.stringify({
          message: `Delete: ${fileName} (${clientId})`,
          sha: fileData.sha,
          branch: GITHUB_BRANCH
        })
      }
    );

    if (!deleteResponse.ok) {
      throw new Error('Failed to delete file');
    }

    // Update metadata file
    const metadataPath = `public/uploads/${clientId}/.metadata.json`;
    const getMetadataResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${metadataPath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'User-Agent': 'Intelsol-Portal'
        }
      }
    );

    if (getMetadataResponse.ok) {
      const metadataFile = await getMetadataResponse.json();
      const metadataContent = atob(metadataFile.content);
      let existingMetadata = JSON.parse(metadataContent);

      // Remove deleted file from metadata
      existingMetadata = existingMetadata.filter((item: any) => item.fileName !== fileName);

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
            message: `Update metadata: Delete ${fileName} (${clientId})`,
            content: updatedMetadataContent,
            sha: metadataFile.sha,
            branch: GITHUB_BRANCH
          })
        }
      );
    }

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
