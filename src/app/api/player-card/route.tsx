import { ImageResponse } from "next/og";
import { getPlayerById } from "@/data/players";
import { positionalFamiliarity, attributeWeighting } from "@/config";

export const runtime = "edge";

function calcRating(player: any, targetPos: string): number {
  const primary = player.metadata.positions[0];
  const secondaries = player.metadata.positions.slice(1);
  const isSecondary = secondaries.includes(targetPos);
  const familiarity = positionalFamiliarity.find(p => p.primaryPosition === primary);
  const adj = isSecondary ? -1 : (familiarity?.adjustment[targetPos as keyof typeof familiarity.adjustment] ?? -20);
  const { weighting } = attributeWeighting.find(w => w.positions.includes(targetPos))!;
  const s = {
    pace: +player.metadata.pace + adj,
    dribbling: +player.metadata.dribbling + adj,
    passing: +player.metadata.passing + adj,
    shooting: +player.metadata.shooting + adj,
    defense: +player.metadata.defense + adj,
    physical: +player.metadata.physical + adj,
    goalkeeping: +(player.metadata.goalkeeping || 0) + adj,
  };
  return Math.round(
    s.passing * weighting[0] + s.shooting * weighting[1] + s.defense * weighting[2] +
    s.dribbling * weighting[3] + s.pace * weighting[4] + s.physical * weighting[5] + s.goalkeeping * weighting[6]
  );
}

function ratingBg(r: number) {
  if (r >= 95) return "#000000";
  if (r >= 85) return "#a21caf";
  if (r >= 75) return "#3b82f6";
  if (r >= 65) return "#84cc16";
  if (r >= 55) return "#facc15";
  return "#e2e8f0";
}
function ratingFg(r: number) {
  if (r >= 95) return "#facc15";
  if (r >= 85) return "#fdf4ff";
  if (r >= 75) return "#eff6ff";
  if (r >= 65) return "#1a2e05";
  if (r >= 55) return "#422006";
  return "#1e293b";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const player = await getPlayerById(Number(id));
  if (!player) return new Response("Player not found", { status: 404 });

  const { firstName, lastName, overall, positions, pace, shooting, passing, dribbling, defense, physical, age, height, preferredFoot } = player.metadata;
  const pos = positions[0];

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
  // Trier: primaire, secondaire, FF(-5), SF(-8)
  const sortOrder = (p: string) => {
    if (positions[0] === p) return 0;
    if (positions.slice(1).includes(p)) return 1;
    const adj = familiarity?.adjustment[p as keyof typeof familiarity.adjustment];
    if (adj === -5) return 2;
    if (adj === -8) return 3;
    return 99;
  };
  const posRatings = allPositions
    .filter(p => {
      if (p === "GK" && !positions.includes("GK")) return false;
      const isPrimary = positions[0] === p;
      const isSecondary = positions.slice(1).includes(p);
      const adj = familiarity?.adjustment[p as keyof typeof familiarity.adjustment];
      return isPrimary || isSecondary || adj === -5 || adj === -8;
    })
    .map(p => {
      const isPrimary = positions[0] === p;
      const isSecondary = positions.slice(1).includes(p);
      const adj = familiarity?.adjustment[p as keyof typeof familiarity.adjustment] ?? 0;
      const badge = isPrimary ? "P" : isSecondary ? "S" : adj === -5 ? "FF" : "SF";
      const badgeColor = isPrimary ? "#16a34a" : isSecondary ? "#65a30d" : adj === -5 ? "#ca8a04" : "#ea580c";
      const rating = calcRating(player, p);
      const diff = rating - overall;
      return { pos: p, badge, badgeColor, rating, diff };
    }).sort((a, b) => b.rating - a.rating);

  return new ImageResponse(
    (
      <div style={{
        width: "600px",
        background: "#f8fafc",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        color: "#334155",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 24px #00000022",
      }}>

        {/* TOP: image + infos */}
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <img
            src={"https://d13e14gtps4iwl.cloudfront.net/players/v2/" + id + "/card.png"}
            width={120} height={160}
            style={{ borderRadius: "8px", border: "1px solid #e2e8f0", flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "40px", fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{overall}</span>
              <span style={{ fontSize: "12px", fontWeight: 700, background: "#1e293b", color: "#fff", padding: "3px 10px", borderRadius: "4px", letterSpacing: "0.05em" }}>{pos}</span>
            </div>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginTop: "6px", lineHeight: 1.1 }}>{firstName} {lastName}</span>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "10px", gap: "5px" }}>
              {[["AGE", age + " yrs"], ["HEIGHT", (height || "-") + " cm"], ["FOOT", preferredFoot || "-"], ["POSITION", positions.join(" / ")]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #cbd5e1", paddingBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569", letterSpacing: "0.08em" }}>{k}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "flex", marginTop: "16px", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden", background: "#ffffff" }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              padding: "10px 4px",
              borderRight: i < stats.length - 1 ? "1px solid #e2e8f0" : "none",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#334155", letterSpacing: "0.06em" }}>{s.label}</span>
              <div style={{ marginTop: "6px", width: "40px", height: "40px", borderRadius: "8px", background: ratingBg(s.value), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: ratingFg(s.value) }}>{s.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* POSITION RATINGS */}
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Position Ratings</span>
          <div style={{ display: "flex", flexDirection: "column", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden", background: "#ffffff" }}>
            {posRatings.map(({ pos: p, badge, badgeColor, rating, diff }, i) => (
              <div key={p} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 14px",
                borderBottom: i < posRatings.length - 1 ? "2px solid #cbd5e1" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155", width: "40px" }}>{p}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, background: badgeColor, color: "#fff", padding: "2px 6px", borderRadius: "3px" }}>{badge}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", color: diff < 0 ? "#ef4444" : diff > 0 ? "#16a34a" : "#94a3b8", fontWeight: 700, width: "28px", textAlign: "right" }}>{diff === 0 ? "0" : diff > 0 ? "+" + diff : diff}</span>
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: ratingBg(rating), display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: ratingFg(rating) }}>{rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.05em" }}>MFL PLAYER INFO</span>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>mflplayerinfo.vercel.app/player/{id}</span>
        </div>
      </div>
    ),
    { width: 600, height: 800 }
  );
}
