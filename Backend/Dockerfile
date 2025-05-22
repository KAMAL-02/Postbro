FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema files
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["node", "dist/index.js"]