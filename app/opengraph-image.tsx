import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Fail2Fix — UK's #1 Managed MOT Repair Service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoPath = join(
    process.cwd(),
    "public",
    "Fail2Fix_logo-removebg-preview.png",
  );
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #14213d 0%, #1f2e54 100%)",
        }}
      >
        <img
          src={logoSrc}
          alt=""
          width={520}
          height={140}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            marginTop: 40,
            fontSize: 28,
            color: "#f7f5ee",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          UK&apos;s #1 Managed MOT Repair Service · Call 020 4541 4102
        </div>
      </div>
    ),
    { ...size },
  );
}
