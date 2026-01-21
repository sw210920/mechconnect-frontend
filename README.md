# MechConnect - Frontend

MechConnect is a vehicle service booking platform that helps users find nearby mechanics based on location and service type, and book maintenance services easily.

This repository contains the **Frontend UI** of MechConnect.

---

## 🚀 Features
- Responsive UI
- Find Mechanic page (Search by location + specialization)
- Mechanic listing UI
- Booking form UI (Doorstep service / Visit mechanic)
- Login / Register pages
- Forgot Password UI (OTP based)
- Simple and clean design

---

## 🛠 Tech Stack
- HTML5
- CSS3
- JavaScript
- Bootstrap (if used)
- Fetch API (Backend integration)

---

## 📂 Project Structure (Typical)
```
mechconnect-frontend/
 ├── index.html
 ├── pages/
 │   ├── find-mechanic.html
 │   ├── login.html
 │   ├── register.html
 │   ├── booking.html
 │   └── forgot-password.html
 ├── css/
 ├── js/
 └── assets/
```

---

## ▶️ Run the Project

### ✅ 1) Clone the Repository
Replace `<your-username>` and repo name if needed:

```bash
git clone git@github.com:sw210920/mechconnect-frontend.git
cd mechconnect-frontend
```

### ✅ 2) Open in Browser
You can run the project by opening:

- `index.html` in any browser ✅

OR use **VS Code Live Server** for best experience.

---

## 🔗 Backend Integration

Set your backend base URL in your JS files (example):

```js
const BASE_URL = "http://localhost:8080";
```

Example API call:
```js
fetch(`${BASE_URL}/mechanics/all`)
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ✅ Future Enhancements
- Dynamic mechanic listing from backend
- Booking confirmation + success page
- Profile pages for customers and mechanics
- Admin dashboard UI
- Payment integration UI

---

## 📸 Screenshots
Add screenshots here for better GitHub and LinkedIn presentation.

---

## 👨‍💻 Developed By
**Shubham Wani**  
Java Full Stack Developer  
LinkedIn: linkedin.com/in/shubham-wani-91074a213

---

## 📜 License
This project is created for learning and portfolio purposes.
