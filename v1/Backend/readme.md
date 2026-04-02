# 🎉 PingWish - Birthday Reminder Backend

PingWish is a web app that lets you **save birthdays** and sends **email reminders** both **one day before** and **on the birthday**. This is the backend, built with **Node.js**, **Express**, and **MongoDB**, with a **cron job** that runs daily to trigger the reminders.

---

## 🚀 Features

- 🎂 Add, edit, delete, and fetch birthdays
- 🔔 Toggle email reminders per entry
- 📬 Automatic daily email reminders
- 🕒 Cron job runs every morning at 9:00 AM
- 📦 RESTful API structure
- 🌐 CORS-enabled & JSON-based API

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **Nodemailer**
- **dotenv**
- **node-cron**
- **date-fns**

---

## 📬 API Endpoints

| Method | Endpoint                         | Description                             |
|--------|----------------------------------|-----------------------------------------|
| POST   | `/api/birthdays`                 | Save a new birthday                     |
| GET    | `/api/birthdays`                 | Get all saved birthdays                 |
| DELETE | `/api/birthdays/:id`             | Delete a birthday entry                 |
| PUT    | `/api/birthdays/:id`             | Edit name, email, or date of birth      |
| PUT    | `/api/birthdays/:id/toggle`      | Toggle the email reminder on/off        |

---

## 🕒 Scheduler (Cron Job)

- **Runs at:** 9:00 AM (every day)
- **Job logic:**
  - Sends email if today is someone’s birthday ✅
  - Sends a reminder if tomorrow is someone’s birthday 🎈
- **Built with:** `node-cron`, `date-fns`, and `nodemailer`
---