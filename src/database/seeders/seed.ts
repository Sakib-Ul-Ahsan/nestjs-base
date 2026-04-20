import { NestFactory } from '@nestjs/core';
import { runSeeders } from '.';
import { AppModule } from 'src/app.module';

async function seed() {
  // @TODO: Run this seeder during initial setup or development
  // Command: npm run seed
  // This will create initial roles, permissions, and admin users
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    await runSeeders(app);
    console.log('✅ Seeders executed successfully');
  } catch (err) {
    console.error('❌ Seeder failed:', err);
  } finally {
    await app.close();
  }
}

seed();