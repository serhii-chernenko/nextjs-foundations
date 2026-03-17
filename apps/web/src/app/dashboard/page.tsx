import { fetchPosts, fetchStats, fetchUser } from '@/app/data-demo/data';

export async function fetchDashboardData() {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchStats(),
  ]);

  // Extract successful results, provide fallbacks for failures
  const user =
    results[0].status === 'fulfilled'
      ? results[0].value
      : { name: 'Guest', email: '' };

  const posts = results[1].status === 'fulfilled' ? results[1].value : [];

  const stats =
    results[2].status === 'fulfilled'
      ? results[2].value
      : { views: 0, likes: 0 };

  // Log failures for monitoring (add biome-ignore if using console.log)
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      // biome-ignore lint/suspicious/noConsole: monitoring
      console.error(`Fetch ${index} failed:`, result.reason);
    }
  });

  return { user, posts, stats };
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="font-bold text-2xl">Dashboard</h1>
    </div>
  );
}
