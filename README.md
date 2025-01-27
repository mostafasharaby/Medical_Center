# Medical Center - Full Stack Web Application 

The  **Medical Center** full-stack web application is an innovative platform designed to streamline healthcare services. Built with .NET 8 for a powerful backend and Angular 18 for an intuitive and responsive frontend, this application ensures seamless experiences for patients, doctors, and administrators. With advanced features like appointment scheduling, medical record access, and role-based dashboards, this platform sets a new standard in healthcare management.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features) Doctor Role and Appointments
- [Admin Dashboard](#Admin-Dashboard)
- [Doctor Role and Appointments](#Doctor-Role-and-Appointments)
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

## Admin Dashboard
###The Admin Dashboard is a powerful control center designed for administrators to efficiently manage the platform:
- **User Role Managemen**: Create, edit, and assign roles (e.g., Administrator, Doctor, Patient).
- **System Analytics**:  Gain insights into appointments, user activity, and system performance through visually appealing charts.
- **Appointment Oversight**:  View, edit, or cancel appointments for seamless administrative control.

## Doctor Role and Appointments
###Doctors have access to a personalized dashboard that enhances their workflow:
- **Appointments Overview**: View upcoming and past appointments with detailed patient information.
- **Appointment Status Updates:**: Update appointment statuses (e.g., Completed, Cancelled, Pending).
- **Medical Records Access**: View patients’ medical histories for informed consultations.


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
