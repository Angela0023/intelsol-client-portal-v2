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
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw new Error('Failed to fetch sequences');
    }

    const sequencesFile = await response.json();
    const sequencesContent = atob(sequencesFile.content);
    const sequences = JSON.parse(sequencesContent);

    return new Response(JSON.stringify({
      success: true,
      sequences
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get sequences error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get sequences',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
