# Product decisions

- Latest user instruction overrides the attached brief's defaults: use actual interactive 3D, the original Moonpool characters, all eight locations on the Moon, numbered music tracks matched to levels, and a new repository.
- Public game name: Junior Astronaut Mission Trainer. Setting: Moonpool Base. Crew: Aquanauts.
- Topic mapping: Bloop/life support, Moss/energy, Nori/food, Luma/hazards, Pip/engineering, Skim/sustainability, Pebble/mission planning, Tink/integrated outpost.
- Rendering: React + Three.js through React Three Fiber, retaining deterministic simulation independent of the renderer. Replaces the PDF's default PixiJS 2D renderer.
- Existing models are static. Interaction overlays and procedural equipment animations visualize simulation state; characters are not claimed to be skeletally rigged.
- Moon communication is approximately 1.3 seconds one-way. Ten-minute in-game delays are explicitly artificial training-support delays, never claimed to be Moon radio travel times.
- English first; no accounts or analytics. Progress stays on the browser, with export/import. Accessible labeled controls mirror 3D equipment selections.
- User's numbered M4A tracks are level-specific background music. Narration uses free browser speech as a labeled placeholder until human recordings are supplied.
- Draft target: Nov 14, 2026, 5:30 PM America/New_York. Full project due Nov 15. Prioritize complete Level1 and shared framework, then all level simulations and flows.
- NASA reference cards must distinguish verified science, saved snapshots, and simplified practice values. API failures must not break gameplay.
- Publish private by default through Sites. Do not charge generation credits or add paid assets/services.

## November 14 interaction redirect

The child plays as an astronaut at eye level, with guided station walks and direct object handling. The bottom console takes its yellow plate, silver rotary controls, and dark case from the supplied physical-console reference. Digital play is standalone; physical hardware is an optional future accessory, with transport/firmware awaiting specifications. `src/panel.ts` provides the command boundary. Original user-provided character artwork replaces all generated SVG interpretations, using non-destructive SVG viewports and rotation over the supplied screenshot.

## Free-roaming adventure and GitHub delivery

The user clarified first-person play with no visible player character. WASD, arrow keys, and bottom-panel direction buttons control continuous free movement. Mouse drag and turn controls change heading. All eight rooms are joined by a central corridor; movement is bounded by floor areas and equipment/wall collision. A bottom-left character overlay drives one sequential story, and each chapter uses physical objects to advance the existing tested mission engine. No station-button camera travel remains.

The user requested a new public GitHub repository and will supply access to their own website later. Do not deploy further changes to the earlier private Sites preview or enable GitHub Pages automatically. Public source upload is authorized, including supplied artwork, worlds, and music; repository creation currently requires the user's GitHub browser sign-in or a repository URL.

Ten equipment GLBs from Kenney Space Kit were obtained from the official source under CC0 and are credited with the bundled license. Original drawings remain the guides. Crew billboards use a white-key material in the scene, preserving the original raster file.
