import { PrismaClient, UserRole, TaskType, RecordType, TemperatureCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.correctiveAction.deleteMany()
  await prisma.recordDetail.deleteMany()
  await prisma.temperatureRecord.deleteMany()
  await prisma.record.deleteMany()
  await prisma.task.deleteMany()
  await prisma.scheduleItem.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.stockItem.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.storeUser.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.user.deleteMany()
  await prisma.store.deleteMany()
  await prisma.franchise.deleteMany()

  console.log('✅ Cleaned existing data')

  // Create Franchise
  const franchise = await prisma.franchise.create({
    data: {
      name: 'Cafe Central Group',
      description: 'A premier cafe franchise group in New Zealand',
    }
  })
  console.log('✅ Created franchise:', franchise.name)

  // Create Stores
  const store1 = await prisma.store.create({
    data: {
      franchiseId: franchise.id,
      name: 'Cafe Central - Auckland CBD',
      address: '123 Queen Street, Auckland CBD, Auckland 1010',
      phone: '+64 9 123 4567',
      email: 'auckland@cafecentral.co.nz',
      registrationNumber: 'FCP-2024-001',
    }
  })

  const store2 = await prisma.store.create({
    data: {
      franchiseId: franchise.id,
      name: 'Cafe Central - Wellington',
      address: '456 Lambton Quay, Wellington 6011',
      phone: '+64 4 234 5678',
      email: 'wellington@cafecentral.co.nz',
      registrationNumber: 'FCP-2024-002',
    }
  })
  console.log('✅ Created stores')

  // Create Users with different roles
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Franchise Admin
  const franchiseAdmin = await prisma.user.create({
    data: {
      email: 'admin@cafecentral.co.nz',
      name: 'Sarah Johnson',
      password: hashedPassword,
      role: UserRole.FRANCHISE_ADMIN,
    }
  })

  // Owners
  const owner1 = await prisma.user.create({
    data: {
      email: 'owner.auckland@cafecentral.co.nz',
      name: 'Michael Chen',
      password: hashedPassword,
      role: UserRole.OWNER,
    }
  })

  const owner2 = await prisma.user.create({
    data: {
      email: 'owner.wellington@cafecentral.co.nz',
      name: 'Emma Wilson',
      password: hashedPassword,
      role: UserRole.OWNER,
    }
  })

  // Managers
  const manager1 = await prisma.user.create({
    data: {
      email: 'manager.auckland@cafecentral.co.nz',
      name: 'David Kumar',
      password: hashedPassword,
      role: UserRole.MANAGER,
    }
  })

  const manager2 = await prisma.user.create({
    data: {
      email: 'manager.wellington@cafecentral.co.nz',
      name: 'Lisa Brown',
      password: hashedPassword,
      role: UserRole.MANAGER,
    }
  })

  // Staff
  const staff1 = await prisma.user.create({
    data: {
      email: 'staff1@cafecentral.co.nz',
      name: 'Tom Anderson',
      password: hashedPassword,
      role: UserRole.STAFF,
    }
  })

  const staff2 = await prisma.user.create({
    data: {
      email: 'staff2@cafecentral.co.nz',
      name: 'Jessica Lee',
      password: hashedPassword,
      role: UserRole.STAFF,
    }
  })

  const staff3 = await prisma.user.create({
    data: {
      email: 'staff3@cafecentral.co.nz',
      name: 'Ryan Taylor',
      password: hashedPassword,
      role: UserRole.STAFF,
    }
  })
  console.log('✅ Created users')

  // Assign users to stores
  await prisma.storeUser.createMany({
    data: [
      // Franchise Admin - access to both stores as Franchise Admin
      { storeId: store1.id, userId: franchiseAdmin.id, role: UserRole.FRANCHISE_ADMIN },
      { storeId: store2.id, userId: franchiseAdmin.id, role: UserRole.FRANCHISE_ADMIN },
      
      // Owners
      { storeId: store1.id, userId: owner1.id, role: UserRole.OWNER },
      { storeId: store2.id, userId: owner2.id, role: UserRole.OWNER },
      
      // Managers
      { storeId: store1.id, userId: manager1.id, role: UserRole.MANAGER },
      { storeId: store2.id, userId: manager2.id, role: UserRole.MANAGER },
      
      // Staff - Auckland
      { storeId: store1.id, userId: staff1.id, role: UserRole.STAFF },
      { storeId: store1.id, userId: staff2.id, role: UserRole.STAFF },
      
      // Staff - Wellington
      { storeId: store2.id, userId: staff3.id, role: UserRole.STAFF },
    ]
  })
  console.log('✅ Assigned users to stores')

  // Create Equipment for temperature monitoring
  await prisma.equipment.createMany({
    data: [
      // Auckland Store Equipment
      { storeId: store1.id, name: 'Walk-in Cold Room', category: TemperatureCategory.COLD_STORAGE, location: 'Back Storage', minTemp: 0, maxTemp: 5 },
      { storeId: store1.id, name: 'Prep Fridge 1', category: TemperatureCategory.COLD_STORAGE, location: 'Prep Area', minTemp: 0, maxTemp: 5 },
      { storeId: store1.id, name: 'Prep Fridge 2', category: TemperatureCategory.COLD_STORAGE, location: 'Prep Area', minTemp: 0, maxTemp: 5 },
      { storeId: store1.id, name: 'Display Fridge', category: TemperatureCategory.COLD_STORAGE, location: 'Front Counter', minTemp: 0, maxTemp: 5 },
      { storeId: store1.id, name: 'Freezer 1', category: TemperatureCategory.FREEZER, location: 'Back Storage', minTemp: -23, maxTemp: -18 },
      { storeId: store1.id, name: 'Hot Bain Marie', category: TemperatureCategory.HOT_HOLDING, location: 'Service Area', minTemp: 60, maxTemp: 85 },
      
      // Wellington Store Equipment
      { storeId: store2.id, name: 'Walk-in Cold Room', category: TemperatureCategory.COLD_STORAGE, location: 'Back Storage', minTemp: 0, maxTemp: 5 },
      { storeId: store2.id, name: 'Prep Fridge', category: TemperatureCategory.COLD_STORAGE, location: 'Prep Area', minTemp: 0, maxTemp: 5 },
      { storeId: store2.id, name: 'Display Fridge', category: TemperatureCategory.COLD_STORAGE, location: 'Front Counter', minTemp: 0, maxTemp: 5 },
      { storeId: store2.id, name: 'Freezer', category: TemperatureCategory.FREEZER, location: 'Back Storage', minTemp: -23, maxTemp: -18 },
    ]
  })
  console.log('✅ Created equipment')

  // Create Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      storeId: store1.id,
      name: 'Fresh Dairy Co',
      contactName: 'John Smith',
      phone: '+64 9 876 5432',
      email: 'orders@freshdairy.co.nz',
      isApproved: true,
    }
  })

  const supplier2 = await prisma.supplier.create({
    data: {
      storeId: store1.id,
      name: 'Premium Meats Ltd',
      contactName: 'Angela Wong',
      phone: '+64 9 765 4321',
      email: 'sales@premiummeats.co.nz',
      isApproved: true,
    }
  })
  console.log('✅ Created suppliers')

  // Create Schedules (Task Templates)
  const openingSchedule = await prisma.schedule.create({
    data: {
      storeId: store1.id,
      name: 'Morning Opening Checklist',
      description: 'Complete all tasks before opening the cafe',
      taskType: TaskType.OPENING,
      items: {
        create: [
          { title: 'Check cold room temperature', description: 'Record temperature in the app', dueTime: '06:30', isRequired: true, order: 1 },
          { title: 'Check freezer temperature', description: 'Record temperature in the app', dueTime: '06:30', isRequired: true, order: 2 },
          { title: 'Turn on hot holding equipment', description: 'Bain marie and soup kettles', dueTime: '06:30', isRequired: true, order: 3 },
          { title: 'Check hand washing stations', description: 'Ensure soap and paper towels stocked', dueTime: '06:45', isRequired: true, order: 4 },
          { title: 'Sanitize food contact surfaces', description: 'Prep tables, cutting boards', dueTime: '06:45', isRequired: true, order: 5 },
          { title: 'Check for pest activity', description: 'Inspect traps and look for signs', dueTime: '07:00', isRequired: true, order: 6 },
          { title: 'Review delivery log', description: 'Check yesterday\'s deliveries were recorded', dueTime: '07:00', isRequired: false, order: 7 },
        ]
      }
    }
  })

  const closingSchedule = await prisma.schedule.create({
    data: {
      storeId: store1.id,
      name: 'Evening Closing Checklist',
      description: 'Complete all tasks before closing',
      taskType: TaskType.CLOSING,
      items: {
        create: [
          { title: 'Record final cold room temperature', description: 'Record in the app', dueTime: '21:00', isRequired: true, order: 1 },
          { title: 'Record final freezer temperature', description: 'Record in the app', dueTime: '21:00', isRequired: true, order: 2 },
          { title: 'Clean and sanitize all surfaces', description: 'Tables, counters, equipment', dueTime: '21:30', isRequired: true, order: 3 },
          { title: 'Clean floors', description: 'Sweep and mop all areas', dueTime: '21:45', isRequired: true, order: 4 },
          { title: 'Dispose of waste', description: 'Take rubbish to designated area', dueTime: '22:00', isRequired: true, order: 5 },
          { title: 'Check fridge doors are sealed', description: 'Verify all refrigeration closed properly', dueTime: '22:00', isRequired: true, order: 6 },
          { title: 'Set alarm and lock up', description: 'Security check complete', dueTime: '22:15', isRequired: true, order: 7 },
        ]
      }
    }
  })
  console.log('✅ Created schedules')

  // Create sample tasks for today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.task.createMany({
    data: [
      // Opening tasks for Auckland
      { storeId: store1.id, type: TaskType.OPENING, title: 'Check cold room temperature', assignedTo: staff1.id, dueTime: '06:30', priority: 'HIGH', isRecurring: true, recurrence: 'daily' },
      { storeId: store1.id, type: TaskType.OPENING, title: 'Check freezer temperature', assignedTo: staff1.id, dueTime: '06:30', priority: 'HIGH', isRecurring: true, recurrence: 'daily' },
      { storeId: store1.id, type: TaskType.OPENING, title: 'Sanitize prep surfaces', assignedTo: staff2.id, dueTime: '06:45', priority: 'HIGH', isRecurring: true, recurrence: 'daily' },
      
      // Closing tasks for Auckland
      { storeId: store1.id, type: TaskType.CLOSING, title: 'Record final fridge temps', assignedTo: staff1.id, dueTime: '21:00', priority: 'HIGH', isRecurring: true, recurrence: 'daily' },
      { storeId: store1.id, type: TaskType.CLOSING, title: 'Clean and sanitize all areas', assignedTo: staff2.id, dueTime: '21:30', priority: 'HIGH', isRecurring: true, recurrence: 'daily' },
      
      // During service
      { storeId: store1.id, type: TaskType.DURING_SERVICE, title: 'Hot holding temperature check', assignedTo: staff1.id, dueTime: '12:00', priority: 'HIGH', isRecurring: true, recurrence: 'daily' },
      { storeId: store1.id, type: TaskType.DURING_SERVICE, title: 'Afternoon cleaning round', assignedTo: staff2.id, dueTime: '15:00', priority: 'NORMAL', isRecurring: true, recurrence: 'daily' },
      
      // Weekly tasks
      { storeId: store1.id, type: TaskType.WEEKLY, title: 'Deep clean kitchen equipment', assignedTo: staff1.id, priority: 'HIGH', isRecurring: true, recurrence: 'weekly' },
      { storeId: store1.id, type: TaskType.WEEKLY, title: 'Pest control inspection', assignedTo: manager1.id, priority: 'HIGH', isRecurring: true, recurrence: 'weekly' },
    ]
  })
  console.log('✅ Created tasks')

  // Create sample temperature records
  const equipment1 = await prisma.equipment.findFirst({ where: { storeId: store1.id, name: 'Walk-in Cold Room' } })
  const equipment2 = await prisma.equipment.findFirst({ where: { storeId: store1.id, name: 'Freezer 1' } })

  if (equipment1 && equipment2) {
    await prisma.temperatureRecord.createMany({
      data: [
        { equipmentId: equipment1.id, recordedBy: staff1.id, temperature: 3.2, isCompliant: true, recordedAt: new Date(today.getTime() + 6 * 60 * 60 * 1000) },
        { equipmentId: equipment2.id, recordedBy: staff1.id, temperature: -19.5, isCompliant: true, recordedAt: new Date(today.getTime() + 6 * 60 * 60 * 1000) },
      ]
    })
  }
  console.log('✅ Created temperature records')

  // Create sample stock items for traceability
  await prisma.stockItem.createMany({
    data: [
      { storeId: store1.id, supplierId: supplier1.id, name: 'Fresh Milk', batchNumber: 'FM-240220-A', quantity: 20, unit: 'liters', receivedDate: new Date(), expiryDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) },
      { storeId: store1.id, supplierId: supplier1.id, name: 'Cream', batchNumber: 'CR-240220-B', quantity: 5, unit: 'liters', receivedDate: new Date(), expiryDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000) },
      { storeId: store1.id, supplierId: supplier2.id, name: 'Chicken Breast', batchNumber: 'CB-240219-C', quantity: 10, unit: 'kg', receivedDate: new Date(today.getTime() - 24 * 60 * 60 * 1000), expiryDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) },
    ]
  })
  console.log('✅ Created stock items')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📋 Default login credentials:')
  console.log('  Franchise Admin: admin@cafecentral.co.nz / password123')
  console.log('  Owner: owner.auckland@cafecentral.co.nz / password123')
  console.log('  Manager: manager.auckland@cafecentral.co.nz / password123')
  console.log('  Staff: staff1@cafecentral.co.nz / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
