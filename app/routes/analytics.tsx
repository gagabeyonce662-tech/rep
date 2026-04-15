import {useLoaderData} from 'react-router';
import type {Route} from './+types/analytics';

export const meta: Route.MetaFunction = () => [
  {title: 'Analytics — Rep'},
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventCount {
  event: string;
  count: number;
}

interface TopPage {
  path: string;
  views: number;
}

interface DashboardData {
  totalPageViews: number;
  totalEvents: number;
  topPages: TopPage[];
  eventBreakdown: EventCount[];
  last7Days: {date: string; views: number}[];
  error?: string;
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({context}: Route.LoaderArgs) {
  const apiKey = (context.env as Record<string, string>).POSTHOG_PERSONAL_API_KEY;
  const projectId = (context.env as Record<string, string>).POSTHOG_PROJECT_ID;
  const host =
    (context.env as Record<string, string>).PUBLIC_POSTHOG_HOST ??
    'https://us.i.posthog.com';

  if (!apiKey || !projectId) {
    return {
      totalPageViews: 0,
      totalEvents: 0,
      topPages: [],
      eventBreakdown: [],
      last7Days: [],
      error: 'POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID are not set in .env',
    } satisfies DashboardData;
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  async function hogql(query: string) {
    const res = await fetch(`${host}/api/projects/${projectId}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({query: {kind: 'HogQLQuery', query}}),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {results?: unknown[][]};
    return json.results ?? [];
  }

  const [pageViewRows, eventRows, topPageRows, dailyRows] = await Promise.all([
    hogql(
      `SELECT count() as c FROM events WHERE event = '$pageview' AND timestamp >= '${since}'`,
    ),
    hogql(
      `SELECT event, count() as c FROM events WHERE timestamp >= '${since}' AND event NOT LIKE '$%' GROUP BY event ORDER BY c DESC LIMIT 10`,
    ),
    hogql(
      `SELECT properties.$pathname, count() as c FROM events WHERE event = '$pageview' AND timestamp >= '${since}' GROUP BY properties.$pathname ORDER BY c DESC LIMIT 8`,
    ),
    hogql(
      `SELECT toDate(timestamp) as day, count() as c FROM events WHERE event = '$pageview' AND timestamp >= '${since}' GROUP BY day ORDER BY day`,
    ),
  ]);

  return {
    totalPageViews: Number((pageViewRows[0] as number[] | undefined)?.[0] ?? 0),
    totalEvents: (eventRows as number[][]).reduce((s, r) => s + Number(r[1] ?? 0), 0),
    topPages: (topPageRows as [string, number][]).map(([path, views]) => ({
      path,
      views: Number(views),
    })),
    eventBreakdown: (eventRows as [string, number][]).map(([event, count]) => ({
      event,
      count: Number(count),
    })),
    last7Days: (dailyRows as [string, number][]).map(([date, views]) => ({
      date,
      views: Number(views),
    })),
  } satisfies DashboardData;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const data = useLoaderData<typeof loader>();

  if (data.error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 font-assistant">
        <p className="font-serif italic text-2xl font-light text-brand-black mb-4">
          Analytics not configured
        </p>
        <p className="text-brand-muted text-sm leading-relaxed">{data.error}</p>
        <SetupInstructions />
      </div>
    );
  }

  const maxViews = Math.max(...data.last7Days.map((d) => d.views), 1);

  return (
    <div className="min-h-screen bg-brand-bg font-assistant text-brand-black">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">

        <div className="mb-16">
          <p className="font-serif italic text-sm text-brand-muted mb-3">Overview</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-[-0.03em] leading-[0.95]">
            Analytics
          </h1>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-line mb-16">
          <Stat label="Page views (7d)" value={data.totalPageViews.toLocaleString()} />
          <Stat label="Named events (7d)" value={data.totalEvents.toLocaleString()} />
          <Stat
            label="Top page"
            value={data.topPages[0]?.path ?? '—'}
            small
          />
          <Stat
            label="Top event"
            value={data.eventBreakdown[0]?.event ?? '—'}
            small
          />
        </div>

        {/* Sparkline chart */}
        <div className="border border-brand-line p-8 mb-8">
          <p className="font-serif italic text-sm text-brand-muted mb-6">
            Page views — last 7 days
          </p>
          <div className="flex items-end gap-2 h-32">
            {data.last7Days.map((d) => (
              <div key={d.date} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full bg-brand-black transition-all duration-700"
                  style={{height: `${Math.round((d.views / maxViews) * 100)}%`, minHeight: '2px'}}
                />
                <span className="text-[10px] text-brand-muted rotate-45 origin-left whitespace-nowrap">
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
            {data.last7Days.length === 0 && (
              <p className="text-brand-muted text-sm italic">No data yet</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top pages */}
          <div className="border border-brand-line p-8">
            <p className="font-serif italic text-sm text-brand-muted mb-6">Top pages</p>
            <div className="flex flex-col gap-4">
              {data.topPages.length === 0 && (
                <p className="text-brand-muted text-sm italic">No data yet</p>
              )}
              {data.topPages.map((page) => (
                <div key={page.path} className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-brand-black truncate font-light">
                    {page.path}
                  </span>
                  <span className="text-sm text-brand-muted shrink-0 tabular-nums">
                    {page.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Event breakdown */}
          <div className="border border-brand-line p-8">
            <p className="font-serif italic text-sm text-brand-muted mb-6">
              Events
            </p>
            <div className="flex flex-col gap-4">
              {data.eventBreakdown.length === 0 && (
                <p className="text-brand-muted text-sm italic">No data yet</p>
              )}
              {data.eventBreakdown.map((ev) => {
                const pct = Math.round((ev.count / (data.totalEvents || 1)) * 100);
                return (
                  <div key={ev.event} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-black font-light">{ev.event}</span>
                      <span className="text-brand-muted tabular-nums">{ev.count.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-brand-line w-full">
                      <div
                        className="h-px bg-brand-black transition-all duration-700"
                        style={{width: `${pct}%`}}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="bg-brand-bg px-6 py-8 flex flex-col gap-2">
      <p className="font-serif italic text-xs text-brand-muted">{label}</p>
      <p
        className={`font-serif font-light tracking-[-0.02em] text-brand-black truncate ${
          small ? 'text-lg' : 'text-4xl'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SetupInstructions() {
  return (
    <div className="mt-12 border border-brand-line p-8 font-assistant text-sm text-brand-muted leading-relaxed space-y-3">
      <p className="font-serif italic text-base text-brand-black">Setup (2 minutes)</p>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          Create a free account at{' '}
          <span className="text-brand-black">posthog.com</span>
        </li>
        <li>Copy your Project API key from Project Settings → Project API key</li>
        <li>Copy your Personal API key from Account Settings → Personal API keys</li>
        <li>Copy your Project ID from the URL: posthog.com/project/<strong>12345</strong>/…</li>
        <li>
          Add to your <span className="font-mono text-xs">.env</span>:
          <pre className="mt-2 bg-brand-gray p-4 text-xs text-brand-black overflow-auto">{`PUBLIC_POSTHOG_KEY=phc_xxxx
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PERSONAL_API_KEY=phx_xxxx
POSTHOG_PROJECT_ID=12345`}</pre>
        </li>
        <li>Restart the dev server</li>
      </ol>
    </div>
  );
}
