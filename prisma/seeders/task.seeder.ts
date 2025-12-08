import type { PrismaClient } from '../../generated/prisma/client'

export async function seedTasks(prisma: PrismaClient) {
  console.log('  → Seeding tasks...')

  // Check if tasks already exist
  const existingCount = await prisma.task.count()
  if (existingCount > 0) {
    console.log(`  ⏭ Skipped: ${existingCount} tasks already exist`)
    return { count: 0 }
  }

  const result = await prisma.task.createMany({
    data: [
      { title: 'Task 1', status: 'pending' },
      { title: 'Task 2', status: 'completed' },
      { title: 'Task 3', status: 'in-progress' },
    ],
  })

  console.log(`  ✓ Created ${result.count} tasks`)
  return result
}

export default seedTasks
