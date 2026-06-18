import { useState } from "react";
import { colors } from "@/theme";
import { useApp } from "./store/AppContext";
import { BottomNav } from "./components/BottomNav";
import { Spinner } from "./components/ui";
import { PRIMARY_TABS, type Route } from "./routes";
import { Onboarding } from "./screens/Onboarding";
import { Home } from "./screens/Home";
import { Nutrition } from "./screens/Nutrition";
import { Workouts } from "./screens/Workouts";
import { Coach } from "./screens/Coach";
import { Schedule } from "./screens/Schedule";
import { Devices } from "./screens/Devices";
import { Feed } from "./screens/Feed";
import { About } from "./screens/About";
import { Profile } from "./screens/Profile";
import { FormCheck } from "./screens/FormCheck";
import { Share } from "./screens/Share";
import type { ShareKind } from "./lib/shareCard";

export function App() {
  const { state, loaded } = useApp();
  const [route, setRoute] = useState<Route>("home");
  const [shareSeed, setShareSeed] = useState<ShareKind | null>(null);

  if (!loaded) {
    return (
      <Shell center>
        <Spinner size={28} />
      </Shell>
    );
  }

  if (!state.onboarded) {
    return (
      <Shell>
        <Onboarding />
      </Shell>
    );
  }

  const nav = (r: Route) => setRoute(r);
  const goShare = (kind?: ShareKind) => {
    setShareSeed(kind ?? null);
    setRoute("share");
  };

  const screen = (() => {
    switch (route) {
      case "home":
        return <Home onNavigate={nav} onShare={goShare} />;
      case "nutrition":
        return <Nutrition />;
      case "workouts":
        return <Workouts />;
      case "coach":
        return <Coach />;
      case "schedule":
        return <Schedule />;
      case "devices":
        return <Devices onBack={() => nav("home")} />;
      case "feed":
        return <Feed onBack={() => nav("home")} onShare={goShare} />;
      case "about":
        return <About onBack={() => nav("home")} />;
      case "profile":
        return <Profile onBack={() => nav("home")} />;
      case "form":
        return <FormCheck onBack={() => nav("home")} />;
      case "share":
        return <Share onBack={() => nav("home")} seed={shareSeed} />;
    }
  })();

  return (
    <Shell>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>{screen}</div>
      <BottomNav active={PRIMARY_TABS.includes(route) ? route : "home"} onNavigate={nav} />
    </Shell>
  );
}

/** Phone-width app frame, centered on larger viewports. */
function Shell({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        background: colors.jet,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: colors.jet,
          borderLeft: `1px solid ${colors.line}`,
          borderRight: `1px solid ${colors.line}`,
          ...(center
            ? { alignItems: "center", justifyContent: "center" }
            : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
}
