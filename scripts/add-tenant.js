const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addNewTenant() {
  console.log('🏢 Adding new tenant with complete data...')

  try {
    // Create Users for the new tenant
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'owner@newstore.com',
          name: 'Michael Owner',
          password: '$2b$10$example.hash.for.owner',
          isVerified: true,
          provider: 'email'
        }
      }),
      prisma.user.create({
        data: {
          email: 'manager@newstore.com',
          name: 'Jennifer Manager',
          password: '$2b$10$example.hash.for.manager',
          isVerified: true,
          provider: 'email'
        }
      }),
      prisma.user.create({
        data: {
          email: 'cashier@newstore.com',
          name: 'Robert Cashier',
          password: '$2b$10$example.hash.for.cashier',
          isVerified: true,
          provider: 'email'
        }
      })
    ])

    console.log('👥 Created users for new tenant:', users.length)

    // Create the new tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: 'New Electronics Store',
        status: 'ACTIVE',
        stripeCustomerId: 'cus_newstore123',
        address: '789 Innovation Drive, Tech City, CA',
        phone: '+1-555-0789',
        email: 'contact@newelectronics.com',
        website: 'https://newelectronics.com',
        logo: 'https://example.com/new-electronics-logo.png',
        description: 'Premium electronics and gadgets store'
      }
    })

    console.log('🏢 Created new tenant:', tenant.name)

    // Create TenantUser relationships
    const tenantUsers = await Promise.all([
      prisma.tenantUser.create({
        data: {
          role: 'OWNER',
          userId: users[0].id,
          tenantId: tenant.id
        }
      }),
      prisma.tenantUser.create({
        data: {
          role: 'MANAGER',
          userId: users[1].id,
          tenantId: tenant.id
        }
      }),
      prisma.tenantUser.create({
        data: {
          role: 'CASHIER',
          userId: users[2].id,
          tenantId: tenant.id
        }
      })
    ])

    console.log('👥 Created tenant users:', tenantUsers.length)

    // Create Products for the new tenant
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Samsung Galaxy S24',
          price: 899.99,
          stock: 30,
          imageUrl: 'https://example.com/galaxy-s24.jpg',
          description: 'Latest Samsung smartphone with AI features',
          tenantId: tenant.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Dell XPS 13 Laptop',
          price: 1299.99,
          stock: 20,
          imageUrl: 'https://example.com/dell-xps.jpg',
          description: 'Premium ultrabook with 13-inch display',
          tenantId: tenant.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Sony WH-1000XM5 Headphones',
          price: 349.99,
          stock: 45,
          imageUrl: 'https://example.com/sony-headphones.jpg',
          description: 'Premium noise-cancelling headphones',
          tenantId: tenant.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'iPad Pro 12.9',
          price: 1099.99,
          stock: 25,
          imageUrl: 'https://example.com/ipad-pro.jpg',
          description: 'Professional tablet with M2 chip',
          tenantId: tenant.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Nintendo Switch OLED',
          price: 349.99,
          stock: 35,
          imageUrl: 'https://example.com/nintendo-switch.jpg',
          description: 'Gaming console with OLED screen',
          tenantId: tenant.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'GoPro Hero 11',
          price: 399.99,
          stock: 15,
          imageUrl: 'https://example.com/gopro-hero11.jpg',
          description: 'Action camera with 5.3K video',
          tenantId: tenant.id
        }
      })
    ])

    console.log('📦 Created products:', products.length)

    // Create Customers for the new tenant
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          name: 'Sarah Thompson',
          email: 'sarah.thompson@email.com',
          phone: '+1-555-0401',
          tenantId: tenant.id
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Kevin Rodriguez',
          email: 'kevin.rodriguez@email.com',
          phone: '+1-555-0402',
          tenantId: tenant.id
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Lisa Chen',
          email: 'lisa.chen@email.com',
          phone: '+1-555-0403',
          tenantId: tenant.id
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Mark Williams',
          email: 'mark.williams@email.com',
          phone: '+1-555-0404',
          tenantId: tenant.id
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Amanda Davis',
          email: 'amanda.davis@email.com',
          phone: '+1-555-0405',
          tenantId: tenant.id
        }
      })
    ])

    console.log('👥 Created customers:', customers.length)

    // Create Sales and SaleItems
    const sales = []
    const saleItems = []

    // Create 15 sample sales
    for (let i = 0; i < 15; i++) {
      const sale = await prisma.sale.create({
        data: {
          total: 0, // Will be calculated
          paymentType: i % 3 === 0 ? 'Card' : i % 3 === 1 ? 'Cash' : 'Mobile',
          tenantId: tenant.id,
          userId: users[i % 3].id, // Rotate between owner, manager, cashier
          customerId: customers[i % 5].id // Rotate between customers
        }
      })
      sales.push(sale)

      // Add 1-4 items to each sale
      const numItems = Math.floor(Math.random() * 4) + 1
      let saleTotal = 0

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)]
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

    console.log('💰 Created sales:', sales.length)
    console.log('📦 Created sale items:', saleItems.length)

    console.log('✅ New tenant added successfully!')
    console.log('📊 Summary for new tenant:')
    console.log(`   👥 Users: ${users.length}`)
    console.log(`   🏢 Tenant: ${tenant.name}`)
    console.log(`   👥 Tenant Users: ${tenantUsers.length}`)
    console.log(`   📦 Products: ${products.length}`)
    console.log(`   👥 Customers: ${customers.length}`)
    console.log(`   💰 Sales: ${sales.length}`)
    console.log(`   📦 Sale Items: ${saleItems.length}`)

  } catch (error) {
    console.error('❌ Error adding new tenant:', error)
    throw error
  }
}

addNewTenant()
  .catch((e) => {
    console.error('❌ Failed to add new tenant:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 