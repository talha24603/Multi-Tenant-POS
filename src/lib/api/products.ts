export interface Product {
  id: string
  name: string
  category: string
  barcode?: string
  price: number
  stock: number
  imageUrl: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  sales: number
  trend: 'up' | 'down'
  description?: string
  tenantName?: string
}

export interface ProductsResponse {
  products: Product[]
  hasMore: boolean
  total: number
  page: number
  limit: number
}

export interface ProductStats {
  totalProducts: number
  lowStockCount: number
  outOfStockCount: number
  categoriesCount: number
  percentageChange: string
}

export async function fetchProducts(page: number, limit: number = 5, searchQuery: string = "", tenantId?: string): Promise<ProductsResponse> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: searchQuery
    })
    console.log("tenantId", tenantId)
    if (tenantId) {
      params.append('tenantId', tenantId)
    }

    const response = await fetch(`/api/admin/products?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching products from API:', error)
    throw error // Re-throw the error instead of falling back to mock data
  }
}

export async function fetchProductStats(tenantId?: string): Promise<ProductStats> {
  try {
    if (!tenantId) {
      throw new Error('Tenant ID is required')
    }

    const params = new URLSearchParams({
      tenantId: tenantId
    })

    const response = await fetch(`/api/admin/products/stats?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching product stats from API:', error)
    throw error
  }
}

export async function fetchProductById(id: string): Promise<Product> {
  try {
    const response = await fetch(`/api/admin/products/${id}`)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    throw error
  }
}

export interface UpdateProductData {
  name?: string
  price?: number
  stock?: number
  description?: string
  category?: string
  barcode?: string
  imageUrl?: string
}

export async function updateProduct(id: string, data: UpdateProductData): Promise<any> {
  try {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export interface CreateProductData {
  name: string
  price: number
  stock: number
  description?: string
  category?: string
  barcode?: string
  imageUrl?: string
  tenantId: string
}

export async function createProduct(productData: CreateProductData): Promise<any> {
  try {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<any> {
  try {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
} 