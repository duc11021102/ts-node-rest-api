import swaggerJSDoc from "swagger-jsdoc";

//SWAGGER JS DOC
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger API My Events - OpenAPI 3.0",
      version: "1.0.11",
      license: {
        name: "License Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
      contact: {
        email: "apiteam@swagger.io",
      },
    },
    externalDocs: {
      description: "Web Application",
      url: "http://localhost:5173",
    },
    servers: [
      {
        url: "http://192.168.1.196:8080",
        description: "Development server",
      },
      {
        url: "http://localhost:8080",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/router/*.ts"], // files containing annotations as above
};

export default options;
