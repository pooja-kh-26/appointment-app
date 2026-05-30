
````markdown
# 🏥 Sutra Health Appointment Scheduling Platform

A full-stack healthcare appointment management platform built using the MERN stack, designed to simplify consultation scheduling, automate appointment workflows, and support virtual healthcare services.

The platform enables patients to book appointments online while providing healthcare providers with an efficient system to manage availability, appointments, and virtual consultations.


## ✨ Key Features

### 👨‍⚕️ Patient Experience

- Browse available consultation dates
- View real-time available slots
- Book appointments online
- Receive instant confirmation emails
- Join consultations through secure video meeting links
- Simple and intuitive booking workflow

### 🩺 Doctor & Admin Experience

- Manage weekly availability schedules
- Block specific dates or consultation slots
- View and manage appointments
- Receive appointment notifications automatically
- Prevent scheduling conflicts and double bookings

### ⚙️ Platform Features

- Dynamic slot generation
- Real-time availability updates
- Automated email notifications
- Virtual consultation support using Jitsi Meet
- Secure backend APIs
- Responsive UI for desktop and mobile devices
- Cloud database integration


## 🚀 Live Workflow

### Appointment Booking Flow


Patient Visits Website
          ↓
Select Available Date
          ↓
Select Available Time Slot
          ↓
Enter Details
          ↓
Book Appointment
          ↓
System Validates Availability
          ↓
Appointment Saved
          ↓
Meeting Link Generated
          ↓
Confirmation Emails Sent
````

The system automatically removes booked or blocked slots from availability, ensuring that patients only see valid booking options.

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React DatePicker

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Nodemailer

### Virtual Consultation

* Jitsi Meet

### Deployment

* Vercel (Frontend)
* Render / Railway (Backend)
* MongoDB Atlas (Database)

---

## 📁 Project Structure

```text
appointment/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── build/
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 📌 Core Modules

### Authentication

Handles administrator login and access control.

### Availability Management

Allows healthcare providers to:

* Configure working hours
* Set consultation schedules
* Modify availability dynamically

### Appointment Booking

Responsible for:

* Appointment creation
* Validation
* Storage
* Conflict prevention

### Slot Management

Generates appointment slots based on:

```text
Availability
− Booked Slots
− Blocked Slots
= Available Slots
```

### Date Management

Provides patients with only valid and bookable dates.

### Blocking System

Allows administrators to:

* Block entire days
* Block individual consultation slots

### Email Notification Service

Automatically sends appointment notifications to both patients and doctors.

---

## 📧 Automated Notifications

### Patient Receives

✅ Appointment confirmation

✅ Consultation date & time

✅ Virtual meeting link

### Doctor Receives

✅ Patient information

✅ Appointment details

✅ Consultation link

---

## 🔒 Booking Conflict Prevention

The platform includes validation checks that ensure:

* No duplicate appointments
* No overlapping slots
* No bookings on blocked dates
* No bookings outside configured availability

This guarantees appointment integrity and prevents scheduling conflicts.

---

## 🌐 Virtual Consultation Support

Each appointment automatically generates a dedicated Jitsi Meet room.

Benefits:

* No manual meeting creation
* Secure consultation links
* Instant access for both doctor and patient

---

## ⚡ Getting Started

### Clone Repository

```bash
git clone https://github.com/your-username/sutra-health-appointment-system.git
cd sutra-health-appointment-system
```

---

### Backend Setup

```bash
cd backend

npm install

npm start
```

Server runs on:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

Application runs on:

```text
http://localhost:3000
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 📈 Recent Improvements

### Availability Synchronization

Implemented dynamic availability updates to ensure newly booked appointments are immediately reflected across the system.

### Real-Time Slot Filtering

Available slots are generated dynamically based on:

* Doctor availability
* Existing bookings
* Blocked dates and times

### Email Automation

Improved notification workflows for appointment confirmations and scheduling updates.

### Meeting Integration

Added automatic Jitsi Meet link generation for every confirmed appointment.

---

## 🎯 Future Roadmap

### Planned Features

* Google Calendar Integration
* Appointment Reminders
* WhatsApp Notifications
* SMS Notifications
* Online Payments (Razorpay / Stripe)
* Doctor Dashboard
* Analytics & Reporting
* Multi-Doctor Support
* Patient Appointment History

---

## 🤝 Contributing

Contributions are welcome.

If you'd like to improve the platform:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

---

## 📄 License

This project is developed for Sutra Health and is intended for healthcare appointment management purposes.

---

## 👩‍💻 Author

**Pooja K H**

Full Stack Developer

Built to streamline healthcare appointment scheduling, automate communication, and improve the overall consultation experience for both patients and healthcare providers.

