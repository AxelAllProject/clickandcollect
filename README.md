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
# 🛍️ Click & Collect

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

Prototype full‑stack pour une application de commande et retrait en boutique. Ce dépôt contient :

- un backend Java Spring Boot (API REST, sécurité JWT, H2 en mémoire pour le dev),
- un frontend React (Vite + Tailwind) avec un panneau admin minimal pour gérer le catalogue.

Ce README explique comment lancer le projet localement, quels endpoints sont disponibles et quelles améliorations sont recommandées.

---

## État actuel (résumé)

- Authentification JWT avec génération et validation côté serveur.
- Frontend avec pages : `Home`, `Catalogue`, `Login`, `Register`, `Admin`.
- `AdminPage` permet de créer / lister / éditer / supprimer des produits et de promouvoir un utilisateur depuis l'UI.
- Base H2 en mémoire et console H2 active pour inspection directe.

---

## Démarrage local

1) Backend

Ouvrir un terminal dans `backend` puis :

```powershell
cd backend
mvnw.cmd spring-boot:run
```

L'API écoute sur `http://localhost:8080`.

2) Frontend

Ouvrir un autre terminal dans `frontend` puis :

```bash
cd frontend
npm install
npm run dev
```

L'interface est servie par Vite (par défaut `http://localhost:5173`).

---

## Endpoints principaux

- `POST /api/auth/register` — inscription (body: `email`, `password`, `firstname`, `lastname`)
- `POST /api/auth/login` — connexion (body: `email`, `password`) → renvoie un token JWT
- `GET /api/products` — liste des produits
- `GET /api/products/{id}` — produit par id
- `POST /api/products` — créer un produit (PROTÉGÉ `ADMIN`)
- `PUT /api/products/{id}` — mettre à jour (PROTÉGÉ `ADMIN`)
- `DELETE /api/products/{id}` — supprimer (PROTÉGÉ `ADMIN`)
- `POST /api/admin/promote` — promouvoir un utilisateur (PROTÉGÉ `ADMIN`, body: `{ "email": "..." }`)

Le frontend utilise `frontend/src/services/api.js` : un intercepteur Axios ajoute automatiquement `Authorization: Bearer <token>` quand le token est présent dans le `localStorage`.

---

## Console H2 (développement)

- URL : `http://localhost:8080/h2-console`
- JDBC URL : `jdbc:h2:mem:clickandcollectdb`
- User : `sa`
- Password : `password`

Utiles pour inspecter les tables ou pour modifier un rôle rapidement :

```sql
UPDATE users SET role='ADMIN' WHERE email='ton.email@example.com';
```

---

## Bonnes pratiques & remarques

- La clé secrète JWT est actuellement définie en dur (fichier `JwtService.java`) pour faciliter le développement : il faut la remplacer par une variable d'environnement avant tout déploiement.
- Le contrôle d'accès réel se fait côté serveur : le frontend ne fait que masquer/afficher des éléments (ex. lien Admin).
- Ne modifie pas `pom.xml` pour l'instant si tu souhaites garder l'environnement stable.

---

## Tests rapides

1. Inscription (UI ou curl) :

```bash
curl -X POST http://localhost:8080/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"email":"me@example.com","password":"Pass123!","firstname":"Moi","lastname":"Test"}'
```

2. Connexion :

```bash
curl -X POST http://localhost:8080/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"me@example.com","password":"Pass123!"}'
```

3. Créer un produit (nécessite token ADMIN) :

```bash
curl -X POST http://localhost:8080/api/products \
	-H "Authorization: Bearer <TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"name":"Burger","description":"Bon","price":9.9,"stock":10,"imageUrl":"https://..."}'
```

---

## Prochaines étapes recommandées

1. Page `AdminUsers` : gestion complète des utilisateurs (liste, rôle, suppression) — priorité haute.
2. Pagination et filtres côté API et frontend pour `products`.
3. Notifications/toasts et modals de confirmation pour les actions critiques.
4. Externaliser la clé JWT et revoir la durée des tokens (ajouter refresh tokens si besoin).
5. Ajouter des tests automatisés (unitaires et e2e) pour les parcours principaux.

---

## Contribution

Tu peux committer les changements locaux puis pousser. Exemple :

```bash
git add .
git commit -m "docs: mise à jour README"
git push
```

---

Si tu veux, je peux créer la page `AdminUsers` maintenant (frontend + petits endpoints si nécessaires). Dis‑moi et je m'en charge.
>>>>>>> 0542727 (feat: add admin promotion endpoint and enhance JWT handling in frontend)
