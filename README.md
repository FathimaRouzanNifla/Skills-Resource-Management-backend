## **Skills Management System – Backend**

This is the **Node.js + Express backend** for the Skills Management System.  
It provides RESTful APIs to manage **personnel, skills, projects, and skill matching** and serves data to the React frontend.

---

## **Table of Contents**

## 1. Overview  
## 2. Features  
## 3. Tech Stack  
## 4. Prerequisites  
## 5. Installation  
## 6. Environment Variables  
## 7. Running Backend  
## 8. Project Structure  
## 9. API Documentation (Postman)  
## 10. Available Scripts  
## 11. Error Handling  
## 12. Contributing  
## 13. License  

---

## **1. Overview**

The backend is responsible for handling all **business logic**, **database operations**, and **REST API endpoints** required by the Skills Management System.  
It follows a clean **RESTful architecture** and integrates seamlessly with the frontend.

---

## **2. Features**

- Manage **Personnel** (Create, Read, Update, Delete)  
- Manage **Skills** (Create, Read, Update, Delete)  
- Manage **Projects** (Create, Read, Update, Delete)  
- Assign skills to personnel  
- Assign required skills to projects  
- Skill-to-project matching logic  
- Centralized validation and error handling  
- Secure and scalable API structure  

---

## **3. Tech Stack**

- Node.js  
- Express.js  
- MySQL (mysql2)  
- dotenv  
- cors  
- nodemon (development)

---

## **4. Prerequisites**

- Node.js (https://nodejs.org)  
- npm  
- MySQL Server  
- Postman (for API testing)

---

## **5. Installation**

Clone the repository:

    git clone https://github.com/your-username/Skills-Resource-Management-backend.git
    cd Skills-Resource-Management-backend

Install dependencies:

    npm install

---

## **6. Environment Variables**

Create a `.env` file in the backend root directory:

    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=skills_management

---

## **7. Running Backend**

Run in development mode (with nodemon):

    npm run dev

Run in production mode:

    npm start

Backend server will be available at:

    http://localhost:5000

---

## **8. Project Structure**

    src/
    ├── controllers/      # Controller logic for APIs
    ├── routes/           # API route definitions
    ├── middlewares/      # Validation & error middleware
    ├── config/           # Database configuration
    ├── app.js            # Express app configuration
    └── server.js         # Server entry point

---

## **9. API Documentation (Postman)**

Complete API documentation with request/response examples is available via Postman:

[Postman API Documentation](https://documenter.getpostman.com/view/47235614/2sBXVcmYN8)

### **Available API Modules**

**Personnel APIs**
- GET    /api/personnel  
- GET    /api/personnel/:id  
- POST   /api/personnel  
- PUT    /api/personnel/:id  
- DELETE /api/personnel/:id  
- POST   /api/personnel/:id/skills  

**Skills APIs**
- GET    /api/skills  
- POST   /api/skills  
- PUT    /api/skills/:id  
- DELETE /api/skills/:id  

**Projects APIs**
- GET    /api/projects  
- POST   /api/projects  
- PUT    /api/projects/:id  
- DELETE /api/projects/:id  
- POST   /api/projects/:id/skills  

**Matching APIs**
- GET /api/matching/projects/:projectId  

---

## **10. Available Scripts**

- npm start     : Start backend server  
- npm run dev   : Start server with nodemon  

---

## **11. Error Handling**

All API errors are returned in JSON format:

    {
      "error": "Error message here"
    }

Validation and database errors return proper HTTP status codes such as **400**, **404**, and **500**.

---

## **12. Contributing**

- Fork the repository  
- Create a new feature branch  
- Commit your changes  
- Push to your branch  
- Open a Pull Request  

---

## **13. License**

MIT License © 2026
