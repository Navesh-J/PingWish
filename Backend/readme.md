# 🎉 PingWish - Birthday Reminder Backend

PingWish is a simple web application that lets you save birthdays and sends **email reminders** both **one day before** and **on the birthday**. This is the backend for the app, built with Node.js, Express, and MongoDB.

---

## 🚀 Features

- 🎂 Add and store birthdays
- 📬 Sends email reminders automatically
- 🕒 Scheduler runs every morning at 9 AM
- 🧹 Delete birthday entries
- 🗂 RESTful API structure

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

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/birthdays`     | Save a birthday   |
| GET    | `/api/birthdays`     | Get all birthdays |
| DELETE | `/api/birthdays/:id` | Delete a birthday |


## 🕒 Scheduler

    Runs daily at 9:00 AM

    Sends emails for:

        Today's birthdays

        Tomorrow's birthdays