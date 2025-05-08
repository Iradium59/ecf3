# Documentation sur le processus de déploiement

## Architecture de l'application

L'application e-commerce est composée des éléments suivants :

1. **Microservices Backend** :
   - **common-data-service** : Gère les données communes comme les produits, catégories, etc.
   - **authentication-service** : Gère l'authentification et les utilisateurs.
   - **payment-service** : Gère les paiements.
   - **search-suggestion-service** : Fournit des suggestions de recherche (développé avec NestJS).

2. **Frontend** :
   - **client** : Interface utilisateur React.

3. **Services d'infrastructure** :
   - **MySQL** : Base de données relationnelle pour stocker les données.
   - **Redis** : Cache pour améliorer les performances.

## Prérequis

Pour déployer l'application, vous aurez besoin de :

- Docker (version 20.10.0 ou supérieure)
- Docker Compose (version 2.0.0 ou supérieure)
- Git
- Au moins 4 Go de RAM disponible
- Au moins 10 Go d'espace disque

## Étapes de déploiement

### 1. Cloner le dépôt

```bash
git clone https://github.com/Iradium59/ecf3.git
cd ecf3
```

2. Configuration des variables d'environnement

Créez un fichier .env à la racine du projet avec les variables suivantes :

***Pour les besoins de cette ECF le fichier .env est deja present dans le projet***

```bash
# Configuration MySQL
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=ecommerce
MYSQL_USER=ecommerce
MYSQL_PASSWORD=ecommerce
DB_SCHEMA=ecommerce
DB_USER=ecommerce
DB_PASS=ecommerce
DB_PORT=3306

# Configuration Redis
REDIS_PORT=6379
REDIS_PASSWORD=redis

# Configuration des services
ACTIVE_PROFILE=dev
COMMON_DATA_SERVICE_PORT=8081
AUTHENTICATION_SERVICE_PORT=8082
PAYMENT_SERVICE_PORT=8083
SEARCH_SUGGESTION_SERVICE_PORT=3002

# Configuration du client React
REACT_APP_PORT=3000
REACT_APP_ENVIRONMENT=development
```

### 3. Construction et démarrage des containers

```bash 
# Construire tous les services
docker-compose build

# Démarrer tous les services
docker-compose up -d
```

Les services seront démarrés dans l'ordre suivant :

1. MySQL et Redis (services d'infrastructure)
2. Les microservices backend (common-data-service, authentication-service, payment-service, search-suggestion-service)
3. Le client React

verifier que tout les containers tourne
```bash
docker-compose ps
```

### 4. Accès à l'application
- Interface utilisateur : http://localhost:3000
- API common-data-service : http://localhost:8081
- API authentication-service : http://localhost:8082
- API payment-service : http://localhost:8083
- API search-suggestion-service : http://localhost:3002