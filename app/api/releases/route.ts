import { NextRequest } from 'next/server';

const UNITY_API_BASE = 'https://services.api.unity.com/unity/editor/release/v1/releases';
const UNITY_MAX_LIMIT = 25;

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

function getBeijingDate(): string {
  const now = new Date();
  const beijingTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  const y = beijingTime.getFullYear();
  const m = String(beijingTime.getMonth() + 1).padStart(2, '0');
  const d = String(beijingTime.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function fetchFromStaticFile(date: string): Promise<any | null> {
  return null;
}

async function fetchFromUnityAPI(params: URLSearchParams): Promise<any> {
  const requestedLimit = parseInt(params.get('limit') || '25', 10);
  const offset = parseInt(params.get('offset') || '0', 10);

  const allResults: any[] = [];
  let currentOffset = offset;
  let remaining = requestedLimit;

  while (remaining > 0) {
    const fetchLimit = Math.min(remaining, UNITY_MAX_LIMIT);
    const targetUrl = new URL(UNITY_API_BASE);

    params.forEach((value, key) => {
      if (key !== 'limit' && key !== 'offset') {
        targetUrl.searchParams.set(key, value);
      }
    });
    targetUrl.searchParams.set('limit', String(fetchLimit));
    targetUrl.searchParams.set('offset', String(currentOffset));

    const res = await fetch(targetUrl.toString(), {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Unity API error: ${res.status}`);
    }

    const data = await res.json();
    const results = data.results || [];
    allResults.push(...results);

    if (results.length < fetchLimit) break;
    currentOffset += fetchLimit;
    remaining -= results.length;
  }

  return { offset, limit: requestedLimit, total: allResults.length, results: allResults };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const today = getBeijingDate();
  const version = searchParams.get('version');
  const stream = searchParams.get('stream');
  const hasFilters = version || stream;

  if (!hasFilters) {
    const staticData = await fetchFromStaticFile(today);
    if (staticData) {
      return Response.json(staticData);
    }
  }

  try {
    const data = await fetchFromUnityAPI(searchParams);
    return Response.json(data);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to fetch releases' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
