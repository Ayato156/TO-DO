import {app} from "@/app";
import {databaseManager} from "@/db/database_manager";

export const runServer = (): void => {
  const port = process.env.PORT || 8000;

  const server = app.listen(port, () => {
    console.log(`listening on ${port}`);
  });

  const shutDown = async (): Promise<void> => {
    console.log("Received kill signal, shutting down gracefully");
    await databaseManager.close();
    server.close(() => {
      console.log("Closed out remaining connections");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);
};
