/**
 * Cloudflare Pages Function - Get Sequences from GitHub
 *
 * Gets email sequences for a specific client from GitHub repository
 * GET /api/sequences/get?clientId=plantryx
 */

interface Env {
  GITHUB_TOKEN: string;
}

const GITHUB_OWNER = 'Angela0023';
const GITHUB_REPO = 'intelsol-client-portal-v2';
const GITHUB_BRANCH = 'main';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const clientId = url.searchParams.get('clientId');

    if (!clientId) {
      return new Response(JSON.stringify({ error: 'Missing clientId parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    if (!context.env.GITHUB_TOKEN) {
      return new Response(JSON.stringify({ error: 'GitHub token not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    // Get sequences file from GitHub
    const sequencesPath = `public/sequences/${clientId}.json`;
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${sequencesPath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'User-Agent': 'Intelsol-Portal'
        }
      }
    );

    if (!response.ok) {
      // If sequences file doesn't exist, return empty array
      if (response.status === 404) {
        return new Response(JSON.stringify({
          success: true,
          sequences: []
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
      throw new Error('Failed to fetch sequences');
    }

    const sequencesFile = await response.json();
    // Properly decode base64 to UTF-8 (not Latin-1)
    const decoded = Uint8Array.from(atob(sequencesFile.content), c => c.charCodeAt(0));
    const sequencesContent = new TextDecoder('utf-8').decode(decoded);
    const sequences = JSON.parse(sequencesContent);

    // Get the last commit date for this file
    let lastUpdated: string | null = null;
    let lastUpdatedBy: string | null = null;

    try {
      const commitsResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?path=${sequencesPath}&ref=${GITHUB_BRANCH}&per_page=1`,
        {
          headers: {
            'Authorization': `token ${context.env.GITHUB_TOKEN}`,
            'User-Agent': 'Intelsol-Portal'
          }
        }
      );

      if (commitsResponse.ok) {
        const commits = await commitsResponse.json();
        if (commits && commits.length > 0) {
          lastUpdated = commits[0].commit.committer.date;
        }
      }
    } catch (error) {
      console.error('Failed to fetch commit date:', error);
      // Continue anyway, lastUpdated will be null
    }

    // Try to get metadata file with user info
    try {
      const metadataPath = `public/sequences/${clientId}.metadata.json`;
      const metadataResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${metadataPath}?ref=${GITHUB_BRANCH}`,
        {
          headers: {
            'Authorization': `token ${context.env.GITHUB_TOKEN}`,
            'User-Agent': 'Intelsol-Portal'
          }
        }
      );

      if (metadataResponse.ok) {
        const metadataFile = await metadataResponse.json();
        const decodedMetadata = Uint8Array.from(atob(metadataFile.content), c => c.charCodeAt(0));
        const metadataContent = new TextDecoder('utf-8').decode(decodedMetadata);
        const metadata = JSON.parse(metadataContent);
        lastUpdatedBy = metadata.lastUpdatedBy || null;
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      // Continue anyway, lastUpdatedBy will be null
    }

    return new Response(JSON.stringify({
      success: true,
      sequences,
      lastUpdated,
      lastUpdatedBy
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });

  } catch (error) {
    console.error('Get sequences error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get sequences',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};
