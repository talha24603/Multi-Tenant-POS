const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.saleItem.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()
  await prisma.tenantUser.deleteMany()
  await prisma.tenant.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@posapp.com',
        name: 'John Admin',
        password: '$2b$10$example.hash.for.admin',
        isVerified: true,
        provider: 'email'
      }
    }),
    prisma.user.create({
      data: {
        email: 'manager@posapp.com',
        name: 'Sarah Manager',
        password: '$2b$10$example.hash.for.manager',
        isVerified: true,
        provider: 'email'
      }
    }),
    prisma.user.create({
      data: {
        email: 'cashier@posapp.com',
        name: 'Mike Cashier',
        password: '$2b$10$example.hash.for.cashier',
        isVerified: true,
        provider: 'email'
      }
    }),
    prisma.user.create({
      data: {
        email: 'owner@restaurant.com',
        name: 'Lisa Restaurant Owner',
        password: '$2b$10$example.hash.for.owner',
        isVerified: true,
        provider: 'email'
      }
    }),
    prisma.user.create({
      data: {
        email: 'superadmin@posapp.com',
        name: 'Super Admin',
        password: '$2b$10$example.hash.for.superadmin',
        isVerified: true,
        isSuperAdmin: true,
        provider: 'email'
      }
    })
  ])

  console.log('👥 Created users:', users.length)

  // Create Tenants
  const tenants = await Promise.all([
    prisma.tenant.create({
      data: {
        name: 'Tech Gadgets Store',
        status: 'ACTIVE',
        stripeCustomerId: 'cus_techstore123',
        address: '123 Tech Street, Silicon Valley, CA',
        phone: '+1-555-0123',
        email: 'contact@techgadgets.com',
        website: 'https://techgadgets.com',
        logo: 'https://example.com/tech-logo.png',
        description: 'Premium electronics and gadgets store'
      }
    }),
    prisma.tenant.create({
      data: {
        name: 'Fresh Grocery Market',
        status: 'ACTIVE',
        stripeCustomerId: 'cus_grocery456',
        address: '456 Market Ave, Downtown, NY',
        phone: '+1-555-0456',
        email: 'info@freshgrocery.com',
        website: 'https://freshgrocery.com',
        logo: 'https://example.com/grocery-logo.png',
        description: 'Fresh organic groceries and local produce'
      }
    }),
    prisma.tenant.create({
      data: {
        name: 'Fashion Boutique',
        status: 'ACTIVE',
        stripeCustomerId: 'cus_fashion789',
        address: '789 Style Blvd, Fashion District, LA',
        phone: '+1-555-0789',
        email: 'hello@fashionboutique.com',
        website: 'https://fashionboutique.com',
        logo: 'https://example.com/fashion-logo.png',
        description: 'Trendy fashion and accessories'
      }
    })
  ])

  console.log('🏢 Created tenants:', tenants.length)

  // Create TenantUser relationships
  const tenantUsers = await Promise.all([
    // Tech Store - Admin as owner, Manager as staff
    prisma.tenantUser.create({
      data: {
        role: 'OWNER',
        userId: users[0].id,
        tenantId: tenants[0].id
      }
    }),
    prisma.tenantUser.create({
      data: {
        role: 'MANAGER',
        userId: users[1].id,
        tenantId: tenants[0].id
      }
    }),
    prisma.tenantUser.create({
      data: {
        role: 'CASHIER',
        userId: users[2].id,
        tenantId: tenants[0].id
      }
    }),
    // Grocery Store - Manager as owner, Cashier as staff
    prisma.tenantUser.create({
      data: {
        role: 'OWNER',
        userId: users[1].id,
        tenantId: tenants[1].id
      }
    }),
    prisma.tenantUser.create({
      data: {
        role: 'CASHIER',
        userId: users[2].id,
        tenantId: tenants[1].id
      }
    }),
    // Fashion Boutique - Owner as owner
    prisma.tenantUser.create({
      data: {
        role: 'OWNER',
        userId: users[3].id,
        tenantId: tenants[2].id
      }
    })
  ])

  console.log('👥 Created tenant users:', tenantUsers.length)

  // Create Products for Tech Store
  const techProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        price: 999.99,
        stock: 25,
        imageUrl: 'https://example.com/iphone15pro.jpg',
        description: 'Latest iPhone with advanced camera system',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'MacBook Air M2',
        price: 1199.99,
        stock: 15,
        imageUrl: 'https://example.com/macbook-air.jpg',
        description: 'Lightweight laptop with M2 chip',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'AirPods Pro',
        price: 249.99,
        stock: 50,
        imageUrl: 'https://example.com/airpods-pro.jpg',
        description: 'Wireless earbuds with noise cancellation',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'iPad Air',
        price: 599.99,
        stock: 30,
        imageUrl: 'https://example.com/ipad-air.jpg',
        description: 'Versatile tablet for work and entertainment',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Apple Watch Series 9',
        price: 399.99,
        stock: 40,
        imageUrl: 'https://example.com/apple-watch.jpg',
        description: 'Smartwatch with health monitoring',
        tenantId: tenants[0].id
      }
    })
  ])

  // Create Products for Grocery Store
  const groceryProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Organic Bananas',
        price: 2.99,
        stock: 200,
        imageUrl: 'https://example.com/bananas.jpg',
        description: 'Fresh organic bananas per bunch',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Whole Milk',
        price: 3.49,
        stock: 100,
        imageUrl: 'https://example.com/milk.jpg',
        description: 'Fresh whole milk 1 gallon',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Organic Eggs',
        price: 4.99,
        stock: 150,
        imageUrl: 'https://example.com/eggs.jpg',
        description: 'Farm fresh organic eggs, 12 count',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Whole Grain Bread',
        price: 2.49,
        stock: 80,
        imageUrl: 'https://example.com/bread.jpg',
        description: 'Fresh baked whole grain bread',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Organic Tomatoes',
        price: 3.99,
        stock: 120,
        imageUrl: 'https://example.com/tomatoes.jpg',
        description: 'Fresh organic tomatoes per pound',
        tenantId: tenants[1].id
      }
    })
  ])

  // Create Products for Fashion Boutique
  const fashionProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Designer Jeans',
        price: 89.99,
        stock: 60,
        imageUrl: 'https://example.com/jeans.jpg',
        description: 'Premium designer jeans',
        tenantId: tenants[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Silk Blouse',
        price: 65.99,
        stock: 45,
        imageUrl: 'https://example.com/blouse.jpg',
        description: 'Elegant silk blouse',
        tenantId: tenants[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Leather Handbag',
        price: 129.99,
        stock: 25,
        imageUrl: 'https://example.com/handbag.jpg',
        description: 'Premium leather handbag',
        tenantId: tenants[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Summer Dress',
        price: 75.99,
        stock: 35,
        imageUrl: 'https://example.com/dress.jpg',
        description: 'Lightweight summer dress',
        tenantId: tenants[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Sneakers',
        price: 95.99,
        stock: 50,
        imageUrl: 'https://example.com/sneakers.jpg',
        description: 'Comfortable casual sneakers',
        tenantId: tenants[2].id
      }
    })
  ])

  console.log('📦 Created products:', techProducts.length + groceryProducts.length + fashionProducts.length)

  // Create Customers
  const customers = await Promise.all([
    // Tech Store Customers
    prisma.customer.create({
      data: {
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        phone: '+1-555-0101',
        tenantId: tenants[0].id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1-555-0102',
        tenantId: tenants[0].id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'David Chen',
        email: 'david.chen@email.com',
        phone: '+1-555-0103',
        tenantId: tenants[0].id
      }
    }),
    // Grocery Store Customers
    prisma.customer.create({
      data: {
        name: 'Emma Wilson',
        email: 'emma.wilson@email.com',
        phone: '+1-555-0201',
        tenantId: tenants[1].id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'James Brown',
        email: 'james.brown@email.com',
        phone: '+1-555-0202',
        tenantId: tenants[1].id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Sophia Davis',
        email: 'sophia.davis@email.com',
        phone: '+1-555-0203',
        tenantId: tenants[1].id
      }
    }),
    // Fashion Boutique Customers
    prisma.customer.create({
      data: {
        name: 'Olivia Taylor',
        email: 'olivia.taylor@email.com',
        phone: '+1-555-0301',
        tenantId: tenants[2].id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Noah Martinez',
        email: 'noah.martinez@email.com',
        phone: '+1-555-0302',
        tenantId: tenants[2].id
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Ava Anderson',
        email: 'ava.anderson@email.com',
        phone: '+1-555-0303',
        tenantId: tenants[2].id
      }
    })
  ])

  console.log('👥 Created customers:', customers.length)

  // Create Sales and SaleItems
  const allProducts = [...techProducts, ...groceryProducts, ...fashionProducts]
  
  // Create some sample sales
  const sales = []
  const saleItems = []

  // Tech Store Sales
  for (let i = 0; i < 8; i++) {
    const sale = await prisma.sale.create({
      data: {
        total: 0, // Will be calculated
        paymentType: i % 2 === 0 ? 'Card' : 'Cash',
        tenantId: tenants[0].id,
        userId: users[i % 3].id, // Rotate between admin, manager, cashier
        customerId: customers[i % 3].id // Rotate between tech store customers
      }
    })
    sales.push(sale)

    // Add 1-3 items to each sale
    const numItems = Math.floor(Math.random() * 3) + 1
    let saleTotal = 0

    for (let j = 0; j < numItems; j++) {
      const product = techProducts[Math.floor(Math.random() * techProducts.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const itemTotal = product.price * quantity
      saleTotal += itemTotal

      const saleItem = await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: product.id,
          quantity: quantity,
          price: product.price
        }
      })
      saleItems.push(saleItem)
    }

    // Update sale total
    await prisma.sale.update({
      where: { id: sale.id },
      data: { total: saleTotal }
    })
  }

  // Grocery Store Sales
  for (let i = 0; i < 12; i++) {
    const sale = await prisma.sale.create({
      data: {
        total: 0, // Will be calculated
        paymentType: i % 3 === 0 ? 'Card' : i % 3 === 1 ? 'Cash' : 'Mobile',
        tenantId: tenants[1].id,
        userId: users[(i % 2) + 1].id, // Manager and cashier
        customerId: customers[(i % 3) + 3].id // Grocery store customers
      }
    })
    sales.push(sale)

    // Add 2-5 items to each sale (grocery has more items typically)
    const numItems = Math.floor(Math.random() * 4) + 2
    let saleTotal = 0

    for (let j = 0; j < numItems; j++) {
      const product = groceryProducts[Math.floor(Math.random() * groceryProducts.length)]
      const quantity = Math.floor(Math.random() * 4) + 1
      const itemTotal = product.price * quantity
      saleTotal += itemTotal

      const saleItem = await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: product.id,
          quantity: quantity,
          price: product.price
        }
      })
      saleItems.push(saleItem)
    }

    // Update sale total
    await prisma.sale.update({
      where: { id: sale.id },
      data: { total: saleTotal }
    })
  }

  // Fashion Boutique Sales
  for (let i = 0; i < 6; i++) {
    const sale = await prisma.sale.create({
      data: {
        total: 0, // Will be calculated
        paymentType: i % 2 === 0 ? 'Card' : 'Cash',
        tenantId: tenants[2].id,
        userId: users[3].id, // Owner
        customerId: customers[(i % 3) + 6].id // Fashion store customers
      }
    })
    sales.push(sale)

    // Add 1-2 items to each sale (fashion items are expensive)
    const numItems = Math.floor(Math.random() * 2) + 1
    let saleTotal = 0

    for (let j = 0; j < numItems; j++) {
      const product = fashionProducts[Math.floor(Math.random() * fashionProducts.length)]
      const quantity = 1 // Usually 1 for fashion items
      const itemTotal = product.price * quantity
      saleTotal += itemTotal

      const saleItem = await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: product.id,
          quantity: quantity,
          price: product.price
        }
      })
      saleItems.push(saleItem)
    }

    // Update sale total
    await prisma.sale.update({
      where: { id: sale.id },
      data: { total: saleTotal }
    })
  }

  console.log('💰 Created sales:', sales.length)
  console.log('📦 Created sale items:', saleItems.length)

  console.log('✅ Database seeding completed successfully!')
  console.log('📊 Summary:')
  console.log(`   👥 Users: ${users.length}`)
  console.log(`   🏢 Tenants: ${tenants.length}`)
  console.log(`   👥 Tenant Users: ${tenantUsers.length}`)
  console.log(`   📦 Products: ${allProducts.length}`)
  console.log(`   👥 Customers: ${customers.length}`)
  console.log(`   💰 Sales: ${sales.length}`)
  console.log(`   📦 Sale Items: ${saleItems.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
