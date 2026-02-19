import { ImageResponse } from "next/og";
import { getPlayerById } from "@/data/players";
import { positionalFamiliarity } from "@/config";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const player = await getPlayerById(Number(id));
  if (!player) return new Response("Player not found", { status: 404 });

  const { firstName, lastName, overall, positions, pace, shooting, passing, dribbling, defense, physical, age, height } = player.metadata;
  const pos = positions[0];

  const statColor = (v: number) => v >= 85 ? "#16a34a" : v >= 70 ? "#ca8a04" : v >= 55 ? "#ea580c" : "#6b7280";

  const stats = [
    { label: "PAC", value: pace },
    { label: "DRI", value: dribbling },
    { label: "PAS", value: passing },
    { label: "SHO", value: shooting },
    { label: "DEF", value: defense },
    { label: "PHY", value: physical },
  ];

  const familiarity = positionalFamiliarity.find(p => p.primaryPosition === pos);
  const allPositions = ["GK","CB","RB","LB","RWB","LWB","CDM","CM","CAM","RM","LM","RW","LW","CF","ST"];
  const posRatings = allPositions
    .filter(p => {
      if (p === "GK" && !positions.includes("GK")) return false;
      const isPrimary = positions[0] === p;
      const isSecondary = positions.slice(1).includes(p);
      const adj = familiarity?.adjustment[p as keyof typeof familiarity.adjustment];
      return isPrimary || isSecondary || adj === -5 || adj === -8;
    })
    .map(p => {
      const adj = familiarity?.adjustment[p as keyof typeof familiarity.adjustment] ?? 0;
      const isPrimary = positions[0] === p;
      const isSecondary = positions.slice(1).includes(p);
      const badge = isPrimary ? "P" : isSecondary ? "S" : adj === -5 ? "FF" : "SF";
      const badgeColor = isPrimary ? "#16a34a" : isSecondary ? "#65a30d" : adj === -5 ? "#ca8a04" : "#ea580c";
      const rating = Math.round(overall + adj);
      return { pos: p, badge, badgeColor, rating, diff: adj };
    });

  return new ImageResponse(
    (
      <div style={{
        width: "600px",
        background: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        color: "#0f172a",
        border: "1px solid #e2e8f0",
        gap: "0px",
      }}>

        {/* TOP ROW: image + infos */}
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          {/* Image */}
          <img
            src={"https://d13e14gtps4iwl.cloudfront.net/players/v2/" + id + "/card.png"}
            width={120} height={160}
            style={{ borderRadius: "8px", border: "1px solid #e2e8f0", flexShrink: 0 }}
          />
          {/* Infos */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "0px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a" }}>{overall}</span>
              <span style={{ fontSize: "13px", fontWeight: 700, background: "#0f172a", color: "#fff", padding: "2px 8px", borderRadius: "4px" }}>{pos}</span>
            </div>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>{firstName} {lastName}</span>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "8px", gap: "4px" }}>
              {[["AGE", age + " yrs"], ["HEIGHT", (height || "-") + " cm"],  ["POSITION", positions.join(" / ")]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "3px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>{k}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#0f172a" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div style={{ display: "flex", marginTop: "16px", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              padding: "10px 4px",
              borderRight: i < stats.length - 1 ? "1px solid #e2e8f0" : "none",
              background: "#ffffff",
            }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em" }}>{s.label}</span>
              <div style={{
                marginTop: "6px", width: "36px", height: "36px", borderRadius: "6px",
                background: statColor(s.value), display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}>{s.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* POSITION RATINGS */}
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Position Ratings</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0px", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
            {posRatings.map(({ pos: p, badge, badgeColor, rating, diff }, i) => (
              <div key={p} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 12px",
                borderBottom: i < posRatings.length - 1 ? "1px solid #f1f5f9" : "none",
                background: "#ffffff",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", width: "36px" }}>{p}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, background: badgeColor, color: "#fff", padding: "2px 6px", borderRadius: "3px" }}>{badge}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: diff < 0 ? "#ef4444" : "#94a3b8", fontWeight: 600 }}>{diff === 0 ? "0" : diff}</span>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "6px",
                    background: statColor(rating), display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}>{rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", color: "#cbd5e1" }}>MFL PLAYER INFO</span>
          <span style={{ fontSize: "10px", color: "#cbd5e1" }}>mflplayer.info/player/{id}</span>
        </div>
      </div>
    ),
    { width: 600, height: 700 }
  );
}
