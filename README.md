# VisualCoding

A **desktop app** for building Minecraft **Fabric 26.2** mods visually — no Java coding required.

Drag blocks to define items, blocks, armor, animated mobs, emotes, particles, and screenshake. Reference your models and animations from project folders. Hit **Play Minecraft** to build and test your mod.

## Why desktop (not web)?

A web app in your browser **cannot** launch Minecraft or run Gradle on your PC. VisualCoding is an **Electron desktop app** so it can:

- Save projects to your disk
- Generate a real Fabric mod project
- Run `gradlew runClient` with the **Play Minecraft** button

## Requirements

Before using VisualCoding, install:

1. **Java 21** (JDK) — [Adoptium](https://adoptium.net/)
2. **Minecraft Java Edition 26.2** (the app downloads dev files via Gradle on first run)

## Quick start

### Run from source (developers)

```bash
npm install
npm run dev
```

### Build installable app

```bash
npm run build
npm run package
```

Installers appear in `release/`.

## How to make your first mod

1. **Create New Project** — pick a folder, set mod ID and name.
2. Drag blocks from the toolbox:
   - Start with **Mod Setup**
   - Add **Register Item**, **Register Mob**, etc.
3. Put assets in your project folder:
   ```
   your-project/
     assets/
       geo/           ← Blockbench Geckolib models
       animations/    ← animation JSON files
       textures/
         entity/
         item/
         block/
         particle/
   ```
4. In blocks, type the file paths (e.g. `geo/my_mob.geo.json`).
5. Click **Export Mod** to generate Java code.
6. Click **▶ Play Minecraft** — first run downloads dependencies (can take 10–20 minutes).

## Block reference

| Category | Blocks |
|----------|--------|
| Setup | Mod Setup |
| Items | Register Item, Register Armor |
| Blocks | Register Block |
| Mobs | Register Mob + AI + Animation rules |
| Emotes | Register Emote (use `/emote <name>` in game) |
| Actions | Message, damage, effects, particles, screenshake, sound |

## Mob workflow

1. Model in **Blockbench** → export Geckolib format
2. Put `.geo.json`, `.animation.json`, `.png` in `assets/`
3. **Register Mob** block → fill in paths
4. Wire **AI** blocks (chase, attack, wander)
5. Wire **Animation** blocks (idle / walk / attack animation names must match your JSON)

## Project structure

```
my-mod-project/
  project.json       ← mod metadata
  workspace.json     ← your block layout (auto-saved)
  assets/            ← your models, textures, animations
  generated/         ← Fabric Gradle project (auto-generated, don't edit by hand)
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **`Error: Electron uninstall`** | Electron's app binary didn't download. Run: `npm run fix-electron` then `npm run dev`. |
| **`electron.exe` missing** (only `LICENSES.chromium.html` in `node_modules\electron\dist`) | **Windows antivirus deleted electron.exe.** Add a Windows Security exclusion for your project folder, restore `electron.exe` from quarantine if listed, then run `npm run fix-electron` again. |
| Play button fails | Install Java 21, ensure it's on your PATH |
| First build very slow | Normal — Gradle downloads Minecraft + libraries |
| Mob has no model | Check geo/animation/texture paths match block fields |
| Animations don't play | Animation names in blocks must match JSON exactly |

## Tech stack

- Electron + React + Blockly (visual editor)
- Java code generator → Fabric 26.2 + Geckolib 5.5

## License

MIT
