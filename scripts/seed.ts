import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // console.log('🌱 Seeding database...')

  // Create a test manager
  const manager = await prisma.manager.upsert({
    where: { phoneNumber: '+1234567890' },
    update: {},
    create: {
      phoneNumber: '+1234567890',
      name: 'Test Manager',
    },
  })

  // console.log('✅ Created manager:', manager)

  // Create a test villa
  const villa = await prisma.villa.upsert({
    where: { slug: 'sunset' },
    update: {},
    create: {
      slug: 'sunset',
      name: 'Sunset Villa',
      description: 'A beautiful villa with stunning sunset views. Perfect for your next vacation.',
      pricePerNight: 150.00,
      phoneNumber: '+1234567890',
      address: '123 Sunset Blvd, Paradise City',
      managerId: manager.id,
    },
  })

  // console.log('✅ Created villa:', villa)

  // console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 