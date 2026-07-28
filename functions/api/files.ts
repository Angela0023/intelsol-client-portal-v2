/**
 * Cloudflare Pages Function - List Files from GitHub
 *
 * Lists all uploaded files for a specific client
 * GET /api/files?clientId=tslab
 */

interface Env {
  GITHUB_TOKEN: string;
}

const GITHUB_OWNER = 'Angela0023';
const GITHUB_REPO = 'intelsol-client-portal';
const GITHUB_BRANCH = 'main';

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

    if (!context.env.GITHUB_TOKEN) {
      return new Response(JSON.stringify({ error: 'GitHub token not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get metadata file from GitHub
    const metadataPath = `public/uploads/${clientId}/.metadata.json`;
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${metadataPath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'User-Agent': 'Intelsol-Portal'
        }
      }
    );

    if (!response.ok) {
      // If metadata file doesn't exist, return empty list
      if (response.status === 404) {
        return new Response(JSON.stringify({
          success: true,
          files: []
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw new Error('Failed to fetch metadata');
    }

    const metadataFile = await response.json();
    const metadataContent = atob(metadataFile.content);
    const files = JSON.parse(metadataContent);

    // Sort by upload date (newest first)
    files.sort((a: any, b: any) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return new Response(JSON.stringify({
      success: true,
      files
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
