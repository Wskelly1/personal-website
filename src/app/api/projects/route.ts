import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Convert date strings to Date objects
    const projectData = {
      ...body,
      startDate: new Date(body.startDate),
      ...(body.endDate ? { endDate: new Date(body.endDate) } : {}),
    };
    
    // Connect to database
    await dbConnect();

    // Enforce max 3 featured projects
    if (projectData.featured) {
      const featuredCount = await Project.countDocuments({ featured: true });
      if (featuredCount >= 3) {
        return NextResponse.json({ error: 'You can only have up to 3 featured projects.' }, { status: 400 });
      }
    }
    
    // Create new project
    const project = await Project.create(projectData);
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to add project' },
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
    const { id, ...updateData } = body;
    
    // Convert date strings to Date objects
    const projectData = {
      ...updateData,
      startDate: new Date(updateData.startDate),
      ...(updateData.endDate ? { endDate: new Date(updateData.endDate) } : {}),
    };
    
    // Connect to database
    await dbConnect();

    // Enforce max 3 featured projects
    if (projectData.featured) {
      // Exclude the current project from the count if it's already featured
      const featuredCount = await Project.countDocuments({ featured: true, _id: { $ne: id } });
      if (featuredCount >= 3) {
        return NextResponse.json({ error: 'You can only have up to 3 featured projects.' }, { status: 400 });
      }
    }
    
    // Update project
    const project = await Project.findByIdAndUpdate(
      id,
      projectData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();
    
    // Delete project
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');

    await dbConnect();
    
    const query = featured === 'true' ? { featured: true } : {};
    const projects = await Project.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
} 