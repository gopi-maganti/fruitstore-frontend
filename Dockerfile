# This Dockerfile is for fruitstore-frontend, a React application for managing a fruit store.
# The first stage builds the application using Node.js.
FROM node:18-alpine

# Add Label to the image
LABEL \
    name="Gopi Krishna Maganti" \
    email="gopi.maganti1998@gmail.com" \
    description="Docker Container for Fruitstore Frontend"

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host"]
