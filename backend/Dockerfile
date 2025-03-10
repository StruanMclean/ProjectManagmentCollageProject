FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Environment variables
ENV NODE_ENV="development"
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/mydb?schema=public"
ENV PORT=4000
ENV JWT_SECRET="KerianRossIsOurPresident"
ENV KAFKAJS_NO_PARTITIONER_WARNING=1

# Expose port
EXPOSE 4000

# Simply run npm start
CMD ["npm", "run", "start"]