# react-books-app
Books managing application using Vue

##
[GIT](https://github.com/muneer2ishtech/vue-books-app)

## Tech stack
- Vue
- ViteJS
- Node: v24.15.0
- Vue 3
- ViteJS
- Pinia - State management
- Vue Router v4 
- TanStack Table v8 - Headless data grid
- Axios
- Tailwind CSS
- vee-validate + Zod
- Vue i18n v9
- Lucide Icons
- TypeScript
- Node: v24.15.0

## Features

- **Authentication & Autherization**
    - 🔐 **JWT** based signin with auto-logout on expiry
    - 🛡️ **RBAC** - Role-based access control (USER/ADMIN)
- 📖 **Book Management** - Create, Read, Update, Delete books
    - 🔍 **Advanced Filtering** - Multi-column search with range filters (year, price)
    - 📊 **Smart Sorting** - Multi-column sorting (additive)
    - 📄 **Server-side Pagination** - Page size selector (10/20/50/100) + "Show All"
- 🌍 **Internationalization**
    - `i18n` with English & Finnish languages
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
```
npm build
```
