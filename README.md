<div align="center">

# вљЎ JVCMS вЂ” Lightweight Schema-Driven Headless CMS

**A minimal, self-hosted headless CMS that reads your data structure from a single JSON file and automatically generates a full admin panel.**

Built with **Java (Spring Boot)** В· **Next.js (React)** В· **PostgreSQL**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## рџ“– Table of Contents

- [What Is This?](#-what-is-this)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Configuration (`cms.config.json`)](#-configuration-cmsconfigjson)
- [Integrating With Your Website](#-integrating-with-your-website)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [рџ‡·рџ‡є Р”РѕРєСѓРјРµРЅС‚Р°С†РёСЏ РЅР° СЂСѓСЃСЃРєРѕРј](#-РґРѕРєСѓРјРµРЅС‚Р°С†РёСЏ-РЅР°-СЂСѓСЃСЃРєРѕРј)

---

## рџ’Ў What Is This?

JVCMS is a **headless CMS** вЂ” it stores and manages your website's content (text, images, lists), but it does **not** generate the website itself. Instead, your website fetches content from the CMS via a simple REST API.

The key difference from traditional CMS platforms (WordPress, Strapi, etc.) is that JVCMS is **extremely lightweight and schema-driven**:

1. You create a single file (`cms.config.json`) that describes your data models.
2. JVCMS reads that file and **automatically generates** the entire admin panel UI вЂ” input fields, image uploaders, array editors вЂ” without writing any admin code.
3. Your website makes simple `GET` requests to retrieve the content as JSON.

**This means:** one CMS backend serves any number of websites. Just swap out the `cms.config.json` file with a new schema, and the admin panel adapts instantly.

### вњЌпёЏ Inline Editing Support
Because JVCMS is strictly API-driven, you don't even have to use the built-in admin panel to edit content! You can build **inline editing** directly into your client's website. The client simply clicks on a text block on their live website, types new text, and your frontend sends a `PUT` request to the JVCMS REST API to save it. JVCMS acts purely as a secure, fast data storage and image optimization middleman.

---

## вњЁ Key Features

| Feature | Description |
|---|---|
| **Schema-Driven UI** | Define models in `cms.config.json` в†’ admin panel is generated automatically. No code changes needed. |
| **Headless Architecture** | Content is delivered via REST API. Use it with React, Vue, iOS, Android вЂ” any frontend. |
| **WebP Image Compression** | Uploaded JPEG/PNG images are automatically converted to WebP on the backend, reducing file size. |
| **Multi-Language Admin** | The admin panel supports English and Russian out of the box, switchable in real time. |
| **Role-Based Access** | Two roles: **ADMIN** (full control, user management) and **CLIENT** (content editing only). |
| **JWT Authentication** | Secure, stateless authentication. The first login creates the admin account automatically. |
| **Docker-First Deployment** | A single `docker-compose up` launches the entire stack (DB + Backend + Frontend). |
| **Auto-Initialization** | No manual database setup. On first launch, create your admin account directly from the login screen. |

---

## рџЏ— Architecture

```
в”Њв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”ђ
в”‚                    Your Website                          в”‚
в”‚              (React, Vue, plain HTML, etc.)               в”‚
в”‚                                                          в”‚
в”‚   fetch("http://your-server:8080/api/v1/content/menu")   в”‚
в”‚   fetch("http://your-server:8080/uploads/pizza.webp")    в”‚
в””в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”¬в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”
                          в”‚  REST API (JSON)
                          в–ј
в”Њв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”ђ
в”‚               JVCMS Backend (Spring Boot)                в”‚
в”‚                                                          в”‚
в”‚  вЂў /api/v1/content/{id}  вЂ” CRUD for content (JSON)       в”‚
в”‚  вЂў /api/v1/auth/*        вЂ” Login, register, users        в”‚
в”‚  вЂў /api/v1/media/*       вЂ” Upload & manage images        в”‚
в”‚  вЂў /uploads/*            вЂ” Static file serving (WebP)    в”‚
в”‚                                                          в”‚
в”‚              PostgreSQL  в†ђв”Ђв”Ђ  Data storage (JSONB)        в”‚
в””в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”
                          в–І
                          в”‚  Internal API
в”Њв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”ђ
в”‚             JVCMS Admin Panel (Next.js)                  в”‚
в”‚                                                          в”‚
в”‚  вЂў Reads cms.config.json в†’ generates UI dynamically      в”‚
в”‚  вЂў Content editing, media library, user management       в”‚
в”‚  вЂў i18n: English / Russian                               в”‚
в””в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”
```

---

## рџљЂ Quick Start

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.

> **Note:** The default port mapping is `8080` (backend) and `3000` (admin panel) on your host machine. These can be changed in `docker-compose.yml` if those ports are already in use. Inside the containers, the services run independently.

### Launch

```bash
# Clone the repository
git clone https://github.com/Lightoton/jvcms.git
cd jvcms

# Start everything
docker-compose up -d --build
```

This starts three containers:
| Container | Description | Default Host Port |
|---|---|---|
| `jvcms-postgres` | PostgreSQL 15 database | `5433` |
| `jvcms-backend` | Spring Boot API server | `8080` |
| `jvcms-frontend` | Next.js admin panel | `3000` |

### First Login

1. Open `http://localhost:3000` in your browser.
2. Since the database is empty, the system will display a **registration form**.
3. Enter your email and password вЂ” this creates the **first ADMIN** account.
4. You are now logged in and can start managing content.

> After the first admin is created, the registration form is disabled. All future accounts must be created by the admin through the Users tab.

---

## вљ™ Configuration (`cms.config.json`)

This is the heart of the system. Place this file in `frontend/cms.config.json`. It defines what content models the admin panel will display and what fields each model has.

### Schema Structure

```json
{
  "models": [
    {
      "id": "unique_model_id",
      "label_ru": "РќР°Р·РІР°РЅРёРµ РЅР° СЂСѓСЃСЃРєРѕРј",
      "label_en": "English Label",
      "fields": [
        { "name": "fieldName", "label_ru": "...", "label_en": "...", "type": "text" },
        { "name": "fieldName", "label_ru": "...", "label_en": "...", "type": "number" },
        { "name": "fieldName", "label_ru": "...", "label_en": "...", "type": "image" },
        {
          "name": "fieldName",
          "label_ru": "...",
          "label_en": "...",
          "type": "array",
          "itemFields": [
            { "name": "subField", "label_ru": "...", "label_en": "...", "type": "text" }
          ]
        }
      ]
    }
  ]
}
```

### Supported Field Types

| Type | Description | Admin UI Element |
|---|---|---|
| `text` | Single-line text value | Text input |
| `number` | Numeric value | Number input |
| `image` | Image URL (with upload support) | File upload + preview |
| `array` | A list of repeating items, each with its own fields | Dynamic card list with add/delete |

### Example: Restaurant Website

```json
{
  "models": [
    {
      "id": "menu",
      "label_ru": "РњРµРЅСЋ",
      "label_en": "Menu",
      "fields": [
        {
          "name": "pizzas",
          "label_ru": "РџРёС†С†С‹",
          "label_en": "Pizzas",
          "type": "array",
          "itemFields": [
            { "name": "name", "label_ru": "РќР°Р·РІР°РЅРёРµ", "label_en": "Name", "type": "text" },
            { "name": "price", "label_ru": "Р¦РµРЅР°", "label_en": "Price", "type": "text" },
            { "name": "image", "label_ru": "Р¤РѕС‚Рѕ", "label_en": "Photo", "type": "image" }
          ]
        }
      ]
    },
    {
      "id": "hero",
      "label_ru": "Р“Р»Р°РІРЅС‹Р№ СЌРєСЂР°РЅ",
      "label_en": "Hero Section",
      "fields": [
        { "name": "title", "label_ru": "Р—Р°РіРѕР»РѕРІРѕРє", "label_en": "Title", "type": "text" },
        { "name": "backgroundImage", "label_ru": "Р¤РѕРЅ", "label_en": "Background", "type": "image" }
      ]
    }
  ]
}
```

After defining this config and rebuilding the frontend container, the admin panel will immediately show tabs for "Menu" and "Hero Section" with all the corresponding fields.

---

## рџ”— Integrating With Your Website

JVCMS is **headless**, which means your website fetches content from the CMS API at runtime (or at build time for static sites). Here is what that integration looks like in practice:

### What You Need To Do

1. **Define the schema.** Create `cms.config.json` that matches the content structure of your website (hero section, menu items, footer contacts, etc.).

2. **Replace hardcoded data with API calls.** Wherever your website currently has hardcoded text, image paths, or lists of items, replace them with `fetch()` calls to the CMS backend. For example:
   ```js
   // Before (hardcoded)
   const pizzas = [
     { name: "Margherita", price: "9.50в‚¬", image: "/img/margherita.jpg" },
     // ...
   ];

   // After (fetched from CMS)
   const res = await fetch("http://your-server:8080/api/v1/content/menu");
   const data = await res.json();
   const pizzas = data.pizzas;
   ```

3. **Point image URLs to the CMS backend.** All images uploaded through the admin panel are served at `http://your-server:8080/uploads/filename.webp`. Update your `<img>` tags accordingly.

4. **Fill in content via the admin panel.** Open the admin panel at `http://your-server:3000`, log in, and populate all the fields defined in your schema.

### Key Points

- Your website's **design, layout, and HTML/CSS stay exactly the same**. Only the data source changes вЂ” from hardcoded values to API responses.
- The `GET /api/v1/content/{schemaId}` endpoint is **public** (no authentication required), so your website can call it directly from the browser or during server-side rendering.
- For **static site generators** (Astro, Hugo, Gatsby), you would call the API at build time and generate static HTML pages with the fetched content.

### рџ¤– Building a Frontend with AI Agents

If you are using an AI coding assistant (like GitHub Copilot, Cursor, or ChatGPT) to build the public-facing website for this CMS, you can copy and paste the following prompt to give the AI the exact context it needs to integrate with JVCMS flawlessly.

**Prompt for AI Agent:**
> "I want you to build a frontend website for me. I am using JVCMS, a headless schema-driven CMS.
> 
> **Important Rules:**
> 1. DO NOT build a backend, database, or admin panel. The CMS backend (Spring Boot) and Admin Panel (Next.js) already exist and are fully functional. Do not modify them.
> 2. Your task is ONLY to build the public-facing frontend and fetch data from the existing CMS REST API.
> 
> **How JVCMS works:**
> - The data schema is defined in `cms.config.json`. Read this file to understand the content structure.
> - To fetch content for a specific model (e.g., `hero` or `menu`), make a `GET` request to `http://localhost:8080/api/v1/content/{schemaId}`. The API requires no authentication and returns a JSON object containing the fields defined in the schema.
> - Image fields in the API response contain the relative path to the image (e.g., `/uploads/filename.webp`). You must prefix this path with the backend URL (e.g., `http://localhost:8080/uploads/filename.webp`) to display images on the frontend.
> 
> Please read the `cms.config.json` file first to understand the data models we have available, and then proceed to build the website layout and integrate the API calls."

---

## рџ“Ў API Reference

### Content

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/content/{schemaId}` | No | Get content for a model |
| `PUT` | `/api/v1/content/{schemaId}` | Yes | Update content for a model |
| `GET` | `/api/v1/content` | Yes | List all schema identifiers |
| `DELETE` | `/api/v1/content/{schemaId}` | Yes | Delete content for a model |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | No | Login (returns JWT) |
| `POST` | `/api/v1/auth/init` | No | Create first admin (one-time) |
| `POST` | `/api/v1/auth/create-client` | Yes | Create a CLIENT user |
| `GET` | `/api/v1/auth/users` | Yes | List all users |
| `DELETE` | `/api/v1/auth/users/{email}` | Yes | Delete a CLIENT user |
| `PUT` | `/api/v1/auth/users/{email}/password` | Yes | Change user's password |

### Media

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/media/upload?imageKey=name` | Yes | Upload an image (auto WebP) |
| `GET` | `/api/v1/media` | Yes | List all uploaded files |
| `DELETE` | `/api/v1/media/{filename}` | Yes | Delete a media file |
| `GET` | `/uploads/{filename}` | No | Serve a static file (image) |

### Example: Fetch Menu Content

```bash
curl http://localhost:8080/api/v1/content/menu
```

Response:
```json
{
  "pizzas": [
    {
      "name": "Margherita",
      "price": "9.50в‚¬",
      "description": "Classic Italian pizza",
      "image": "/uploads/margherita.webp"
    }
  ],
  "getraenke": [ ... ],
  "desserts": [ ... ]
}
```

---

## рџ”ђ Environment Variables

All variables are defined in the `.env` file in the project root.

> **CRITICAL:** `DB_PASSWORD` and `JWT_SECRET` do not have default values in Docker Compose. The system will fail to start if they are omitted.

| Variable | Default | Description |
|---|---|---|
| `DB_USER` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | **(REQUIRED)** | PostgreSQL password |
| `DB_NAME` | `jvcms_db` | Database name |
| `CMS_SETUP_TOKEN` | *(optional)* | Security token required to create the first admin user |
| `JWT_SECRET` | **(REQUIRED)** | JWT signing key. Must be a Base64 string at least 32 bytes long. Generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | Backend URL as seen by the browser |
| `INTERNAL_API_URL` | `http://backend:8080/api/v1` | Backend URL for server-side rendering (internal Docker network) |
| `ALLOWED_DOMAINS` | `localhost,127.0.0.1` | **Security (CSRF):** Comma-separated domains where the CMS runs (e.g. `my-domain.com`). Prevents proxy-based host spoofing. |

> **Note:** Copy the `.env.example` file to `.env` and configure your environment variables before launching the system.

---

## рџ“Ѓ Project Structure

```
CMS/
в”њв”Ђв”Ђ docker-compose.yml              # Orchestrates all services
в”њв”Ђв”Ђ README.md
в”‚
в”њв”Ђв”Ђ backend/jvcms/                  # Spring Boot application
в”‚   в”њв”Ђв”Ђ Dockerfile
в”‚   в”њв”Ђв”Ђ pom.xml
в”‚   в””в”Ђв”Ђ src/main/java/.../
в”‚       в”њв”Ђв”Ђ config/                 # Security, CORS, exception handling
в”‚       в”њв”Ђв”Ђ controller/             # REST endpoints
в”‚       в”њв”Ђв”Ђ dto/                    # Request/response objects
в”‚       в”њв”Ђв”Ђ entity/                 # JPA entities (User, ContentItem)
в”‚       в”њв”Ђв”Ђ repository/             # Spring Data JPA repositories
в”‚       в”њв”Ђв”Ђ security/               # JWT filter
в”‚       в””в”Ђв”Ђ service/                # Business logic
в”‚
в””в”Ђв”Ђ frontend/                       # Next.js admin panel
    в”њв”Ђв”Ђ Dockerfile
    в”њв”Ђв”Ђ cms.config.json             # в†ђ YOUR DATA SCHEMA
    в”њв”Ђв”Ђ components/                 # UI components (ContentManager, MediaLibrary, etc.)
    в”њв”Ђв”Ђ features/                   # Server actions (auth, content, media, users)
    в””в”Ђв”Ђ shared/
        в”њв”Ђв”Ђ api/                    # API fetcher
        в””в”Ђв”Ђ i18n/                   # Translations (ru.ts, en.ts)
```

---

---

<a name="-РґРѕРєСѓРјРµРЅС‚Р°С†РёСЏ-РЅР°-СЂСѓСЃСЃРєРѕРј"></a>
## рџ‡·рџ‡є Р”РѕРєСѓРјРµРЅС‚Р°С†РёСЏ РЅР° СЂСѓСЃСЃРєРѕРј

### Р§С‚Рѕ СЌС‚Рѕ С‚Р°РєРѕРµ?

JVCMS вЂ” СЌС‚Рѕ **Р»РµРіРєРѕРІРµСЃРЅР°СЏ headless CMS**, РєРѕС‚РѕСЂР°СЏ СѓРїСЂР°РІР»СЏРµС‚СЃСЏ РѕРґРЅРёРј JSON-С„Р°Р№Р»РѕРј РєРѕРЅС„РёРіСѓСЂР°С†РёРё. Р’С‹ РѕРїРёСЃС‹РІР°РµС‚Рµ СЃС‚СЂСѓРєС‚СѓСЂСѓ РґР°РЅРЅС‹С… РІР°С€РµРіРѕ СЃР°Р№С‚Р° (РЅР°РїСЂРёРјРµСЂ, РјРµРЅСЋ СЂРµСЃС‚РѕСЂР°РЅР°, Р±Р»РѕРє В«Рћ РЅР°СЃВ», РєРѕРЅС‚Р°РєС‚С‹ РІ С„СѓС‚РµСЂРµ) РІ С„Р°Р№Р»Рµ `cms.config.json`, Рё СЃРёСЃС‚РµРјР° **Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё РіРµРЅРµСЂРёСЂСѓРµС‚** РїР°РЅРµР»СЊ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР° СЃ РЅСѓР¶РЅС‹РјРё РїРѕР»СЏРјРё РІРІРѕРґР°, Р·Р°РіСЂСѓР·РєРѕР№ РєР°СЂС‚РёРЅРѕРє Рё РґРёРЅР°РјРёС‡РµСЃРєРёРјРё СЃРїРёСЃРєР°РјРё.

Р’Р°С€ СЃР°Р№С‚ РїРѕР»СѓС‡Р°РµС‚ РґР°РЅРЅС‹Рµ С‡РµСЂРµР· РїСЂРѕСЃС‚С‹Рµ HTTP-Р·Р°РїСЂРѕСЃС‹ Рє REST API.

### РљР°Рє Р·Р°РїСѓСЃС‚РёС‚СЊ

**РўСЂРµР±РѕРІР°РЅРёСЏ:** Docker Рё Docker Compose.

```bash
git clone https://github.com/Lightoton/jvcms.git
cd jvcms
docker-compose up -d --build
```

> РџРѕ СѓРјРѕР»С‡Р°РЅРёСЋ Р±СЌРєРµРЅРґ РґРѕСЃС‚СѓРїРµРЅ РЅР° РїРѕСЂС‚Сѓ `8080`, Р° Р°РґРјРёРЅРєР° вЂ” РЅР° РїРѕСЂС‚Сѓ `3000`. РџРѕСЂС‚С‹ РјРѕР¶РЅРѕ РёР·РјРµРЅРёС‚СЊ РІ С„Р°Р№Р»Рµ `docker-compose.yml`.

РћС‚РєСЂРѕР№С‚Рµ `http://localhost:3000`. РџСЂРё РїРµСЂРІРѕРј Р·Р°РїСѓСЃРєРµ СЃРёСЃС‚РµРјР° РїСЂРµРґР»РѕР¶РёС‚ СЃРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°. РџРѕСЃР»Рµ СЌС‚РѕРіРѕ РІС‹ РјРѕР¶РµС‚Рµ РЅР°РїРѕР»РЅСЏС‚СЊ РєРѕРЅС‚РµРЅС‚.

### РљР°Рє РїРѕРґРєР»СЋС‡РёС‚СЊ Рє СЃРІРѕРµРјСѓ СЃР°Р№С‚Сѓ

1. РЎРѕР·РґР°Р№С‚Рµ С„Р°Р№Р» `cms.config.json`, РѕРїРёСЃС‹РІР°СЋС‰РёР№ СЃС‚СЂСѓРєС‚СѓСЂСѓ РґР°РЅРЅС‹С… РІР°С€РµРіРѕ СЃР°Р№С‚Р°.
2. Р’ РєРѕРґРµ РІР°С€РµРіРѕ СЃР°Р№С‚Р° Р·Р°РјРµРЅРёС‚Рµ Р·Р°С…Р°СЂРґРєРѕР¶РµРЅРЅС‹Рµ РґР°РЅРЅС‹Рµ (С‚РµРєСЃС‚С‹, РєР°СЂС‚РёРЅРєРё, СЃРїРёСЃРєРё С‚РѕРІР°СЂРѕРІ) РЅР° РІС‹Р·РѕРІС‹ API:
   ```js
   const res = await fetch("http://your-server:8080/api/v1/content/menu");
   const data = await res.json();
   ```
3. РР·РѕР±СЂР°Р¶РµРЅРёСЏ, Р·Р°РіСЂСѓР¶РµРЅРЅС‹Рµ С‡РµСЂРµР· Р°РґРјРёРЅРєСѓ, РґРѕСЃС‚СѓРїРЅС‹ РїРѕ Р°РґСЂРµСЃСѓ `http://your-server:8080/uploads/filename.webp`.

Р”РёР·Р°Р№РЅ Рё РІРµСЂСЃС‚РєР° РІР°С€РµРіРѕ СЃР°Р№С‚Р° **РЅРµ РјРµРЅСЏСЋС‚СЃСЏ** вЂ” РјРµРЅСЏРµС‚СЃСЏ С‚РѕР»СЊРєРѕ РёСЃС‚РѕС‡РЅРёРє РґР°РЅРЅС‹С…. Р’РјРµСЃС‚Рѕ Р·Р°С…Р°СЂРґРєРѕР¶РµРЅРЅС‹С… Р·РЅР°С‡РµРЅРёР№ РІР°С€ СЃР°Р№С‚ Р±РµСЂРµС‚ РёС… РёР· CMS.

### рџ¤– Р Р°Р·СЂР°Р±РѕС‚РєР° С„СЂРѕРЅС‚РµРЅРґР° СЃ РїРѕРјРѕС‰СЊСЋ AI Р°РіРµРЅС‚РѕРІ

Р•СЃР»Рё РІС‹ РёСЃРїРѕР»СЊР·СѓРµС‚Рµ AI-Р°СЃСЃРёСЃС‚РµРЅС‚Р° (РЅР°РїСЂРёРјРµСЂ, GitHub Copilot, Cursor РёР»Рё ChatGPT) РґР»СЏ СЃРѕР·РґР°РЅРёСЏ РєР»РёРµРЅС‚СЃРєРѕРіРѕ СЃР°Р№С‚Р° РїРѕРґ СЌС‚Сѓ CMS, РїСЂРѕСЃС‚Рѕ СЃРєРѕРїРёСЂСѓР№С‚Рµ Рё РѕС‚РїСЂР°РІСЊС‚Рµ РµРјСѓ СЌС‚РѕС‚ РїСЂРѕРјРїС‚. Р­С‚Рѕ РґР°СЃС‚ РЅРµР№СЂРѕСЃРµС‚Рё РёРґРµР°Р»СЊРЅС‹Р№ РєРѕРЅС‚РµРєСЃС‚ РґР»СЏ РїСЂР°РІРёР»СЊРЅРѕР№ РёРЅС‚РµРіСЂР°С†РёРё.

**РџСЂРѕРјРїС‚ РґР»СЏ AI-Р°РіРµРЅС‚Р°:**
> "РќР°РїРёС€Рё РґР»СЏ РјРµРЅСЏ РєР»РёРµРЅС‚СЃРєРёР№ С„СЂРѕРЅС‚РµРЅРґ (СЃР°Р№С‚). РЇ РёСЃРїРѕР»СЊР·СѓСЋ JVCMS вЂ” РіРѕС‚РѕРІСѓСЋ headless CMS.
> 
> **РЎС‚СЂРѕРіРёРµ РїСЂР°РІРёР»Р°:**
> 1. РќР• СЃРѕР·РґР°РІР°Р№ Р±СЌРєРµРЅРґ, Р±Р°Р·Сѓ РґР°РЅРЅС‹С… РёР»Рё РїР°РЅРµР»СЊ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°. Р‘СЌРєРµРЅРґ (Spring Boot) Рё Р°РґРјРёРЅРєР° (Next.js) СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓСЋС‚ Рё РїРѕР»РЅРѕСЃС‚СЊСЋ СЂР°Р±РѕС‚Р°СЋС‚. РќРµ РёР·РјРµРЅСЏР№ РёС… РєРѕРґ.
> 2. РўРІРѕСЏ Р·Р°РґР°С‡Р° вЂ” РўРћР›Р¬РљРћ РЅР°РїРёСЃР°С‚СЊ РїСѓР±Р»РёС‡РЅС‹Р№ СЃР°Р№С‚ Рё РЅР°СЃС‚СЂРѕРёС‚СЊ РїРѕР»СѓС‡РµРЅРёРµ РґР°РЅРЅС‹С… РёР· РіРѕС‚РѕРІРѕРіРѕ REST API.
> 
> **РљР°Рє СЂР°Р±РѕС‚Р°РµС‚ JVCMS:**
> - РЎС‚СЂСѓРєС‚СѓСЂР° РґР°РЅРЅС‹С… (СЃС…РµРјР°) РѕРїРёСЃР°РЅР° РІ С„Р°Р№Р»Рµ `cms.config.json`. РџСЂРѕС‡РёС‚Р°Р№ СЌС‚РѕС‚ С„Р°Р№Р», С‡С‚РѕР±С‹ РїРѕРЅСЏС‚СЊ, РєР°РєРёРµ РґР°РЅРЅС‹Рµ РЅР°Рј РґРѕСЃС‚СѓРїРЅС‹.
> - Р§С‚РѕР±С‹ РїРѕР»СѓС‡РёС‚СЊ РєРѕРЅС‚РµРЅС‚ РґР»СЏ РѕРїСЂРµРґРµР»РµРЅРЅРѕР№ РјРѕРґРµР»Рё (РЅР°РїСЂРёРјРµСЂ, `hero` РёР»Рё `menu`), СЃРґРµР»Р°Р№ `GET` Р·Р°РїСЂРѕСЃ РЅР° `http://localhost:8080/api/v1/content/{schemaId}`. API РїСѓР±Р»РёС‡РЅРѕРµ (Р±РµР· Р°РІС‚РѕСЂРёР·Р°С†РёРё) Рё РІРѕР·РІСЂР°С‰Р°РµС‚ JSON-РѕР±СЉРµРєС‚ СЃ РїРѕР»СЏРјРё РёР· СЃС…РµРјС‹.
> - РџРѕР»СЏ СЃ РєР°СЂС‚РёРЅРєР°РјРё (`type: "image"`) РІРѕР·РІСЂР°С‰Р°СЋС‚ РѕС‚РЅРѕСЃРёС‚РµР»СЊРЅС‹Р№ РїСѓС‚СЊ (РЅР°РїСЂРёРјРµСЂ, `/uploads/filename.webp`). Р§С‚РѕР±С‹ РѕС‚РѕР±СЂР°Р·РёС‚СЊ РєР°СЂС‚РёРЅРєСѓ РЅР° СЃР°Р№С‚Рµ, РґРѕР±Р°РІР»СЏР№ Рє СЌС‚РѕРјСѓ РїСѓС‚Рё URL Р±СЌРєРµРЅРґР° (РЅР°РїСЂРёРјРµСЂ, `http://localhost:8080/uploads/filename.webp`).
> 
> Р”Р»СЏ РЅР°С‡Р°Р»Р° РїСЂРѕС‡РёС‚Р°Р№ С„Р°Р№Р» `cms.config.json`, С‡С‚РѕР±С‹ РїРѕРЅСЏС‚СЊ СЃС‚СЂСѓРєС‚СѓСЂСѓ РґР°РЅРЅС‹С…, Р° Р·Р°С‚РµРј РїСЂРёСЃС‚СѓРїР°Р№ Рє РІРµСЂСЃС‚РєРµ СЃР°Р№С‚Р° Рё РёРЅС‚РµРіСЂР°С†РёРё API-Р·Р°РїСЂРѕСЃРѕРІ."

### РљРѕРЅС„РёРіСѓСЂР°С†РёСЏ

Р¤Р°Р№Р» `frontend/cms.config.json` РѕРїСЂРµРґРµР»СЏРµС‚, РєР°РєРёРµ РјРѕРґРµР»Рё Рё РїРѕР»СЏ Р±СѓРґСѓС‚ РѕС‚РѕР±СЂР°Р¶Р°С‚СЊСЃСЏ РІ РїР°РЅРµР»Рё Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°.

РџРѕРґРґРµСЂР¶РёРІР°РµРјС‹Рµ С‚РёРїС‹ РїРѕР»РµР№:
- `text` вЂ” С‚РµРєСЃС‚РѕРІРѕРµ РїРѕР»Рµ
- `number` вЂ” С‡РёСЃР»РѕРІРѕРµ РїРѕР»Рµ
- `image` вЂ” Р·Р°РіСЂСѓР·РєР° РёР·РѕР±СЂР°Р¶РµРЅРёСЏ СЃ РїСЂРµРІСЊСЋ
- `array` вЂ” РґРёРЅР°РјРёС‡РµСЃРєРёР№ СЃРїРёСЃРѕРє СЌР»РµРјРµРЅС‚РѕРІ (РЅР°РїСЂРёРјРµСЂ, РєР°СЂС‚РѕС‡РєРё С‚РѕРІР°СЂРѕРІ)

### РџРµСЂРµРјРµРЅРЅС‹Рµ РѕРєСЂСѓР¶РµРЅРёСЏ

Р’СЃРµ РїРµСЂРµРјРµРЅРЅС‹Рµ РёРјРµСЋС‚ Р·РЅР°С‡РµРЅРёСЏ РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ РґР»СЏ Р»РѕРєР°Р»СЊРЅРѕР№ СЂР°Р·СЂР°Р±РѕС‚РєРё. Р”Р»СЏ РїСЂРѕРґР°РєС€РµРЅР° РїРµСЂРµРѕРїСЂРµРґРµР»РёС‚Рµ РёС… С‡РµСЂРµР· С„Р°Р№Р» `.env`:

| РџРµСЂРµРјРµРЅРЅР°СЏ | РџРѕ СѓРјРѕР»С‡Р°РЅРёСЋ | РћРїРёСЃР°РЅРёРµ |
|---|---|---|
| `DB_USER` | `postgres` | РРјСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ PostgreSQL |
| `DB_PASSWORD` | **(РћР‘РЇР—РђРўР•Р›Р¬РќРћ)** | РџР°СЂРѕР»СЊ PostgreSQL |
| `DB_NAME` | `jvcms_db` | РќР°Р·РІР°РЅРёРµ Р±Р°Р·С‹ РґР°РЅРЅС‹С… |
| `JWT_SECRET` | **(РћР‘РЇР—РђРўР•Р›Р¬РќРћ)** | РЎРµРєСЂРµС‚ РґР»СЏ РїРѕРґРїРёСЃРё JWT (Base64 СЃС‚СЂРѕРєР° РѕС‚ 32 Р±Р°Р№С‚) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | URL Р±СЌРєРµРЅРґР° РґР»СЏ Р±СЂР°СѓР·РµСЂР° |
| `ALLOWED_DOMAINS` | `localhost,127.0.0.1` | **Р‘РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ (CSRF):** Р”РѕРјРµРЅС‹ С‡РµСЂРµР· Р·Р°РїСЏС‚СѓСЋ (РЅР°РїСЂРёРјРµСЂ, `my-domain.com`). Р—Р°С‰РёС‰Р°РµС‚ РѕС‚ РїРѕРґРјРµРЅС‹ Р·Р°РіРѕР»РѕРІРєРѕРІ Р·Р° РїСЂРѕРєСЃРё (Cloudflare/Nginx). |

> **РџСЂРёРјРµС‡Р°РЅРёРµ:** РЎРєРѕРїРёСЂСѓР№С‚Рµ С„Р°Р№Р» `.env.example` РІ `.env` Рё РЅР°СЃС‚СЂРѕР№С‚Рµ РїРµСЂРµРјРµРЅРЅС‹Рµ РѕРєСЂСѓР¶РµРЅРёСЏ РїРµСЂРµРґ Р·Р°РїСѓСЃРєРѕРј СЃРёСЃС‚РµРјС‹.
