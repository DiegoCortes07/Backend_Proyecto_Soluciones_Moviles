# 🎧 Tunesly — Backend (API REST)

API REST del proyecto **Soluciones Móviles**: un clon de Spotify (apodado *Tunesly* en el correo de verificación) para **música y podcasts**, consumido por una aplicación móvil hecha en React Native / Expo.

- 🎵 Catálogo de **canciones, álbumes, artistas y podcasts**
- 👤 Registro/login con **JWT** y verificación de correo
- ❤️ **"Me gusta"** (favoritos) por usuario
- 📂 **Playlists** por usuario (crear, editar, portada, agregar/quitar canciones)
- ⚙️ **Configuración de usuario** (tema, idioma, contenido explícito, plan)
- ☁️ **Cloudinary** para audio e imágenes
- 🗄️ **SQLite + Sequelize** con migraciones y seeders

> 📱 La aplicación cliente vive en el repositorio hermano **`Frontend_Proyecto_Soluciones_Moviles`**.

---

## 📑 Tabla de contenido

1. [Stack tecnológico](#-stack-tecnológico)
2. [Arquitectura y estructura](#-arquitectura-y-estructura)
3. [Modelo de datos](#-modelo-de-datos)
4. [Referencia de la API](#-referencia-de-la-api)
5. [Autenticación](#-autenticación)
6. [Variables de entorno](#-variables-de-entorno)
7. [Puesta en marcha](#-puesta-en-marcha)
8. [Datos de prueba (seeders)](#-datos-de-prueba-seeders)
9. [Notas y limitaciones conocidas](#-notas-y-limitaciones-conocidas)
10. [Autores](#-autores)

---

## 🛠 Stack tecnológico

| Área | Tecnología |
| --- | --- |
| Runtime | Node.js (ES Modules, `"type": "module"`) |
| Framework HTTP | Express `5` |
| ORM | Sequelize `6` + `sequelize-cli` |
| Base de datos | SQLite `3` (archivo local) |
| Autenticación | `jsonwebtoken` (JWT, expiración 7 días) |
| Hash de contraseñas | `bcryptjs` |
| Subida de archivos | `express-fileupload`, `multer` |
| Almacenamiento de media | `cloudinary` |
| Correo | `nodemailer` (SMTP de Gmail) |
| Utilidades | `cors`, `morgan` (dev), `dotenv`, `randomstring` |

---

## 🏗 Arquitectura y estructura

Arquitectura **MVC en capas** (routes → controllers → models), con una capa de configuración para infraestructura.

```
Backend_Proyecto_Soluciones_Moviles/
├── src/
│   ├── app.js                     # Punto de entrada: instancia y arranca el servidor
│   ├── server.js                  # Clase Server: DB, middlewares, rutas, seeders
│   ├── config/
│   │   ├── database.js            # Instancia de Sequelize (SQLite)
│   │   ├── config.js              # Config para sequelize-cli
│   │   └── cloudinary.js          # uploadMusicFile / uploadImageFile / uploadCoverFile / deleteFile
│   ├── controllers/               # Lógica de cada recurso
│   │   ├── userController.js      # auth, perfil, likes, configuración
│   │   ├── songController.js
│   │   ├── albumController.js
│   │   ├── artistController.js
│   │   ├── playlistController.js
│   │   └── podcastController.js
│   ├── models/                    # Modelos Sequelize
│   │   ├── index.js               # Autocarga los modelos y ejecuta sus asociaciones
│   │   ├── user.js  artist.js  album.js  song.js
│   │   └── like.js  playlist.js  playlistsong.js
│   ├── routes/
│   │   ├── api.js                 # Router raíz, monta todos los sub-routers bajo /api
│   │   └── api/                   # Un archivo de rutas por recurso
│   ├── database/
│   │   ├── migrations/            # 7 migraciones (esquema)
│   │   ├── seeders/               # artist, album, song, user (datos de ejemplo)
│   │   └── database.sqlite        # Archivo de base de datos
│   ├── mail/
│   │   ├── mailsystem.js          # Transporter de Nodemailer + enviarCorreo()
│   │   └── template/confirmMail.html
│   └── tmp/                       # Archivos temporales de express-fileupload
├── Archivos http/                 # Peticiones de ejemplo (REST Client de VS Code)
│   ├── user.http  song.http  album.http
│   └── artist.http  playlist.http  podcast.http
├── Modelo Relacional Clon Spotify-2025-11-02-160231.png   # Diagrama del modelo relacional
├── .env.example
├── .sequelizerc                   # Rutas de config/models/migrations/seeders
└── package.json
```

### Flujo de arranque

`src/app.js` → `new Server()`:

1. **`connectDB()`** — `sequelize.authenticate()` y luego `sequelize.sync({ alter: false })` (crea las tablas si no existen, a partir de los modelos).
2. **`middlewares()`** — `morgan("dev")`, `cors()`, `express-fileupload` (temp files en `./src/tmp`), `express.json()`, `express.urlencoded()`.
3. **`routes()`** — monta el router principal en `/api`.
4. **`seeders()`** — ejecuta los seeders de artist, album, song y user en cada arranque (cada seeder se autosalta si su tabla ya tiene datos).
5. **`listen()`** — escucha en `0.0.0.0:PORT`.

---

## 🗄 Modelo de datos

Nombres de tabla tal como los define cada modelo (`tableName`). El diagrama completo está en
`Modelo Relacional Clon Spotify-2025-11-02-160231.png`.

| Tabla | Campos principales | Notas |
| --- | --- | --- |
| **`user`** | `id`, `username`, `alias`, `email` (único), `password`, `enabled`, `plan` (`free`), `profilePhoto`, `language` (`es`), `theme` (`light`), `explicitContent` | `enabled` parte en `false` hasta verificar el correo |
| **`artist`** | `id`, `name`, `description`, `image` | `timestamps: false` |
| **`album`** | `id`, `title`, `year`, `image`, `genre`, `artistName`, `isPodcast`, `artistId` | Un álbum marcado `isPodcast: true` funciona como *show* de podcast |
| **`song`** | `id`, `title`, `cloudinaryPublicId`, `cloudinarySecureUrl`, `explicit`, `enabled`, `year`, `artistName`, `imageUrl`, `isPodcast`, `albumId`, `artistId` | La misma tabla almacena canciones y episodios de podcast (`isPodcast`) |
| **`like`** | `id`, `userId`, `songId`, `enabled` | `enabled` se alterna para "des-likear" sin borrar la fila |
| **`playlist`** | `id`, `name`, `description`, `image_url`, `userId` | |
| **`PlaylistSong`** | `id`, `playlistId`, `songId`, `enabled` | Tabla intermedia N:M |

### Relaciones

```
user      1 ──< playlist           user      1 ──< like >── 1 song
artist    1 ──< album              artist    1 ──< song
album     1 ──< song               playlist  1 ──< PlaylistSong >── 1 song
album     1 ──< song (isPodcast = show de podcast)
```

---

## 🔌 Referencia de la API

Base URL: `http://<host>:<PORT>/api`

### 👤 Usuarios — `/api/users`

| Método | Ruta | Auth | Body / Form | Descripción |
| --- | --- | --- | --- | --- |
| `POST` | `/register` | — | `{ username, email, password }` | Crea usuario y envía correo de verificación |
| `POST` | `/login` | — | `{ email, password }` | Devuelve `{ user: { id, username, email, token } }` |
| `POST` | `/verifmail` | — | `{ token }` | Verifica correo (`enabled = true`) o confirma cambio de email |
| `GET` | `/all` | — | — | Lista de usuarios (sin `password`) |
| `GET` | `/me` | ✅ | — | Perfil del usuario autenticado |
| `GET` | `/liked-songs` | ✅ | — | Canciones favoritas (`204` si no hay) |
| `POST` | `/like-song/:songId` | ✅ | — | Agrega o alterna el "me gusta" |
| `PUT` | `/change-config` | — | `{ userId, configUpdates: { language?, theme?, explicitContent?, plan? } }` | Cambia preferencias |
| `PUT` | `/change-password` | ✅ | `{ newPassword }` | Cambia contraseña |
| `PUT` | `/change-userdata` | ✅ | `{ newUsername?, newEmail? }` | Cambia nombre/correo |
| `PUT` | `/change-image` | ✅ | `multipart` campo `file` | Sube foto de perfil a Cloudinary |

### 🎵 Canciones — `/api/songs`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Canciones habilitadas y no-podcast |
| `GET` | `/:id` | Canción por ID |
| `GET` | `/artist/:artistId` | Canciones de un artista |

> `POST /songs/upload` existe en el controlador (`uploadSong`, sube el audio a Cloudinary) pero está **comentado** en el router.

### 💿 Álbumes — `/api/albums`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Álbumes no-podcast |
| `GET` | `/:albumId` | Álbum por ID |
| `GET` | `/:albumId/songs` | Canciones del álbum (`include: 'songs'`) |
| `POST` | `/:artistId` | Crea un álbum para un artista (acepta `multipart` con campo `image`) |

### 🎤 Artistas — `/api/artists`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Todos los artistas |
| `GET` | `/:artistId` | Artista por ID |
| `GET` | `/:artistId/songs` | Canciones del artista |
| `GET` | `/:artistId/albums` | Álbumes del artista |
| `POST` | `/` | Crea artista (`{ name, genre, description }`) |

### 📂 Playlists — `/api/playlists`

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `GET` | `/` | ✅ | Playlists del usuario autenticado |
| `POST` | `/` | ✅ | Crea playlist (`{ name, description, image_url? }`) |
| `PUT` | `/:playlistId` | ✅ | Edita nombre/descripción |
| `DELETE` | `/:playlistId` | ✅ | Elimina la playlist |
| `GET` | `/:playlistId/songs` | — | Canciones de la playlist |
| `POST` | `/:playlistId/songs` | ✅ | Agrega canción (`{ songId }`, `409` si ya está) |
| `DELETE` | `/:playlistId/songs/:songId` | ✅ | Quita canción |
| `POST` | `/:playlistId/image` | ✅ | Sube portada (`multipart`, campo `image`) |

Las operaciones de escritura validan que la playlist pertenezca al usuario (`403` en caso contrario).

### 🎙 Podcasts — `/api/podcasts`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Shows (registros de `album` con `isPodcast: true`) |
| `GET` | `/getAllShows` | Episodios (registros de `song` con `isPodcast: true`) |
| `GET` | `/getShowsForPodcastId/:podcastId` | Episodios de un show |

En la carpeta **`Archivos http/`** hay peticiones listas para importar en VS Code (extensión *REST Client*) que cubren todos estos endpoints.

---

## 🔐 Autenticación

- Al hacer login se firma un **JWT** con `{ id: userId }` y expiración de **7 días** (`generateToken`).
- Los endpoints protegidos esperan el header:

  ```
  Authorization: Bearer <token>
  ```

- El token se verifica **dentro de cada controlador** con `jwt.verify(token, process.env.JWT_SECRET)`; **no hay middleware de autenticación** reutilizable.
- La verificación de correo usa un segundo token (`generateEmailToken`, expiración 40 min) que codifica `email||userId` y se envía por correo con una plantilla HTML (`src/mail/template/confirmMail.html`).

---

## ⚙️ Variables de entorno

Crea un archivo **`.env`** en la raíz a partir de `.env.example`:

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (por defecto `3000`) |
| `JWT_SECRET` | Clave para firmar/verificar los JWT |
| `API_URL` | URL del frontend usada al construir el enlace de verificación de correo |
| `MAIL_USER` / `MAIL_PASS` | Credenciales SMTP de Gmail (`MAIL_PASS` = *app password*) |
| `CLOUDINARY_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Credenciales de Cloudinary |

> ⚠️ El transporte de correo usa Gmail con `host: smtp.gmail.com`, `port: 465`, `secure: true`. Gmail requiere una **contraseña de aplicación**, no la del usuario.

---

## 🚀 Puesta en marcha

### Requisitos

- Node.js `18+`
- npm

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de entorno
cp .env.example .env      # y completar los valores

# 3. Levantar en modo desarrollo (nodemon)
npm run dev
```

El servidor imprime en consola la conexión a la base de datos, la sincronización de modelos y el puerto. Con `PORT=8080` la API queda en `http://localhost:8080/api`.

### Scripts disponibles

| Script | Acción |
| --- | --- |
| `npm run dev` | Inicia el servidor con `nodemon` |
| `npm run db:migrate:up` | Ejecuta las migraciones (`sequelize-cli db:migrate`) |
| `npm run db:migrate:down` | Revierte la última migración |

> El proyecto **también** crea el esquema con `sequelize.sync()` al arrancar, así que en la práctica puedes levantar el servidor sin correr migraciones.

### Probar la API

Usa los archivos de `Archivos http/` con la extensión REST Client, o cualquier cliente HTTP. Ejemplo:

```http
POST http://localhost:8080/api/users/login
Content-Type: application/json

{ "email": "diego@test.com", "password": "password123" }
```

---

## 🌱 Datos de prueba (seeders)

Los seeders se ejecutan automáticamente al arrancar y **solo insertan si la tabla está vacía**:

| Tabla | Contenido de ejemplo |
| --- | --- |
| `artist` / `album` / `song` | The Beatles, Bad Bunny, Myke Towers, Billie Eilish, Linkin Park, Eladio Carrión + un show de podcast, con audio e imágenes reales alojadas en Cloudinary |
| `user` | `diego@test.com` / `password123` y `cristian@test.com` / `password123` (contraseñas hasheadas, `enabled: true`) |

Estas credenciales son **solo para desarrollo local**.

---

## 📝 Notas y limitaciones conocidas

Puntos reales del código que conviene revisar si se retoma el proyecto:

- **Sin middleware de autenticación**: cada controlador repite el `jwt.verify` y el manejo del header `Authorization`.
- **Sin capa de validación**: `express-validator` está en `package.json` pero no se usa; las validaciones son manuales.
- **Tabla `like`**: `like` es palabra reservada en SQL; conviene renombrarla (p. ej. `likes`).
- **Asociaciones inconsistentes**: casi todos los modelos exponen `associate()`, pero `like.js` define `associations` (nunca se ejecuta) y `album.js` **sobrescribe** `Artist.associate`, por lo que algunas asociaciones/`include` pueden no registrarse según el orden de carga de los modelos. Unificar en un único `associate()` por modelo.
- **Import sensible a mayúsculas**: `playlistController.js` importa `../models/playlistSong.js` pero el archivo es `playlistsong.js`. En Windows/macOS funciona, **en Linux falla** (relevante para Docker/CI/deploy).
- **Doble fuente de esquema**: conviven `migrations/` y `sequelize.sync()`, con diferencias (p. ej. `song.genre` y `user.createdAt/updatedAt` existen en las migraciones pero no en los modelos). Elige una sola estrategia.
- **`sequelize.sync()` en cada arranque** y **seeders automáticos**: cómodo en desarrollo, no recomendable en producción.
- **Errores**: varias respuestas devuelven texto plano (`res.send("...")`) en vez de JSON consistente; hay `console.log` de depuración (p. ej. el objeto `Song` completo en `getAllSongs`).
- **`albumController.createAlbumForArtist`** sube la imagen con `uploadImageFile(req.files.image)` (buffer de `express-fileupload`), mientras el resto usa `multer`; conviene unificar.
- **SQLite**: no soporta bien concurrencia de escritura; para producción habría que migrar a PostgreSQL/MySQL.

---

## 👥 Autores

Proyecto académico del curso **Soluciones Móviles** (Universidad Católica del Norte).

- **Diego Cortés** — [@DiegoCortes07](https://github.com/DiegoCortes07)
- **Cristian Jiménez** — [@CrisPalaUnion](https://github.com/CrisPalaUnion)
