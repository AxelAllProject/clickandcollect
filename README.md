<<<<<<< HEAD
# 🛍️ Click & Collect - Web Application

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

> Une application full-stack moderne permettant aux clients de commander en ligne et de venir récupérer leurs produits sur place. Conçue avec une architecture propre, sécurisée par JWT et dotée d'une interface utilisateur premium (Glassmorphism).

---

## Fonctionnalités actuelles

- **Authentification sécurisée** : Inscription et connexion avec tokens JWT.
- **Validation stricte** : Mots de passe robustes (12+ caractères) et contraintes de saisie.
- **Espace Membre** : Routage protégé, récupération dynamique du profil utilisateur depuis la base de données (`/api/auth/me`).
- **UI/UX Premium** : Interface responsive développée avec Tailwind CSS (Navbar translucide, menus interactifs).
- **Gestion des Rôles** : Distinction entre profils `CLIENT` et `ADMIN`.

---

## Stack Technique

### Frontend (Client)
- **Framework** : React.js (Vite)
- **Styling** : Tailwind CSS
- **Routing** : React Router DOM
- **Requêtes HTTP** : Axios (avec intercepteurs pour le token JWT)

### Backend (Serveur)
- **Framework** : Java Spring Boot 3
- **Sécurité** : Spring Security & JWT (JSON Web Tokens)
- **Base de données** : H2 (In-memory pour le développement)
- **Architecture** : Controllers / Services / Repositories / DTOs

---

## Roadmap du Projet

Voici les prochaines étapes de développement pour finaliser l'application. 

### Phase 1 : Fondations & Sécurité (Terminée)
- [x] Initialisation du backend Spring Boot et du frontend React.
- [x] Configuration de Spring Security et implémentation du JWT.
- [x] Création des entités User et des endpoints d'authentification (`/login`, `/register`).
- [x] Mise en place du Layout Frontend (Navbar premium, footer).
- [x] Connexion Frontend/Backend et récupération dynamique du profil (`/me`).

### Phase 2 : Catalogue & Produits (En cours)
- [ ] **Frontend** : Finaliser `CataloguePage.jsx` pour afficher les produits depuis la BDD.
- [ ] **Frontend** : Ajouter un système de filtres (par catégories) et une barre de recherche.

### Phase 3 : Panier & Commandes (À faire)
- [ ] **Frontend** : Implémenter la logique du Panier (State management, ajout/retrait d'articles).
- [ ] **Backend** : Créer l'entité `Order` (statut, total, date) et `OrderItem` (détails de la commande).
- [ ] **Backend** : Endpoint pour valider une commande (`POST /api/orders`).
- [ ] **Frontend** : Remplacer les fausses données de `OrdersPage.jsx` par l'historique réel depuis l'API.

### Phase 4 : Dashboard Administrateur (⏳ À faire)
- [ ] **Frontend** : Protéger la route `/admin` (accessible uniquement si `role === 'ADMIN'`).
- [ ] **Frontend** : Créer une interface de gestion des stocks (ajouter/modifier un produit).
- [ ] **Frontend** : Créer une vue "Cuisine/Préparation" pour passer les commandes de "En attente" à "Prête".

### Phase 5 : Paramètres & Déploiement (⏳ À faire)
- [ ] **Frontend** : Brancher `SettingsPage.jsx` (Modification du mot de passe, préférences).
- [ ] **Backend** : Migrer la base de données de H2 vers **PostgreSQL** ou **MySQL**.
- [ ] **DevOps** : Dockeriser l'application (Frontend + Backend + DB).
- [ ] **DevOps** : Déploiement en ligne (Render, Vercel, ou VPS).

---

## Instructions d'installation

### 1. Cloner le dépôt
```bash
git clone [https://github.com/ton-nom-utilisateur/click-and-collect.git](https://github.com/ton-nom-utilisateur/click-and-collect.git)
cd click-and-collect
=======
# Click & Collect — Projet local

Prototype full‑stack : backend Spring Boot (H2) + frontend React (Vite + Tailwind).

Ce README reflète l'état actuel du dépôt (auth JWT, CRUD produits, panneau admin minimal).

---

## État actuel

- Backend Spring Boot avec authentification JWT.
- Frontend React (Vite) avec pages : `Home`, `Catalogue`, `Login`, `Register`, `Admin`.
- Frontend inclut un `AdminPage` permettant de créer/lister/éditer/supprimer des produits et de promouvoir un utilisateur (Test).
- Base de données H2 en mémoire (développement) + console H2 active.

---

## Démarrage (local)

1) Backend

Ouvrir un terminal depuis le dossier `backend` et lancer :

```powershell
cd backend
mvnw.cmd spring-boot:run
```

L'API écoute par défaut sur `http://localhost:8080`.

2) Frontend

Ouvrir un autre terminal depuis le dossier `frontend` et lancer :

```bash
cd frontend
npm install
npm run dev
```

L'UI frontend (Vite) tourne souvent sur `http://localhost:5173`.

---

## Endpoints utiles (actuels)

- `POST /api/auth/register` — enregistrement (body: email, password, firstname, lastname)
- `POST /api/auth/login` — authentification (body: email, password) → renvoie token JWT
- `GET /api/products` — lister produits
- `GET /api/products/{id}` — récupérer un produit
- `POST /api/products` — créer produit (PROTÉGÉ `ADMIN`)
- `PUT /api/products/{id}` — mettre à jour produit (PROTÉGÉ `ADMIN`)
- `DELETE /api/products/{id}` — supprimer produit (PROTÉGÉ `ADMIN`)
- `POST /api/admin/promote` — promouvoir un utilisateur (PROTÉGÉ `ADMIN`, body: {"email":"..."})

Notes : le frontend envoie automatiquement l'en-tête `Authorization: Bearer <token>` en lisant `localStorage.jwt_token`.

---

## Console H2 (dev)

- URL : `http://localhost:8080/h2-console`
- JDBC URL : `jdbc:h2:mem:clickandcollectdb`
- User : `sa`
- Password : `password`

Utiliser la console pour inspecter la table `users` et, si besoin, promouvoir un utilisateur :

```sql
UPDATE users SET role='ADMIN' WHERE email='ton.email@example.com';
```

---

## Règles et bonnes pratiques (dev)

- Ne modifie pas `pom.xml` pour l'instant (la demande initiale le strictement évitée).
- La clé JWT est actuellement codée en dur (fichier `JwtService.java`) — OK pour dev, à externaliser en variable d'environnement pour prod.
- Le rôle d'un utilisateur est stocké dans la colonne `role` de la table `users` (valeurs actuelles : `USER`, `ADMIN`).

---

## Comment tester rapidement

1. S'inscrire via l'UI (`/register`) ou via curl :

```bash
curl -X POST http://localhost:8080/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"email":"me@example.com","password":"Pass123!","firstname":"Moi","lastname":"Test"}'
```

2. Se connecter (`/login`) — copier le token renvoyé et le stocker dans `localStorage` sous la clé `jwt_token` (le frontend le fait automatiquement si tu utilises l'UI).

3. Aller sur `/admin` (le lien apparaît dans la navbar si le token a `role === 'ADMIN'`) et gérer les produits.

4. Si tu n'as pas d'admin, promouvoir un utilisateur via la console H2 (voir ci‑dessus) ou via l'UI Admin (formulaire Promouvoir si tu es déjà admin).

---

## Sujets à compléter ensuite (priorités)

1. Créer une page `AdminUsers` pour gérer les utilisateurs (liste, recherche, modifier rôle, supprimer) — remplace l'usage manuel de H2.
2. Ajouter pagination & filtres côté API (`/api/products`) et côté frontend.
3. Ajouter toasts/modals pour confirmations et retours utilisateurs.
4. Sortir la clé JWT des sources : utiliser `application.properties` + variable d'environnement.
5. Écrire des tests e2e simples (Cypress / Playwright) pour les flows critiques (login, CRUD produit).

---

## Commit et sauvegarde

Après vérifications locales, tu peux commit tes changements :

```bash
git add .
git commit -m "feat: admin CRUD UI + JWT improvements + README"
git push
```

---

Si tu veux, je peux :
- créer la page `AdminUsers` maintenant, ou
- ajouter pagination API pour les produits, ou
- générer un petit README séparé `DEVELOPMENT.md` avec les checkpoints de debug.
Choisis et j'attaque.
>>>>>>> 0542727 (feat: add admin promotion endpoint and enhance JWT handling in frontend)
