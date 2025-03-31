# SignifyPlus Backend

## Overview

SignifyPlus Backend is built using **Node.js** and **Express.js**, with **MongoDB** as the database. The application includes WebSocket management and routing for user and home endpoints.

---

## Features

- REST API for user and home functionalities.
- WebSocket management for real-time communication.
- MongoDB integration for database operations.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas instance)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

---

## Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/YunoGasasi9862/signify-plus.git
cd signify-plus
cd backend
```

### 2. Install Dependencies

Install all required Node.js packages using the `package.json` file:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
MONGO_DB_URL=<Your MongoDB Connection String>
PORT=3000
```

- Replace `<Your MongoDB Connection String>` with your MongoDB URI.
- `PORT` is the port number where the application will run.

### 4. Firebase Integration (Optional)

If connecting the MongoDB URI from Firebase, ensure the Firebase SDK is configured and the URI is retrieved dynamically.

### 5. Run the Application

Start the server:

```bash
node server/server.js
```

---

## Project Structure

```plaintext
signify-plus/backend/
├── managers/
│   └── websocketManager.js
├── routes/
│   ├── HomeRoute.js
│   └── UserRoutes.js
├── utilities/
│   └── encrypt.js
├── server/
│   └── server.js
├── .env
├── package.json
└── README.md
```

- **managers/**: WebSocket management.
- **routes/**: API route handlers for users and home.
- **utilities/**: Utility functions like encryption.
- **server/**: Entry point for starting the server.

---

## Usage

### API Endpoints

- **User Routes**: `/users`
- **Home Routes**: `/`

### WebSocket Management

WebSocketManager is initialized after the server starts. Extend its functionality by editing `managers/websocketManager.js`.

---

## Troubleshooting

### MongoDB Connection Error

If you encounter a MongoDB connection error:

1. Verify the `MONGO_DB_URL` in your `.env` file.
2. Check your network access and credentials for MongoDB Atlas or local instance.
3. Ensure MongoDB is running if using a local instance.

### Port Already in Use

If the specified port is in use, modify the `PORT` value in the `.env` file to a different number.

---

## Future Enhancements

- Add detailed API documentation (e.g., using Swagger).
- Enhance WebSocketManager with more real-time event handling.
- Implement Firebase dynamic configuration for MongoDB URI.

---

## License

This project is licensed under the MIT License.
