import { buildGuardDutyOgImageResponse } from "@/lib/guarddutyOgImageResponse";

/**
 * Static .png URL for the /guardduty page Open Graph preview.
 * Generated at build time alongside the rest of the static export.
 */
export async function GET() {
  return buildGuardDutyOgImageResponse();
}

export const dynamic = "force-static";
