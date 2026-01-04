import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception';
import { HttpService } from '@nestjs/axios';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const whiteList: RegExp[] = [/http:\/\/localhost:[0-9]{4}$/];
export const corsOptions = {
  origin: function (
    origin: string,
    callback: (arg0: null, arg1: boolean) => void,
  ) {
    if (!origin || whiteList.some((w) => origin.match(w))) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://una-admin.netlify.app',
        'https://319daeb9b333.ngrok-free.app',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  // IMPORTANT: handle preflight
  // app.options('*', cors());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Reservation')
    .setDescription('Reservation ORG API Documentation')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // app.useGlobalFilters(new HttpExceptionFilter(app.get(HttpService)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
