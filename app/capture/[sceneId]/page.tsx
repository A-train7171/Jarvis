import { scenes } from "@/lib/mockData";
import CaptureFlow from "./CaptureFlow";

export function generateStaticParams() {
  return scenes.map((s) => ({ sceneId: s.id }));
}

export default async function Page({ params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;
  return <CaptureFlow sceneId={sceneId} />;
}
