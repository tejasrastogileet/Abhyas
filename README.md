# DevShala

<div align="center">

  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-0A0A0A?style=for-the-badge&logo=razorpay" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" alt="Vite" />

</div>

A modern full-stack online learning platform that connects learners with instructors and enables smooth course discovery, enrollment, and progress tracking.

Live Demo: https://devs-olive.vercel.app/

## Overview

DevShala is a complete e-learning platform built to simplify online education for both students and instructors. The platform allows instructors to create and manage courses, upload learning content, and deliver a polished experience to learners. Students can browse available courses, view detailed lesson modules, enroll through secure payment flows, and track their learning progress.

This project demonstrates a production-style full-stack architecture with role-based access control, secure authentication, media handling, and integrations for real-world digital commerce.

## Key Features

- Student authentication and authorization
- Instructor dashboard for creating and managing courses
- Course catalog with search and category-based browsing
- Detailed course pages with curriculum and author information
- Video-based lecture viewing with section/sub-section structure
- Student enrollment and progress tracking
- Secure payment integration using Razorpay
- Email-based account flow for registration and updates
- Cloudinary integration for image and media upload
- Responsive and modern UI built with React and Tailwind CSS

## Tech Stack

### Frontend
- React.js
- Vite
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Framer Motion
- React Hot Toast
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary
- Brevo transactional email API
- Razorpay

## System Architecture

```text
Frontend (React + Vite)  --->  Backend API (Express + Node.js)  --->  MongoDB
                              |
                              +-- Cloudinary for media upload
                              +-- Razorpay for payment processing
                              +-- Brevo transactional email API for user communication
```

## Project Structure

```text
Devshala/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── reducer/
│   │   ├── slices/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   └── tsconfig.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── src/
│   ├── package.json
│   └── server.js
│
├── render.yaml
├── .gitignore
└── README.md
```

## Roles and User Flow

### Student
- Sign up / login
- Browse and explore courses
- View course details and syllabus
- Enroll and pay securely
- Access learning dashboard
- Track completed lessons and progress

### Instructor
- Create and update course information
- Upload course thumbnails and curriculum content
- Manage sections and sub-sections
- Publish and maintain learning materials

## Screenshots

> Screenshots will be added here to showcase the homepage, course catalog, dashboard, and course details experience.

## Prerequisites

Before running the project locally, ensure you have the following installed:

- Node.js (v18 or above)
- npm or yarn
- MongoDB instance
- Cloudinary account
- Razorpay account

## Environment Variables

Create a `.env` file in the `server` directory and configure the following variables:

```env
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
MAIL_FROM_EMAIL=your_sender_email
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

For the frontend, configure the API base URL if needed:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/tejasrastogileet/Devshala.git
cd Devshala
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Run the application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The frontend will run on the local Vite development server, and the backend will serve API requests on the configured Node.js port.

## Deployment

The project is configured for deployment using Render with separate web services for the backend and frontend, as defined in `render.yaml`.

## Why This Project Stands Out

DevShala is more than a simple course marketplace. It demonstrates:

- Full-stack application design
- Role-based access control and secure session management
- Real-world payment integration
- Media and document handling in a web application
- Scalable architecture for SaaS-style product flows
- Experience in building education technology products

## Future Enhancements

- AI-based course recommendations
- Instructor analytics dashboard
- Discussion forums and Q&A for students
- Certification generation and course completion badges
- Search and filter improvements
- Multi-language support

## License

This project is available for educational and portfolio use.

## Contact

For project-related discussions or collaboration opportunities:

- GitHub: https://github.com/tejasrastogileet
- Live Demo: https://devs-olive.vercel.app/

## Acknowledgements

- React and Vite ecosystem
- Node.js and Express.js community
- MongoDB and Cloudinary services
- Razorpay payment platform

---

Built with passion for learning, product development, and scalable web engineering.
