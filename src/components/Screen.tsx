import type { ReactNode } from "react";
import { colors, displayHeading } from "@/theme";
import { IconChevron } from "./icons";

/** Standard scrollable screen with an optional sticky header. */
export function Screen({
  title,
  onBack,
  right,
  children,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {title && (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 16px",
            paddingTop: "calc(14px + env(safe-area-inset-top))",
            borderBottom: `1px solid ${colors.line}`,
            background: "rgba(5,5,5,0.85)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 5,
          }}
        >
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back"
              style={{
                background: "transparent",
                border: "none",
                color: colors.light,
                display: "flex",
                transform: "rotate(180deg)",
                padding: 4,
              }}
            >
              <IconChevron />
            </button>
          )}
          <h1 style={{ ...displayHeading, fontSize: 20, margin: 0, flex: 1 }}>{title}</h1>
          {right}
        </header>
      )}
      <div
        className="pt-fade"
        style={{ flex: 1, overflowY: "auto", padding: 16, paddingBottom: 28 }}
      >
        {children}
      </div>
    </div>
  );
}
