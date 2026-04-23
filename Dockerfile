FROM mcr.microsoft.com/playwright:v1.59.1-jammy-amd64

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Install Playwright browsers and dependencies
RUN npx playwright install --with-deps chromium

# Build frontend
WORKDIR /app/frontend
RUN npm install --include=dev
RUN npm run build

# Return to root
WORKDIR /app

# Environment configuration
ENV NODE_ENV=production
ENV PORT=7860

# Expose port
EXPOSE 7860

# Start application
CMD ["node", "backend/server.js"]
