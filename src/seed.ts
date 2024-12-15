import { NestFactory } from '@nestjs/core';

import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  console.log('Starting seed script...');
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);

  await seedService.run();
  console.log('Seed completed successfully!');

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Error running seed:', err);
});
