import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer CORS pour permettre les requêtes depuis le frontend
  app.enableCors({
    origin: '*', // En production, vous devriez spécifier l'origine exacte
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Utiliser le port depuis les variables d'environnement ou 3002 par défaut
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Service de suggestions de recherche démarré sur le port ${port}`);
}
bootstrap();
