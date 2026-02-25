import { Container, getContainer } from "@cloudflare/containers";
import { env as workerEnv } from "cloudflare:workers";

interface Env {
  RUST_LOGI: DurableObjectNamespace<RustLogiContainer>;
  DATABASE_URL: string;
  JWT_SECRET: string;
  STORAGE_BACKEND: string;
  R2_BUCKET: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_KEY: string;
}

const e = workerEnv as unknown as Env;

export class RustLogiContainer extends Container<Env> {
  defaultPort = 8080;
  sleepAfter = "1m";
  envVars = {
    SERVER_PORT: "8080",
    SERVER_HOST: "0.0.0.0",
    DATABASE_URL: e.DATABASE_URL,
    JWT_SECRET: e.JWT_SECRET,
    STORAGE_BACKEND: e.STORAGE_BACKEND,
    R2_BUCKET: e.R2_BUCKET,
    R2_ACCOUNT_ID: e.R2_ACCOUNT_ID,
    R2_ACCESS_KEY: e.R2_ACCESS_KEY,
    R2_SECRET_KEY: e.R2_SECRET_KEY,
    DVR_NOTIFICATION_ENABLED: "true",
    DVR_LINEWORKS_BOT_URL: "https://lineworks-bot-rust-566bls5vfq-an.a.run.app",
    GOOGLE_CLIENT_ID: "747065218280-9httjrj60r8phntvba226vcr1m6u95tg.apps.googleusercontent.com",
    FLICKR_CONSUMER_KEY: "ce52fba1099524b9eb0fb0b1913547b5",
    FLICKR_CONSUMER_SECRET: "74de269c7d0b550f",
    CAM_DIGEST_USER: "admin",
    CAM_DIGEST_PASS: "Ohishi55",
    CAM_MACHINE_NAME: "TS-NA230WP-48",
    CAM_SDCARD_CGI: "https://car.mtamaramu.com/camera-cgi/admin/sdcard.cgi?action=generate&pagesize=1000&pagenum=1&dir=",
    CAM_MP4_CGI: "https://car.mtamaramu.com/playmp4.cgi?storage=sd&file=/",
    CAM_JPG_CGI: "https://car.mtamaramu.com/snapshot.cgi?storage=sd&file=/",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const container = getContainer(env.RUST_LOGI, "main-v5");
      const response = await container.fetch(request);
      console.log(`[proxy] ${request.method} ${new URL(request.url).pathname} → ${response.status}`);
      return response;
    } catch (err) {
      const pathname = new URL(request.url).pathname;
      console.error(`[proxy] ${request.method} ${pathname} threw:`, err);
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
