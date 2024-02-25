# Use the official Node.js image as a base
FROM node:20

# Set the working directory
WORKDIR /app

# Install ClamAV
RUN apt-get update && apt-get install -y clamav

# Copy ClamAV database files
RUN freshclam

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 4001

# Command to run your app
CMD ["npm","run","dev"]