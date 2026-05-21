import { policyOgSize } from "@/lib/policyOgSize";
import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

type EndpointChange = {
  detected_at: string;
  summary: string;
  changes?: Array<{ description: string }>;
};

type EndpointsSummary = {
  currentState?: {
    totalRegions: number;
    totalServices: number;
    totalPartitions: number;
    partitions?: Array<{
      partition: string;
      serviceCount: number;
    }>;
  };
  changeStats?: {
    totalChangeItems: number;
    uniqueServices: number;
    uniqueRegions: number;
  };
  recentChanges?: EndpointChange[];
};

function loadEndpointsSummary(): EndpointsSummary | null {
  try {
    const dataPath = path.join(
      process.cwd(),
      "public/data/endpoints-summary.json",
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

export function buildEndpointsOgImageResponse() {
  const data = loadEndpointsSummary();

  const awsPartition = data?.currentState?.partitions?.find(
    (p) => p.partition === "aws",
  );
  const totalRegions = data?.currentState?.totalRegions ?? 0;
  const totalServices =
    awsPartition?.serviceCount ?? data?.currentState?.totalServices ?? 0;
  const totalChanges = data?.changeStats?.totalChangeItems ?? 0;

  const stats: Array<{ value: string; label: string }> = [
    { value: totalRegions.toLocaleString(), label: "Regions" },
    { value: totalServices.toLocaleString(), label: "Services" },
    { value: totalChanges.toLocaleString(), label: "Changes tracked" },
  ];

  const latest = data?.recentChanges?.[0];
  const latestSummary = latest?.summary ?? "";
  const latestDate = formatDate(latest?.detected_at ?? "");
  const latestDetail = latest?.changes?.[0]?.description ?? "";

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
            AWS Endpoint Changes
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
            AWS Endpoint Changes
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
            New regions, new services, and endpoint expansions tracked from
            botocore
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
                  minWidth: 180,
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
          {latestSummary ? (
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
                Latest{latestDate ? ` - ${latestDate}` : ""}
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
                {latestSummary}
              </span>
              {latestDetail ? (
                <span
                  style={{
                    fontSize: 16,
                    color: "#a1a1aa",
                    textAlign: "center",
                    fontFamily:
                      "ui-monospace, Menlo, Monaco, Consolas, monospace",
                  }}
                >
                  {truncate(latestDetail, 110)}
                </span>
              ) : null}
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
            iamtrail.com/endpoints
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
