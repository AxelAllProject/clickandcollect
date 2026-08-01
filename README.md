# Click & Collect

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

Application de commande en ligne avec retrait en point relais (click & collect) : catalogue de produits, panier, réservation d'un créneau de retrait, paiement en ligne, suivi de commande et back-office admin.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Démarrage rapide avec Docker](#démarrage-rapide-avec-docker)
- [Démarrage en local sans Docker](#démarrage-en-local-sans-docker)
- [Variables d'environnement](#variables-denvironnement)
- [Comptes de test](#comptes-de-test)
- [Paiement Stripe en local](#paiement-stripe-en-local)
- [Endpoints principaux](#endpoints-principaux)
- [Structure du projet](#structure-du-projet)
- [Prochaines étapes](#prochaines-étapes)

---

## Fonctionnalités

**Côté client**
- Authentification (inscription / connexion) par JWT, avec connexion via Google
- Mot de passe oublié (réinitialisation par lien envoyé par email)
- Double authentification (2FA) par email, activable dans le profil
- Catalogue de produits avec recherche, tri et gestion du stock
- Panier persistant (ajout, modification de quantité, suppression)
- Choix d'un point relais et d'un créneau de retrait avec gestion de capacité (plus de réservations que de places disponibles)
- Paiement en ligne sécurisé via Stripe (Payment Element)
- Suivi des commandes (statut de préparation + statut de paiement)
- Profil utilisateur (informations personnelles, changement de mot de passe)
- Paramètres (point relais favori, présélectionné automatiquement au paiement)

**Côté admin**
- Tableau de bord (aperçu des commandes par statut)
- Gestion des produits (créer / éditer / supprimer)
- Gestion des utilisateurs (liste, rôle, suppression, promotion en admin)
- Gestion des commandes (changement de statut)
- Gestion des créneaux de retrait (créer / supprimer)
- Gestion des points relais (créer / éditer / supprimer)

---

## Stack technique

| Composant | Technologie |
|---|---|
| Backend | Spring Boot 4, Spring Security (JWT), Spring Data JPA |
| Base de données | PostgreSQL |
| Paiement | Stripe (Payment Intents + webhooks) |
| Frontend | React 19, React Router, Tailwind CSS 4, Axios |
| Conteneurisation | Docker, Docker Compose |

---

## Démarrage rapide avec Docker

C'est la façon la plus simple de lancer toute la stack (base de données incluse).

1. Copier le fichier d'exemple et renseigner tes propres valeurs :

```bash
cp .env.example .env
```

2. Lancer la stack :

```bash
docker compose up --build
```

- Frontend : http://localhost:5173
- Backend : http://localhost:8080
- PostgreSQL : localhost:5432

Les données (utilisateurs, produits, commandes...) sont stockées dans un volume Docker et survivent aux redémarrages. Pour tout arrêter en gardant les données :

```bash
docker compose down
```

Pour tout arrêter et supprimer aussi la base de données :

```bash
docker compose down -v
```

---

## Démarrage en local sans Docker

Nécessite une instance PostgreSQL accessible en local (par exemple via `docker compose up db`).

**Backend**

```bash
cd backend
./mvnw spring-boot:run
```

Par défaut, le backend se connecte à `jdbc:postgresql://localhost:5432/clickandcollect` (voir [Variables d'environnement](#variables-denvironnement) pour personnaliser). L'API écoute sur `http://localhost:8080`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

L'interface est servie par Vite sur `http://localhost:5173`.

---

## Variables d'environnement

Toutes les valeurs sensibles se configurent via variables d'environnement (voir `.env.example`). En local sans Docker, des valeurs par défaut de développement sont utilisées si rien n'est défini.

| Variable | Rôle | Défaut (dev) |
|---|---|---|
| `DB_URL` | URL JDBC PostgreSQL | `jdbc:postgresql://localhost:5432/clickandcollect` |
| `DB_USERNAME` | Utilisateur PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `postgres` |
| `JWT_SECRET` | Clé de signature des tokens JWT | valeur de dev fournie |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (mode test) | — |
| `STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe (mode test) | — |
| `STRIPE_WEBHOOK_SECRET` | Secret de vérification des webhooks Stripe | — |
| `FRONTEND_URL` | URL du frontend, utilisée dans le lien de réinitialisation de mot de passe | `http://localhost:5173` |
| `MAIL_USERNAME` | Adresse Gmail utilisée pour envoyer les emails (mot de passe oublié, code 2FA) | — |
| `MAIL_APP_PASSWORD` | Mot de passe d'application Gmail (pas le mot de passe du compte) | — |
| `GOOGLE_CLIENT_ID` | Client ID OAuth Google pour la connexion "Se connecter avec Google" | — |

Les clés Stripe se récupèrent sur https://dashboard.stripe.com/test/apikeys.

Pour `MAIL_APP_PASSWORD`, active la validation en deux étapes sur le compte Gmail dédié puis génère un mot de passe d'application sur https://myaccount.google.com/apppasswords.

Pour `GOOGLE_CLIENT_ID`, crée un identifiant OAuth 2.0 de type "Application Web" sur https://console.cloud.google.com/apis/credentials, en ajoutant `http://localhost:5173` (et l'URL de prod le cas échéant) aux "Origines JavaScript autorisées". Seul le Client ID est nécessaire (aucun Client Secret : la vérification du jeton se fait côté serveur via l'API publique de Google).

---

## Comptes de test

Un jeu de données de démonstration est inséré automatiquement au premier démarrage (produits, points relais, créneaux, comptes) :

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@clickandcollect.fr` | `AdminTest1234!` |
| Utilisateur | `client.test@clickandcollect.fr` | `ClientTest1234!` |

Le catalogue de démo (6 produits) et 6 points relais en Hauts-de-France (avec leurs créneaux) sont créés en même temps.

---

## Paiement Stripe en local

Le paiement passe par un webhook Stripe pour confirmer qu'une commande est bien payée. En local, Stripe ne peut pas atteindre directement `localhost` : il faut utiliser le [Stripe CLI](https://docs.stripe.com/stripe-cli) pour relayer les événements.

1. Se connecter :

```bash
stripe login
```

2. Relayer les webhooks vers le backend (à laisser tourner pendant les tests) :

```bash
stripe listen --forward-to localhost:8080/api/payments/webhook
```

3. Copier le secret affiché (`whsec_...`) dans `STRIPE_WEBHOOK_SECRET`. **Ce secret change à chaque redémarrage de la commande.**

4. Cartes de test utiles :

| Scénario | Numéro de carte |
|---|---|
| Paiement réussi | `4242 4242 4242 4242` |
| Carte refusée | `4000 0000 0000 0002` |
| Fonds insuffisants | `4000 0000 0000 9995` |

Date d'expiration future et CVC quelconques.

---

## Endpoints principaux

**Authentification**
- `POST /api/auth/register` — inscription
- `POST /api/auth/login` — connexion (renvoie directement un JWT, ou `twoFactorRequired: true` si la 2FA est activée)
- `POST /api/auth/2fa/verify` — valide le code reçu par email et renvoie le JWT
- `POST /api/auth/2fa/resend` — renvoie un nouveau code 2FA
- `POST /api/auth/forgot-password` — envoie un lien de réinitialisation par email
- `POST /api/auth/reset-password` — définit un nouveau mot de passe à partir du lien reçu
- `POST /api/auth/google` — connexion/inscription via un ID token Google
- `GET /api/auth/config` — expose le Client ID Google (public) au frontend

**Produits**
- `GET /api/products` — liste des produits
- `POST /api/products` / `PUT /api/products/{id}` / `DELETE /api/products/{id}` — gestion (ADMIN)

**Panier**
- `GET /api/cart` — panier courant
- `POST /api/cart/items` / `PUT /api/cart/items/{id}` / `DELETE /api/cart/items/{id}` — gestion des lignes

**Points relais et créneaux**
- `GET /api/pickup-locations` — liste des points relais
- `POST /api/pickup-locations` / `PUT /api/pickup-locations/{id}` / `DELETE /api/pickup-locations/{id}` — gestion des points relais (ADMIN)
- `GET /api/pickup-slots?locationId=` — créneaux disponibles
- `POST /api/pickup-slots` / `DELETE /api/pickup-slots/{id}` — gestion des créneaux (ADMIN)

**Commandes et paiement**
- `POST /api/orders/checkout` — valide le panier sur un créneau, crée le paiement Stripe
- `GET /api/orders` — commandes de l'utilisateur connecté
- `GET /api/orders/all` — toutes les commandes (ADMIN)
- `PUT /api/orders/{id}/status` — changer le statut d'une commande (ADMIN)
- `POST /api/payments/webhook` — confirmation de paiement (appelé par Stripe)

**Profil**
- `GET/PUT /api/profile` — informations personnelles
- `PUT /api/profile/password` — changement de mot de passe
- `PUT /api/profile/settings` — point relais favori
- `PUT /api/profile/2fa` — active/désactive la double authentification

**Administration**
- `GET /api/admin/users` — liste des utilisateurs
- `PUT /api/admin/users/{id}/role` / `DELETE /api/admin/users/{id}` — gestion des rôles/suppression
- `POST /api/admin/promote` — promouvoir un utilisateur en admin

Le frontend utilise `frontend/src/services/api.js` : un intercepteur Axios ajoute automatiquement `Authorization: Bearer <token>` quand un token est présent dans le `localStorage`.

---

## Structure du projet

```
clickandcollect/
├── backend/                # API Spring Boot
│   ├── src/main/java/...   # controllers, services, repositories, entités, DTOs
│   └── Dockerfile
├── frontend/                # SPA React
│   ├── src/
│   │   ├── pages/           # une page par route
│   │   ├── components/      # composants UI et layout réutilisables
│   │   ├── context/          # panier, notifications
│   │   └── services/api.js   # client HTTP
│   └── Dockerfile
├── docker-compose.yml       # backend + frontend + PostgreSQL
└── .env.example
```

---

## Prochaines étapes

- Couverture de tests automatisés (JUnit, tests d'intégration avec Testcontainers)
- Migrations de schéma versionnées (Flyway/Liquibase) plutôt que `ddl-auto=update`
- Pagination sur les listes de produits/commandes
