import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prismaClient'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  
  try {
    console.log('Stats API called with session:', session?.user?.email)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    console.log('Tenant ID from request:', tenantId)

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 })
    }

    // Get total products count
    const totalProducts = await prisma.product.count({
      where: { tenantId }
    })

    // Get low stock products (stock <= 10 but > 0)
    const lowStockCount = await prisma.product.count({
      where: {
        tenantId,
        stock: {
          lte: 10,
          gt: 0
        }
      }
    })

    // Get out of stock products (stock = 0)
    const outOfStockCount = await prisma.product.count({
      where: {
        tenantId,
        stock: 0
      }
    })

    // Get unique categories count
    let categoriesCount = 0
    try {
      // Use raw query since category field might not be in Prisma types yet
      const categoriesResult = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT category) as count 
        FROM "Product" 
        WHERE "tenantId" = ${tenantId}
      `
      // Convert BigInt to number to avoid serialization issues
      const rawCount = (categoriesResult as any)[0]?.count
      categoriesCount = typeof rawCount === 'bigint' ? Number(rawCount) : (rawCount || 0)
    } catch (error) {
      console.log('Error getting categories count:', error)
      // Fallback to 0 if the query fails
      categoriesCount = 0
    }

    // Calculate percentage change from last month (placeholder for now)
    const lastMonthProducts = await prisma.product.count({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    })

    const percentageChange = totalProducts > 0 
      ? ((lastMonthProducts / totalProducts) * 100).toFixed(1)
      : '0.0'

    return NextResponse.json({
      totalProducts: Number(totalProducts),
      lowStockCount: Number(lowStockCount),
      outOfStockCount: Number(outOfStockCount),
      categoriesCount: Number(categoriesCount),
      percentageChange: `+${percentageChange}% from last month`
    })

  } catch (error) {
    console.error('Error fetching product stats:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
} 