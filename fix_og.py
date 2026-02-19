import os
os.makedirs("src/app/api/player-card", exist_ok=True)
content = open("src/app/api/player-card/route.tsx", "w", encoding="utf-8")
content.write("""import { ImageResponse } from "next/og";
import { getPlayerById } from "@/data/players";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const player = await getPlayerById(Number(id));
  if (!player) return new Response("Player not found", { status: 404 });

  const { firstName, lastName, overall, positions, pace, shooting, passing, dribbling, defense, physical, age } = player.metadata;
  const pos = positions[0];

  const posColors: Record<string, string> = {
    ST: "#ff4757", CF: "#ff6b81", LW: "#ff6348", RW: "#ff6348",
    CM: "#2ed573", CAM: "#7bed9f", CDM: "#1e90ff",
    CB: "#3742fa", LB: "#70a1ff", RB: "#70a1ff", GK: "#eccc68",
  };
  const posColor = posColors[pos] || "#00f5a0";
  const statColor = (v: number) => v >= 85 ? "#00f5a0" : v >= 70 ? "#f5c400" : v >= 55 ? "#f57c00" : "#f54040";

  const stats = [
    { label: "PAC", value: pace },
    { label: "SHO", value: shooting },
    { label: "PAS", value: passing },
    { label: "DRI", value: dribbling },
    { label: "DEF", value: defense },
    { label: "PHY", value: physical },
  ];

  return new ImageResponse(
    (
      <div style={{
        width: "400px", height: "520px",
        background: "linear-gradient(145deg, #0f0f1e 0%, #13131f 50%, #0a0a14 100%)",
        borderRadius: "16px", padding: "24px",
        display: "flex", flexDirection: "column",
        fontFamily: "sans-serif", color: "#fff",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "64px", fontWeight: 900, lineHeight: 1, color: "#fff" }}>{overall}</span>
            <span style={{ background: posColor, color: "#000", fontSize: "13px", fontWeight: 800, padding: "3px 10px", borderRadius: "4px", marginTop: "6px", alignSelf: "flex-start" }}>{pos}</span>
          </div>
          <img src={"https://d13e14gtps4iwl.cloudfront.net/players/v2/" + id + "/card.png"} width={110} height={140} style={{ borderRadius: "10px" }} />
        </div>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "26px", fontWeight: 800 }}>{firstName} <span style={{ color: posColor }}>{lastName}</span></span>
          <span style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>#{id} - Age {age}</span>
        </div>
        <div style={{ height: "1px", background: posColor + "44", margin: "16px 0" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          {stats.map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10px", color: "#888", textTransform: "uppercase" }}>{s.label}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: statColor(s.value) }}>{s.value}</span>
              </div>
              <div style={{ height: "3px", background: "#1a1a2e", borderRadius: "2px", display: "flex" }}>
                <div style={{ width: s.value + "%", background: statColor(s.value), borderRadius: "2px" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #ffffff08", paddingTop: "12px", marginTop: "16px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", color: "#444" }}>MFL PLAYER INFO</span>
          <span style={{ fontSize: "10px", color: "#444" }}>mflplayer.info/player/{id}</span>
        </div>
      </div>
    ),
    { width: 400, height: 520 }
  );
}
""")
content.close()
print("OK")
