import type { UserProfile } from "@/types";

/**
 * Offline knowledge engine. Pocket Trainer's Coach must be useful even without
 * an API key configured, so this provides safe, educational answers keyed off
 * the user's message. It is intentionally conservative and always defers to
 * professionals for medical questions.
 */

interface Rule {
  test: RegExp;
  answer: (p: UserProfile) => string;
}

const DISCLAIMER =
  "\n\n_This is general fitness information, not medical advice. For anything health-specific, check with a doctor or registered dietitian._";

const RULES: Rule[] = [
  {
    test: /\b(injur|sharp pain|hurts a lot|chest pain|dizzy|faint|can't breathe)\b/i,
    answer: () =>
      "That sounds like something to take seriously. Please stop training that movement and rest. Sharp pain, chest pain, or dizziness are signals to check in with a doctor or physiotherapist before continuing — I can help you plan around it once you're cleared. Your long-term progress is worth one careful week.",
  },
  {
    test: /\b(starv|not eat|barely eat|purge|throw up|skip meals to lose|crash diet|500 calories)\b/i,
    answer: () =>
      "I hear you wanting results, but I won't guide you toward eating that little — it backfires on your energy, muscle, and metabolism, and it isn't safe. Sustainable fat loss comes from a modest calorie deficit, enough protein, and consistency. If food feels stressful or restrictive lately, talking to a doctor or registered dietitian is a genuinely strong move, not a weak one.",
  },
  {
    test: /\b(start|begin|new to|beginner|where do i)\b/i,
    answer: (p) =>
      `Great starting point. Here's the simple version for a ${p.experience}:\n\n1. Aim for 3 short full-body sessions a week — squat, hinge, push, pull, and a little core.\n2. Start lighter than you think and focus on clean form; add weight only when the last rep still looks good.\n3. Walk daily and get protein at each meal.\n4. Win the week by just showing up — consistency beats intensity every time.\n\nWant me to point you at the Foundations program? It's built exactly for this.`,
  },
  {
    test: /\b(protein|how much protein|macros|macronutrient)\b/i,
    answer: (p) =>
      `A practical protein target is about 1.6–2.2 g per kg of bodyweight per day — for you that's roughly ${Math.round(p.weightKg * 1.6)}–${Math.round(p.weightKg * 2.2)} g. Spread it across your meals (a palm-sized portion each) and you'll cover it. Carbs fuel your training and fats support hormones, so keep all three in the mix rather than cutting one to zero.`,
  },
  {
    test: /\b(lose (fat|weight)|cut|deficit|leaner|slim down)\b/i,
    answer: () =>
      "Fat loss is mostly a patient, modest calorie deficit — think 300–500 kcal under maintenance, not a crash. Keep protein high to protect muscle, lift 2–4×/week so your body has a reason to keep that muscle, and stay active on off days. Aim for around 0.5–1% of bodyweight per week; slower is more sustainable and easier to keep off.",
  },
  {
    test: /\b(build muscle|gain muscle|bulk|bigger|hypertrophy|grow)\b/i,
    answer: () =>
      "Muscle is built by progressive overload plus enough food and recovery. Practically: train each muscle 2×/week in the 6–15 rep range, add a little weight or a rep over time, eat a slight calorie surplus with plenty of protein, and sleep 7–9 hours. Growth is slow and steady — track your lifts so you can see it happening even when the mirror is quiet.",
  },
  {
    test: /\b(sore|soreness|doms|recovery|rest day|recover)\b/i,
    answer: () =>
      "Soreness (DOMS) is normal, especially after new movements — it isn't a measure of a good workout. To recover well: sleep, protein, hydration, and easy movement like walking. You can absolutely train other muscle groups while one is sore. If a joint (not a muscle) hurts, though, back off and don't push through it.",
  },
  {
    test: /\b(motivat|consistent|lazy|discipline|stick with|give up|habit)\b/i,
    answer: () =>
      "Motivation comes and goes — systems are what keep you going. Shrink the goal until it's almost too easy: lay your clothes out, commit to just 10 minutes, and let momentum do the rest. Anchor training to something you already do daily, and track your streak so quitting feels like breaking a chain. You don't need to be perfect, just consistent.",
  },
  {
    test: /\b(cardio|run|running|endurance|conditioning|5k|10k)\b/i,
    answer: () =>
      "For general fitness, mix mostly easy conversational-pace cardio with one harder interval session a week. If you're building a running base, increase weekly distance gradually (roughly 10% at a time) to protect your joints. Strength training and cardio support each other, so you don't have to choose — just keep the hard days apart from your heaviest lifts.",
  },
  {
    test: /\b(sleep|tired|fatigue|energy|rest)\b/i,
    answer: () =>
      "Sleep is the most underrated training tool — it's when you actually adapt and rebuild. Aim for 7–9 hours, keep a consistent wake time, and dim screens before bed. If you're chronically exhausted, that's often a sign to add a rest day or eat a bit more, not to push harder.",
  },
  {
    test: /\b(form|technique|how do i (squat|deadlift|bench|press)|cues)\b/i,
    answer: () =>
      "Good form is about a few reliable checkpoints per lift: brace your core, keep a neutral spine, control the lowering phase, and move through a full range you can own. Film a set from the side — it's the fastest feedback loop. You can also use the Form tab here to get a checkpoint-by-checkpoint breakdown of a specific lift.",
  },
  {
    test: /\b(supplement|creatine|pre.?workout|bcaa|vitamin)\b/i,
    answer: () =>
      "Supplements are the small stuff — nail sleep, protein, and consistent training first. Of the well-studied ones, creatine monohydrate (about 3–5 g daily) is safe and helpful for most people, and caffeine can boost a session. Everything else is optional. Before adding anything, it's worth a quick check with a doctor, especially if you take medication.",
  },
];

export function offlineCoachReply(message: string, profile: UserProfile): string {
  const matched = RULES.find((r) => r.test.test(message));
  if (matched) {
    const base = matched.answer(profile);
    // Skip the boilerplate disclaimer on safety-critical replies (they already redirect).
    const safetyCritical = /\b(injur|starv|purge|dizzy|chest pain)\b/i.test(message);
    return safetyCritical ? base : base + DISCLAIMER;
  }
  return (
    `Good question. Here's how I'd think about it: focus on the few things that actually move the needle — consistent training, enough protein, sleep, and gradual progress. If you can tell me a bit more (your goal, experience, or the specific lift or meal you mean), I'll give you a sharper plan. You can also explore the Workout, Nutrition, and Form tabs for structured guidance.` +
    DISCLAIMER
  );
}
