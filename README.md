

# Full Stack Chat Application

This is a real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Socket.io for live messaging and Cloudinary for image uploads. It features user authentication, chat history, media sharing, and online status indicators.

---

## Features

* **User Authentication** (JWT based)
* **One-to-One Messaging**
* **Image Uploads** via Cloudinary
* **Unseen Message Count**
* **Online/Offline Status Indicators**
* **Real-time Communication** using Socket.io
* **User Search**
* **Message Seen Tracking**

---

## Tech Stack

### Frontend:

* **React.js**
* **Tailwind CSS**
* **Axios** (API requests)
* **Socket.io-client**
* **React Context API** (state management)
* **Vite** (build tool)

### Backend:

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **Cloudinary SDK**
* **Socket.io**
* **JWT** for authentication

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sowmya-rebbavarapu/chat-app
cd chat-app
```
---

### 2. Setup Backend

```bash
cd server
npm install
```

* Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

> Ensure both frontend and backend are running concurrently.


