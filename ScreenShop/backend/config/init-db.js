import "dotenv/config";
import { initDB } from "./init.js";
(async () => {
  try {
    await initDB();
    console.log("Database initialized successfully");
    process.exit(0);
  } catch (err) {
    console.error("Database initialization failed", err);
    process.exit(1);
  }
})();