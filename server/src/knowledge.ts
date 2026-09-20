/**
 * Curated knowledge base for the Vulcan OmniPro 220 (Harbor Freight item 57812).
 *
 * Why hand-curated instead of raw-PDF-dumped or embedding/RAG-chunked:
 * the source manual is only 48 pages, and its column-based layout scrambles
 * naively-extracted text order (headers interleave with body text). A small,
 * hand-verified corpus that is cross-referenced once and injected in full
 * beats retrieval-by-similarity here: the model always sees the whole duty
 * cycle matrix, the whole troubleshooting table, etc., so it can actually
 * cross-reference sections instead of missing a chunk boundary. Every number
 * below was verified against the extracted page text and the rendered page
 * images in data/manual/images (see scripts/extract-manual.ts).
 *
 * Each IMAGE_CATALOG entry is a page the agent can surface verbatim with the
 * show_manual_image tool. `page` and `source` let the UI render a citation.
 */

export interface ImageCatalogEntry {
  id: string;
  source: "owner-manual" | "quick-start-guide" | "selection-chart";
  sourceLabel: string;
  page: number;
  title: string;
  tags: string[];
}

export const IMAGE_CATALOG: ImageCatalogEntry[] = [
  { id: "selection-chart-p01", source: "selection-chart", sourceLabel: "How to Choose a Welder", page: 1, title: "Welding process selection chart (MIG vs Flux-Cored vs Stick vs TIG)", tags: ["process selection", "which process", "MIG vs TIG vs Stick", "gas required", "skill level", "material thickness"] },
  { id: "owner-manual-p07", source: "owner-manual", sourceLabel: "Owner's Manual", page: 7, title: "Specifications table (MIG/TIG/Stick current ranges, duty cycles, OCV, wire capacity)", tags: ["specifications", "duty cycle", "amperage range", "OCV", "wire speed", "wire capacity"] },
  { id: "owner-manual-p08", source: "owner-manual", sourceLabel: "Owner's Manual", page: 8, title: "Front panel controls (LCD display, knobs, sockets, power switch)", tags: ["front panel", "controls", "knobs", "lcd", "sockets", "layout"] },
  { id: "owner-manual-p09", source: "owner-manual", sourceLabel: "Owner's Manual", page: 9, title: "Interior controls / wire feed mechanism (idler arm, tensioner, feed roller, spool)", tags: ["wire feed mechanism", "interior", "idler arm", "tensioner", "feed roller", "spool"] },
  { id: "owner-manual-p10", source: "owner-manual", sourceLabel: "Owner's Manual", page: 10, title: "1-2 lb wire spool installation diagram", tags: ["wire spool", "spool installation", "1-2 lb"] },
  { id: "owner-manual-p11", source: "owner-manual", sourceLabel: "Owner's Manual", page: 11, title: "10-12 lb wire spool installation diagram (spool adapter)", tags: ["wire spool", "spool installation", "10-12 lb", "spool adapter"] },
  { id: "owner-manual-p12", source: "owner-manual", sourceLabel: "Owner's Manual", page: 12, title: "Feed roller groove selection diagram (solid core V-groove vs flux-cored knurled)", tags: ["feed roller", "groove", "wire size", "solid core", "flux-cored"] },
  { id: "owner-manual-p13", source: "owner-manual", sourceLabel: "Owner's Manual", page: 13, title: "Gun cable connection + Flux-Cored (DCEN) polarity setup diagram", tags: ["polarity", "DCEN", "flux-cored", "gasless", "ground clamp", "sockets"] },
  { id: "owner-manual-p14", source: "owner-manual", sourceLabel: "Owner's Manual", page: 14, title: "Solid-Core MIG (DCEP) polarity setup + gas cylinder hookup + rating label", tags: ["polarity", "DCEP", "MIG", "shielding gas", "regulator", "cylinder", "rating label"] },
  { id: "owner-manual-p15", source: "owner-manual", sourceLabel: "Owner's Manual", page: 15, title: "Threading welding wire through the liner and MIG gun", tags: ["wire threading", "liner", "mig gun", "contact tip", "nozzle"] },
  { id: "owner-manual-p16", source: "owner-manual", sourceLabel: "Owner's Manual", page: 16, title: "Power cord socket + cold wire feed switch location", tags: ["power cord", "cold wire feed", "power input"] },
  { id: "owner-manual-p17", source: "owner-manual", sourceLabel: "Owner's Manual", page: 17, title: "Wire feed tension check + optional spool gun setup diagram", tags: ["feed tension", "spool gun", "aluminum"] },
  { id: "owner-manual-p20", source: "owner-manual", sourceLabel: "Owner's Manual", page: 20, title: "MIG settings screen navigation (process, wire diameter, thickness, WFS/voltage)", tags: ["lcd menu", "mig settings", "wire diameter", "material thickness", "wire feed speed", "voltage"] },
  { id: "owner-manual-p21", source: "owner-manual", sourceLabel: "Owner's Manual", page: 21, title: "MIG optional settings (Run-In WFS, Inductance, Spot Timer) + gas flow setup", tags: ["run-in wfs", "inductance", "spot timer", "gas flow", "scfh"] },
  { id: "owner-manual-p22", source: "owner-manual", sourceLabel: "Owner's Manual", page: 22, title: "MIG gun angle diagram (push angle vs drag angle, CTWD, stringer vs weave bead)", tags: ["gun angle", "push angle", "drag angle", "ctwd", "stringer bead", "weave bead", "technique"] },
  { id: "owner-manual-p23", source: "owner-manual", sourceLabel: "Owner's Manual", page: 23, title: "MIG duty cycle reference card (120V and 240V)", tags: ["duty cycle", "mig", "120v", "240v"] },
  { id: "owner-manual-p24", source: "owner-manual", sourceLabel: "Owner's Manual", page: 24, title: "TIG cable setup diagram (ground clamp positive, torch negative, foot pedal)", tags: ["tig setup", "polarity", "ground clamp", "torch", "foot pedal"] },
  { id: "owner-manual-p25", source: "owner-manual", sourceLabel: "Owner's Manual", page: 25, title: "TIG shielding gas + power cord connection diagram", tags: ["tig gas", "argon", "regulator", "power cord"] },
  { id: "owner-manual-p26", source: "owner-manual", sourceLabel: "Owner's Manual", page: 26, title: "Tungsten electrode sharpening + TIG torch assembly diagram", tags: ["tungsten", "electrode grinding", "collet", "torch assembly", "ceramic nozzle"] },
  { id: "owner-manual-p27", source: "owner-manual", sourceLabel: "Owner's Manual", page: 27, title: "Stick welding cable setup diagram (ground negative, electrode holder positive)", tags: ["stick setup", "polarity", "electrode holder", "ground clamp"] },
  { id: "owner-manual-p29", source: "owner-manual", sourceLabel: "Owner's Manual", page: 29, title: "TIG and Stick duty cycle reference cards (120V and 240V)", tags: ["duty cycle", "tig", "stick", "120v", "240v"] },
  { id: "owner-manual-p34", source: "owner-manual", sourceLabel: "Owner's Manual", page: 34, title: "Strike test diagram (good weld vs poor weld) + weld cleaning tools", tags: ["strike test", "weld quality", "chipping hammer", "wire brush"] },
  { id: "owner-manual-p35", source: "owner-manual", sourceLabel: "Owner's Manual", page: 35, title: "Wire weld diagnosis: penetration chart + 6 example wire weld defect diagrams", tags: ["weld diagnosis", "penetration", "porosity", "wire weld defects", "voltage too low", "travel speed", "ctwd"] },
  { id: "owner-manual-p36", source: "owner-manual", sourceLabel: "Owner's Manual", page: 36, title: "Wire weld penetration close-ups + weld-not-adhering + bend-at-joint + slag photos", tags: ["weld defects", "penetration", "adhesion", "slag"] },
  { id: "owner-manual-p37", source: "owner-manual", sourceLabel: "Owner's Manual", page: 37, title: "Wire weld burn-through, crooked bead, porosity, and excessive spatter photos", tags: ["burn-through", "crooked bead", "porosity", "spatter", "wire weld"] },
  { id: "owner-manual-p38", source: "owner-manual", sourceLabel: "Owner's Manual", page: 38, title: "Stick weld diagnosis: penetration chart + 6 example stick weld defect diagrams", tags: ["stick weld diagnosis", "penetration", "current", "arc length", "weld speed"] },
  { id: "owner-manual-p39", source: "owner-manual", sourceLabel: "Owner's Manual", page: 39, title: "Stick weld penetration close-ups + weld-not-adhering + bend-at-joint", tags: ["stick weld defects", "penetration", "adhesion"] },
  { id: "owner-manual-p40", source: "owner-manual", sourceLabel: "Owner's Manual", page: 40, title: "Stick weld slag, porosity, crooked bead, spatter, burn-through photos", tags: ["stick weld defects", "slag", "porosity", "spatter", "burn-through"] },
  { id: "owner-manual-p41", source: "owner-manual", sourceLabel: "Owner's Manual", page: 41, title: "MIG gun nozzle/contact tip cleaning + LCD screen cover replacement", tags: ["maintenance", "nozzle", "contact tip", "screen cover"] },
  { id: "owner-manual-p45", source: "owner-manual", sourceLabel: "Owner's Manual", page: 45, title: "Full wiring schematic (power section, MCU board, wire feeder, solenoid valve)", tags: ["wiring schematic", "electrical diagram", "circuit", "mcu board", "igbt"] },
  { id: "owner-manual-p47", source: "owner-manual", sourceLabel: "Owner's Manual", page: 47, title: "Exploded assembly diagram with numbered parts", tags: ["assembly diagram", "exploded view", "parts diagram"] },
  { id: "quick-start-guide-p01", source: "quick-start-guide", sourceLabel: "Quick Start Guide", page: 1, title: "Quick-start wire spool loading and gun-clear warning card", tags: ["quick start", "wire spool", "warning"] },
];

export const IMAGE_IDS = new Set(IMAGE_CATALOG.map((i) => i.id));

/** Full duty-cycle matrix, verified by cross-referencing the Specifications
 *  table (p.7), the rating label silkscreened on the machine (p.14/16/25/27),
 *  and the rated-duty-cycle reference cards (p.19/23/29). All three sources agree. */
const DUTY_CYCLE_MARKDOWN = `
### Duty Cycle Matrix (verified across Specifications p.7, rating label p.14/25/27, and reference cards p.19/23/29)

Duty cycle = minutes a process can run continuously within any 10-minute window without overheating. Rest time = 10 minutes − weld minutes.

| Process | Input | 100% duty (continuous) | 60% duty | Rated duty (max current) |
|---|---|---|---|---|
| MIG | 120V | 75A (10 min weld / 0 rest) | 85A (6 min weld / 4 rest) | **40% @ 100A** (4 min weld / 6 rest) |
| MIG | 240V | 115A (10 min / 0 rest) | 130A (6 min / 4 rest) | **25% @ 200A** (2.5 min weld / 7.5 rest) |
| Stick | 120V | 60A (10 min / 0 rest) | 70A (6 min / 4 rest) | **40% @ 80A** (4 min weld / 6 rest) |
| Stick | 240V | 100A (10 min / 0 rest) | 115A (6 min / 4 rest) | **25% @ 175A** (2.5 min weld / 7.5 rest) |
| TIG | 120V | 90A (10 min / 0 rest) | 105A (6 min / 4 rest) | **40% @ 125A** (4 min weld / 6 rest) |
| TIG | 240V | 105A (10 min / 0 rest) | 125A (6 min / 4 rest) | **30% @ 175A** (3 min weld / 7 rest) |

Max OCV (open circuit voltage) is 86 VDC for all processes. If the machine overheats mid-weld it shuts down, shows a warning on the LCD, and auto-resumes once cool (leave the Power Switch ON so the internal fan keeps running).
`;

const KNOWLEDGE_MARKDOWN = `
# Vulcan OmniPro 220 — Verified Reference Knowledge

Product: Vulcan OmniPro 220 Multiprocess Welding System, Harbor Freight item 57812, UPC 193175422590.
Supports MIG, Flux-Cored (self-shielded, gasless), TIG, and Stick welding. Dual voltage: 120VAC or 240VAC, 60Hz (twist-lock plug, only fits one way — you cannot plug it in backwards).

## 1. Specifications (owner-manual-p07)

- **MIG**: 120V → 30–140A range; 240V → 30–220A range. Weldable: mild steel, stainless steel, aluminum (needs optional Spool Gun). Wire: solid core 0.025"/0.030"/0.035", flux-cored 0.030"/0.035"/0.045". Wire speed 50–500 IPM. Spool capacity up to 12 lb.
- **TIG**: 120V → 10–125A range; 240V → 10–175A range. Weldable: mild steel, stainless steel, chrome moly.
- **Stick**: 120V → 10–80A range; 240V → 10–175A range. Weldable: mild steel, stainless steel.
- Max OCV: 86 VDC for all processes.

${DUTY_CYCLE_MARKDOWN}

## 2. Controls (owner-manual-p08, owner-manual-p09)

**Front panel** (owner-manual-p08): LCD display, Home button, Back button, Main Control Knob (center), Left Knob, Right Knob, Power Switch, Power Cable, Wire Feed / MIG Gun / Spool Gun cable socket, Negative (–) socket, Positive (+) socket, Spool Gun gas outlet, storage compartment.

**Interior** (owner-manual-p09, behind the door): Cold Wire Feed Switch, Idler Arm, Wire Feed Mechanism, Wire Spool, Spool Knob, Feed Tensioner, Wire Inlet Liner, Feed Roller Knob, Wire Feed Control Socket, Foot Pedal Socket.

**LCD menu flow** (owner-manual-p20, p21, p30, p31, p32, p33): Press Home → turn Main Control Knob to pick process (MIG/Flux-Cored/TIG/Stick) → press Main Control Knob to select → adjust polarity/gas per on-screen prompt → Left Knob sets wire/rod/electrode diameter, Right Knob sets material thickness → Left Knob adjusts amperage/WFS, Right Knob adjusts voltage/energizes the torch or electrode holder. A white mark on the on-screen line shows the factory-recommended setting for the chosen wire/thickness combo; you can still move off it manually. Optional settings (press Main Control Knob again): Run-In WFS, Inductance, Spot Timer (MIG); Hot Start, Arc Force (Stick); Recall/Save Setting (all processes, 5 memory slots).

## 3. Polarity Setup — the exact socket wiring for each process

This is one of the most commonly confused parts of the machine. All socket connections twist clockwise to lock.

- **Flux-Cored (gasless), DCEN — Direct Current Electrode Negative** (owner-manual-p13): Ground Clamp Cable → **Positive (+)** socket. Wire Feed Power Cable → **Negative (–)** socket.
- **MIG / Solid-Core with shielding gas, DCEP — Direct Current Electrode Positive** (owner-manual-p14): Ground Clamp Cable → **Negative (–)** socket. Wire Feed Power Cable → **Positive (+)** socket.
- **TIG** (owner-manual-p24): Ground Clamp Cable → **Positive (+)** socket. TIG Torch Cable → **Negative (–)** socket. Foot Pedal (optional) plugs into the Foot Pedal Socket inside the machine.
  - Note: the manual documents this single cable configuration for TIG. It states DC TIG is for steel/stainless and AC TIG is for aluminum, but does not show a different physical cable arrangement for AC vs DC TIG — the AC/DC waveform appears to be selected in the process menu, not by moving cables. Don't invent a different socket wiring for AC TIG; say so plainly if asked and point to page 24/28.
- **Stick**: (owner-manual-p27): Ground Clamp Cable → **Negative (–)** socket. Electrode Holder Cable → **Positive (+)** socket.
- **Optional Spool Gun (aluminum)** (owner-manual-p17): Ground Clamp Cable → **Negative (–)** socket. Wire Feed Power Cable → **Positive (+)** socket (same as solid-core MIG).

Memory aid: MIG/solid-core and Spool Gun are DCEP (ground on negative). Flux-cored is the odd one out — DCEN (ground on positive). TIG also grounds on positive. Stick grounds on negative.

## 4. Wire Spool & Feed System

- **1–2 lb spool** (owner-manual-p10): remove wingnut + spacer, seat spool on spindle against the brake pad so it unwinds **clockwise**, replace spacer, secure wingnut (snug — not so loose the spool free-spins, which causes tangling).
- **10–12 lb spool** (owner-manual-p11): needs the Spool Adapter. Adapter over spindle → spool over adapter (pin/hole aligned) → spacer → wingnut → thread the Spool Knob into the adapter. Loosen the Feed Tensioner (turn counterclockwise) before loading wire; the spring-loaded Idler Arm lifts.
- **Feed roller selection** (owner-manual-p12): flip/replace the roller so the groove matches the wire type and diameter marked on the spool — V-groove for solid core (0.025", 0.030"/0.035"), knurled groove for flux-cored (0.030"/0.035", 0.045").
- **Gun cable connector**: insert fully into the Wire Feed mechanism socket and tighten the knob (finger-tight, don't overtighten) — an incompletely seated connector leaks the shielding gas connection even though it feels "in."
- **Tension setting**: 3–5 for solid wire, 2–3 for flux-cored (too much tension crushes flux-cored wire). Check by holding the trigger to feed wire into a piece of wood from 2–3" away for under 3 seconds — wire should bend, not stop.
- **Threading wire** (owner-manual-p15): feed at least 12" of wire into the inlet liner with the wire under tension the whole time (uncontrolled tension = unraveling/tangling), lay the gun cable straight while feeding (critical for stiffer stainless wire).

## 5. Basic Welding Technique

- **CTWD** (contact-tip-to-work distance): keep ≤ 1/2" for MIG/flux-cored.
- **Push angle** (owner-manual-p22): for MIG with shielding gas, tilt the gun 0–15° *toward* the direction of travel (pushing).
- **Drag angle** (owner-manual-p22): for flux-cored (gasless), tilt the gun 0–15° *away* from the direction of travel (dragging).
- Butt (end-to-end) joints: hold the **MIG/flux-cored gun** at 90°. Fillet (T-shaped) joints: 45°. This angle rule is only documented for the wire-welding gun (owner-manual-p22, "Direct the welding wire straight into the joint") — the manual gives no equivalent joint-angle rule for the Stick electrode holder or TIG torch, so don't apply this 90°/45° figure to those processes.
- Stringer bead = straight line (narrow weld); weave bead = side-to-side motion (wider weld).
- TIG (owner-manual-p31): keep the Tungsten 1–1.5× its own diameter away from the workpiece; tilt torch back 10–15° once the puddle forms; dip the rod at the leading edge, then withdraw it (without leaving the gas shield) between dips to avoid oxidation contamination.
- Stick (owner-manual-p33): strike the arc like a match, lift off ~1 electrode-diameter, tilt back 10–20°, drag the electrode to the back of the puddle.

## 6. Welding Process Selection (selection-chart-p01)

The "How to Choose a Welder" chart cross-references skill level, gas requirement, material, thickness, and finish quality:
- **Flux-Cored/FCAW**: low skill, no gas, steel/stainless, 18ga–5/16". Best outdoors/windy, forgiving on rusty/dirty steel, more spatter.
- **MIG/GMAW**: low skill, gas required (indoor recommended), steel/stainless/aluminum (spool gun), 22ga–3/8". Fast, easiest to learn, clean welds, better on thin material.
- **Stick/SMAW**: moderate skill, no gas, steel/stainless/castings, 10ga–1/2". Good outdoors/windy, forgiving on rusty steel, deep penetration, more spatter.
- **TIG/GTAW**: high skill, gas required, steel/stainless/chrome-moly (DC TIG) or aluminum/magnesium (AC TIG), 24ga–3/16". Highest quality, extremely clean, precise, slowest.

## 7. Weld Diagnosis (owner-manual-p35 through p40)

**Wire (MIG/Flux-Cored) weld defects:**
- *Voltage too low or wire feed too slow* → correct: increase output voltage OR increase wire feed speed.
- *Voltage too high or wire feed too fast* → correct: decrease output voltage OR decrease wire feed speed.
- *Travel speed too fast* → correct: travel slower.
- *Travel speed too slow* → correct: travel faster.
- *CTWD too long or wrong polarity* → correct: check polarity and keep CTWD under 1/2".
- *Inadequate penetration* → increase current, decrease travel speed, faster wire feed, shorter CTWD.
- *Excess penetration / burn-through* → decrease current, increase travel speed, slower wire feed, longer CTWD.
- *Porosity* (small cavities/holes): incorrect polarity; insufficient/incorrect shielding gas (MIG only — check flow, clean nozzle, CTWD); dirty workpiece or wire; inconsistent travel speed; CTWD too long.
- *Excessive spatter*: dirty workpiece/wire; incorrect polarity; insufficient shielding gas (MIG only); wire feeding too fast; CTWD too long.
- *Crooked/wavy bead*: inaccurate technique, inconsistent travel speed, CTWD too long.
- *Weld not adhering / gaps*: wrong bead placement, insufficient heat, dirty workpiece, insufficient wire feed, joint gap too narrow.

**Stick weld defects** (owner-manual-p38 through p40): same categories, but controls are current and weld/arc-length instead of voltage/wire-feed/CTWD — e.g. current too low/high, weld speed too fast/slow, arc length too short/long.

**Strike test** (owner-manual-p34): weld two scraps, clamp one, strike the other with a dead-blow hammer. Good weld deforms without breaking; poor weld snaps/cracks at the weld line. Destructive test — for technique verification only, not for working welds.

## 8. Troubleshooting (owner-manual-p42 through p44)

**MIG/Flux-Cored:**
- Wire feed motor runs but wire doesn't feed: insufficient feed pressure (tighten tensioner), wrong roller size (flip it), damaged gun/cable/liner, or tensioner too tight (loosen).
- Bird's nesting: excess feed pressure, wrong contact tip size, gun connector not fully seated, damaged liner.
- Wire stops mid-weld: bent gun cable, clogged/worn/undersized liner, tangled spool, wire not contacting feed rollers, roller groove mismatch.
- Arc not stable: wire feed issues (see above), wrong tip/liner size, wrong wire feed speed, loose cables, **wrong polarity — must be DCEP for MIG, DCEN for self-shielded flux-cored**, insufficient/excess gas, poor workpiece connection.
- Weak arc: incorrect line voltage, wrong cord (never use an extension cord on this welder), current setting too low for material thickness.
- Won't power on: tripped thermal protection (let it cool, power switch stays ON), insufficient circuit voltage/amperage, faulty trigger, low/over-voltage protection tripped, wrong process selected.
- LCD stays dark: bad outlet connection, tripped breaker/GFCI, wrong plug rating, press the Reset Button on the back.
- Wire feeds but arc won't ignite: bad ground connection, wrong/worn/dirty contact tip.
- Porosity: empty gas bottle, wrong gas flow, dirty workpiece, gun too far from work (CTWD), **wrong polarity (DCEP for MIG, DCEN for flux-cored)**, dirty wire.

**TIG/Stick:**
- Won't power on: tripped thermal protection, faulty trigger, ground clamp not attached, shielding gas not connected (TIG).
- LCD stays dark: bad outlet/breaker/GFCI.
- Weak arc: incorrect line voltage, wrong cord.
- Arc not stable: loose cables, damaged electrode holder/torch connection, current setting off, low shielding gas (TIG).

Always shut off, unplug, and discharge the gun/electrode to ground before servicing.

## 9. Gas & Cylinder Setup

- MIG/solid-core: set flow gauge to 20–30 SCFH. TIG: 10–25 SCFH.
- Strap the cylinder to a cart/wall (tip-over hazard). Crack the valve briefly to blow out dust before attaching the regulator. Thread regulator on, wrench-tighten. Attach gas hose to regulator outlet and the welder's gas inlet.
- C100 shielding gas needs the included CGA 580/320 adapter on the regulator inlet.
- TIG shielding gas: 100% Argon.
- Never weld on a pressurized/closed cylinder; keep the cylinders away from the welding circuit and any ignition source.

## 10. TIG Torch & Tungsten (owner-manual-p26)

Match collet + collet body size to the tungsten electrode diameter. Grind the tip to a blunt point with a conical length ≈2.5× the electrode diameter, grinding parallel to the electrode's length (perpendicular grinding causes arc wander). Insert with 1/8"–1/4" protrusion beyond the ceramic nozzle.

## 11. Maintenance (owner-manual-p41)

Before every use: check for loose hardware, misaligned/binding parts, damaged cord/cables, cracked parts. Periodically have a technician blow out interior dust with compressed air. MIG gun: clean nozzle interior with a wire brush; replace if the end is uneven/chipped/melted; clean contact tip and confirm the orifice is still round (not oblong); replace if the wrong size or worn.

## 12. Electrical & Wiring Reference (owner-manual-p45)

Internal architecture: AC input (120–240V, 50/60Hz) → rectifier → PFC (power factor correction) inductor stage → IGBT full-bridge inverter (6 IGBTs total) → high-frequency transformer (T1) → secondary rectification (fast recovery diodes) → output inductor → DC welding output. Cooling: two fans (FAN, FAN2) plus heatsinks/radiators on the IGBTs and bridge rectifiers. Control: MCU board drives the LCD screen, wire feeder motor, solenoid gas valve, and reads the remote board / fast wire feed switch / aviation-plug accessory connector (foot pedal, spool gun). This is a from-the-schematic summary of the topology — for exact pin-outs, refer to the full schematic image (owner-manual-p45); don't fabricate pin numbers beyond what's legible there.

## 13. Parts List & Assembly (owner-manual-p46, owner-manual-p47)

61 numbered parts spanning covers/handles/latches (1–8), the wire feed subsystem (9–19), the front panel/display (20–26), fittings and clamps (27–35), and the power electronics (36–61: main PCB, control PCB, fast recovery diodes ×8 total, transformer, 6 IGBTs, 2 bridge rectifiers, radiators, fans, power cords for both voltages). Harbor Freight explicitly disclaims the parts list as a reference only and recommends certified technicians for repairs — don't encourage a user to self-repair the power electronics; point out this caution if asked about opening the case.

## 14. Safety Essentials (owner-manual p2–p6, p16, p18, p21, p28, p30)

Always relay these when relevant, briefly and without being preachy:
- Ventilate or use a NIOSH-approved respirator; welding fumes are a real inhalation hazard.
- Minimum shade 10 welding helmet/mask, welding gloves, flame-resistant clothing with no open pockets/cuffs.
- Ground the machine via a GFCI-protected outlet; never use an extension cord.
- Clear a 35 ft radius of flammables; keep an ABC fire extinguisher nearby.
- Shielding gas can displace air and cause asphyxiation with no warning symptoms — ventilate before opening a cylinder.
- Never leave the machine energized and unattended; rest the torch/gun/electrode holder on a non-conductive surface between welds.
- Pacemaker wearers should consult a physician before operating.

## Available reference images

The IDs below correspond to real pages in the manual. Call \`show_manual_image\` with the exact id whenever a diagram, chart, or photo would explain the answer better than prose — this matters as much as being textually correct.
`;

export function buildKnowledgeSection(): string {
  const catalogList = IMAGE_CATALOG.map(
    (i) => `- \`${i.id}\` — ${i.title} (${i.sourceLabel}, p.${i.page}) [${i.tags.join(", ")}]`
  ).join("\n");
  return `${KNOWLEDGE_MARKDOWN}\n${catalogList}\n`;
}
