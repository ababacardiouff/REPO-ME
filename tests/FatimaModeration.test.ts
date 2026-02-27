import axios from "axios";
import { callFatimaModeration } from "../src/services/FatimaModeration";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Fatima moderation allow", async () => {
  process.env.FATIMA_URL = "http://fatima.test";
  mockedAxios.post.mockResolvedValueOnce({ data: { verdict: "ALLOW", score: 95 } } as any);

  const resp = await callFatimaModeration({ text: "Hello" });
  expect(resp.verdict).toBe("ALLOW");
});
