FROM node:16
# as build

# Create app directory
WORKDIR /

COPY package*.json ./

# Remove proxy
RUN npm run start

RUN npm install --network-timeout 1000000
# RUN yarn install

# Bundle app source
COPY . .

EXPOSE 8080
# RUN npx browserslist@latest --update-db
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s" ,"build","-l","8080"]

# FROM nginx:1.19

#COPY ./nginx/nginx.conf etc/nginx/nginx.conf
#COPY --from=build /app/build user/share/nginx/html