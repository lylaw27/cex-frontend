FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
ENV NEXT_PUBLIC_ORDERBOOKIP="exchangegg-209356939874.us-west1.run.app"
ENV NEXT_PUBLIC_WALLET_ADDRESS="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
ENV NEXT_PUBLIC_ENV=prod
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]
