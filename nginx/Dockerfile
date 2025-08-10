FROM node:20-alpine

WORKDIR /app

#copy dependency files
COPY package*.json ./          

RUN npm install 

#copy rest of the files
COPY . .   

EXPOSE 3000

CMD ["npm", "start"]


