import { buildEndpointsOgImageResponse } from "@/lib/endpointsOgImageResponse";

/**
 * Static .png URL for the /endpoints page Open Graph preview.
 * Generated at build time alongside the rest of the static export.
 */
export async function GET() {
  return buildEndpointsOgImageResponse();
}

export const dynamic = "force-static";
