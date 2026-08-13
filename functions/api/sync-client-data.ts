/**
 * Trigger Client Data Sync Workflow (Generic)
 *
 * This API endpoint triggers the GitHub Actions workflow for any client.
 * Accepts clientId as a query parameter or in request body.
 *
 * Usage:
 * POST /api/sync-client-data?clientId=intelsol
 * POST /api/sync-client-data with body: { "clientId": "intelsol" }
 */

interface Env {
  GITHUB_TOKEN: string;
}

const VALID_CLIENTS = [
  'intelsol',
  'tslab',
  'demo',
  'xpose',
  'adsigner',
  'beeit',
  'wulf',
  'peoplefocus',
  'plantryx',
  'all'
];

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

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

  // Get clientId from query parameter or request body
  const url = new URL(request.url);
  let clientId = url.searchParams.get('clientId');

  if (!clientId) {
    try {
      const body = await request.json();
      clientId = body.clientId;
    } catch {
      // Body parsing failed, clientId remains null
    }
  }

  // Validate clientId
  if (!clientId || !VALID_CLIENTS.includes(clientId)) {
    return new Response(
      JSON.stringify({
        error: 'Invalid or missing clientId',
        validClients: VALID_CLIENTS,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Trigger the GitHub Actions workflow
    const owner = 'Angela0023';
    const repo = 'intelsol-client-portal';
    const workflow_id = 'sync-client-data.yml';

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        'User-Agent': 'Intelsol-Client-Portal',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          client_id: clientId,
        },
      }),
    });

    if (response.status === 204) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `${clientId} data sync triggered successfully. Check GitHub Actions for progress.`,
          clientId: clientId,
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
