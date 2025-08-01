import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prismaClient';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
      const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    if (session.user.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const website = formData.get('website') as string;
    const description = formData.get('description') as string;
    const logoFile = formData.get('logo') as File | null;

    // Validate required fields
    if (!name || !type || !address || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the user with their tenant relationships
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        tenants: {
          include: {
            tenant: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has an existing tenant
    console.log('User tenants:', user.tenants);
    const existingTenantUser =  user.tenants.find(tu => tu.role === 'OWNER');
    console.log('Existing tenant user:', existingTenantUser);
    if (!existingTenantUser) {
      return NextResponse.json(
        { error: 'No tenant found. Please create a tenant first.' },
        { status: 404 }
      );
    }

    // Update existing tenant
    const tenant = await prisma.tenant.update({
      where: { id: existingTenantUser.tenant.id },
      data: {
        name,
        type,
        address,
        phone,
        email,
        website: website || null,
        description: description || null,
        
      }
    });

    // Handle logo upload if provided
    if (logoFile) {
      try {
        // Convert File to buffer for Cloudinary
        const bytes = await logoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'tenant-logos',
              public_id: `tenant-${tenant.id}`,
              overwrite: true,
              resource_type: 'auto'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });

        // Update tenant with Cloudinary URL
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: { logo: (result as any).secure_url }
        });
      } catch (error) {
        console.error('Logo upload failed:', error);
        // Don't fail the entire request if logo upload fails
      }
    }

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        status: tenant.status
      }
    });

  } catch (error) {
    console.error('Tenant setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 