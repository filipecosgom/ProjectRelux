# Relux ✨

A robust full-stack web application for advanced management of users, products, categories, and real-time communication, designed for academic and business environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Relux is a full-featured web application that streamlines the management of users, products, and categories, while providing real-time chat and notification capabilities. The system supports role-based access (Admin, User), secure authentication, and a rich dashboard for statistics and analytics. Built as part of the PAJ (Programação Avançada em Java) coursework, Relux demonstrates best practices in modern web development.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Admin, User)
- Password reset and change functionality
- Account activation and status management

### 🛒 Product & Category Management
- **Product CRUD**: Create, edit, delete, and view products
- **Category CRUD**: Manage product categories
- **Product States**: Draft, Available, Reserved, Purchased, Deleted
- **Product Search**: Filter products by user, category, or state

### 👥 User Management
- User registration and profile management
- Avatar/profile picture support
- Admin panel for user management (create, edit, delete)
- Bulk user statistics and status overview

### 📊 Dashboard & Statistics
- Real-time dashboard with charts (Recharts)
- Product statistics by state and category
- User statistics and activity tracking
- Time series for registrations and purchases

### 💬 Communication
- **Real-time Chat**: WebSocket-powered messaging between users
- **Notifications**: Real-time notifications for events (product updates, messages)
- **Session Management**: Configurable session timeout for security

### 🌐 User Experience
- Responsive design (mobile-friendly)
- Intuitive navigation with breadcrumbs and navbar
- Toast notifications for feedback
- Modal dialogs for CRUD operations

## 🛠 Technology Stack

### Frontend
- **React 19.x** - Modern React with hooks and functional components
- **React Router 6.x** - Client-side routing
- **Zustand 5.x** - State management
- **Axios 1.x** - HTTP client
- **Recharts** - Data visualization
- **React Toastify** - Notifications
- **Bootstrap** - UI framework

### Backend
- **Java 21** - Latest LTS version
- **Jakarta EE** - Enterprise Java platform
- **JAX-RS** - RESTful web services
- **JPA/Hibernate** - Object-relational mapping
- **EJB** - Business logic
- **WebSocket** - Real-time communication
- **Maven** - Build automation
- **JUnit 5** - Unit testing
- **Log4j2** - Logging

### Database
- **PostgreSQL** - Production database
- **JPA/Hibernate** - ORM framework

### Development Tools
- **Maven** - Backend build tool
- **npm** - Frontend package manager
- **JavaDoc** - API documentation

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  React Frontend │    │    Jakarta EE   │    │     Database    │
│                 │    │   Backend       │    │                 │
│  • Components   │◄──►│  • REST APIs    │◄──►│  • JPA Entities │
│  • State Mgmt   │    │  • WebSocket    │    │  • Relationships│
│  • Routing      │    │  • Services     │    │  • Constraints  │
│  • Testing      │    │  • Repositories │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic implementation
- **Repositories/DAOs**: Data access layer
- **Entities**: JPA database entities
- **DTOs**: Data transfer objects
- **WebSocket Endpoints**: Real-time communication
- **React Components**: Reusable UI components
- **Stores**: Global state management

## 🚀 Getting Started

### Prerequisites

- **Java 21** or higher
- **Node.js 18** or higher
- **npm** or **yarn**
- **Maven 3.6+**
- **Application Server** (WildFly recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/relux.git
   cd relux
   ```

2. **Backend Setup**
   ```bash
   cd backend
   mvn clean install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend-react
   npm install
   ```

4. **Database Configuration**
   - Configure your database connection in `backend/src/main/resources/META-INF/persistence.xml`
   - Update database credentials as needed

5. **Application Server**
   - Deploy the generated WAR file to your application server
   - Configure datasource in your application server

### Running the Application

1. **Start Backend**
   ```bash
   cd backend
   mvn wildfly:deploy
   ```

2. **Start Frontend**
   ```bash
   cd frontend-react
   npm start
   ```

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080/filipe-proj5/rest`
