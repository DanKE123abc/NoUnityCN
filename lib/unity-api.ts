/**
 * 前端/服务端调用切换开关
 * true  = 前端直接调用 Unity API（客户端模式）
 * false = 通过 /api/releases 服务端代理调用（服务端模式）
 */
export const USE_CLIENT_SIDE_FETCH = true;

const UNITY_API_BASE = 'https://services.api.unity.com/unity/editor/release/v1/releases';
const UNITY_MAX_LIMIT = 25;

interface FetchUnityReleasesParams {
  version?: string;
  stream?: string;
  limit?: number;
  offset?: number;
  platform?: string;
  architecture?: string;
  entitlement?: string[];
}

/** 客户端直接调用 Unity API */
async function fetchFromUnityAPI(params: FetchUnityReleasesParams): Promise<any> {
  const { version, stream, limit = 25, offset = 0, platform, architecture, entitlement } = params;

  const allResults: any[] = [];
  let currentOffset = offset;
  let remaining = limit;

  while (remaining > 0) {
    const fetchLimit = Math.min(remaining, UNITY_MAX_LIMIT);
    const targetUrl = new URL(UNITY_API_BASE);

    if (version) targetUrl.searchParams.set('version', version);
    if (stream) targetUrl.searchParams.set('stream', stream);
    if (platform) targetUrl.searchParams.set('platform', platform);
    if (architecture) targetUrl.searchParams.set('architecture', architecture);
    if (entitlement && entitlement.length > 0) {
      entitlement.forEach(e => targetUrl.searchParams.append('entitlement', e));
    }

    targetUrl.searchParams.set('limit', String(fetchLimit));
    targetUrl.searchParams.set('offset', String(currentOffset));

    const res = await fetch(targetUrl.toString(), {
      headers: { 'Accept': 'application/json' },
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

  return { offset, limit, total: allResults.length, results: allResults };
}

/** 通过服务端代理 /api/releases 调用 */
async function fetchViaServerProxy(params: FetchUnityReleasesParams): Promise<any> {
  const { version, stream, limit = 25, offset = 0, platform, architecture, entitlement } = params;

  const allResults: any[] = [];
  let currentOffset = offset;
  let remaining = limit;

  while (remaining > 0) {
    const fetchLimit = Math.min(remaining, UNITY_MAX_LIMIT);
    const url = new URL('/api/releases', window.location.origin);

    if (version) url.searchParams.set('version', version);
    if (stream) url.searchParams.set('stream', stream);
    if (platform) url.searchParams.set('platform', platform);
    if (architecture) url.searchParams.set('architecture', architecture);
    if (entitlement && entitlement.length > 0) {
      entitlement.forEach(e => url.searchParams.append('entitlement', e));
    }

    url.searchParams.set('limit', String(fetchLimit));
    url.searchParams.set('offset', String(currentOffset));

    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`Server proxy error: ${res.status}`);
    }

    const data = await res.json();
    const results = data.results || [];
    allResults.push(...results);

    if (results.length < fetchLimit) break;
    currentOffset += fetchLimit;
    remaining -= results.length;
  }

  return { offset, limit, total: allResults.length, results: allResults };
}

/** 统一入口：根据 USE_CLIENT_SIDE_FETCH 切换调用方式 */
export async function fetchUnityReleases(params: FetchUnityReleasesParams): Promise<any> {
  if (USE_CLIENT_SIDE_FETCH) {
    return fetchFromUnityAPI(params);
  }
  return fetchViaServerProxy(params);
}
