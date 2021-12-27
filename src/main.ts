import { SERVER_PORT } from "@config/env";
import { GlobalExceptionsFilter } from "@core/filters/global-exception-filter";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as basicAuth from "express-basic-auth";

import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
  OpenAPIObject,
} from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set("trust proxy", 1);
  app.setGlobalPrefix("/v1");
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );
  // Swagger Basic authentication
  app.use(
    ["/docs"],
    basicAuth({
      challenge: true,
      users: {
        ["nemo.superadmin"]: "nemoai1345",
      },
    }),
  );

  const swaggerSetupOptions: SwaggerCustomOptions = {
    explorer: true,
    swaggerOptions: {
      docExpansion: false,
      deepLinking: true,
    },
  };

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("NemoAI")
      .setDescription("This is the API Documentation for NemoAI")
      .addBearerAuth()
      .setVersion("1.0.0")
      .setContact(
        "Nguyễn Quang Tú",
        "https://www.linkedin.com/in/quangtudng",
        "quangtupct@gmail.com",
      )
      .build(),
    {
      deepScanRoutes: true,
    },
  );

  SwaggerModule.setup("docs", app, document, swaggerSetupOptions);

  app.useGlobalFilters(new GlobalExceptionsFilter());
  await app.listen(SERVER_PORT);
}
bootstrap();
