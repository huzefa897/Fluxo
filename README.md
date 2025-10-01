# 📦 Fluxo — Inventory Management System

Fluxo is a **full-stack inventory management application** built with **Spring Boot (Java)** for the backend and **React.js** for the frontend.

It allows users to manage products, track stock levels, and update quantities in real-time.

---

## ✨ Features

- ➕ Add new products with **SKU, name, brand, description, category, expiry date, and quantity**
- 🔍 Search and fetch products by **ID or SKU**
- 📊 Track and update **stock levels** (add/remove quantities)
- ⏱️ Automatically updates **last added date**
- ⚡ REST API backend with **Spring Boot** and **JPA/Hibernate**
- 🗄️ Database support with **PostgreSQL** (switchable from H2 for testing)
- 🎨 Frontend built with **React.js** + **Material UI** for a modern UI

---

## 🏗️ Tech Stack

**Frontend**

- React.js
- Material UI (MUI)
- Axios (API calls)
- TailwindCSS (styling helpers)

**Backend**

- Spring Boot (Java 21+)
- Spring Data JPA / Hibernate
- REST API architecture
- PostgreSQL (default DB)
- H2 (for quick local testing)

---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/fluxo.git
cd fluxo

```

### 2. Backend (Spring Boot)

```bash
cd Backend
./mvnw spring-boot:run

```

Backend runs at: `http://localhost:8080`

Make sure to configure your DB in `application.properties`:

```
spring.datasource.url=jdbc:postgresql://localhost:5432/fluxo
spring.datasource.username=youruser
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update

```

### 3. Frontend (React)

```bash
cd Frontend
npm install
npm run dev

```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Endpoints

### Products

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/{id}` | Get product by ID |
| `GET` | `/api/products/sku/{sku}` | Get product by SKU |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/{id}/add/{quantity}` | Increase stock quantity by ID |
| `PUT` | `/api/products/{id}/remove/{quantity}` | Decrease stock quantity by ID |
| `PUT` | `/api/products/sku/{sku}/add/{qty}` | Increase stock by SKU |
| `PUT` | `/api/products/sku/{sku}/remove/{qty}` | Decrease stock by SKU |

---

## 🗃️ Database Schema (PostgreSQL)

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    category VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    expiry_date DATE,
    last_add_date DATE
);

```

---

## 🚀 Future Enhancements

- 🔐 User authentication & role-based access (admin/staff)
- 📑 Reports & analytics dashboard (low stock, expiry alerts)
- 📱 Mobile-friendly responsive design
- ⏰ Automatic reminders for expiring products
- ☁️ Docker & Kubernetes deployment

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](https://chatgpt.com/g/g-p-686f3132762881919e6066d671f4e13a-codemaxing/c/LICENSE) file for details.

---

## 🙌 Acknowledgements

- Inspired by real-world **clinic inventory workflows**
- Built as part of the **CodeMaxing project** to practice React + Spring Boot + PostgreSQL
- Thanks to [Material UI](https://mui.com/) and [Spring Boot](https://spring.io/projects/spring-boot)

---

✨ Fluxo makes stock management simple, scalable, and reliable.

---