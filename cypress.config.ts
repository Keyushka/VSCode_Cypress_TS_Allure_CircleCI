import { defineConfig } from "cypress";
import { allureCypress } from "allure-cypress/reporter";
import { platform, release, version } from "node:os";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        environmentInfo: {
          os_platform: platform(),
          os_release: release(),
          os_version: version(),
          node_version: process.version,
        },
        resultsDir: "allure-results",
      });
      return config;
    },
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,ts}",
    baseUrl: process.env.BASE_URL,
    env: {
      allureLogCypress: false,
      allureReuseAfterSpec: true,
      token: 'pk_2144410100_UHSIC7AK5SLLZTOD067P1TI0QIXO1YGD',
      token2: process.env.TOKEN
    }
  }
});
