import { Router } from "express";
import { getHealth } from "../controllers/health.controller.js";
import authRouter from "./auth.routes.js";
import ticketRouter from "./ticket.routes.js";
import userRouter from "./user.routes.js";

// Router() permite dividir la API en archivos sin crear otra aplicación Express.
const router = Router();

// Health permanece público para diagnóstico y pruebas.
router.get("/health", getHealth);

// router.use(prefijo, subrouter) delega grupos completos de endpoints.
router.use("/auth", authRouter);
router.use("/tickets", ticketRouter);
router.use("/users", userRouter);

export default router;
