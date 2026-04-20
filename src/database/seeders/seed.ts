import { NestFactory } from '@nestjs/core';
import { runSeeders } from '.';
import { AppModule } from 'src/app.module';

async function seed() {
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