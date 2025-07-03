# 🏋️‍♂️ NEM Gym - Desktop Gym Management System



A modern, **offline-first** desktop application for gym owners to efficiently manage members, payments, and operations with a sleek interface and powerful backend.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Electron Version](https://img.shields.io/badge/Electron-25.0.0-blue)](https://www.electronjs.org/)
[![React Version](https://img.shields.io/badge/React-18.2.0-61DAFB)](https://reactjs.org/)

## ✨ Key Features

### 🧑‍🤝‍🧑 Member Management
- 📝 Add/edit/delete member profiles with photos
- 🔍 Advanced search and filtering
- 📅 Subscription plan management with expiration tracking

### 💰 Payment System
- 💳 Track payments and membership status
- 📊 Payment history per member
- ⏰ Automated expiration alerts

### 🔔 Notification Center
- 🔄 Daily subscription status checks
- 📩 Real-time alerts for expired payments
- ✅ Mark notifications as read

### 🔒 Secure Access
- 🛡️ Admin authentication system
- 🔐 Session management
- 🗝️ JWT-based security

### 📈 Business Insights
- 📊 Dashboard with key metrics
- 💹 Revenue and membership analytics
- 📆 Daily performance overview

## 🛠 Technology Stack

### Frontend
| Component       | Technology                          |
|-----------------|-------------------------------------|
| Framework       | React 18                            |
| Styling         | Tailwind CSS + Headless UI          |
| Animations      | Framer Motion                       |
| UI Components   | Custom-built with accessibility     |

### Backend
| Component       | Technology                          |
|-----------------|-------------------------------------|
| Runtime         | Electron 25                         |
| Communication   | Electron IPC                        |
| Database        | PostgreSQL                          |
| ORM             | Drizzle ORM                         |
| Authentication  | JWT with secure storage             |

## � Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/nem-gym.git
cd nem-gym

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
