import { policyOgSize } from "@/lib/policyOgSize";
import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

type GuardDutyAnnouncement = {
  type: string;
  detected_at: string;
  description?: string;
  short_description?: string;
  link?: string;
};

type GuardDutySummary = {
  stats?: {
    total: number;
    typeCounts?: Record<string, number>;
  };
  announcements?: GuardDutyAnnouncement[];
};

const TYPE_LABELS: Record<string, string> = {
  NEW_FINDINGS: "New Finding",
  UPDATED_FINDINGS: "Updated Finding",
  NEW_FEATURES: "New Feature",
  NEW_REGION: "New Region",
  GENERAL: "Announcement",
};

function loadGuardDutySummary(): GuardDutySummary | null {
  try {
    const dataPath = path.join(
      process.cwd(),
      "public/data/guardduty-summary.json",
    );
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  if (lastSpace > max * 0.6) {
    return `${sliced.slice(0, lastSpace).replace(/[.,;:!?-]+$/, "")}...`;
  }
  return `${sliced.replace(/[.,;:!?-]+$/, "")}...`;
}

export function buildGuardDutyOgImageResponse() {
  const data = loadGuardDutySummary();

  const total = data?.stats?.total ?? 0;
  const counts = data?.stats?.typeCounts ?? {};
  const featuresCount = counts.NEW_FEATURES ?? 0;
  const findingsCount = (counts.NEW_FINDINGS ?? 0) + (counts.UPDATED_FINDINGS ?? 0);
  const regionsCount = counts.NEW_REGION ?? 0;

  const stats: Array<{ value: string; label: string }> = [
    { value: total.toLocaleString(), label: "Announcements" },
    { value: featuresCount.toLocaleString(), label: "Features" },
    { value: findingsCount.toLocaleString(), label: "Findings" },
    { value: regionsCount.toLocaleString(), label: "Regions" },
  ];

  const latest = data?.announcements?.[0];
  const latestLabel = latest ? TYPE_LABELS[latest.type] ?? "Announcement" : "";
  const latestText =
    latest?.short_description?.trim() || latest?.description?.trim() || "";
  const latestDate = formatDate(latest?.detected_at ?? "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background:
            "linear-gradient(160deg, #0c0c0e 0%, #18181b 50%, #09090b 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontFamily:
                  "ui-monospace, Menlo, Monaco, Consolas, monospace",
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: -0.5,
              }}
            >
              IAMTrail
            </span>
            <span
              style={{
                fontSize: 28,
                fontFamily:
                  "ui-monospace, Menlo, Monaco, Consolas, monospace",
                fontWeight: 700,
                color: "#dc2626",
              }}
            >
              _
            </span>
          </div>
          <span
            style={{
              fontSize: 18,
              color: "#a1a1aa",
              fontFamily: "ui-monospace, Menlo, Monaco, Consolas, monospace",
            }}
          >
            GuardDuty Announcements
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingTop: 8,
            paddingBottom: 8,
            gap: 28,
          }}
        >
          <div
            style={{
              color: "#fafafa",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              textAlign: "center",
              maxWidth: 1080,
              fontFamily: "ui-monospace, Menlo, Monaco, Consolas, monospace",
            }}
          >
            GuardDuty Announcements
          </div>
          <div
            style={{
              color: "#a1a1aa",
              fontSize: 22,
              textAlign: "center",
              maxWidth: 980,
              fontFamily: "ui-monospace, Menlo, Monaco, Consolas, monospace",
            }}
          >
            New findings, feature updates, and region launches from AWS
            GuardDuty SNS
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "12px 22px",
                  borderRadius: 10,
                  backgroundColor: "rgba(24, 24, 27, 0.9)",
                  border: "1px solid #3f3f46",
                  minWidth: 160,
                }}
              >
                <span
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#fafafa",
                    fontFamily:
                      "ui-monospace, Menlo, Monaco, Consolas, monospace",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: "#a1a1aa",
                    fontFamily:
                      "ui-monospace, Menlo, Monaco, Consolas, monospace",
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          {latestText ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                maxWidth: 1040,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  fontFamily:
                    "ui-monospace, Menlo, Monaco, Consolas, monospace",
                }}
              >
                Latest - {latestLabel}
                {latestDate ? ` - ${latestDate}` : ""}
              </span>
              <span
                style={{
                  fontSize: 20,
                  color: "#e4e4e7",
                  textAlign: "center",
                  fontFamily:
                    "ui-monospace, Menlo, Monaco, Consolas, monospace",
                }}
              >
                {truncate(latestText, 120)}
              </span>
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "#71717a",
              fontFamily: "ui-monospace, Menlo, Monaco, Consolas, monospace",
            }}
          >
            iamtrail.com/guardduty
          </span>
        </div>
      </div>
    ),
    {
      width: policyOgSize.width,
      height: policyOgSize.height,
    },
  );
}
