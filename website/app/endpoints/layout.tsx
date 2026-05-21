import type { Metadata } from "next";
import { policyOgSize } from "@/lib/policyOgSize";

const ogPng = "https://iamtrail.com/endpoints/opengraph.png";

export const metadata: Metadata = {
  title: "AWS Endpoint Changes - Botocore Monitor",
  description:
    "Track AWS infrastructure changes from botocore endpoints.json - new regions, new services, and endpoint expansions detected automatically.",
  alternates: {
    canonical: "https://iamtrail.com/endpoints",
  },
  openGraph: {
    siteName: "IAMTrail",
    title: "AWS Endpoint Changes | IAMTrail",
    description:
      "Monitor AWS infrastructure signals - new regions, services, and endpoint changes tracked from botocore.",
    url: "https://iamtrail.com/endpoints",
    images: [
      {
        url: ogPng,
        width: policyOgSize.width,
        height: policyOgSize.height,
        alt: "IAMTrail - AWS Endpoint Changes preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AWS Endpoint Changes | IAMTrail",
    description:
      "Monitor AWS infrastructure signals - new regions, services, and endpoint changes tracked from botocore.",
    images: [ogPng],
  },
};

export default function EndpointsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
