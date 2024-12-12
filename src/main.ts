import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { config } from './config';
import { AppModule } from './modules/app.module';
import { enableSwagger } from './swagger.service';

const {
  api: { port },
} = config;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  enableSwagger(app);
  await app.listen(port || 3000);
}
bootstrap();
