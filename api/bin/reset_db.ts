import { databaseManager } from "@/db/database_manager";
import { resetDB } from "@/db/reset_db";

(async () => {
  const db = await databaseManager.getInstance();
  await resetDB(db);
})();
