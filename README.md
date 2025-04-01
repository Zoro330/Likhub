# Likhub

A platform for inventors to showcase and collaborate on their inventions.

## Deployment Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Render account (or your preferred hosting platform)

### Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Set the build command: `npm install`
5. Set the start command: `node server.js`

### Frontend Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the following environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   REACT_APP_CLOUDINARY_API_KEY=your_api_key
   ```
4. Set the build command: `npm install && npm run build`
5. Set the publish directory: `build`

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```
3. Create .env files in both frontend and backend directories (see .env.example files)
4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # Start frontend server
   cd ../frontend
   npm start
   ```

## Environment Variables
See `.env.example` files in both frontend and backend directories for required environment variables.

## Security Notes
- Never commit .env files
- Keep your JWT_SECRET secure
- Use environment variables for all sensitive data
- Regularly update dependencies for security patches

## Support
For support, please contact the development team. 