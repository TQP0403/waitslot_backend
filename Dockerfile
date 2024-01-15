FROM --platform=linux/amd64 node:20-bullseye AS dev

# Set the working directory
WORKDIR /usr/src/app

# NPM
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the application code
COPY . .

# Build the application
RUN npm run build

ENV NODE_ENV=development
ENV NODE_PORT=8080

CMD [ "node", "dist/main" ]

# ===================================================================

FROM --platform=linux/amd64 node:20-bullseye AS prod

# Set the working directory
WORKDIR /usr/src/app

# NPM
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the application code
COPY . .

# Build the application
RUN npm run build

ENV NODE_ENV=production
ENV NODE_PORT=8080

CMD [ "node", "dist/main" ]