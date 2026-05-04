# vue-books-app
Books managing application using Vue

##
[GIT](https://github.com/muneer2ishtech/vue-books-app)

## Tech stack
- Vue 3
- Vite
- Node v24 LTS
- Pinia — state management
- Vue Router v4
- TanStack Table v8 — headless data grid
- Axios
- Tailwind CSS
- vee-validate + Zod
- Vue I18n v11
- Lucide Icons
- TypeScript

## Features

- **Authentication & Autherization**
    - 🔐 **JWT** based signin with auto-logout on expiry
    - 🛡️ **RBAC** - Role-based access control (USER/ADMIN)
- 📖 **Book Management** - Create, Read, Update, Delete books
    - 🔍 **Advanced Filtering** - Multi-column search with range filters (year, price)
    - 📊 **Smart Sorting** - Multi-column sorting (additive)
    - 📄 **Server-side Pagination** - Page size selector (10/20/50/100) + "Show All"
- 🌍 **Internationalization**
    - `i18n` with English, Finnish, and Swedish
- 📱 **Responsive**
    - Mobile/Tablet/Desktop breakpoints
    - Card layout on small screens (table transforms to stacked cards)
- 🔄 **Global Loading Overlay** - Blocks UI during API calls
- 🎨 **UI Features** - with persistence of preferences
    -  Light/Dark mode toggle
    - 🖱️ Collapsible Navbar (fixed left)
    - 📌 Pin Header/Footer - Sticky toggle
- ⚠️ **Error Handling**
    - `/404` page for route not found
    - `/error` page for HTTP status with error details
    - `401` auto redirect to `/signin`
    - HTTP status codes → appropriate `Alert` or redirect to `/error`

## Routes
| Route           | Description |
|-----------------|-------------|
| /signin         | For login   |
| /signup         | Register new user |
| /home           | Landing page |
| /books          | Search, Filter, Sort list of Books in Pages |
| /books/new      | Create New Book |
| /books/:id      | View Existing Book |
| /books/:id/edit | Edit Existing Book |
| /me             | View user own profile |
| /error          | Generic error page |


## Local Run

```
npm install
npm run dev
```

## Build
### Local Build

- To build with Vite default mode (i.e. `production`)

```
npm run build
```

- To build another mode

```
npm run build -- --mode development
npm run build -- --mode testing
npm run build -- --mode staging
```

### Compute App Version

- Using Node.js

```bash
APP_VERSION=$(node -p "require('./package.json').version")
```

- Using jq (if installed)

```bash
APP_VERSION=$(jq -r .version package.json)
```

- Using grep + sed

```bash
APP_VERSION=$(grep -o '"version": *"[^"]*"' package.json | sed 's/"version": *"//;s/"//')
```

- PowerShell (Windows)

```powershell
$APP_VERSION = (Get-Content -Raw package.json | ConvertFrom-Json).version
```

### Docker Build

- Production build
    - `BUILD_ENV=production` is the default. Both commands below produce the same result:
    - `BUILD_ENV=prod` also inferred as `production`

```
docker build -t vue-books-app:${APP_VERSION} .
```

```
docker build --build-arg BUILD_ENV=production -t vue-books-app:${APP_VERSION} .
```

```
docker build --build-arg BUILD_ENV=prod -t vue-books-app:${APP_VERSION} .
```

- Non-Production Builds

```
docker build --build-arg BUILD_ENV=qa -t vue-books-app:${APP_VERSION}-qa .
docker build --build-arg BUILD_ENV=staging -t vue-books-app:${APP_VERSION}-staging .
```

- Development (both 'dev' and 'development' work)

```
docker build --build-arg BUILD_ENV=dev -t vue-books-app:dev .
```

```
docker build --build-arg BUILD_ENV=development -t vue-books-app:dev .
```

- Fresh dependency install for non-production builds:
    - For non-production builds, you can force a fresh dependency install (by first deleting package-lock.json)
 | - Build will fail if `FRESH_INSTALL=true` for production builds (build will fail). Production builds require package-lock.json for reproducible installs.

```
docker build \
  --build-arg BUILD_ENV=development \
  --build-arg FRESH_INSTALL=true \
  -t vue-books-app:${APP_VERSION}-development .
```

- Image versioning example

| BUILD_ENV | Image Tag Example | FRESH_INSTALL Allowed |
|-----------|-------------------|-----------------------|
| production | vue-books-app:1.2.3 | ❌ No |
| dev / development | vue-books-app:1.2.3-development | ✅ Yes |
| qa | vue-books-app:1.2.3-qa | ✅ Yes |
| staging | vue-books-app:1.2.3-staging | ✅ Yes |
