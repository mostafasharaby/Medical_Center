# Medical Center - Full Stack Web Application 

The **Medical Center** full-stack web application is a comprehensive platform for managing healthcare services. It is built with **.NET 8** for a robust and scalable backend and **Angular 18** for a dynamic and responsive frontend. This application offers seamless functionality for patients, doctors, and administrators, including appointment management and medical records.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Security](#security)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used
- **Backend**: ASP.NET Core (.NET 8)
- **Frontend**: Angular 18
- **Database**: SQL Server
- **Authentication & Authorization**: ASP.NET Core Identity, JWT, and OAuth (Google Login)
- **API Communication**: RESTful APIs
- **UI/UX Framework**: Angular Material for a modern and accessible interface

## Features

### User-Facing Features
- **Secure User Authentication**: Multi-layered authentication including:
  - **Traditional Login**: Email and password-based login.
  - **Google OAuth Integration**: One-click Google login for seamless access.
  - **Email Confirmation**: Mandatory email confirmation to verify and activate user accounts.
  - **Password Reset**: Secure password recovery with email notifications.
- **Appointment Scheduling**: Comprehensive appointment management system for patients and doctors.
- **Medical Records Access**: Patients can securely view and update their medical history.
- **Notifications System**: Automated reminders for upcoming appointments via email and in-app notifications.
- **Mobile-Responsive Design**: Optimized for desktops, tablets, and smartphones.


## Security
- **Data Protection**: End-to-end encryption for sensitive data.
- **JWT Authentication**: Secure token-based authentication for API communication.
- **OAuth 2.0**: Google login integration with secure token exchange.
- **Email Verification**: Ensures only verified users can access the system.
- **Password Policies**: Enforced strong password rules and secure password storage using hashing algorithms.

## Getting Started

### Prerequisites
To run this project locally, ensure the following tools are installed:
- **Node.js** and **npm** for Angular development.
- **.NET SDK 8** for backend development.
- **SQL Server** for database management.
- **Git** for version control.

### Installation

#### Clone the Repository
```bash
git clone https://github.com/mostafasharaby/Medical-Center.git
cd Medical-Center
