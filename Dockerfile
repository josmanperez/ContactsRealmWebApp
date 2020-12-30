# pull the Node.js Docker image
FROM node:12.15.0

# create the directory inside the container
WORKDIR /usr/src/app

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install --quiet
RUN npm install -g nodemon

# Copy local directory to container - remove if using volumes in docker-compose.yml
COPY . /usr/src/app

# our app is running on port 5000 within the container, so need to expose it
EXPOSE 5000

# the command that starts our app
#CMD ["ls"]
CMD ["nodemon", "api.files/app.js"]

