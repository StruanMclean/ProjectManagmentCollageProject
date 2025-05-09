FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies and NestJS CLI globally
RUN npm install
RUN npm install -g @nestjs/cli

# Environment variables
ENV NODE_ENV="development"
ENV PORT=4000
ENV JWT_SECRET="KerianRossIsOurPresident"
ENV KAFKAJS_NO_PARTITIONER_WARNING=1


# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma db push
RUN npx prisma generate

# Copy the rest of the application
COPY . .

RUN npm install

# Expose port
EXPOSE 4000

CMD ["npm", "run", "start"]