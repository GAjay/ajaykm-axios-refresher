import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createAxiosRefresh } from "../src";

beforeAll(() => {
    (global as any).BroadcastChannel = class {
      postMessage() {}
      addEventListener() {}
      close() {}
    };
  });

test("refresh flow works", async () => {
  const mock = new MockAdapter(axios);
  const api = axios.create();

  createAxiosRefresh({
    axiosInstance: api,
    refreshTokenFn: async () => "token"
  });

  mock.onGet("/secure").replyOnce(401);
  mock.onGet("/secure").reply(200, { ok: true });

  const res = await api.get("/secure");
  expect(res.status).toBe(200);
});