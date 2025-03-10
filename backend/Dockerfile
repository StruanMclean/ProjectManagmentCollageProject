FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma client
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/mydb?schema=public"
ENV PORT=4000
ENV JWT_SECRET="KerianRossIsOurPresident"
ENV NODE_ENV="development"

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --only=production

# Generate Prisma client for production
RUN npx prisma generate

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 4000

ENV KAFKAJS_NO_PARTITIONER_WARNING=1

CMD ["node", "dist/main"]