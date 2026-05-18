# 🛒 ShopHub

> A modern full-stack MERN e-commerce platform with secure payments, responsive UI, and real-time shopping experience.





---

# 📚 Table of Contents

1. [Overview](#1-overview)
2. [Key Features](#2-key-features)
3. [System Architecture](#3-system-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Folder Structure](#5-folder-structure)
6. [Frontend Features](#6-frontend-features)
7. [Backend Features](#7-backend-features)
8. [Authentication Flow](#8-authentication-flow)
9. [Payment Integration](#9-payment-integration)
10. [How to Run](#10-how-to-run)
11. [Screenshots](#11-screenshots)
12. [Future Improvements](#12-future-improvements)
13. [Deployment](#13-deployment)
14. [Contributors](#14-contributors)
15. [Conclusion](#15-conclusion)

---

# 1. Overview

ShopHub is a full-stack MERN e-commerce platform built to provide a modern online shopping experience with secure authentication, cart management, order handling, and integrated online payments.

The project focuses on:

* scalable backend architecture
* modern responsive UI
* secure JWT authentication
* Razorpay payment integration
* full frontend-backend connectivity

---

# 🚀 Live Demo

🌐 Frontend:
https://shop-hub-pi-one.vercel.app/

---

# 📦 GitHub Repository

🔗 Repository:
https://github.com/X-ImLucky-X/ShopHub

---

# 2. Key Features

* 🔐 JWT Authentication System
* 👤 User Registration & Login
* 🛍️ Product Listing & Browsing
* 🛒 Persistent Shopping Cart
* 💳 Razorpay Payment Gateway
* 📦 Order Management
* 👨‍💼 Admin Product Management
* ⚡ REST API Architecture
* 🎨 Modern Responsive UI
* 📱 Mobile-Friendly Design

---

# 3. System Architecture

```text
Frontend (React + TailwindCSS)
        ↓
Axios API Requests
        ↓
Backend (Node.js + Express)
        ↓
MongoDB Database
        ↓
JWT Authentication & Razorpay Payments
```

---

# 4. Tech Stack

| Technology       | Purpose             |
| ---------------- | ------------------- |
| React            | Frontend UI         |
| TailwindCSS      | Styling             |
| Vite             | Frontend Build Tool |
| Axios            | API Requests        |
| React Router DOM | Routing             |
| Node.js          | Backend Runtime     |
| Express.js       | REST APIs           |
| MongoDB Atlas    | Database            |
| Mongoose         | ODM                 |
| JWT              | Authentication      |
| bcrypt.js        | Password Hashing    |
| Razorpay         | Payment Gateway     |

---

# 5. Folder Structure

```bash
ShopHub/
│
├── client/                     # React Frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/                     # Node.js Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── screenshots/
├── README.md
└── package.json
```

---

# 6. Frontend Features

## 🏠 Home Page

* Modern hero section
* Responsive design
* Product categories
* Premium UI styling

## 🔑 Authentication Pages

* Login system
* Registration system
* JWT token storage

## 🛍️ Products Page

* Product cards
* Responsive grid layout
* Add to Cart functionality

## 🛒 Cart Page

* Dynamic cart updates
* Quantity management
* Total price calculation

## 💳 Checkout Page

* Razorpay payment popup
* Order summary
* Payment handling

---

# 7. Backend Features

## 🔐 Authentication APIs

* Register User
* Login User
* JWT Verification

## 📦 Product APIs

* Create Product
* Update Product
* Delete Product
* Fetch Products

## 🛒 Cart APIs

* Add to Cart
* Remove from Cart
* Persistent Database Cart

## 📋 Order APIs

* Create Orders
* Fetch User Orders
* Admin Order Management

## 💳 Payment APIs

* Razorpay Order Creation
* Payment Verification

---

# 8. Authentication Flow

```text
User Login/Register
        ↓
JWT Token Generated
        ↓
Token Stored in localStorage
        ↓
Protected API Requests
        ↓
Backend Token Verification
```

---

# 9. Payment Integration

ShopHub uses Razorpay for secure online transactions.

### Features

* Test payment support
* Razorpay order creation
* Secure checkout flow
* Backend payment handling

### Payment Workflow

```text
Cart Checkout
↓
Create Razorpay Order
↓
Open Razorpay Popup
↓
Payment Success
↓
Create Order in Database
```

---

# 10. How to Run

## Step 1 — Clone Repository

```bash
git clone https://github.com/X-ImLucky-X/ShopHub.git
cd ShopHub
```

---

## Step 2 — Setup Backend

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

Run backend:

```bash
npm run dev
```

---

## Step 3 — Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

# 11. Screenshots

## 🏠 Home Page

![Home Page](Screenshots\HOMEPAGE.png)

---

## 🛍️ Products Page

![Products Page](Screenshots\PRODUCT.png)

---

## 🛒 Cart Page

![CART](Screenshots\CART.png)

---

## 💳 Checkout Page

![CHECKOUT](Screenshots\CHECKOUT.png)

---

## 🔐 Login Page

![LOGIN](Screenshots\LOGIN.png)

---

## REGISTER

![REGISTER](Screenshots\REGISTER.png)

---

## Razor Pay

![RAZORPAY](Screenshots\RAZORPAY.png)

---

# 12. Future Improvements

* [ ] Product Search & Filters
* [ ] Wishlist System
* [ ] Product Reviews & Ratings
* [ ] Cloudinary Image Uploads
* [ ] Admin Dashboard Analytics
* [ ] Email Notifications
* [ ] Coupon & Discount System
* [ ] AI Product Recommendations
* [ ] Redux Toolkit State Management
* [ ] PWA Support

---

# 13. Deployment

| Platform | Service       |
| -------- | ------------- |
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |

---

# 14. Contributors

| Name                | GitHub                         |
| ------------------- | ------------------------------ |
| Lakshya Kumar Singh | https://github.com/X-ImLucky-X |

---

# 15. Conclusion

ShopHub demonstrates a complete full-stack e-commerce solution combining:

* Modern Frontend Development
* REST API Architecture
* Authentication & Security
* Payment Gateway Integration
* Database Management
* Responsive UI Design

The project showcases practical industry-level MERN stack development concepts and real-world application architecture.

---

> ⭐ If you found this project useful, consider starring the repository on GitHub!
