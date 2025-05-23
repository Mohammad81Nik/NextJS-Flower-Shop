import express from "express";
import dotenv from "dotenv";
import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import prisma from "../db";
import { authenticationMiddleware, errorHandlerMiddleware, notFoundMiddleware, setAuthTokenMiddlewar } from "./middleware";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";

dotenv.config();

const app = express();

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(YAML.load(path.join(__dirname, "..", "swagger.yaml")))
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

app.use(setAuthTokenMiddlewar);

app.use("/api/auth", authRoutes);

app.use("/api/users", authenticationMiddleware, usersRoutes);

app.use(errorHandlerMiddleware);

app.use(notFoundMiddleware)

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
