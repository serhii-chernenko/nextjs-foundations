import { fetchPosts } from '@repo/api/blog';
import Link from 'next/link';

export default async function BlogHomePage() {
  const posts = await fetchPosts(10);

  return (
    <main className="flex flex-col gap-8">
      <h1 className="font-bold text-4xl">Blog</h1>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <article className="flex flex-col gap-2 border-b pb-6" key={post.id}>
            <Link className="hover:underline" href={`/${post.slug}`}>
              <h2 className="font-semibold text-2xl">{post.title}</h2>
            </Link>
            <p className="text-gray-500 text-sm">
              {post.category} · {post.readingTime} min read ·{' '}
              {post.publishedAt.toLocaleDateString()}
            </p>
            <p className="text-gray-700">{post.excerpt}</p>
            <Link
              className="text-blue-600 text-sm hover:underline"
              href={`/${post.slug}`}
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
