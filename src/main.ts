import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'metrics', method: RequestMethod.GET }],
  });
  app.enableCors();
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap().then(() => {
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 8080}/api/v1`,
  );
  console.log(
    `Metrics is running on: http://localhost:${process.env.PORT ?? 8080}/metrics`,
  );
});
