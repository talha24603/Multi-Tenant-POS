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
        category: 'Smartphones',
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
        category: 'Laptops',
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
        category: 'Audio',
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
        category: 'Tablets',
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
        category: 'Wearables',
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
        category: 'Fruits',
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
        category: 'Dairy',
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
        category: 'Dairy',
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
        category: 'Bakery',
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
        category: 'Vegetables',
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
        category: 'Bottoms',
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
        category: 'Tops',
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
        category: 'Accessories',
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
        category: 'Dresses',
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
        category: 'Footwear',
        tenantId: tenants[2].id
      }
    })
  ])

  // Create Additional Products for Tech Store (15 more)
  const additionalTechProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24',
        price: 899.99,
        stock: 20,
        imageUrl: 'https://example.com/samsung-galaxy.jpg',
        description: 'Android flagship with advanced AI features',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Dell XPS 13',
        price: 1299.99,
        stock: 12,
        imageUrl: 'https://example.com/dell-xps.jpg',
        description: 'Premium Windows laptop with InfinityEdge display',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Sony WH-1000XM5',
        price: 349.99,
        stock: 35,
        imageUrl: 'https://example.com/sony-headphones.jpg',
        description: 'Premium noise-cancelling headphones',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'iPad Pro 12.9',
        price: 1099.99,
        stock: 18,
        imageUrl: 'https://example.com/ipad-pro.jpg',
        description: 'Professional tablet with M2 chip',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Garmin Fenix 7',
        price: 699.99,
        stock: 15,
        imageUrl: 'https://example.com/garmin-fenix.jpg',
        description: 'Advanced GPS sports watch',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'DJI Mini 3 Pro',
        price: 759.99,
        stock: 8,
        imageUrl: 'https://example.com/dji-drone.jpg',
        description: 'Compact drone with 4K camera',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Nintendo Switch OLED',
        price: 349.99,
        stock: 25,
        imageUrl: 'https://example.com/nintendo-switch.jpg',
        description: 'Gaming console with OLED screen',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Logitech MX Master 3',
        price: 99.99,
        stock: 40,
        imageUrl: 'https://example.com/logitech-mouse.jpg',
        description: 'Premium wireless mouse for professionals',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Samsung 65" QLED TV',
        price: 1499.99,
        stock: 10,
        imageUrl: 'https://example.com/samsung-tv.jpg',
        description: '4K QLED smart TV with quantum dots',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Bose QuietComfort 45',
        price: 329.99,
        stock: 30,
        imageUrl: 'https://example.com/bose-headphones.jpg',
        description: 'Comfortable noise-cancelling headphones',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Microsoft Surface Pro 9',
        price: 1099.99,
        stock: 14,
        imageUrl: 'https://example.com/surface-pro.jpg',
        description: '2-in-1 laptop and tablet',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'GoPro Hero 11',
        price: 399.99,
        stock: 22,
        imageUrl: 'https://example.com/gopro-hero.jpg',
        description: 'Action camera with 5.3K video',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Fitbit Sense 2',
        price: 299.99,
        stock: 28,
        imageUrl: 'https://example.com/fitbit-sense.jpg',
        description: 'Advanced health and fitness smartwatch',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Canon EOS R6',
        price: 2499.99,
        stock: 6,
        imageUrl: 'https://example.com/canon-eos.jpg',
        description: 'Full-frame mirrorless camera',
        tenantId: tenants[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Razer Blade 15',
        price: 1799.99,
        stock: 9,
        imageUrl: 'https://example.com/razer-blade.jpg',
        description: 'Gaming laptop with RTX graphics',
        tenantId: tenants[0].id
      }
    })
  ])

  // Create Additional Products for Grocery Store (10 more)
  const additionalGroceryProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Organic Avocados',
        price: 4.99,
        stock: 80,
        imageUrl: 'https://example.com/avocados.jpg',
        description: 'Fresh organic avocados, 4 count',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Greek Yogurt',
        price: 5.49,
        stock: 60,
        imageUrl: 'https://example.com/greek-yogurt.jpg',
        description: 'Creamy Greek yogurt, 32oz',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Quinoa',
        price: 6.99,
        stock: 45,
        imageUrl: 'https://example.com/quinoa.jpg',
        description: 'Organic quinoa, 16oz package',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Almond Milk',
        price: 3.99,
        stock: 75,
        imageUrl: 'https://example.com/almond-milk.jpg',
        description: 'Unsweetened almond milk, 64oz',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Organic Spinach',
        price: 2.99,
        stock: 90,
        imageUrl: 'https://example.com/spinach.jpg',
        description: 'Fresh organic spinach, 8oz bag',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Chicken Breast',
        price: 8.99,
        stock: 40,
        imageUrl: 'https://example.com/chicken-breast.jpg',
        description: 'Organic chicken breast, 1lb',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Salmon Fillet',
        price: 12.99,
        stock: 25,
        imageUrl: 'https://example.com/salmon.jpg',
        description: 'Fresh Atlantic salmon, 8oz',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Sweet Potatoes',
        price: 3.49,
        stock: 70,
        imageUrl: 'https://example.com/sweet-potatoes.jpg',
        description: 'Organic sweet potatoes, 3lb bag',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Blueberries',
        price: 4.49,
        stock: 55,
        imageUrl: 'https://example.com/blueberries.jpg',
        description: 'Fresh organic blueberries, 6oz',
        tenantId: tenants[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Coconut Oil',
        price: 7.99,
        stock: 35,
        imageUrl: 'https://example.com/coconut-oil.jpg',
        description: 'Virgin coconut oil, 16oz jar',
        tenantId: tenants[1].id
      }
    })
  ])

  // Create Additional Products for Fashion Boutique (5 more)
  const additionalFashionProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Cashmere Sweater',
        price: 189.99,
        stock: 20,
        imageUrl: 'https://example.com/cashmere-sweater.jpg',
        description: 'Luxury cashmere sweater',
        tenantId: tenants[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Designer Sunglasses',
        price: 159.99,
        stock: 30,
        imageUrl: 'https://example.com/sunglasses.jpg',
        description: 'Premium designer sunglasses',
        tenantId: tenants[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Leather Jacket',
        price: 299.99,
        stock: 15,
        imageUrl: 'https://example.com/leather-jacket.jpg',
        description: 'Classic leather motorcycle jacket',
        tenantId: tenants[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Evening Gown',
        price: 399.99,
        stock: 8,
        imageUrl: 'https://example.com/evening-gown.jpg',
        description: 'Elegant evening gown for special occasions',
        tenantId: tenants[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Designer Watch',
        price: 599.99,
        stock: 12,
        imageUrl: 'https://example.com/designer-watch.jpg',
        description: 'Luxury designer watch',
        tenantId: tenants[2].id
      }
    })
  ])

  console.log('📦 Created products:', techProducts.length + groceryProducts.length + fashionProducts.length + additionalTechProducts.length + additionalGroceryProducts.length + additionalFashionProducts.length)

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
  const allProducts = [...techProducts, ...groceryProducts, ...fashionProducts, ...additionalTechProducts, ...additionalGroceryProducts, ...additionalFashionProducts]
  
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
