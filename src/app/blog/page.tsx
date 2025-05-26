import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import Link from 'next/link';

async function getPublishedPosts() {
  await dbConnect();
  const posts = await BlogPost.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .select('title excerpt slug publishedAt tags');
  return posts;
}

export default async function Blog() {
  const posts = await getPublishedPosts();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No blog posts published yet.
          </div>
        ) : (
          posts.map((post) => (
            <article key={post._id} className="bg-[#e9f1ff] rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-2">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <div className="text-gray-500 mb-4">
                Posted on {new Date(post.publishedAt).toLocaleDateString()}
                {post.tags && post.tags.length > 0 && (
                  <span className="ml-4">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read More →
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
} 