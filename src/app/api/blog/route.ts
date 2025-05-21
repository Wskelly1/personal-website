import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const posts = await BlogPost.find().sort({ publishedAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Connect to database
    await dbConnect();

    // Generate slug from title
    const baseSlug = body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists and generate a unique one if needed
    let slug = baseSlug;
    let counter = 1;
    while (await BlogPost.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Add slug to body
    const postData = {
      ...body,
      slug,
    };
    
    // Create new blog post
    const post = await BlogPost.create(postData);
    
    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Error creating blog post:', {
      error,
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return NextResponse.json(
      { error: `Failed to create blog post: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { _id, ...updateData } = body;

    // Generate new slug if title is being updated
    if (updateData.title) {
      const baseSlug = updateData.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Check if slug exists and generate a unique one if needed
      let slug = baseSlug;
      let counter = 1;
      while (await BlogPost.findOne({ slug, _id: { $ne: _id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }
    
    // Connect to database
    await dbConnect();
    
    // Update blog post
    const post = await BlogPost.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
} 