# Use official Node.js LTS image as base
FROM node:20-alpine

# Set working directory
WORKDIR /smartlot

COPY package.json /smartlot/

RUN rm -rf /smartlot/node_modules

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /smartlot/
