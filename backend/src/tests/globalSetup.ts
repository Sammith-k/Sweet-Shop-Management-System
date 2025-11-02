import { execSync } from 'child_process';

export default async () => {
  process.env.DATABASE_URL = 'file:./test.db';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  // Prepare schema and seed admin/sweets
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  execSync('npx prisma db seed', { stdio: 'inherit' });
};