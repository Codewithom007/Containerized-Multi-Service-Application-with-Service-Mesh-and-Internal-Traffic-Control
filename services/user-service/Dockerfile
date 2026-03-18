# Start with official Node.js 18 on Alpine Linux (very small image)
FROM node:18-alpine
 
# Set working directory inside the container
WORKDIR /app
 
# Copy package files first
# Why first? Docker caches layers. If package.json hasn't changed,
# Docker won't re-run npm install — saving time on rebuilds.
COPY package*.json ./
 
# Install Node.js dependencies
RUN npm install --production
 
# Copy all application code
COPY . .
 
# Create a non-root user for security
# Running as root inside containers is a security risk
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
 
# Tell Docker this app listens on port 3001
EXPOSE 3001
 
# Command to run when the container starts
CMD ["node", "app.js"]
