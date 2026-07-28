## Fonctionnalités actuelles
# Click & Collect

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

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

- La clé secrète JWT est actuellement définie en dur (fichier `JwtService.java`) pour faciliter le développement.
- Le contrôle d'accès réel se fait côté serveur : le frontend ne fait que masquer/afficher des éléments (ex. lien Admin).
- Ne modifie pas `pom.xml` pour l'instant si tu souhaites garder l'environnement stable.

---

## Tests rapides

1. Inscription :

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

3. Créer un produit :

```bash
curl -X POST http://localhost:8080/api/products \
	-H "Authorization: Bearer <TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"name":"Burger","description":"Bon","price":9.9,"stock":10,"imageUrl":"https://..."}'
```

---

## Prochaines étapes 

1. Page `AdminUsers` : gestion complète des utilisateurs (liste, rôle, suppression) — priorité haute.
2. Pagination et filtres côté API et frontend pour `products`.
3. Notifications/toasts et modals de confirmation pour les actions critiques.
4. Externaliser la clé JWT et revoir la durée des tokens (ajouter refresh tokens si besoin).
5. Ajouter des tests automatisés (unitaires et e2e) pour les parcours principaux.

---


