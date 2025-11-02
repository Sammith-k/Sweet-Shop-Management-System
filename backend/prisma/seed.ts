// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const password = 'Admin123!';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      password: hashed,
      role: 'ADMIN'
    }
  });

  // Indian sweets (prices in INR per piece)
  const sweets = [
    { name: 'Gulab Jamun',  category: 'Mithai',    price: 25, quantity: 100 },
    { name: 'Jalebi',       category: 'Mithai',    price: 20, quantity: 120 },
    { name: 'Rasgulla',     category: 'Bengali',   price: 30, quantity: 80  },
    { name: 'Kaju Katli',   category: 'Dry Fruit', price: 35, quantity: 60  },
    { name: 'Besan Ladoo',  category: 'Mithai',    price: 20, quantity: 90  },
    { name: 'Barfi',        category: 'Mithai',    price: 30, quantity: 70  },
    { name: 'Rasmalai',     category: 'Bengali',   price: 50, quantity: 50  },
    { name: 'Soan Papdi',   category: 'Traditional', price: 15, quantity: 110 },
    { name: 'Peda',         category: 'Mithai',    price: 25, quantity: 95  },
    { name: 'Sandesh',      category: 'Bengali',   price: 30, quantity: 75  }
  ];

  for (const s of sweets) {
    await prisma.sweet.upsert({
      where: { name: s.name },
      update: {},
      create: s
    });
  }

  console.log('Seed complete. Admin: admin@example.com / Admin123!');
}

main().finally(async () => {
  await prisma.$disconnect();
});