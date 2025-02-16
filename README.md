# URL Shortener Application

## Overview

This application is a URL Shortener service that allows users to create and manage shortened URLs. It is built with a NestJS backend using MongoDB and a React/Next.js frontend. Users can register and log in, create short URLs (with an option to provide a custom slug), view their created URLs in a dashboard, and track the number of visits for each short URL. The app also implements rate limiting and follows a JSON:API-like response format.

## Features

- **URL Shortening**: Generate short, shareable links for long URLs.
- **Custom Slugs**: Optionally specify a custom, alphanumeric slug for your URL.
- **Redirection**: Accessing a short URL will redirect you to the original link while tracking visits.
- **User Accounts**: Register and log in to manage your URLs.
- **Analytics**: Automatically track the number of visits for each URL.
- **Rate Limiting**: Prevent abuse by limiting the number of requests per minute.
- **Docker Support**: The backend includes a Dockerfile for containerization.

## How to Run Locally

### Prerequisites

- **Node.js** (v16 or later recommended)
- **npm** (comes with Node.js)
- **MongoDB** (running locally on the default port or update the connection string accordingly)
- Optionally, **Docker** (if you prefer to containerize the backend)

### Backend Setup (NestJS & MongoDB)

1. **Clone or copy the backend code** into a directory named `backend`.

2. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

````

3. **Configure MongoDB**:

   - Ensure MongoDB is running locally.
   - The default connection string is set to `mongodb://localhost/url_shortener` in `src/app.module.ts`.
   - Update the connection string if necessary.

4. **Run the Application**:

   - For development:
     ```bash
     npm run start:dev
     ```
   - For production build:
     ```bash
     npm run build
     npm start
     ```

5. **Using Docker**:
   - Build the Docker image:
     ```bash
     docker build -t url-shortener-backend .
     ```
   - Run the container:
     ```bash
     docker run -p 3000:3000 url-shortener-backend
     ```

### Frontend Setup (React with Next.js)

1. **Clone or copy the frontend code** into a directory named `frontend`.

2. **Install Dependencies**:

   ```bash
   cd frontend
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

- **Backend**:
  - The JWT secret is hardcoded as `'your_jwt_secret'` in the example code. In a production environment, store secrets in environment variables.
  - Adjust the MongoDB connection string in `src/app.module.ts` as needed.
- **Frontend**:
  - API endpoints are currently set to `http://localhost:3000`. Modify these URLs if your backend is hosted elsewhere.

## API Endpoints

### URL Endpoints

1. **Create a Short URL**

   - **Endpoint**: `POST /urls`
   - **Description**: Creates a new shortened URL.
   - **Request Body** (JSON):
     ```json
     {
       "originalUrl": "https://example.com/long-url",
       "slug": "optionalCustomSlug" // Optional, must be alphanumeric
     }
     ```
   - **Response** (JSON:API format):
     ```json
     {
       "data": {
         "type": "url",
         "id": "generatedSlug",
         "attributes": {
           "originalUrl": "https://example.com/long-url",
           "slug": "generatedSlug",
           "visits": 0
         }
       }
     }
     ```

2. **Redirect to Original URL**

   - **Endpoint**: `GET /:slug`
   - **Description**: Redirects the client to the original URL corresponding to the given slug. The visit count is incremented.
   - **Response**:
     - HTTP 302 redirect to the original URL if the slug exists.
     - HTTP 404 with an error message if the slug is not found.

3. **Get URLs for Authenticated User**

   - **Endpoint**: `GET /users/urls`
   - **Description**: Retrieves all shortened URLs created by the authenticated user.
   - **Headers**:
     ```
     Authorization: Bearer <JWT token>
     ```
   - **Response** (JSON:API format):
     ```json
     {
       "data": [
         {
           "type": "url",
           "id": "slug",
           "attributes": {
             "originalUrl": "https://example.com/long-url",
             "slug": "slug",
             "visits": 10
           }
         }
         // ... additional URLs
       ]
     }
     ```

4. **Update URL Slug**
   - **Endpoint**: `PATCH /urls/:slug`
   - **Description**: Updates the slug of an existing URL (only allowed if the URL belongs to the authenticated user).
   - **Headers**:
     ```
     Authorization: Bearer <JWT token>
     ```
   - **Request Body** (JSON):
     ```json
     {
       "slug": "newCustomSlug" // Must be alphanumeric
     }
     ```
   - **Response** (JSON:API format):
     ```json
     {
       "data": {
         "type": "url",
         "id": "newCustomSlug",
         "attributes": {
           "originalUrl": "https://example.com/long-url",
           "slug": "newCustomSlug",
           "visits": 10
         }
       }
     }
     ```

### User & Authentication Endpoints

1. **User Registration**

   - **Endpoint**: `POST /users/register`
   - **Description**: Registers a new user.
   - **Request Body** (JSON):
     ```json
     {
       "username": "yourUsername",
       "password": "yourPassword" // Minimum 6 characters
     }
     ```
   - **Response** (JSON:API format):
     ```json
     {
       "data": {
         "type": "user",
         "id": "userId",
         "attributes": {
           "username": "yourUsername"
         }
       }
     }
     ```

2. **User Login**
   - **Endpoint**: `POST /auth/login`
   - **Description**: Authenticates a user and returns a JWT token.
   - **Request Body** (JSON):
     ```json
     {
       "username": "yourUsername",
       "password": "yourPassword"
     }
     ```
   - **Response** (JSON:API format):
     ```json
     {
       "data": {
         "type": "auth",
         "attributes": {
           "access_token": "jwtToken"
         }
       }
     }
     ```

## Additional Notes

- **Rate Limiting**: The backend is configured to allow a maximum of 10 requests per minute per IP address.
- **Validation**: Inputs are validated to ensure that URLs are valid and that custom slugs are alphanumeric.
- **Error Handling**: All errors are returned in a consistent JSON:API format.
- **Security**: Sensitive information (like JWT secrets) should be managed using environment variables in production environments.

Happy coding and enjoy using the URL Shortener!

```

```
````
