# JVCMS: Project Memory & Context

*Этот файл автоматически поддерживается системой (Auto-Memory) для сохранения долгосрочного контекста проекта.*

## 1. Главная суть проекта и прогресс
**JVCMS** — это минималистичная, легковесная Headless CMS. 
- **Основная парадигма:** CMS выступает исключительно как надежное хранилище данных (посредник) и оптимизатор медиафайлов. Она не генерирует клиентские сайты.
- **Главная фича для конечных пользователей:** Поддержка **Inline Editing**. Клиент редактирует контент прямо на своем "живом" сайте, а клиентский фронтенд отправляет `PUT`-запросы с JSON-данными в нашу CMS.
- **Текущий прогресс:** Система стабильна, поддерживает авторизацию, загрузку файлов (с конвертацией в WebP), имеет динамическую админку, которая генерируется на лету из `cms.config.json`. Недавно внедрена защита от брутфорса (IP-based).

## 2. Стек технологий и архитектура
- **Backend:** Java 21, Spring Boot 3, Spring Security 6, Maven.
- **Frontend (Admin Panel):** Next.js 16 (Turbopack), React, Tailwind CSS, TypeScript.
- **Database:** PostgreSQL 15 (используется колонка `JSONB` для гибкого хранения контента).
- **Security:** 
  - JWT-токены хранятся в `HttpOnly` куках (SameSite=Lax).
  - Защита от брутфорса (In-memory кэш Caffeine для трекинга IP-адресов с TTL 15 минут).
  - Строгий Role-Based Access Control (ADMIN и CLIENT). Закрытая регистрация.
  - Защита от RCE при загрузке файлов (Magic Bytes проверка + Scrimage WebP).

## 3. Технические нюансы и костыли (Quirks)
- **Окружение развертывания:** Проект хостится на немецком сервере **Hetzner**.
- **Проблема со Standalone:** В Next.js нельзя использовать `output: 'standalone'` при сборке, так как на Hetzner-сервере пользователя это вызывало критические ошибки. Используется стандартный билд.
- **Сетевая безопасность Docker:** Порты базы данных (PostgreSQL) в `docker-compose.yml` **категорически запрещено** открывать наружу (`0.0.0.0`). Обязательно биндить на `127.0.0.1` (например, `127.0.0.1:5433:5432`). Ранее из-за открытого порта был получен алерт об уязвимости от CERT-Bund (Германия).
- **Git Workflow:** Вся новая разработка ведется строго в **отдельных ветках** (например, `feat/brute-force-protection`), тщательно тестируется и только потом пушится на GitHub для последующего слияния.

## 4. Текущие открытые задачи и Roadmap (Версия 2.0)
Архитектурные улучшения (по результатам Senior Code Review), которые предстоит сделать в отдельных ветках:
1. **[PENDING] Внедрение миграций БД (Flyway):** Отказ от `ddl-auto=update` для продакшена. Использование `baseline-on-migrate=true` для интеграции с уже существующей базой на сервере. (План уже готов, ждет аппрува пользователя).
2. **[TODO] Backend JSON Validation:** Бэкенд должен валидировать входящий JSON-контент на соответствие схеме из `cms.config.json`, а не просто слепо сохранять всё подряд.
3. **[TODO] Zero-rebuild Schema Updates:** Перенос хранения `cms.config.json` на бэкенд (или в БД) с отдачей через API, чтобы изменение структуры сайта не требовало пересборки Docker-контейнера фронтенда.

## 5. Системные правила проекта (Project Rules)
- **Всегда проверять актуальность в интернете (`search_web`):** Запрещено полагаться на устаревшие внутренние знания базы данных. При код-ревью, планировании архитектуры или проверке версий (например, Spring Boot, Java, Next.js) необходимо ОБЯЗАТЕЛЬНО гуглить актуальные релизы на текущий год (2026+).
- **Актуальные версии (Осень 2026):** Проект использует **Spring Boot 4.1.0** (релиз состоялся в июне 2026 года). Это самая свежая и стабильная версия, откатываться на 3.x не нужно.

## GLOBAL RULE: ALWAYS USE LATEST VERSIONS (Sept 2026)
When working with dependencies, tools, or best practices, ALWAYS search the web to find the absolute latest versions available (as of September 2026). Do NOT rely on internal training data for versions. Use modern approaches (e.g. Testcontainers for Spring Boot 4.x).

## Phase 3 Completed: Testcontainers Integration
- Setup spring-boot-testcontainers with @ServiceConnection.
- Wrote ContentItemServiceIntegrationTest with PostgreSQL 16.
- Fixed issue where test properties overrode Dialect to H2 and threw bytea exception.
- Fixed base64 parsing issue by providing a valid base64 jwt.secret in test properties.

## Phase 4 Completed: DB Migrations
- Added spring-boot-starter-flyway and flyway-database-postgresql.
- Created V1__init_schema.sql.
- Changed ddl-auto to validate and configured baseline-on-migrate.

## Review v3 (2026-10-06, main @ 890419e)
- Report: brain/code_review_report_v3.md
- P0: compose default JWT_SECRET/DB_PASSWORD + .env.example missing them; backend 8080 bound to 0.0.0.0; rate limiter keyed by frontend container IP (global lockout) + XFF spoof; UsernameNotFoundException in JWT filter -> 500; NEXT_PUBLIC_UPLOADS_URL inlined at build (Docker image always localhost).
- P1: GlobalExceptionHandler leaks messages, catch-all breaks 4xx; backend Set-Cookie is dead code (server actions); open /auth/init takeover; no DTO validation; decompression bomb; proxy.ts host rewrite hack; AGENTS.md/CLAUDE.md/.idea tracked, '*.md' in .gitignore; Node 20 EOL.
- fix/fetch-empty-body merged (PR #7).

## Stage 1 (fix/env-followup) Completed
- Fixed JWT_SECRET validation to require base64 string
- Removed defaults from .env.example
- Added required env var docs to README
- Removed AI files from .gitignore to track prompt engineering process

## Stage 2 (fix/frontend-types) Completed
- Created shared types for CMS schema (User, ContentItem, CmsField)
- Replaced all usages of 'any' in frontend with strictly typed Record<string, unknown> or standard interfaces
- Resolved React hook warnings (set-state-in-effect) in MediaLibrary and UserList

## Stage 3 (fix/env-build-time) Completed
- Created Next.js proxy route /api/proxy/uploads/[...path] to fetch images dynamically from backend without exposing ports
- Removed NEXT_PUBLIC_UPLOADS_URL from docker-compose.yml, README and all frontend components
- Changed <img src> and <Image src> to use relative /api/proxy/uploads/... URLs to avoid build-time inlining of localhost
