export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  stock: number
  barcode?: string
  category?: string
  imageUrl?: string
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
}

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  barcode?: string
  category?: string
  imageUrl?: string
}

export interface SaleData {
  items: CartItem[]
  total: number
  paymentType: string
  customerId?: string
  tenantId: string
}

// Product search
export async function searchProducts(query: string, tenantId: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      tenantId
    })

    const response = await fetch(`/api/cashier/products/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.products
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

// Fetch product by exact barcode
export async function getProductByBarcode(barcode: string, tenantId: string): Promise<Product | null> {
  try {
    const params = new URLSearchParams({
      barcode,
      tenantId,
    })

    const response = await fetch(`/api/cashier/products/by-barcode?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.product
  } catch (error) {
    console.error('Error fetching product by barcode:', error)
    throw error
  }
}

// Customer search
export async function searchCustomers(query: string, tenantId: string): Promise<Customer[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      tenantId
    })

    const response = await fetch(`/api/cashier/customers?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.customers
  } catch (error) {
    console.error('Error searching customers:', error)
    throw error
  }
}

// Create customer
export async function createCustomer(customerData: {
  name: string
  email?: string
  phone?: string
  tenantId: string
}): Promise<Customer> {
  try {
    const response = await fetch('/api/cashier/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

// Process sale
export async function processSale(saleData: SaleData): Promise<{ success: boolean; saleId: string; message: string }> {
  try {
    const response = await fetch('/api/cashier/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error processing sale:', error)
    throw error
  }
} 