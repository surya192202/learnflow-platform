# Build Stage for Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app

# Copy dependency files
COPY package*.json ./
# Install production dependencies only
RUN npm install --omit=dev

# Copy backend source
COPY backend ./backend

# Copy built frontend from build stage
COPY --from=frontend-build /app/dist ./dist

# Environment variables (to be overridden at runtime)
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start the server
CMD ["npm", "start"]
