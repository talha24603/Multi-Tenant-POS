import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prismaClient'
import { auth } from '@/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  try {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const resolvedParams = await params
    const { id } = resolvedParams
    const product = await prisma.product.findUnique({
      where: { id },
    })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  try {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const resolvedParams = await params
    const { id } = resolvedParams
    const body = await request.json()
    const { name, price, stock, description, category, barcode, imageUrl } = body

    // Validate at least one field to update
    if (!name && !price && stock === undefined && !description && !category && !barcode && !imageUrl) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Validate fields if present
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json({ error: 'Product name must be a non-empty string' }, { status: 400 })
    }
    if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
    }
    if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
      return NextResponse.json({ error: 'Stock must be a non-negative integer' }, { status: 400 })
    }
    // Barcode uniqueness check (if changed)
    if (barcode) {
      const existing = await prisma.product.findFirst({
        where: {
          barcode: barcode.trim(),
          NOT: { id },
        },
      })
      if (existing) {
        return NextResponse.json({ error: 'A product with this barcode already exists' }, { status: 400 })
      }
    }
    // Update product
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(stock !== undefined ? { stock } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
        ...(category !== undefined ? { category: category?.trim() || 'General' } : {}),
        ...(barcode !== undefined ? { barcode: barcode?.trim() || null } : {}),
        ...(imageUrl !== undefined ? { imageUrl: imageUrl?.trim() || null } : {}),
      },
    })
    return NextResponse.json({ message: 'Product updated', product: updated })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  try {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const resolvedParams = await params
    const { id } = resolvedParams
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Delete the product
    await prisma.product.delete({
      where: { id },
    })
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
