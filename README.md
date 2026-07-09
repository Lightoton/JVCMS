<div align="center">

# ⚡ JVCMS — Lightweight Schema-Driven Headless CMS

**A minimal, self-hosted headless CMS that reads your data structure from a single JSON file and automatically generates a full admin panel.**

Built with **Java (Spring Boot)** · **Next.js (React)** · **PostgreSQL**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## 📖 Table of Contents

- [What Is This?](#-what-is-this)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Configuration (`cms.config.json`)](#-configuration-cmsconfigjson)
- [Integrating With Your Website](#-integrating-with-your-website)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [🇷🇺 Документация на русском](#-документация-на-русском)

---

## 💡 What Is This?

JVCMS is a **headless CMS** — it stores and manages your website's content (text, images, lists), but it does **not** generate the website itself. Instead, your website fetches content from the CMS via a simple REST API.

The key difference from traditional CMS platforms (WordPress, Strapi, etc.) is that JVCMS is **extremely lightweight and schema-driven**:

1. You create a single file (`cms.config.json`) that describes your data models.
2. JVCMS reads that file and **automatically generates** the entire admin panel UI — input fields, image uploaders, array editors — without writing any admin code.
3. Your website makes simple `GET` requests to retrieve the content as JSON.

**This means:** one CMS backend serves any number of websites. Just swap out the `cms.config.json` file with a new schema, and the admin panel adapts instantly.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Schema-Driven UI** | Define models in `cms.config.json` → admin panel is generated automatically. No code changes needed. |
| **Headless Architecture** | Content is delivered via REST API. Use it with React, Vue, iOS, Android — any frontend. |
| **WebP Image Compression** | Uploaded JPEG/PNG images are automatically converted to WebP on the backend, reducing file size. |
| **Multi-Language Admin** | The admin panel supports English and Russian out of the box, switchable in real time. |
| **Role-Based Access** | Two roles: **ADMIN** (full control, user management) and **CLIENT** (content editing only). |
| **JWT Authentication** | Secure, stateless authentication. The first login creates the admin account automatically. |
| **Docker-First Deployment** | A single `docker-compose up` launches the entire stack (DB + Backend + Frontend). |
| **Auto-Initialization** | No manual database setup. On first launch, create your admin account directly from the login screen. |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Your Website                          │
│              (React, Vue, plain HTML, etc.)               │
│                                                          │
│   fetch("http://your-server:8080/api/v1/content/menu")   │
│   fetch("http://your-server:8080/uploads/pizza.webp")    │
└─────────────────────────┬────────────────────────────────┘
                          │  REST API (JSON)
                          ▼
┌──────────────────────────────────────────────────────────┐
│               JVCMS Backend (Spring Boot)                │
│                                                          │
│  • /api/v1/content/{id}  — CRUD for content (JSON)       │
│  • /api/v1/auth/*        — Login, register, users        │
│  • /api/v1/media/*       — Upload & manage images        │
│  • /uploads/*            — Static file serving (WebP)    │
│                                                          │
│              PostgreSQL  ←──  Data storage (JSONB)        │
└──────────────────────────────────────────────────────────┘
                          ▲
                          │  Internal API
┌──────────────────────────────────────────────────────────┐
│             JVCMS Admin Panel (Next.js)                  │
│                                                          │
│  • Reads cms.config.json → generates UI dynamically      │
│  • Content editing, media library, user management       │
│  • i18n: English / Russian                               │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.

> **Note:** The default port mapping is `8080` (backend) and `3000` (admin panel) on your host machine. These can be changed in `docker-compose.yml` if those ports are already in use. Inside the containers, the services run independently.

### Launch

```bash
# Clone the repository
git clone https://github.com/your-username/jvcms.git
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
3. Enter your email and password — this creates the **first ADMIN** account.
4. You are now logged in and can start managing content.

> After the first admin is created, the registration form is disabled. All future accounts must be created by the admin through the Users tab.

---

## ⚙ Configuration (`cms.config.json`)

This is the heart of the system. Place this file in `frontend/cms.config.json`. It defines what content models the admin panel will display and what fields each model has.

### Schema Structure

```json
{
  "models": [
    {
      "id": "unique_model_id",
      "label_ru": "Название на русском",
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
      "label_ru": "Меню",
      "label_en": "Menu",
      "fields": [
        {
          "name": "pizzas",
          "label_ru": "Пиццы",
          "label_en": "Pizzas",
          "type": "array",
          "itemFields": [
            { "name": "name", "label_ru": "Название", "label_en": "Name", "type": "text" },
            { "name": "price", "label_ru": "Цена", "label_en": "Price", "type": "text" },
            { "name": "image", "label_ru": "Фото", "label_en": "Photo", "type": "image" }
          ]
        }
      ]
    },
    {
      "id": "hero",
      "label_ru": "Главный экран",
      "label_en": "Hero Section",
      "fields": [
        { "name": "title", "label_ru": "Заголовок", "label_en": "Title", "type": "text" },
        { "name": "backgroundImage", "label_ru": "Фон", "label_en": "Background", "type": "image" }
      ]
    }
  ]
}
```

After defining this config and rebuilding the frontend container, the admin panel will immediately show tabs for "Menu" and "Hero Section" with all the corresponding fields.

---

## 🔗 Integrating With Your Website

JVCMS is **headless**, which means your website fetches content from the CMS API at runtime (or at build time for static sites). Here is what that integration looks like in practice:

### What You Need To Do

1. **Define the schema.** Create `cms.config.json` that matches the content structure of your website (hero section, menu items, footer contacts, etc.).

2. **Replace hardcoded data with API calls.** Wherever your website currently has hardcoded text, image paths, or lists of items, replace them with `fetch()` calls to the CMS backend. For example:
   ```js
   // Before (hardcoded)
   const pizzas = [
     { name: "Margherita", price: "9.50€", image: "/img/margherita.jpg" },
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

- Your website's **design, layout, and HTML/CSS stay exactly the same**. Only the data source changes — from hardcoded values to API responses.
- The `GET /api/v1/content/{id}` endpoint is **public** (no authentication required), so your website can call it directly from the browser or during server-side rendering.
- For **static site generators** (Astro, Hugo, Gatsby), you would call the API at build time and generate static HTML pages with the fetched content.

---

## 📡 API Reference

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
      "price": "9.50€",
      "description": "Classic Italian pizza",
      "image": "/uploads/margherita.webp"
    }
  ],
  "getraenke": [ ... ],
  "desserts": [ ... ]
}
```

---

## 🔐 Environment Variables

All variables have sensible defaults for local development. Override them via a `.env` file in the project root or directly in `docker-compose.yml`.

| Variable | Default | Description |
|---|---|---|
| `DB_USER` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `root` | PostgreSQL password |
| `DB_NAME` | `jvcms_db` | Database name |
| `JWT_SECRET` | `SuperSecretKey...` | JWT signing key (**change in production!**) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | Backend URL as seen by the browser |
| `INTERNAL_API_URL` | `http://backend:8080/api/v1` | Backend URL for server-side rendering (internal Docker network) |
| `NEXT_PUBLIC_UPLOADS_URL` | `http://localhost:8080` | Base URL for image previews in the admin panel |

---

## 📁 Project Structure

```
CMS/
├── docker-compose.yml              # Orchestrates all services
├── README.md
│
├── backend/jvcms/                  # Spring Boot application
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/.../
│       ├── config/                 # Security, CORS, exception handling
│       ├── controller/             # REST endpoints
│       ├── dto/                    # Request/response objects
│       ├── entity/                 # JPA entities (User, ContentItem)
│       ├── repository/             # Spring Data JPA repositories
│       ├── security/               # JWT filter
│       └── service/                # Business logic
│
└── frontend/                       # Next.js admin panel
    ├── Dockerfile
    ├── cms.config.json             # ← YOUR DATA SCHEMA
    ├── components/                 # UI components (ContentManager, MediaLibrary, etc.)
    ├── features/                   # Server actions (auth, content, media, users)
    └── shared/
        ├── api/                    # API fetcher
        └── i18n/                   # Translations (ru.ts, en.ts)
```

---

---

<a name="-документация-на-русском"></a>
## 🇷🇺 Документация на русском

### Что это такое?

JVCMS — это **легковесная headless CMS**, которая управляется одним JSON-файлом конфигурации. Вы описываете структуру данных вашего сайта (например, меню ресторана, блок «О нас», контакты в футере) в файле `cms.config.json`, и система **автоматически генерирует** панель администратора с нужными полями ввода, загрузкой картинок и динамическими списками.

Ваш сайт получает данные через простые HTTP-запросы к REST API.

### Как запустить

**Требования:** Docker и Docker Compose.

```bash
git clone https://github.com/your-username/jvcms.git
cd jvcms
docker-compose up -d --build
```

> По умолчанию бэкенд доступен на порту `8080`, а админка — на порту `3000`. Порты можно изменить в файле `docker-compose.yml`.

Откройте `http://localhost:3000`. При первом запуске система предложит создать аккаунт администратора. После этого вы можете наполнять контент.

### Как подключить к своему сайту

1. Создайте файл `cms.config.json`, описывающий структуру данных вашего сайта.
2. В коде вашего сайта замените захардкоженные данные (тексты, картинки, списки товаров) на вызовы API:
   ```js
   const res = await fetch("http://your-server:8080/api/v1/content/menu");
   const data = await res.json();
   ```
3. Изображения, загруженные через админку, доступны по адресу `http://your-server:8080/uploads/filename.webp`.

Дизайн и верстка вашего сайта **не меняются** — меняется только источник данных. Вместо захардкоженных значений ваш сайт берет их из CMS.

### Конфигурация

Файл `frontend/cms.config.json` определяет, какие модели и поля будут отображаться в панели администратора.

Поддерживаемые типы полей:
- `text` — текстовое поле
- `number` — числовое поле
- `image` — загрузка изображения с превью
- `array` — динамический список элементов (например, карточки товаров)

### Переменные окружения

Все переменные имеют значения по умолчанию для локальной разработки. Для продакшена переопределите их через файл `.env`:

| Переменная | По умолчанию | Описание |
|---|---|---|
| `DB_USER` | `postgres` | Имя пользователя PostgreSQL |
| `DB_PASSWORD` | `root` | Пароль PostgreSQL |
| `DB_NAME` | `jvcms_db` | Название базы данных |
| `JWT_SECRET` | `SuperSecretKey...` | Секрет для подписи JWT (**обязательно сменить!**) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | URL бэкенда для браузера |
| `NEXT_PUBLIC_UPLOADS_URL` | `http://localhost:8080` | URL для превью картинок в админке |
