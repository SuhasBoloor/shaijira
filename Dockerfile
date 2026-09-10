FROM node:24-slim

WORKDIR /app

# 1. Copy package files for Docker layer caching
COPY package*.json ./
COPY client/package*.json ./client/

# 2. Install backend and frontend dependencies
RUN npm install
RUN npm --prefix client install

# 3. Copy all application files
COPY . .

# 4. Build the React frontend production bundle
RUN npm --prefix client run build

# 5. Remove client node_modules to keep image lean
RUN rm -rf client/node_modules

EXPOSE 3000

CMD ["node", "server.js"]