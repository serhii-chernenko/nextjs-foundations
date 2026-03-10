import { fetchPostBySlug, fetchPosts } from '@repo/api/blog';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await fetchPosts(10);

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// export const dynamicParams = false;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post || slug === 'test-not-found') {
    notFound();
  }

  return (
    <main className="flex flex-col gap-6">
      <Link className="text-blue-600 text-sm hover:underline" href="/">
        ← Back to posts
      </Link>

      <article className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h1 className="font-bold text-4xl">{post.title}</h1>
          <p className="text-gray-500 text-sm">
            {post.category} · {post.readingTime} min read ·{' '}
            {post.publishedAt.toLocaleDateString()}
          </p>
          <p className="text-gray-500 text-sm">By {post.author.name}</p>
        </header>

        <div className="prose max-w-none">
          {post.content.split('\n\n').map((paragraph, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key for static content
            <p className="mb-4" key={i}>
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="flex flex-wrap gap-2 border-t pt-4">
          {post.tags.map((tag) => (
            <span
              className="rounded bg-gray-100 px-2 py-1 text-gray-600 text-sm"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </footer>
        {/* <div>
          <pre>{JSON.stringify({ slug }, null, 2)}</pre>
        </div> */}
      </article>
    </main>
  );
}
