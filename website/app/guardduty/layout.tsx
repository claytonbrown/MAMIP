import type { Metadata } from "next";
import { policyOgSize } from "@/lib/policyOgSize";

const ogPng = "https://iamtrail.com/guardduty/opengraph.png";

export const metadata: Metadata = {
  title: "GuardDuty Announcements - SNS Monitor",
  description:
    "Track AWS GuardDuty SNS announcements - new findings, feature updates, region launches, and service changes detected automatically.",
  alternates: {
    canonical: "https://iamtrail.com/guardduty",
  },
  openGraph: {
    siteName: "IAMTrail",
    title: "GuardDuty Announcements | IAMTrail",
    description:
      "Monitor AWS GuardDuty SNS announcements - new findings, features, and region launches.",
    url: "https://iamtrail.com/guardduty",
    images: [
      {
        url: ogPng,
        width: policyOgSize.width,
        height: policyOgSize.height,
        alt: "IAMTrail - GuardDuty Announcements preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GuardDuty Announcements | IAMTrail",
    description:
      "Monitor AWS GuardDuty SNS announcements - new findings, features, and region launches.",
    images: [ogPng],
  },
};

export default function GuardDutyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
