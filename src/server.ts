import express from "express";
import dotenv from "dotenv";
import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import prisma from "../db";

dotenv.config();

const app = express();

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(YAML.load(path.join(__dirname, "..", "swagger.yaml")))
);

app.use(express.json());

app.listen(process.env.PORT, async () => {
    try{ 
        await prisma.$connect();
        console.log("Database connected");
        console.log(`Api docs: http://localhost:${process.env.PORT}/api-docs`);
    } catch(err) {
        console.error(err);
        throw err;
    } finally {
        await prisma.$disconnect();
    }
});
