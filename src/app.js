import express from "express";
import fileUpload from "express-fileupload";
import { engine } from "express-handlebars";
import morgan from "morgan";
import path from "node:path";
import apiRouter from "./routes/api.routes.js";
import webRouter from "./routes/web.routes.js";
import { notFound } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Morgan registra método, URL, status y tiempo de respuesta en desarrollo.
app.use(morgan("dev"));

// Middleware nativo de Express para cuerpos JSON.
// No necesitamos body-parser para esta tarea.
app.use(express.json());

// Soporta formularios HTML tradicionales codificados como urlencoded.
// Nuestros formularios principales usarán fetch(), pero es útil conocer
// este parser porque forma parte del soporte nativo actual de Express.
app.use(express.urlencoded({ extended: true }));

// express-fileupload interpreta multipart/form-data y agrega req.files.
app.use(
  fileUpload({
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    abortOnLimit: true,
  }),
);

// Express sirve directamente CSS y JavaScript del navegador desde public/.
app.use(express.static(path.resolve("public")));

// Exponemos archivos subidos para que puedan visualizarse mediante URL.
app.use("/uploads", express.static(path.resolve("uploads")));

// Configuramos Handlebars como motor de vistas de Express.
app.engine(
  ".hbs",
  engine({
    // Todas nuestras plantillas usan extensión .hbs.
    extname: ".hbs",

    // main.hbs envolverá las vistas salvo que una vista indique lo contrario.
    defaultLayout: "main",

    // Declaramos las carpetas explícitamente para que la arquitectura
    // de vistas sea fácil de reconocer durante el reforzamiento.
    layoutsDir: path.resolve("views/layouts"),
    partialsDir: path.resolve("views/partials"),

    helpers: {
      // Un helper es una función disponible dentro de las plantillas.
      currentYear: () => new Date().getFullYear(),
    },
  }),
);

// Indicamos a Express que .hbs es nuestro motor de vistas.
app.set("view engine", ".hbs");

// Todas las vistas se encuentran dentro de views/.
app.set("views", path.resolve("views"));

// La API se versiona bajo /api/v1 y responde principalmente JSON.
app.use("/api/v1", apiRouter);

// Las rutas web responden HTML renderizado con Handlebars.
app.use("/", webRouter);

// Los middlewares de error van al final para recibir peticiones
// que no fueron resueltas por ninguna ruta anterior.
app.use(notFound);
app.use(errorHandler);

export default app;
