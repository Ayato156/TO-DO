import express from "express";
import {databaseManager} from "@/db/database_manager";

export const app = express();
app.use(express.json());

// 1. 一覧取得
app.get("/api/tasks", async (req, res) => {
  const db = await databaseManager.getInstance();
  const tasks = await db.all("SELECT * FROM tasks ORDER BY id ASC");
  res.json(tasks);
});

// 2. 新規追加（status は 0: todo）
app.post("/api/tasks", async (req, res) => {
  const db = await databaseManager.getInstance();
  const {title} = req.body;
  const result = await db.run(
    "INSERT INTO tasks (title, status) VALUES (?, ?)",
    title,
    0,
  );
  res.json({id: result.lastID, title, status: 0});
});

// 3. ステータス更新（status を 1: done に更新）
app.patch("/api/tasks/:id", async (req, res) => {
  const db = await databaseManager.getInstance();
  const {id} = req.params;
  const {status} = req.body;
  // status が 'done' や 1 で送られてきても 1 になるように設定
  const statusValue = status === "done" || status === 1 ? 1 : 0;
  await db.run("UPDATE tasks SET status = ? WHERE id = ?", statusValue, id);
  res.json({message: "Task updated successfully"});
});

// 4. 完了済みタスクの一括削除（status が 1 のものを削除！）
app.delete("/api/tasks/done", async (req, res) => {
  const db = await databaseManager.getInstance();
  await db.run("DELETE FROM tasks WHERE status = 1 OR status = 'done'");
  res.json({message: "Completed tasks deleted successfully"});
});
