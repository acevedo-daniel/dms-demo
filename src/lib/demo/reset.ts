import "server-only";

import { getDatabase } from "@/db/client";
import { seedDemoWorkspace } from "@/db/demo-seed";

export async function resetDemoDataset() {
  await seedDemoWorkspace(getDatabase());
}
