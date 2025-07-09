# Project Overview:
Build a backend API for a simplified e-commerce system. This API will handle user registration and login, product management, order processing, and automated inventory alerts. The goal is to create a robust and secure system that demonstrates your understanding of Node.js, Express.js, database interactions, user authentication, and scheduled tasks



# Clone the repository: 
https://github.com/Training-Rapidops/Neha-Kanki/tree/master/Node/E-Commerce%20Product%20Management

# Install dependencies:
 npm install

# Start the Application: 
npm run dev

# API Documentation
https://documenter.getpostman.com/view/31919969/2sB2cU9hef

# config folder
Configuration files for essential services:

database.js: Handles the database connection setup, connects to a MongoDB database using Mongoose
 
email.js: Sets up the email service functionality using node-mailer

emailTemplate.js: Defines reusable HTML templates for email alerts.

# Middleware

auth.js: for authentication and authorization
errorHandler.js : for handling errors

application level middleware : morgan for logging the incoming requests

# models folder
Database models for MongoDB:

Order.js: Defines the schema for orders, including products, customer, and status.

Product.js: Defines the schema for products with attributes like name, description, price, category and stock.

User.js: Defines the schema for user details: email, password and roles.

# controller folder

auth.js : register and login user
cronjob.js : to schedule email for admins those hit the minimum threshold value
Order.js : CRUD of orders
(Admins can change the status of order but not cancel while customer can cancel order only when the status is in pending)
product.js : Admins can perform all crud and customers can get all the products

# routes folder

different routes for respective controllers

# .env 

PORT , JWT_SECRET , MONGODB_URL, EMAIL_USER, EMAIL_PASS


