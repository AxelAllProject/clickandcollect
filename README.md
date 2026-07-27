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
