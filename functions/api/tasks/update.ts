/**
 * Cloudflare Pages Function - Update Tasks in GitHub
 *
 * Updates tasks for a specific client in GitHub repository
 * POST /api/tasks/update
 */

interface Env {
  GITHUB_TOKEN: string;
}

const GITHUB_OWNER = 'Angela0023';
const GITHUB_REPO = 'intelsol-client-portal';
const GITHUB_BRANCH = 'main';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { clientId, tasks } = await context.request.json();

    if (!clientId || !tasks) {
      return new Response(JSON.stringify({ error: 'Missing clientId or tasks' }), {
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

    const tasksPath = `public/tasks/${clientId}.json`;

    // Get current file SHA (if it exists)
    let fileSha: string | undefined;
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${tasksPath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'User-Agent': 'Intelsol-Portal'
        }
      }
    );

    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      fileSha = fileData.sha;
    }

    // Convert tasks to base64
    const tasksContent = JSON.stringify(tasks, null, 2);
    const base64Content = btoa(tasksContent);

    // Commit tasks to GitHub
    const commitResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${tasksPath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${context.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Intelsol-Portal'
        },
        body: JSON.stringify({
          message: `Update tasks for ${clientId}`,
          content: base64Content,
          branch: GITHUB_BRANCH,
          ...(fileSha && { sha: fileSha })
        })
      }
    );

    if (!commitResponse.ok) {
      const errorData = await commitResponse.json();
      throw new Error(`GitHub API error: ${errorData.message || 'Update failed'}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Tasks updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update tasks error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to update tasks',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
