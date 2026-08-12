/**
 * Trigger Intelsol Data Sync Workflow
 *
 * This API endpoint triggers the GitHub Actions workflow that:
 * 1. Fetches all leads from SmartLead for Intelsol campaigns
 * 2. Updates public/data/intelsol-database.csv
 * 3. Fetches campaign analytics and updates public/campaigns/intelsol.json
 * 4. Commits changes to GitHub
 */

interface Env {
  GITHUB_TOKEN: string;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { env } = context;

  // Check if GitHub token is configured
  if (!env.GITHUB_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'GitHub token not configured' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Trigger the GitHub Actions workflow
    const owner = 'Angela0023';  // GitHub username
    const repo = 'intelsol-client-portal';  // Repository name
    const workflow_id = 'sync-intelsol-data.yml';

    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main',  // Branch to run workflow on
      }),
    });

    if (response.status === 204) {
      // 204 No Content means the workflow was successfully triggered
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Intelsol data sync triggered successfully. Check GitHub Actions for progress.',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      const errorData = await response.text();
      console.error('GitHub API error:', response.status, errorData);

      return new Response(
        JSON.stringify({
          error: 'Failed to trigger workflow',
          details: errorData,
          status: response.status,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error triggering workflow:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
