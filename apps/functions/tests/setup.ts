import { getLatestBlock } from "@repo/database/src/actions";
import { clearDatabase, closeDatabase } from "@repo/database/src/drizzle";

beforeEach(async () => {
  await clearDatabase();
  const latestSavedBlock = await getLatestBlock();
  expect(latestSavedBlock).toStrictEqual(0);
});

afterEach(async () => {
  await closeDatabase();
});
