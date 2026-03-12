import type { NormalizedPayload, FeasibilityMetrics } from "../types/index.js";
export declare const INPUT_KEYS: readonly ["landArea", "landCost", "landPsf", "gfa", "nsaResi", "nsaRetail", "buaResi", "buaRetail", "unitsResi", "unitsRetail", "resiPsf", "retailPsf", "carParkIncome", "cofOnSalesPct", "ccPsf", "softPct", "statPct", "contPct", "devMgmtPct", "cofPct", "salesExpPct", "mktPct"];
export type InputKey = (typeof INPUT_KEYS)[number];
export declare function normalizePayload(payload?: Record<string, unknown>): NormalizedPayload;
export declare function calculateMetrics(payload: Record<string, unknown> | NormalizedPayload): FeasibilityMetrics;
//# sourceMappingURL=calculations.d.ts.map