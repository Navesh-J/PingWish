# 🎉 PingWish - Birthday Reminder App

PingWish is a full-stack web application that lets you **save birthdays** and sends **automated email reminders** **one day before** and **on the birthday**.

Built using **React, Node.js, Express, and MongoDB**, it also features dark mode, search, sorting by upcoming birthdays, and more.

---

## 🚀 Features

✅ Add, edit, delete, and search birthdays  
✅ Toggle email reminders for individual entries  
✅ Automatically sends emails at **9:00 AM** for today's and tomorrow's birthdays  
✅ Sorts the list by nearest upcoming birthdays  
✅ Dark mode toggle for a pleasant viewing experience  
✅ Responsive design with toast notifications & animations

---

## 🛠 Tech Stack

### 💻 Frontend
- **React** (with hooks)
- **Tailwind CSS**
- **Framer Motion** (animations)
- **React Toastify** (notifications)
- **Axios**

### 🖥 Backend
- **Node.js** & **Express.js**
- **MongoDB** (with Mongoose)
- **Nodemailer** (for emails)
- **node-cron** & **date-fns** (for scheduling)
- **dotenv**

---

## ⚙ How it Works

- Users can save birthdays along with names and emails.
- Toggle reminders on/off for each entry.
- Every day at **9:00 AM**, the scheduler checks for birthdays:
  - Sends an email if today is someone's birthday.
  - Sends an advance email one day before.
- Emails are sent via **Nodemailer**.

---

## 🔗 Live Link
| [🌐 PingWish Frontend](https://pingwish.vercel.app)

---

## ✨ Acknowledgements
- Inspired by the idea of forgetting birthdays 😉
- Thanks to open-source libraries that made it possible.

## 📫 Contact

- For any queries or collaboration, feel free to reach out on GitHub.

## 🎉 Enjoy PingWish and never miss a birthday again!