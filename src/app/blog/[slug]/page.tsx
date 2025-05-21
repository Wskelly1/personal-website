import { marked } from 'marked';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getBlogPost(slug: string) {
  await dbConnect();
  const post = await BlogPost.findOne({ slug, isPublished: true });
  return post;
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const htmlContent = marked(post.content);

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      {/* Back to blog link */}
      <Link
        href="/blog"
        className="text-blue-600 hover:text-blue-800 mb-8 inline-block"
      >
        ← Back to Blog
      </Link>

      {/* Post header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600">
          <time dateTime={post.publishedAt.toISOString()}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full mr-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Post excerpt */}
      <div className="text-xl text-gray-600 mb-8 font-serif italic">
        {post.excerpt}
      </div>

      {/* Post content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
} 