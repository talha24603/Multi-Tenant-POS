import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prismaClient'
import { auth }  from '@/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  
  try {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, price, stock, description, category, barcode, imageUrl, tenantId } = body

    // Validate required fields
    if (!name || !price || stock === undefined || !tenantId) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, price, stock, and tenantId are required' 
      }, { status: 400 })
    }

    // Validate data types
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Product name must be a non-empty string' }, { status: 400 })
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: 'Stock must be a non-negative integer' }, { status: 400 })
    }

    // Check if barcode already exists for this tenant
    if (barcode) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          tenantId,
          barcode: barcode.trim()
        }
      })
      
      if (existingProduct) {
        return NextResponse.json({ error: 'A product with this barcode already exists' }, { status: 400 })
      }
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price,
        stock,
        description: description?.trim() || null,
        category: category?.trim() || 'General',
        barcode: barcode?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        tenantId
      }
    })

    return NextResponse.json({ 
      message: 'Product created successfully',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        category: product.category,
        barcode: product.barcode,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const session = await auth()
  try {
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const search = searchParams.get('search') || ''
    const tenantId = searchParams.get('tenantId')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 })
    }

    const skip = (page - 1) * limit

    // Build where clause for search
    const whereClause: any = {
      tenantId: tenantId
    }

    if (search.trim()) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } }
      ]
    }
    console.log("limit", limit);
    

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          tenant: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.product.count({
        where: whereClause
      })
    ])

    // Calculate sales for each product
    const productsWithSales = await Promise.all(
      products.map(async (product) => {
        const salesData = await prisma.saleItem.aggregate({
          where: {
            productId: product.id
          },
          _sum: {
            quantity: true
          }
        })

        const totalSales = salesData._sum.quantity || 0

        // Determine status based on stock
        let status: 'in-stock' | 'low-stock' | 'out-of-stock'
        if (product.stock === 0) {
          status = 'out-of-stock'
        } else if (product.stock <= 10) {
          status = 'low-stock'
        } else {
          status = 'in-stock'
        }

        // Calculate trend based on recent vs older sales
        const recentSales = await prisma.saleItem.aggregate({
          where: {
            productId: product.id,
            sale: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
              }
            }
          },
          _sum: {
            quantity: true
          }
        })

        const olderSales = await prisma.saleItem.aggregate({
          where: {
            productId: product.id,
            sale: {
              createdAt: {
                gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 7-14 days ago
                lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            }
          },
          _sum: {
            quantity: true
          }
        })

        const recentSalesCount = recentSales._sum.quantity || 0
        const olderSalesCount = olderSales._sum.quantity || 0
        const trend: 'up' | 'down' = recentSalesCount >= olderSalesCount ? 'up' : 'down'

        return {
          id: product.id,
          name: product.name,
          category: (product as any).category || 'General',
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl || '/products/default.jpg',
          status,
          sales: totalSales,
          trend,
          description: product.description,
          tenantName: product.tenant.name
        }
      })
    )

    const hasMore = skip + limit < total

    return NextResponse.json({
      products: productsWithSales,
      hasMore,
      total,
      page,
      limit
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 