/**
 * Cloudflare Pages Function - Update Sequences in GitHub
 *
 * Updates email sequences for a specific client in GitHub repository
 * POST /api/sequences/update
 */

interface Env {
  GITHUB_TOKEN: string;
}

const GITHUB_OWNER = 'Angela0023';
const GITHUB_REPO = 'intelsol-client-portal';
const GITHUB_BRANCH = 'main';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { clientId, sequences } = await context.request.json();

    if (!clientId || !sequences) {
      return new Response(JSON.stringify({ error: 'Missing clientId or sequences' }), {
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

    const sequencesPath = `public/sequences/${clientId}.json`;

    // Get current file to get its SHA
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${sequencesPath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'User-Agent': 'Intelsol-Portal'
        }
      }
    );

    let sha: string | undefined;
    if (getResponse.ok) {
      const currentFile = await getResponse.json();
      sha = currentFile.sha;
    }

    // Update sequences file
    // Properly encode UTF-8 strings to base64 (btoa alone fails with non-ASCII chars)
    let content: string;
    try {
      const jsonString = JSON.stringify(sequences, null, 2);
      // Escape UTF-8 characters for btoa compatibility
      const escapedString = unescape(encodeURIComponent(jsonString));
      content = btoa(escapedString);
    } catch (encodeError) {
      console.error('Base64 encoding error:', encodeError);
      throw new Error('Failed to encode sequences data. Check for invalid characters.');
    }
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${sequencesPath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Intelsol-Portal'
        },
        body: JSON.stringify({
          message: `Update email sequences for ${clientId}`,
          content,
          branch: GITHUB_BRANCH,
          ...(sha && { sha })
        })
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('GitHub API error:', errorData);
      throw new Error(errorData.message || `GitHub API returned ${updateResponse.status}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Sequences updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update sequences error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to update sequences',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
