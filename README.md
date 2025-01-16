# Ecommerce

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.3.

## 📖 Project Description
This is a full-stack e-commerce application built using the MEAN stack (MongoDB, Express.js, Angular, and Node.js). It enables users to browse products, manage shopping carts, and place orders, while admins can manage the products and users efficiently.

### 🌟 Features
- **User Functionality:**
  - Browse products and categories.
  - Add/remove products to/from the cart.
  - Place and manage orders.
  - Authentication system (register, login, logout).
- **Admin Functionality:**
  - Manage products, categories, and orders.
  - User management.
- **General Features:**
  - Responsive design using Angular and Bootstrap.
  - RESTful API with Node.js and Express.js.
  - MongoDB for database operations.

---

## 🛠️ Tech Stack
- **Frontend:** Angular, Bootstrap, HTML, CSS.
- **Backend:** Node.js, Express.js, MongoDB, Mongoose.
- **Authentication:** JWT for user authentication.
- **Additional Tools:** CORS, dotenv.

---

## 🚀 Development Setup

### Prerequisites
1. [Node.js](https://nodejs.org/)
2. [Angular CLI](https://angular.io/cli)
3. [MongoDB](https://www.mongodb.com/)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/rehabmohamed2/E-commerce_MEAN_Project.git
   cd E-commerce_MEAN_Project
   ```

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Setup environment variables:**
   - Create a `.env` file in the `backend` directory:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```

4. **Run the backend server:**
   ```bash
   cd backend
   npm start
   ```

5. **Run the frontend application:**
   ```bash
   cd ../frontend
   ng serve
   ```

6. **Access the application:**
   - Frontend: `http://localhost:4200`
   - Backend: `http://localhost:5000`

---

## 📂 Project Structure

### Backend:
```
backend/
├── controllers/    # API controllers
├── models/         # Mongoose models
├── routes/         # API routes
├── middleware/     # Authentication and error handling
├── .env            # Environment variables
└── server.js       # Main entry point
```

### Frontend:
```
frontend/
├── src/
│   ├── app/
│   │   ├── components/    # Angular components
│   │   ├── services/      # Services for API calls
│   │   ├── guards/        # Route guards
│   │   ├── app.module.ts  # Main Angular module
│   ├── assets/            # Static assets
│   ├── environments/      # Environment configurations
└── angular.json           # Angular configuration
```

---


## 🧪 Testing

### Run Unit Tests
- **Frontend:**
  ```bash
  cd frontend
  ng test
  ```
- **Backend:**
  ```bash
  cd backend
  npm test
  ```

### Run End-to-End Tests
```bash
cd frontend
ng e2e
```

---

## 📈 Future Enhancements
- Payment gateway integration (e.g., Stripe or PayPal).
- Advanced search and filtering options.
- Real-time order tracking.
- Mobile app version.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## 📧 Contact
For any inquiries, reach out via:
- [GitHub](https://github.com/rehabmohamed2)
- Email: rehabmohamed2@example.com

---

### ⭐ Support the Project
If you find this project helpful, give it a ⭐ on GitHub!

