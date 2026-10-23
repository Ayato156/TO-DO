export class Application {
  start = async (): Promise<void> => {
    // --- 1. ウェルカムメッセージ（初回アクセス時のみ） ---
    const hasShownWelcome = localStorage.getItem("hasShownWelcome");
    if (!hasShownWelcome) {
      alert("Welcome to TODO APP");
      localStorage.setItem("hasShownWelcome", "true");
    }

    const taskListElement = document.querySelector(".task-list");
    const formElement = document.querySelector(".form");
    const inputElement =
      document.querySelector<HTMLInputElement>(".form__title");
    const clearElement = document.querySelector(".clear");

    if (!taskListElement || !formElement || !inputElement) return;

    // --- 画面描画用の関数 ---
    const renderTasks = async () => {
      const response = await fetch("/api/tasks");
      const tasks: {id: number; title: string; status: number | string}[] =
        await response.json();

      let listHtml = "";
      for (const task of tasks) {
        const isDone = task.status === 1 || task.status === "done";
        const statusClass = isDone ? "task--done" : "task--todo";

        listHtml += `
          <li class="task ${statusClass}" data-id="${task.id}">
            <div class="task__btn"></div>
            <div data-test="task-title" class="task__title">${task.title}</div>
          </li>
        `;
      }
      taskListElement.innerHTML = listHtml;
    };

    // 2. 初回ロード時にタスクを描画
    await renderTasks();

    // 3. 新規追加フォーム送信
    formElement.addEventListener("submit", async event => {
      event.preventDefault();

      const title = inputElement.value.trim();
      if (!title) return;

      await fetch("/api/tasks", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title}),
      });

      inputElement.value = "";
      await renderTasks();
    });

    // 4. 完了チェックボタンクリック
    taskListElement.addEventListener("click", async event => {
      const target = event.target as HTMLElement;
      if (!target.classList.contains("task__btn")) return;

      const liElement = target.closest("li");
      if (!liElement || liElement.classList.contains("task--done")) return;

      const taskId = liElement.getAttribute("data-id");
      if (!taskId) return;

      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({status: 1}),
      });

      liElement.classList.remove("task--todo");
      liElement.classList.add("task--done");
    });

    // 5. 完了タスクの一括削除
    if (clearElement) {
      clearElement.addEventListener("click", async () => {
        await fetch("/api/tasks/done", {
          method: "DELETE",
        });
        await renderTasks();
      });
    }
  };
}
