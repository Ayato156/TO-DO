import "jest-puppeteer";
import "expect-puppeteer";
import {Dialog} from "puppeteer";

describe("TODO APP", () => {
  const dialogHandler = jest.fn((dialog: Dialog) => dialog.dismiss());

  beforeAll(async () => {
    page.on("dialog", dialogHandler);
  });

  beforeEach(async () => {
    await page.goto(`http://localhost:${FRONT_PORT}`);
    await new Promise(r => setTimeout(r, 100));
  });

  test("welcome message", async () => {
    expect(dialogHandler).toHaveBeenCalledTimes(1);

    await page.reload();

    expect(dialogHandler).toHaveBeenCalledTimes(1);
  });

  test("get tasks", async () => {
    const title = await page.$eval('[data-test="task-title"]', el => {
      return (el as HTMLElement).innerText;
    });
    expect(title).toBe("breakfast");
  });

  test("add todo", async () => {
    await page.type("[data-test=input-title]", "new todo");
    await page.click("[data-test=submit]");
    await new Promise(r => setTimeout(r, 100));

    const title = await page.$$eval('[data-test="task-title"]', els => {
      return (els[els.length - 1] as HTMLElement).innerText;
    });
    expect(title).toBe("new todo");
  });

  test("done todo", async () => {
    await page.click(".task:last-child .task__btn");
    await new Promise(r => setTimeout(r, 100));

    const className = await page.$eval(".task:last-child", el => {
      return (el as HTMLElement).getAttribute("class");
    });
    expect(className).toContain("task--done");
  });

  test("clear all done tasks", async () => {
    await page.click(".clear__btn");
    await new Promise(r => setTimeout(r, 100));

    const doneTaskCount = await page.$$eval(
      ".task--done",
      elements => elements.length,
    );
    expect(doneTaskCount).toBe(0);
  });
});
