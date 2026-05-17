// Rasterize the brand SVG into iOS + Android launcher icon slots.
import sharp from "sharp";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const SVG = readFileSync(join(ROOT, "public/icons/icon.svg"));

const androidDensities = {
  "mipmap-mdpi": 48,
  "mipmap-hdpi": 72,
  "mipmap-xhdpi": 96,
  "mipmap-xxhdpi": 144,
  "mipmap-xxxhdpi": 192,
};

for (const [dir, size] of Object.entries(androidDensities)) {
  const base = join(ROOT, "android/app/src/main/res", dir);
  if (!existsSync(base)) continue;
  await sharp(SVG).resize(size, size).png().toFile(join(base, "ic_launcher.png"));
  await sharp(SVG).resize(size, size).png().toFile(join(base, "ic_launcher_round.png"));
  await sharp(SVG).resize(Math.round(size * 1.08), Math.round(size * 1.08)).png()
    .toFile(join(base, "ic_launcher_foreground.png"));
  console.log("android:", dir);
}

const iosAssetsDir = join(ROOT, "ios/App/App/Assets.xcassets/AppIcon.appiconset");
if (existsSync(iosAssetsDir)) {
  // Apple unified icon: 1024x1024 (Contents.json refers to it as AppIcon-512@2x.png)
  await sharp(SVG).resize(1024, 1024).png()
    .toFile(join(iosAssetsDir, "AppIcon-512@2x.png"));
  console.log("ios: AppIcon-512@2x.png");
}

// Splash assets — solid bg, centered logo
const splash = await sharp({
  create: { width: 2732, height: 2732, channels: 4, background: "#0B0F14" },
})
  .composite([{ input: await sharp(SVG).resize(720, 720).png().toBuffer(), gravity: "center" }])
  .png()
  .toBuffer();

const iosSplashDir = join(ROOT, "ios/App/App/Assets.xcassets/Splash.imageset");
if (existsSync(iosSplashDir)) {
  writeFileSync(join(iosSplashDir, "splash-2732x2732.png"), splash);
  writeFileSync(join(iosSplashDir, "splash-2732x2732-1.png"), splash);
  writeFileSync(join(iosSplashDir, "splash-2732x2732-2.png"), splash);
  console.log("ios: splash");
}

const androidDrawable = join(ROOT, "android/app/src/main/res/drawable");
if (existsSync(androidDrawable)) {
  // Center-crop to 1080x1920 for splash
  const a = await sharp({
    create: { width: 1080, height: 1920, channels: 4, background: "#0B0F14" },
  })
    .composite([{ input: await sharp(SVG).resize(520, 520).png().toBuffer(), gravity: "center" }])
    .png()
    .toBuffer();
  writeFileSync(join(androidDrawable, "splash.png"), a);
  console.log("android: splash");
}
