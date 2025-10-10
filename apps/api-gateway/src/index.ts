// src/server.ts
import app from "./app";
import { logger } from "./core/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`API Gateway running at http://localhost:${PORT}`);
});
