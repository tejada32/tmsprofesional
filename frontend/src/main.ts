//scr/main.ts
import 'dotenv/config'; // <-- ¡Esta línea es clave y debe ir arriba de todo!
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // rawBody: true es necesario para verificar la firma de Stripe en
  // /subscriptions/webhook (Stripe.webhooks.constructEvent necesita el
  // cuerpo crudo, no el JSON ya parseado).
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors(); // <-- Agrega esta línea
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en el puerto: ${port}`);
  
 // ... dentro de tu función bootstrap()
const config = new DocumentBuilder()
  .setTitle('TMS Profesional API')
  .setDescription('API oficial del ERP SaaS')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document); 
  
}
bootstrap();