# SMaLoB Marketplace

SMaLoB is a full-stack e-commerce platform allowing vendors to sell products and customers to purchase items seamlessly. The platform includes user authentication, email verification, password recovery, and a secure payment gateway.

## 🚀 Features

- User authentication (Signup, Login, Logout)
- Role-based access control (Admin, Vendor, Customer)
- Email verification & password reset
- Product listing & vendor management
- Payment gateway integration
- Responsive UI with Bootstrap
- JWT-based authentication

## 🛠️ Technologies Used

### **Frontend**
- React.js (with React Router)
- Bootstrap for styling
- Axios for API calls

### **Backend**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email services

## 🔧 Installation & Setup

### **Prerequisites**
Ensure you have the following installed:
- Node.js & npm
- MongoDB (Local or Atlas)
- Git

### **Clone the repository**
```bash
git clone https://github.com/maazbobat/SMaLoB.git
cd SMaLoB
```

### **Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
CLIENT_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```

### **Frontend Setup**
```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm start
```

## 📩 API Endpoints

### **Authentication Routes**
- `POST /auth/signup` - Register new users
- `POST /auth/login` - User login
- `GET /auth/verify-email/:token` - Verify user email
- `POST /auth/forgot-password` - Send password reset email
- `POST /auth/reset-password/:token` - Reset password

### **Product Routes**
- `GET /products` - Fetch all products
- `POST /products` - Add a new product (Vendor only)

## 📌 Deployment

### **Deploying Frontend on Netlify**
1. Push your frontend code to GitHub.
2. Log in to [Netlify](https://www.netlify.com/) and connect your GitHub repo.
3. Set the build command as:
   ```bash
   npm run build
   ```
4. Set `PUBLIC_URL` in Netlify environment variables.
5. Deploy and get the live URL!

### **Deploying Backend on Render**
1. Push your backend code to GitHub.
2. Log in to [Render](https://render.com/) and create a new web service.
3. Connect your repository and set environment variables.
4. Deploy and get the backend live!

## 🤝 Contribution
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Added new feature'`)
4. Push to your fork (`git push origin feature-name`)
5. Create a Pull Request

## 📜 License
This project is open-source and available under the MIT License.

---
🚀 **Developed by Maaz Bobat & Contributors**

