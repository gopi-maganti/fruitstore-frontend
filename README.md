# 🍓 Fruit Store - Frontend

This is the **frontend** for the 🛒 Fruit Store web app — a responsive online platform where users can browse, manage, and buy fruits. Built using **React + Vite + TypeScript**, it includes a full guest checkout flow, seller dashboard, and Docker integration for containerized deployments.

---

## 🚀 Features

- ✅ Buyer and Seller views
- 🛒 Cart and Guest Checkout
- 📦 Add, Clone, Edit & Delete fruits
- ✏️ Bulk edit with inline validation
- 🔍 Search, Pagination, and Filter
- 📥 Receipt download post-order
- 🔒 LocalStorage-based cart state
- 🧪 Unit tests + Code coverage
- 🐳 Dockerized for easy deployment

---

## 🛠️ Tech Stack

- **React** + **TypeScript**
- **Vite** for fast dev builds
- **Axios** for API communication
- **SCSS Modules** for styling
- **React Toastify** for notifications
- **Vitest** + **Testing Library** for testing
- **Docker** for containerization

---

## 📁 Folder Structure

src/
├── components/ # Reusable components (modals, navbars, tables)
├── context/ # Cart context
├── models/ # TypeScript models
├── pages/ # Route-level pages
├── App.tsx
├── main.tsx
tests/ # Unit test files
Dockerfile
vite.config.ts

yaml
Copy
Edit

---

## 📦 Getting Started (Dev)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/fruitstore-frontend.git
cd fruitstore-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open: http://localhost:5173

⚠️ Make sure your backend API is running at http://localhost:5000

### 🧪 Run Tests & Coverage

```bash
npm run test # Run all unit tests
npm run test -- --coverage # Generate test coverage
```

To view the coverage report in browser:

```bash
open coverage/index.html # macOS
start coverage/index.html # Windows
```

### 🐳 Docker Setup

### 📌 Build Docker Image

```bash
docker build -t fruitstore-frontend .
```

### ▶️ Run the Container

```bash
docker run -p 5173:5173 fruitstore-frontend
```

This will expose your app at: http://localhost:5173

If you're using a proxy, ensure CORS and ports are aligned with your backend (http://localhost:5000)

### ⚙️ Optional: Docker Compose

If you’re running both frontend and backend, you can include this in a docker-compose.yml:

```yaml
services:
frontend:
build: .
ports: - "5173:5173"
depends_on: - backend
```

### 📄 License

MIT © 2025 Gopi Krishna Maganti

### 🙌 Acknowledgments

This app was built as part of a full-stack fruit e-commerce project with complete local and container-based deployment support.
