import sharp from "sharp";
import { readFileSync } from "fs";
const svg = readFileSync("/home/user/Jarvis/public/icons/icon.svg");
const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-1024.png", size: 1024 },
  { name: "icon-maskable-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];
for (const { name, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(`/home/user/Jarvis/public/icons/${name}`);
  console.log("wrote", name);
}
// Also a 1024 launcher for Capacitor assets
await sharp(svg).resize(1024, 1024).png().toFile("/home/user/Jarvis/resources/icon.png").catch(()=>{});
