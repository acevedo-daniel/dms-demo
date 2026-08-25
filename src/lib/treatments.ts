import "server-only";

import { asc, eq } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import { treatments } from "@/db/schema";
import { DEMO_PRACTICE_ID } from "@/lib/demo/constants";

export type TreatmentCatalogItem = {
  category: string;
  defaultDurationMinutes: number;
  description: string;
  id: string;
  name: string;
};

export async function getTreatmentCatalog(): Promise<TreatmentCatalogItem[]> {
  return getDatabase()
    .select({
      category: treatments.category,
      defaultDurationMinutes: treatments.defaultDurationMinutes,
      description: treatments.description,
      id: treatments.id,
      name: treatments.name,
    })
    .from(treatments)
    .where(eq(treatments.practiceId, DEMO_PRACTICE_ID))
    .orderBy(asc(treatments.name));
}
