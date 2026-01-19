#  Amazon-Hackon-Backend

A Node.js/Express backend for the sustainable shopping TaskFlow-Kanban project, deployed on Vercel.

## 🚀 Live Deployment

Backend is live at: [https://amazon-hackon-s2-buckets.vercel.app](https://amazon-hackon-s2-buckets.vercel.app)

## 📋 Prerequisites

* Node.js v14+ and npm installed locally
* A MongoDB Atlas cluster with the following:

  * **Database user** with `readWrite` role on your database
  * **Network Access** (IP Whitelist) configured to allow connections from Vercel functions
* Vercel account and CLI (optional)

## 🔧 Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/your-backend-repo.git
   cd your-backend-repo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file in the root directory with the following keys:

   ```ini
   # MongoDB connection string (Atlas cluster)
   mongo_uri=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DATABASE>?retryWrites=true&w=majority

   # JSON Web Token secret
   secret_key=your_jwt_secret_here

   # (Optional) Port for local development
   PORT=8080
   ```

4. **Whitelist Vercel outbound IPs in Atlas**

   In your MongoDB Atlas dashboard:

   1. Go to **Security → Network Access**
   2. Click **Add IP Address**
   3. Enter `0.0.0.0/0` (opens access to all IPs; required for Vercel’s dynamic functions)
   4. Confirm and wait a few minutes to propagate

## 📁 vercel.json

Place this `vercel.json` file at the root of your backend folder (next to `index.js`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

This ensures all incoming requests are routed to your Express app.

## 🚀 Local Development

* **Start the server with nodemon**

  ```bash
  npm run dev
  ```
* **Or** run with Node.js

  ```bash
  npm start
  ```
* The server will listen on `http://localhost:<PORT>` (default 8080).

## 📡 Deployment to Vercel

1. Install Vercel CLI (if not already)

   ```bash
   npm install -g vercel
   ```
2. Log in and deploy

   ```bash
   vercel login
   vercel
   ```

   Follow the prompts to select the correct scope and project.

Vercel will read your `vercel.json`, build your app, and deploy it. Environment variables must be set in the Vercel Dashboard under **Settings → Environment Variables** with the same keys as your `.env` file.

## 📖 API Endpoints

* `GET /getproducts` – fetch all products
* `POST /addproduct` – add a new product (multipart/form-data with `productImage`)
* `POST /signup` – user registration
* `POST /login` – user authentication
* `GET /group` – group-related operations
* And other routes as defined in `routes/`

## 🔒 Security

* CORS is enabled for all origins in development. Restrict `origin` in production as needed.
* Multer uploads are stored in `/uploads`; consider using S3 or another persistent store for production.

---

Made with ❤️ by SHIVAM AND VISHAL
