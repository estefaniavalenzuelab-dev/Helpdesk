import app from "./app.js";
import { appPort } from "./config/env.js";
import { sequelize } from "./config/sequelize.js";
import "./models/index.js";

try {
  // authenticate() comprueba que las credenciales sean válidas y que
  // PostgreSQL esté accesible. No crea ni modifica tablas.
  await sequelize.authenticate();

  app.listen(appPort, () => {
    console.log(`HelpDesk running on http://localhost:${appPort}`);
  });
} catch (error) {
  // Un fallo aquí suele indicar credenciales incorrectas, PostgreSQL apagado
  // o una base DB_NAME que todavía no existe.
  console.error("Could not start server:", error);
  process.exit(1);
}
