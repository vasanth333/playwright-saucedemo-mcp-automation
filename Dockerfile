FROM mcr.microsoft.com/playwright:v1.57.0-focal

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create test results directory
RUN mkdir -p test-results

# Set environment variables
ENV NODE_ENV=test
ENV TEST_ENV=test
ENV CI=true

# Default command
CMD ["npm", "run", "test:ci"]