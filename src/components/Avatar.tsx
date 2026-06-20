import { initials } from "@/lib/util";
import type { Avatar as AvatarData } from "@/types";

export function Avatar({
  name,
  avatar,
  size = 44,
  onClick,
}: {
  name: string;
  avatar: AvatarData;
  size?: number;
  onClick?: () => void;
}) {
  const common: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    objectFit: "cover",
    border: "2px solid rgba(182,92,255,0.5)",
  };
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      aria-label={onClick ? "Open profile" : undefined}
      style={{
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: onClick ? "pointer" : "default",
        lineHeight: 0,
      }}
    >
      {avatar.image ? (
        <img src={avatar.image} alt={name || "Profile"} style={common} />
      ) : (
        <div
          style={{
            ...common,
            background: avatar.bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: size * 0.38,
          }}
        >
          {initials(name)}
        </div>
      )}
    </Tag>
  );
}
