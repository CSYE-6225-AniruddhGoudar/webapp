# webapp
This project is a web application built using Node.js and PostgreSQL. 
It serves as a basic template for creating web applications with CRUD operations using a database.

## Table of Contents

- Installation

- Usage


## Installation

To get started with the project, follow these steps:

1. Clone the repository to your local machine:

   git clone <repository-url>

2. Navigate to the project directory:

   cd project-directory
   
3. Install dependencies:

   npm install

4. Set up the PostgreSQL database:
   
   - PostgreSQL installed on your system.
   - Create a new database for the project.

5. Configure the database connection:
   
   - In the project, locate the database configuration file (e.g.database.js).
   - Update the database connection details such as host, port, username, password, and database name according to  PostgreSQL setup.(using .env) 
     

## Usage

Once the installation and setup are complete, you can start the web application by running:

npm start

This will start the server, and you can access the application using Postman

The application provides CRUD (Create, Read, Update, Delete) operations for managing data in the PostgreSQL database. 

# Packer
Customize the packer.hcl file for image configuration

Build the custom image using Packer:

Once build is complete, the custom image is avalable in GCP for VM creation or etc.