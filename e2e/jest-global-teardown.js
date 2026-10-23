import {default as teardownPuppeteer} from "jest-environment-puppeteer/teardown";
import {teardown as teardownDevServer} from "jest-dev-server";

export default async function globalTeardown(globalConfig) {
  await teardownDevServer(globalThis.servers);
  await teardownPuppeteer(globalConfig);
}
