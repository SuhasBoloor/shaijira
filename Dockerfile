FROM node:24-slim

# 1. Install PostgreSQL and Redis inside the container
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql postgresql-contrib \
    redis-server \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Copy package files for Docker layer caching
COPY package*.json ./
COPY client/package*.json ./client/

# 3. Install backend and frontend dependencies
RUN npm install
RUN npm --prefix client install

# 4. Copy all application files
COPY . .

# 5. Build the React frontend production bundle
RUN npm --prefix client run build

# 6. Remove client node_modules to keep image lean
RUN rm -rf client/node_modules

# 7. Make start.sh executable
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]
