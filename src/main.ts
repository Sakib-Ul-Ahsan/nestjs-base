 import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interfaces/response.interface';
import { AuditLogService } from './common/audit/audit-log.service';
import { AuditLogInterceptor } from './common/audit/audit-log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.APP_PORT || 3000;
  const host = process.env.APP_HOST || 'localhost';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  // @TODO: Update Swagger documentation with your project details
  const config = new DocumentBuilder()
    .setTitle('My API') // @TODO: Change this to your project name
    .setDescription('API documentation') // @TODO: Update description
    .setVersion('1.0') // @TODO: Update version as needed
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // const { runSeeders } = await import('./database/seeders/index.js');
  // await runSeeders(app);

  const auditService = app.get(AuditLogService);

  app.useGlobalInterceptors(new AuditLogInterceptor(auditService));

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Application is running on: http://${host}:${port}`);
  logger.log(`📄 Swagger docs available at: http://${host}:${port}/api`);
}

bootstrap();
