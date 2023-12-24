# Blogster

This is a MERN (MongoDB, Express.js, React.js, Node.js) web application that allows users to create posts with images. Images are uploaded to Cloudinary, and post details are stored in a MongoDB database.

## Features

- User authentication (token-based)
- Creating and viewing posts
- Image upload to Cloudinary
- Visit tracking for each post

## Getting Started

### Installation

1. Clone the repository.
2. Install server dependencies by going to the backend directory.
      - cd ./backend
      - yarn
3. Install client dependencies by going to the frontend directory
      - cd ./frontend
      - yarn
4. Obtain your Cloudinary API key, API secret, and cloud name.
5. Update the Cloudinary configuration and other env variables in the .env file for both frontend and backend
6. Start the client by using yarn run dev
7. Start the server by using yarn run start-dev


The frontend should now be running at http://localhost:5173.
And the server should now be running at http://localhost:3500.
