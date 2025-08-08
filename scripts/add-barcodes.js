const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addBarcodes() {
  console.log('🔄 Adding dummy barcodes to products...')

  try {
    // Get all products
    const products = await prisma.product.findMany()
    console.log(`📦 Found ${products.length} products to update`)

    // Generate and update barcodes for each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      // Generate a dummy barcode (13 digits for EAN-13 format)
      const dummyBarcode = generateBarcode(product.id, i + 1)
      
      await prisma.product.update({
        where: { id: product.id },
        data: { barcode: dummyBarcode }
      })
      
      console.log(`✅ Updated ${product.name} with barcode: ${dummyBarcode}`)
    }

    console.log('🎉 Successfully added barcodes to all products!')
  } catch (error) {
    console.error('❌ Error adding barcodes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function generateBarcode(productId, index) {
  // Create a consistent barcode based on product ID and index
  // This ensures each product gets a unique barcode
  const hash = productId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  // Generate a 12-digit number (we'll add check digit)
  const baseNumber = Math.abs(hash + index * 1000) % 1000000000000
  const barcode12 = baseNumber.toString().padStart(12, '0')
  
  // Add check digit for EAN-13
  const checkDigit = calculateEAN13CheckDigit(barcode12)
  
  return barcode12 + checkDigit
}

function calculateEAN13CheckDigit(barcode12) {
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode12[i])
    sum += digit * (i % 2 === 0 ? 1 : 3)
  }
  const remainder = sum % 10
  return remainder === 0 ? 0 : 10 - remainder
}

addBarcodes()
  .catch((e) => {
    console.error('❌ Script failed:', e)
    process.exit(1)
  }) 