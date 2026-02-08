# SpotifaPepe (Music Playlist Website)

## Live Links
- Backend API: https://spotifapepe.onrender.com
- Health check: https://spotifapepe.onrender.com/health
- Frontend: https://mellow-platypus-9a9a7d.netlify.app/login.html

## Features
- JWT Authentication (register/login)
- Catalog: artists, albums, songs (stored in MongoDB)
- Playlists (private, per-user CRUD)
- External API: iTunes Search (enrich song/album with cover + preview)

## Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT + bcrypt
- Joi validation
- Frontend: HTML/CSS/JS

## Environment Variables (Backend)
```env
PORT=5000
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/musicDB?retryWrites=true&w=majority
JWT_SECRET=your_long_secret
CLIENT_ORIGIN=http://localhost:5500
NODE_ENV=development

## Screenshots (API Verification)
### Register
![Register](/screenshots/screen1.jpg)

### Login
![Login](/screenshots/screen2.jpg)

### Protected /me
![Me](/screenshots/screen3.jpg)