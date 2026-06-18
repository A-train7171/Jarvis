import { colors, displayHeading, gradient } from "@/theme";
import { Screen } from "@/components/Screen";
import { Card, SectionTitle } from "@/components/ui";
import { Logo } from "@/components/Logo";

const SOURCES = [
  {
    label: "WHO — Free-sugars guideline",
    url: "https://www.who.int/news/item/04-03-2015-who-calls-on-countries-to-reduce-sugars-intake-among-adults-and-children",
  },
  {
    label: "ISSN Position Stand: Protein and Exercise (2017)",
    url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8",
  },
  {
    label: "Physical Activity Guidelines for Americans (ODPHP)",
    url: "https://odphp.health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines",
  },
  {
    label: "CDC — Physical Activity Basics for Adults",
    url: "https://www.cdc.gov/physical-activity-basics/guidelines/adults.html",
  },
];

export function About({ onBack }: { onBack: () => void }) {
  return (
    <Screen title="About Us" onBack={onBack}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <Logo size={48} withWordmark />
        <p style={{ color: colors.muted, fontSize: 13, marginTop: 6 }}>Your Coach. In Your Pocket.</p>
      </div>

      <SectionTitle>Founder</SectionTitle>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
          <div
            aria-label="Andrew Gumbs"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontStyle: "italic",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            AG
          </div>
          <div>
            <div style={{ ...displayHeading, fontSize: 18 }}>Andrew Gumbs</div>
            <div style={{ color: colors.glow, fontSize: 13 }}>Founder &amp; CEO</div>
          </div>
        </div>
        <p style={{ color: colors.light, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Andrew Gumbs is a 15-year-old entrepreneur with 3+ years of lifting experience. Beyond the
          gym he's into rock climbing and basketball. He built Pocket Trainer to make smart,
          supportive coaching available to everyone — beginners included — right from their phone.
        </p>
      </Card>

      <SectionTitle>Mission</SectionTitle>
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: colors.light, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Make great coaching accessible and judgment-free. Pocket Trainer adapts to your goals,
          keeps advice healthy and realistic, and helps you stay consistent — your coach, in your
          pocket.
        </p>
      </Card>

      <SectionTitle>Sources &amp; References</SectionTitle>
      <Card style={{ display: "grid", gap: 12 }}>
        {SOURCES.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.glow, fontSize: 13, textDecoration: "none", lineHeight: 1.4 }}
          >
            {s.label} ↗
          </a>
        ))}
        <p style={{ color: colors.muted, fontSize: 11.5, margin: "4px 0 0" }}>
          General information, not medical advice.
        </p>
      </Card>
    </Screen>
  );
}
