# 🌿 TribalTrek – Jharkhand Tourism Platform

**TribalTrek** is an interactive tourism discovery platform built to showcase the rich **tribal heritage, culture, and natural beauty of Jharkhand, India**. The platform provides a powerful backend system that supports interactive maps, multimedia content, and future-ready features like AR/VR previews to enhance tourism experiences.

---

## 🌐 Overview

TribalTrek aims to digitize tourism information for Jharkhand by providing structured, searchable, and scalable APIs. It enables users to explore tourist and cultural destinations through maps, images, and immersive previews — helping travelers plan better and promoting Jharkhand’s heritage using modern technology.

---

## ✨ Key Features

* 🗺️ **Interactive Maps** – Discover and navigate tourist spots across Jharkhand
* 🏛️ **Tourist & Cultural Sites** – Detailed data about destinations, history, and significance
* 🌁 **AR/VR Ready Architecture** – Virtual previews of sites (extensible)
* 📸 **Image Management** – Upload, store, and retrieve images efficiently
* 🔎 **Search & Filters** – Find places by name, district, or location-based queries
* 🗄️ **RESTful APIs** – Clean and scalable endpoints for all operations
* 🔐 **Secure Backend** – Helmet, CORS, and rate limiting enabled

---

## ⚙️ Tech Stack

### Backend

* **Node.js**
* **Express.js**

### Database & Storage

* **MongoDB**
* **GridFS** (for image storage)

### Security & Utilities

* **Helmet** – Security headers
* **CORS** – Cross-origin support
* **Express Rate Limit** – API protection
* **Multer** – File uploads

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/PRATHAM10805/TribalTrek-Jharkhand-Tourism.git
cd TribalTrek-Jharkhand-Tourism/backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Setup

```bash
cp .env.example .env
```

Edit the `.env` file with your MongoDB URI and other configuration values.

### 4️⃣ Start MongoDB

* Run MongoDB locally **OR**
* Use a MongoDB Atlas URI in `.env`

### 5️⃣ Seed Initial Data

```bash
npm run seed
```

### 6️⃣ Start the Server

**Development mode (hot reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

---

## 🏗️ Project Structure

```
backend/
│── config/        # Database & environment configuration
│── controllers/  # Business logic
│── models/        # MongoDB schemas
│── routes/        # API routes
│── middlewares/   # Auth, error handling, security
│── utils/         # Helper utilities
│── seed/          # Seed scripts
│── uploads/       # Temporary upload storage
│── server.js      # App entry point
```

---

## 📖 About the Project

**TribalTrek** is designed as a scalable tourism backend that can power:

* Web & mobile tourism applications
* Interactive map-based exploration platforms
* AR/VR tourism experiences
* Government or private tourism portals

The system allows administrators to manage destinations, images, and metadata while offering users a smooth and informative discovery experience.

---

## 🎯 Use Cases

* 🏛️ State tourism departments
* ✈️ Travel & tourism startups
* 👨‍💻 Developers building travel guide apps
* 🌍 Cultural preservation & promotion platforms

---
