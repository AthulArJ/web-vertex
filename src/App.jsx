import "./App.css";
import mapBgImg from "./assets/map-bg.jpg";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import LaunchCinematic from "./LaunchCinematic";

import HeroControlRoom from "./HeroControlRoom";
import HeroVideoCarousel from "./HeroVideoCarousel";


/* ------------------------------------------------------------------
   Small SVG icon set (engineering / IoT / industrial)
------------------------------------------------------------------- */
const ICONS = {
  automation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="2" /><circle cx="5" cy="17" r="2" /><circle cx="19" cy="17" r="2" />
      <path d="M12 8v3M5 15v-2a7 7 0 0 1 14 0v2" />
    </svg>
  ),
  fleet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h14M17 17h4v-6l-3-4h-6v10" />
      <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
      <path d="M9 7h14" transform="translate(-6 0)" />
    </svg>
  ),
  vehicle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 11 6.6 7.5A2 2 0 0 1 8.5 6h7a2 2 0 0 1 1.9 1.5L19 11" />
      <path d="M3 11h18v5h-3M3 16H6" />
      <circle cx="7.5" cy="16" r="1.6" /><circle cx="16.5" cy="16" r="1.6" />
    </svg>
  ),
  workforce: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6" /><path d="M15 8a3 3 0 1 1 3 3" /><path d="M15.5 14.5c3 .4 5.5 2.8 5.5 5.5" />
    </svg>
  ),
  geolocate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  dedupe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="6" height="12" rx="1.5" /><rect x="15" y="7" width="6" height="12" rx="1.5" />
      <path d="M6 4h12" />
    </svg>
  ),
  signal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12a10 10 0 0 1 20 0" /><path d="M6 12a6 6 0 0 1 12 0" /><path d="M10 12a2 2 0 0 1 4 0" /><circle cx="12" cy="16" r="1" />
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /><path d="M7 9l2.5 2L13 8l4 3" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  tower: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 8 21M12 3l4 18M5 8h14M6.5 14h11" />
      <path d="M3 21h18" />
    </svg>
  ),
};

/* ------------------------------------------------------------------
   Neon machine schematic icons (vehicle tracking)
------------------------------------------------------------------- */
const MACHINE_ICONS = {
  excavator: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18.5h16M3 21h18" />
      <rect x="6" y="12" width="9" height="5" rx="1" />
      <path d="M15 12v-3a2 2 0 0 1 2-2h1a1 1 0 0 1 1 1v4" />
      <path d="M10 12 6 4l-3 4" />
      <path d="M2.5 7.5c0 1 .7 1.6 1.5 1.6s1.5-.6 1.5-1.6" />
    </svg>
  ),
  hydra: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="14" height="5" rx="1" />
      <circle cx="6.5" cy="18" r="1.4" />
      <circle cx="14" cy="18" r="1.4" />
      <path d="M17 12v-2a1 1 0 0 1 1-1h2v3" />
      <path d="M11 12 15 3h2" />
      <path d="M15 3c2 0 3 1 3 2.5" />
    </svg>
  ),
  dumper: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9.5h9.5L17 13H4z" />
      <rect x="3" y="13" width="9" height="4" rx="1" />
      <circle cx="6" cy="18" r="1.4" />
      <circle cx="12" cy="18" r="1.4" />
      <path d="M14 13.5h2a1 1 0 0 1 1 1v2.5h1.5" />
    </svg>
  ),
  crane: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v18M8 20.5h8" />
      <path d="M5 8h13" />
      <path d="M18 8l2 2M18 4l2-2" />
      <path d="M8 8v4.5" />
      <path d="M7.2 12.5c0 .9.6 1.5 1.3 1.5s1.3-.6 1.3-1.5" />
    </svg>
  ),
  mixer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="10" height="4" rx="1" />
      <path d="M13 12l1 4" />
      <circle cx="18.5" cy="12" r="3.4" />
      <path d="M18.5 8.6v3.4M16.8 10.8l3.4 2.4" />
      <circle cx="5.5" cy="18" r="1.3" />
      <circle cx="12.5" cy="18" r="1.3" />
      <path d="M3 12V9.5h2" />
    </svg>
  ),
  pump: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="8" height="4" rx="1" />
      <rect x="11" y="13" width="7" height="4" rx="1" />
      <circle cx="6" cy="18.5" r="1.3" />
      <circle cx="13.5" cy="18.5" r="1.3" />
      <circle cx="17" cy="18.5" r="1.3" />
      <rect x="8" y="11" width="3" height="3" rx="0.5" />
      <path d="M9.5 11V6h2" />
      <path d="M11.5 6c2 0 3.5-.6 4.5-2" />
      <path d="M16 4l-1-2M16.5 6.5l-2-1" />
    </svg>
  ),
  lowboy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="14" width="15" height="2" rx="0.5" />
      <path d="M16.5 14.5V10h2.5a2 2 0 0 1 2 2v2.5" />
      <path d="M16.5 11.5h1.8" />
      <circle cx="5" cy="17.5" r="1.3" />
      <circle cx="12" cy="17.5" r="1.3" />
      <circle cx="18.5" cy="17.5" r="1.3" />
    </svg>
  ),
  bulldozer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="9" height="5" rx="1" />
      <path d="M12 11.5h5" />
      <path d="M2 14.5h18" />
      <circle cx="5" cy="15.5" r="1.3" />
      <circle cx="10" cy="15.5" r="1.3" />
      <circle cx="16" cy="15.5" r="1.3" />
      <rect x="0.5" y="11" width="4" height="3" rx="0.4" />
      <path d="M4.5 13.5 12 12" />
    </svg>
  ),
  boomlift: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="16" width="7" height="3" rx="1" />
      <circle cx="7.5" cy="19.5" r="1.2" />
      <circle cx="11.5" cy="19.5" r="1.2" />
      <path d="M9.5 16V9M9.5 9c1.8 0 3-.7 4-1.8" />
      <path d="M13.5 7.2l-1-2.7h-3" />
      <rect x="13.6" y="4" width="4" height="2.2" rx="0.5" />
      <path d="M15.6 8v2.2" />
      <path d="M14 10.5v3.5h3v-3.5" />
    </svg>
  ),
  forklift: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 16v3M13 16v3" />
      <rect x="9.7" y="2.8" width="4" height="1.4" rx="0.7" />
      <rect x="2" y="11" width="8" height="6" rx="1" />
      <path d="M10 13h4" />
      <path d="M2 11V7h5" />
      <path d="M7 9h4" />
      <circle cx="4.5" cy="18.5" r="1.3" />
      <circle cx="15.5" cy="18.5" r="1.3" />
    </svg>
  ),
  tele: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="13" width="8" height="4" rx="1" />
      <circle cx="5" cy="18.5" r="1.3" />
      <circle cx="15" cy="18.5" r="1.3" />
      <path d="M10 13 18 5" />
      <path d="M18 5v4M18 5h-4" />
      <path d="M19.5 3.4l3 1.5-1.5 3-3-1.5z" />
    </svg>
  ),
  crawler: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 19.5c0-.6.6-1 1.3-1h17.4c.7 0 1.3.4 1.3 1s-.6 1-1.3 1H3.3C2.6 20.5 2 20.1 2 19.5" />
      <rect x="8" y="6" width="8" height="8" rx="1" />
      <path d="M15 6l3-2" />
      <path d="M19 3v6" />
      <path d="M19 9l-1.6 1.6" />
      <rect x="9" y="9" width="5" height="3" rx="0.5" />
    </svg>
  ),
  fuel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 13h3M4 13V9" />
      <circle cx="7.5" cy="12" r="1.8" />
      <path d="M9 12H11" />
      <rect x="9" y="10.5" width="11" height="5.5" rx="1.5" />
      <circle cx="12" cy="17.5" r="1.3" />
      <circle cx="16.5" cy="17.5" r="1.3" />
      <circle cx="20.5" cy="8.5" r="2" />
    </svg>
  ),
};

/* Vehicle / hydraulic machines tracked by FMB120 */
const FLEET_TYPES = [
  { id: "crawler", label: "CRAWLER", unit: "UNIT 22", deviceId: "TRK-9105", icon: MACHINE_ICONS.crawler, ignition: "ON", ignitionCls: "ok", speed: "3 km/h", fuel: "47%", fuelCls: "warn" },
  { id: "dumper", label: "DUMPER", unit: "UNIT 07", deviceId: "TRK-7781", icon: MACHINE_ICONS.dumper, ignition: "ON", ignitionCls: "ok", speed: "18 km/h", fuel: "62%", fuelCls: "warn" },
  { id: "crane", label: "CRANE", unit: "UNIT 21", deviceId: "TRK-3324", icon: MACHINE_ICONS.crane, ignition: "ON", ignitionCls: "ok", speed: "0 km/h", fuel: "62%", fuelCls: "warn" },
  { id: "lorry", label: "LORRY", unit: "UNIT 11", deviceId: "TRK-8822", icon: MACHINE_ICONS.lowboy, ignition: "ON", ignitionCls: "ok", speed: "24 km/h", fuel: "71%", fuelCls: "ok" },
  { id: "excavator", label: "EXCAVATOR", unit: "UNIT 02", deviceId: "TRK-2291", icon: MACHINE_ICONS.excavator, ignition: "ON", ignitionCls: "ok", speed: "0 km/h", fuel: "74%", fuelCls: "warn" },
  { id: "hydra", label: "HYDRA", unit: "UNIT 12", deviceId: "TRK-1186", icon: MACHINE_ICONS.hydra, ignition: "ON", ignitionCls: "ok", speed: "18 km/h", fuel: "58%", fuelCls: "warn" },
  { id: "mixer", label: "CONCRETE MIXER", unit: "UNIT 09", deviceId: "TRK-7751", icon: MACHINE_ICONS.mixer, ignition: "ON", ignitionCls: "ok", speed: "22 km/h", fuel: "66%", fuelCls: "warn" },
  { id: "pump", label: "PUMP TRUCK", unit: "UNIT 18", deviceId: "TRK-6610", icon: MACHINE_ICONS.pump, ignition: "ON", ignitionCls: "ok", speed: "12 km/h", fuel: "54%", fuelCls: "warn" },
  { id: "bulldozer", label: "BULLDOZER", unit: "UNIT 02", deviceId: "TRK-3310", icon: MACHINE_ICONS.bulldozer, ignition: "ON", ignitionCls: "ok", speed: "6 km/h", fuel: "58%", fuelCls: "warn" },
  { id: "boomlift", label: "BOOM LIFT", unit: "UNIT 14", deviceId: "TRK-5093", icon: MACHINE_ICONS.boomlift, ignition: "ON", ignitionCls: "ok", speed: "4 km/h", fuel: "82%", fuelCls: "ok" },
  { id: "forklift", label: "FORKLIFT", unit: "UNIT 11", deviceId: "TRK-4477", icon: MACHINE_ICONS.forklift, ignition: "ON", ignitionCls: "ok", speed: "8 km/h", fuel: "63%", fuelCls: "warn" },
  { id: "tele", label: "TELEHANDLER", unit: "UNIT 16", deviceId: "TRK-5236", icon: MACHINE_ICONS.tele, ignition: "ON", ignitionCls: "ok", speed: "11 km/h", fuel: "69%", fuelCls: "ok" },
  { id: "fuel", label: "FUEL & LUBE", unit: "UNIT 08", deviceId: "TRK-6644", icon: MACHINE_ICONS.fuel, ignition: "ON", ignitionCls: "ok", speed: "15 km/h", fuel: "90%", fuelCls: "ok" },
];

const SITE_ZONES = ["North Stockyard", "Zone 1", "N2 Plant", "B2 Zone", "Gate House"];

/* Manpower + fleet mode (FMC920) */
const MANPOWER_MODE = {
  tag: "FMC920",
  kicker: "MANPOWER + FLEET",
  device: "Teltonika FMC920",
  small: "Workforce · Fleet · Geofences",
  img: "/images/hardware/fmc920.png",
  name: "CREW BUS · UNIT 12",
  meta: "Device ID · FMC-8843",
  asset: "Crew Transport",
  zone: "Zone 1 · Site Gate",
  contact: "2 sec ago",
  rows: [
    { label: "Workers onboard", value: "6 PERSONS", cls: "warn" },
    { label: "Beacon proximity", value: "3 TAG TEAMS", cls: "warn" },
    { label: "Route", value: "ACTIVE", cls: "ok" },
    { label: "Geofence", value: "ENTERED", cls: "ok" },
    { label: "Fleet status", value: "SYNCED", cls: "ok" },
    { label: "Battery", value: "92%", cls: "" },
  ],
};

/* Workforce placed around the site map, each drifting between zones */
const WORKFORCE_DOTS = [
  { left: 12, top: 24, dz: { x: 9, y: 6 }, d: 7.5, color: "warn" },
  { left: 34, top: 12, dz: { x: -7, y: 10 }, d: 8.5, color: "ok" },
  { left: 58, top: 30, dz: { x: 6, y: -9 }, d: 6.8, color: "warn" },
  { left: 22, top: 64, dz: { x: 11, y: -5 }, d: 9.2, color: "ok" },
  { left: 80, top: 18, dz: { x: -8, y: 8 }, d: 7.2, color: "ok" },
  { left: 66, top: 74, dz: { x: 8, y: 5 }, d: 8.6, color: "warn" },
  { left: 44, top: 86, dz: { x: -6, y: -9 }, d: 7, color: "ok" },
  { left: 88, top: 62, dz: { x: -10, y: -7 }, d: 8.1, color: "warn" },
];

/* GT POINTS — 28 solar-powered Gate Points scattered across the site
   (not a grid — natural deployment along roads/towers/boundary). */
const GT_POINT_COUNT = 28;
const GT_POINTS = [
  { id: 1, label: "GT-01", left: 8, top: 14, tilt: 8 },
  { id: 2, label: "GT-02", left: 17, top: 8, tilt: -6 },
  { id: 3, label: "GT-03", left: 29, top: 16, tilt: 4 },
  { id: 4, label: "GT-04", left: 40, top: 9, tilt: -10 },
  { id: 5, label: "GT-05", left: 52, top: 15, tilt: 7 },
  { id: 6, label: "GT-06", left: 63, top: 8, tilt: -4 },
  { id: 7, label: "GT-07", left: 74, top: 13, tilt: 6 },
  { id: 8, label: "GT-08", left: 86, top: 9, tilt: -8 },
  { id: 9, label: "GT-09", left: 92, top: 22, tilt: 3 },
  { id: 10, label: "GT-10", left: 12, top: 30, tilt: -7 },
  { id: 11, label: "GT-11", left: 24, top: 36, tilt: 5 },
  { id: 12, label: "GT-12", left: 37, top: 30, tilt: -3 },
  { id: 13, label: "GT-13", left: 49, top: 38, tilt: 9 },
  { id: 14, label: "GT-14", left: 61, top: 32, tilt: -5 },
  { id: 15, label: "GT-15", left: 72, top: 40, tilt: 2 },
  { id: 16, label: "GT-16", left: 85, top: 34, tilt: -9 },
  { id: 17, label: "GT-17", left: 9, top: 52, tilt: 6 },
  { id: 18, label: "GT-18", left: 20, top: 60, tilt: -4 },
  { id: 19, label: "GT-19", left: 32, top: 52, tilt: 8 },
  { id: 20, label: "GT-20", left: 45, top: 62, tilt: -6 },
  { id: 21, label: "GT-21", left: 56, top: 54, tilt: 3 },
  { id: 22, label: "GT-22", left: 68, top: 64, tilt: -2 },
  { id: 23, label: "GT-23", left: 80, top: 56, tilt: 7 },
  { id: 24, label: "GT-24", left: 91, top: 66, tilt: -8 },
  { id: 25, label: "GT-25", left: 14, top: 76, tilt: 4 },
  { id: 26, label: "GT-26", left: 28, top: 82, tilt: -5 },
  { id: 27, label: "GT-27", left: 46, top: 78, tilt: 9 },
  { id: 28, label: "GT-28", left: 64, top: 84, tilt: -3 },
];

/* Workforce density nodes — 1000+ workers grouped in clusters */
const WORKFORCE_CLUSTERS = [
  { label: "ZONE 1", left: 38, top: 20, count: 214, pulse: 0 },
  { label: "N2 PLANT", left: 74, top: 48, count: 308, pulse: 1 },
  { label: "B2 ZONE", left: 28, top: 58, count: 186, pulse: 2 },
  { label: "GATE HOUSE", left: 60, top: 76, count: 142, pulse: 0.6 },
  { label: "MAIN COURT", left: 50, top: 42, count: 130, pulse: 1.4 },
];

const VIOLATION_ZONES = ["N2 PLANT", "B2 ZONE"];

function GTIcon({ active }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "gt-ico gt-ico-active" : "gt-ico"}
    >
      {/* solar panel top */}
      <rect x="9.2" y="2.4" width="6.4" height="2.2" rx="0.5" style={{ fill: "rgba(255,100,29,0.16)" }} />
      <path d="M10 2.6 12.6 4.4M14 2.6 11.4 4.4" />
      {/* pole mast */}
      <path d="M12 4.6v15" />
      {/* sensor box */}
      <rect x="10" y="9" width="4" height="3.6" rx="0.7" style={{ fill: "rgba(0,0,0,0.35)" }} />
      <path d="M10.7 11.4h2.6" />
      {/* base legs */}
      <path d="M8.4 19.6h7.2" />
      {/* transmitting arcs */}
      <path d="M16 6.2a5.2 5.2 0 0 1 0 4.6" className="gt-arc gt-arc-1" />
      <path d="M17.6 4.6a8 8 0 0 1 0 7.8" className="gt-arc gt-arc-2" />
    </svg>
  );
}

/* ------------------------------------------------------------------
   Fake satellite route map — dark "Google Maps" carto of Ambalamugal
   (Kochi). Procedural farmland, town blocks, Periyar river, NH-544,
   BPCL refinery with tanks, and a live orange route with a moving
   vehicle + telemetry HUD.
------------------------------------------------------------------- */
const FM_ROUTE = "M16 196 C 62 182 104 192 148 172 C 186 156 210 138 238 122 C 268 106 308 92 352 74";

const fmHash = (n) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

const FM_FARMS = Array.from({ length: 104 }, (_, i) => {
  if (fmHash(i) < 0.24) return null;
  const c = i % 13;
  const r = Math.floor(i / 13);
  return {
    x: c * 31 + 5 + fmHash(i + 1) * 6,
    y: r * 30 - 3 + fmHash(i + 2) * 6,
    w: 16 + fmHash(i + 3) * 20,
    h: 14 + fmHash(i + 4) * 16,
    fill: ["#243024", "#293529", "#212b24", "#2e3a2b", "#26321f"][i % 5],
  };
}).filter(Boolean);

const FM_BUILDINGS = Array.from({ length: 30 }, (_, i) => ({
  x: [38, 108, 178][i % 3] + fmHash(i + 7) * 24,
  y: 12 + Math.floor(i / 3) * 13 + fmHash(i + 8) * 8,
  w: 7 + fmHash(i + 9) * 9,
  h: 7 + fmHash(i + 10) * 9,
}));

const FM_TANKS = [
  [250, 46, 15], [282, 53, 12], [302, 44, 13], [332, 54, 15],
  [258, 76, 11], [314, 80, 12], [338, 78, 10], [290, 84, 13],
];

/* Small smooth closed loop used as a default route for units without a
   hand-authored path. Keeps every vehicle moving along its own geometry. */
const routeLoop = ([x, y], amp) =>
  `M ${x - amp} ${y} a ${amp} ${amp * 0.55} 0 1 0 ${amp * 2} 0 a ${amp} ${amp * 0.55} 0 1 0 ${-amp * 2} 0 Z`;

/* Per-vehicle operational profile for the live telemetry session.
   Speeds and ignition stay driven by FLEET_TYPES; this adds the route /
   zone / destination / telemetry identity so each unit opens a different
   map state. Coordinates live in the 400 × 226 map viewBox. */
const FLEET_OPS = {
  excavator: {
    pos: [184, 148], prev: [118, 150],
    route: "M170 144 C 176 138 186 138 191 145 C 195 153 186 161 177 157 C 170 153 167 148 170 144 Z",
    dur: 12,
    destLabel: "N2 PLANT", destPos: [150, 136],
    routeName: "N2 ACCESS RD", dist: "0.8", eta: "STOPPED", routeState: "IDLE",
    zone: "ZONE 1 · N2 PLANT", task: "EXCAVATION · FOOTING 4",
    hdg: 214, alt: "12 m", sat: 8, lat: "10.0362", lng: "76.3321", signal: 4, battery: 74, last: "2 s",
  },
  hydra: {
    pos: [74, 124], prev: [96, 108],
    route: routeLoop([74, 124], 16),
    dur: 9,
    destLabel: "STRUCTURE A", destPos: [58, 106],
    routeName: "STRUCTURE A LOOP", dist: "1.1", eta: "6 MIN", routeState: "MOVING",
    zone: "ZONE 1 · STRUCTURE A", task: "LIFT · PANEL 12",
    hdg: 178, alt: "7 m", sat: 7, lat: "10.0341", lng: "76.3318", signal: 4, battery: 58, last: "3 s",
  },
  dumper: {
    pos: [238, 112], prev: [118, 150],
    route: FM_ROUTE,
    dur: 5.5,
    destLabel: "BPCL GATE A", destPos: [352, 74],
    routeName: "NH-544 · HAUL RD", dist: "4.2", eta: "12 MIN", routeState: "MOVING",
    zone: "ZONE 2 · HAUL RD", task: "AGGREGATE RUN · LOAD 6",
    hdg: 42, alt: "9 m", sat: 10, lat: "10.0284", lng: "76.3409", signal: 5, battery: 91, last: "1 s",
  },
  crane: {
    pos: [296, 96], prev: [270, 122],
    route: routeLoop([296, 96], 18),
    dur: 12,
    destLabel: "STRUCTURE B", destPos: [356, 52],
    routeName: "STRUCTURE B REACH", dist: "0.9", eta: "IDLE", routeState: "STANDBY",
    zone: "ZONE 3 · STRUCTURE B", task: "CRANE STAND · BLOCK 2",
    hdg: 88, alt: "24 m", sat: 9, lat: "10.0319", lng: "76.3377", signal: 4, battery: 62, last: "4 s",
  },
  mixer: {
    pos: [344, 82], prev: [296, 122],
    route: routeLoop([344, 82], 20),
    dur: 8,
    destLabel: "BPCL PRECAST", destPos: [372, 48],
    routeName: "PRECAST SPUR", dist: "1.8", eta: "8 MIN", routeState: "MOVING",
    zone: "ZONE 3 · PRECAST", task: "CONCRETE · SLAB 9",
    hdg: 312, alt: "8 m", sat: 9, lat: "10.0338", lng: "76.3441", signal: 5, battery: 66, last: "2 s",
  },
  pump: {
    pos: [40, 202], prev: [118, 150],
    route: routeLoop([40, 202], 22),
    dur: 9.5,
    destLabel: "NH-544 SOUTH", destPos: [16, 214],
    routeName: "NH-544 SOUTH", dist: "2.4", eta: "9 MIN", routeState: "MOVING",
    zone: "ZONE 4 · SOUTH GATE", task: "PUMP · CASING OUTER 2",
    hdg: 201, alt: "6 m", sat: 7, lat: "10.0253", lng: "76.3286", signal: 3, battery: 54, last: "5 s",
  },
  lowboy: {
    pos: [104, 176], prev: [118, 150],
    route: routeLoop([104, 176], 17),
    dur: 12,
    destLabel: "YARD 1", destPos: [62, 190],
    routeName: "YARD 1", dist: "0.6", eta: "STOPPED", routeState: "PARKED",
    zone: "ZONE 4 · YARD 1", task: "HAUL · STANDBY",
    hdg: 155, alt: "5 m", sat: 6, lat: "10.0279", lng: "76.3312", signal: 3, battery: 71, last: "6 s",
  },
  bulldozer: {
    pos: [268, 120], prev: [238, 112],
    route: routeLoop([268, 120], 18),
    dur: 11,
    destLabel: "GRADING PAD", destPos: [232, 140],
    routeName: "GRADING PAD", dist: "0.7", eta: "IDLE", routeState: "IDLE",
    zone: "ZONE 2 · PAD 3", task: "GRADE · BASE 6",
    hdg: 266, alt: "11 m", sat: 8, lat: "10.0303", lng: "76.3389", signal: 4, battery: 58, last: "3 s",
  },
  boomlift: {
    pos: [210, 56], prev: [238, 82],
    route: routeLoop([210, 56], 18),
    dur: 10,
    destLabel: "REFINERY EAST", destPos: [364, 42],
    routeName: "REFINERY EAST", dist: "1.4", eta: "7 MIN", routeState: "MOVING",
    zone: "ZONE 1 · REFINERY", task: "INSPECT · TANK 7",
    hdg: 74, alt: "18 m", sat: 10, lat: "10.0356", lng: "76.3426", signal: 5, battery: 82, last: "1 s",
  },
  forklift: {
    pos: [150, 88], prev: [120, 100],
    route: routeLoop([150, 88], 15),
    dur: 9,
    destLabel: "WAREHOUSE", destPos: [102, 74],
    routeName: "BULK STORE", dist: "0.4", eta: "5 MIN", routeState: "MOVING",
    zone: "ZONE 1 · BULK", task: "PALLET · LOT 22",
    hdg: 190, alt: "4 m", sat: 8, lat: "10.0370", lng: "76.3334", signal: 4, battery: 63, last: "2 s",
  },
  tele: {
    pos: [248, 148], prev: [200, 150],
    route: routeLoop([248, 148], 20),
    dur: 8.5,
    destLabel: "B2 ZONE", destPos: [118, 178],
    routeName: "B2 RING", dist: "1.3", eta: "6 MIN", routeState: "MOVING",
    zone: "B2 ZONE", task: "LIFT · SCAFFOLD C",
    hdg: 332, alt: "13 m", sat: 8, lat: "10.0322", lng: "76.3363", signal: 4, battery: 69, last: "2 s",
  },
  crawler: {
    pos: [96, 166], prev: [118, 150],
    route: routeLoop([96, 166], 15),
    dur: 11,
    destLabel: "SOUTH CUT", destPos: [40, 190],
    routeName: "SOUTH CUT", dist: "0.9", eta: "IDLE", routeState: "SLOW",
    zone: "ZONE 4 · SOUTH", task: "CUT · TRENCH 3",
    hdg: 240, alt: "6 m", sat: 7, lat: "10.0261", lng: "76.3306", signal: 3, battery: 47, last: "4 s",
  },
  fuel: {
    pos: [330, 108], prev: [296, 96],
    route: routeLoop([330, 108], 18),
    dur: 9.5,
    destLabel: "BOWSER", destPos: [368, 96],
    routeName: "SERVICE SPUR", dist: "1.6", eta: "7 MIN", routeState: "MOVING",
    zone: "ZONE 3 · SERVICE", task: "FILL · PUMP 1",
    hdg: 96, alt: "7 m", sat: 9, lat: "10.0333", lng: "76.3434", signal: 5, battery: 90, last: "1 s",
  },
};

/* Safety net profile if a unit id is ever missing from FLEET_OPS. */
const OPS_FALLBACK = {
  pos: [200, 113], prev: [118, 150],
  route: routeLoop([200, 113], 18),
  dur: 10,
  destLabel: "SITE", destPos: [200, 60],
  routeName: "SITE LOOP", dist: "1.0", eta: "ETA", routeState: "MOVING",
  zone: "ZONE 1", task: "ROUTINE", hdg: 180, alt: "10 m", sat: 8, lat: "10.0300", lng: "76.3300", signal: 4, battery: 60, last: "2 s",
};

/* Shared satellite-map terrain used by the compact hero map. */
function FmTerrain({ uid }) {
  return (
    <g className="fm-terrain">
      <rect width="400" height="226" rx="14" fill={`url(#${uid}Sky)`} />

      {/* farmland / vegetation plots */}
      {FM_FARMS.map((pl, i) => (
        <rect key={`p-${i}`} x={pl.x} y={pl.y} width={pl.w} height={pl.h} fill={pl.fill} opacity="0.9" />
      ))}

      {/* Periyar river */}
      <path d="M226 0 C 206 48 258 80 248 120 C 240 152 300 186 294 226" fill={`url(#${uid}Water)`} stroke="#163a4a" strokeWidth="1.2" />
      <path d="M226 0 C 206 48 258 80 248 120 C 240 152 300 186 294 226" fill="none" stroke="#1d4a5c" strokeWidth="3" opacity="0.6" />

      {/* minor roads + casings */}
      <g fill="none" strokeLinecap="round">
        <path d="M40 -10 C 60 40 120 70 170 70 C 210 70 226 96 226 132" stroke="#232930" strokeWidth="10" />
        <path d="M40 -10 C 60 40 120 70 170 70 C 210 70 226 96 226 132" stroke="#2e363f" strokeWidth="6" />
        <path d="M-10 118 C 80 112 140 124 206 112 C 250 106 268 120 300 132 C 330 142 350 138 404 128" stroke="#232930" strokeWidth="10" />
        <path d="M-10 118 C 80 112 140 124 206 112 C 250 106 268 120 300 132 C 330 142 350 138 404 128" stroke="#303842" strokeWidth="6" />
        <path d="M120 210 C 150 170 172 148 190 136 C 220 116 240 108 258 100" stroke="#232930" strokeWidth="9" />
        <path d="M120 210 C 150 170 172 148 190 136 C 220 116 240 108 258 100" stroke="#2e363f" strokeWidth="5" />
      </g>

      {/* NH-544 highway */}
      <path d="M16 214 C 70 198 110 206 160 180 C 200 160 224 138 254 122 C 290 103 330 92 384 72" fill="none" stroke="#49535e" strokeWidth="11" />
      <path d="M16 214 C 70 198 110 206 160 180 C 200 160 224 138 254 122 C 290 103 330 92 384 72" fill="none" stroke="#aeb6be" strokeWidth="1.4" strokeDasharray="8 9" opacity="0.55" />
      <text x="96" y="206" className="fm-label fm-road-label">NH-544</text>
      <text x="268" y="112" className="fm-label fm-road-label">KOCHI ⇄ KOTTAYAM</text>

      {/* town blocks */}
      {FM_BUILDINGS.map((b, i) => (
        <rect key={`b-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill="#2d333b" stroke="#22272e" strokeWidth="1" />
      ))}

      {/* BPCL refinery complex */}
      <g className="fm-refinery">
        <rect x="244" y="24" width="104" height="76" rx="8" fill="#2b2a24" stroke="#4a4437" strokeWidth="1.4" />
        <rect x="272" y="18" width="22" height="16" rx="3" fill="#333028" stroke="#4a4437" opacity="0.9" />
        {FM_TANKS.map(([tx, ty, tr], i) => (
          <g key={`t-${i}`}>
            <circle cx={tx} cy={ty} r={tr} fill="#241f18" stroke="#57503e" strokeWidth="2" />
            <circle cx={tx} cy={ty} r={tr * 0.45} fill="none" stroke="#3f3a2e" strokeWidth="1.6" />
            <circle cx={tx - tr * 0.3} cy={ty - tr * 0.3} r={tr * 0.14} fill="#7a6a42" opacity="0.6" />
          </g>
        ))}
        <circle cx="352" cy="34" r="3.4" fill="#ffb64c" />
        <circle cx="248" cy="92" r="3" fill="#ff7a1a" opacity="0.85" />
        <text x="296" y="62" textAnchor="middle" className="fm-label">BPCL KOCHI REFINERY</text>
        <text x="296" y="76" textAnchor="middle" className="fm-small">AMBALAMUGAL · ERN</text>
      </g>

      {/* area labels */}
      <text x="70" y="30" className="fm-label">AMBALAMUGAL</text>
      <text x="118" y="150" className="fm-label fm-road-label">NAMBAKULAM RD</text>
      <text x="196" y="66" transform="rotate(48 216 58)" className="fm-small">PERIYAR</text>
    </g>
  );
}

/* ------------------------------------------------------------------
   Compact site map — two distinct map states:
   1. FLEET MAP: all vehicles visible across the site
   2. VEHICLE DETAIL MAP: ONLY the selected vehicle is rendered,
      centered on that vehicle with its route and position.
------------------------------------------------------------------ */
function FleetRouteMap({ f, ops, speed, mapMode = "detail", onSelectVehicle }) {
  // CRITICAL REQUIREMENT:
  // In INDIVIDUAL VEHICLE DETAIL mode: render ONLY the selected vehicle's marker!
  // In FLEET OVERVIEW mode: render all vehicles.
  const visibleVehicles = mapMode === "detail"
    ? FLEET_TYPES.filter((v) => v.id === f.id)
    : FLEET_TYPES;

  // Center the map on the selected vehicle when in detail view
  const selectedPos = (FLEET_OPS[f.id] || OPS_FALLBACK).pos;
  const vbW = 200;
  const vbH = 113;
  const minX = Math.max(0, Math.min(400 - vbW, selectedPos[0] - vbW / 2));
  const minY = Math.max(0, Math.min(226 - vbH, selectedPos[1] - vbH / 2));
  const activeViewBox = mapMode === "detail" ? `${minX} ${minY} ${vbW} ${vbH}` : "0 0 400 226";

  const markStyle = (pos) => {
    if (mapMode === "detail") {
      return {
        left: `${((pos[0] - minX) / vbW) * 100}%`,
        top: `${((pos[1] - minY) / vbH) * 100}%`,
      };
    }
    return {
      left: `${(pos[0] / 400) * 100}%`,
      top: `${(pos[1] / 226) * 100}%`,
    };
  };

  return (
    <div className={`fleet-map mode-${mapMode}`}>
      {/* 1. Large clean map canvas — hero of the card */}
      <div className="fm-canvas-stage">
        <svg className="fm-svg" viewBox={activeViewBox} preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
          <defs>
            <linearGradient id="fmSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b2026" />
              <stop offset="100%" stopColor="#14181c" />
            </linearGradient>
            <linearGradient id="fmWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10242f" />
              <stop offset="100%" stopColor="#0c1b24" />
            </linearGradient>
            <pattern id="fmGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="rgba(148, 176, 196, 0.07)" strokeWidth="1" />
            </pattern>
          </defs>
          <FmTerrain uid="fm" />
          <rect className="fm-grid" width="400" height="226" fill="url(#fmGrid)" />
          <path className="fm-trail" d={ops.route} />
          <path className="fm-route" d={ops.route} />
          {/* Destination waypoint / route endpoint */}
          {ops.destPos && (
            <g className="fm-dest-pt" transform={`translate(${ops.destPos[0]}, ${ops.destPos[1]})`}>
              <circle r="4" fill="none" stroke="#00e5ff" strokeWidth="1.2" opacity="0.85" />
              <circle r="1.8" fill="#00e5ff" />
              <text x="0" y="-6" textAnchor="middle" className="fm-dest-lbl">{ops.destLabel}</text>
            </g>
          )}
        </svg>

        {/* Selected vehicle marker (or all in fleet overview) */}
        <div className="fm-select">
          {visibleVehicles.map((v) => {
            const pos = (FLEET_OPS[v.id] || OPS_FALLBACK).pos;
            return (
              <button
                type="button"
                key={v.id}
                className={`fm-sel-btn${f.id === v.id ? " sel" : ""}`}
                style={markStyle(pos)}
                onClick={() => onSelectVehicle && onSelectVehicle(v.id)}
                aria-label={`Select ${v.label} ${v.unit}`}
                title={`${v.label} · ${v.unit}`}
              >
                <span className="fm-sel-chip">{v.icon}</span>
                <i className="fm-sel-ring" />
                <em className="fm-sel-tag">{v.label} · {v.unit}</em>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ONE compact telemetry HUD strip with small typography and separators */}
      <div className="fm-tele-hud" role="region" aria-label="Vehicle telemetry">
        <span className="fm-th-live">
          <i className="fm-th-dot" aria-hidden="true" />
          <strong>LIVE</strong>
        </span>
        <span className="fm-th-sep">·</span>
        <span className="fm-th-speed">
          <strong>{speed}</strong>
        </span>
        <span className="fm-th-sep">·</span>
        <span className="fm-th-item">
          <em>HDG</em><strong>{ops.hdg}°</strong>
        </span>
        <span className="fm-th-sep">·</span>
        <span className="fm-th-item fm-th-cyan">
          <em>GPS</em><strong>LOCK</strong>
        </span>
        <span className="fm-th-sep">·</span>
        <span className="fm-th-item">
          <em>NET</em><strong>4G</strong>
        </span>
        <span className="fm-th-sep">·</span>
        <span className="fm-th-item fm-th-cyan">
          <em>SIG</em><strong>{"▮".repeat(ops.signal)}</strong>
        </span>
        <span className="fm-th-sep">·</span>
        <span className="fm-th-item">
          <em>SAT</em><strong>{String(ops.sat).padStart(2, "0")}</strong>
        </span>
        <span className="fm-th-sep">·</span>
        <span className="fm-th-item">
          <em>ALT</em><strong>{ops.alt}</strong>
        </span>
      </div>

      {/* 3. Bottom compact route / ETA area */}
      <div className="fm-route-bar" role="region" aria-label="Route information">
        <div className="fm-rb-left">
          <i className="fm-rb-arr" aria-hidden="true" />
          <span className="fm-rb-name">{ops.routeName}</span>
        </div>
        <div className="fm-rb-right">
          <strong>{ops.dist} KM</strong>
          <span className="fm-rb-sep">•</span>
          <span className="fm-rb-eta">ETA {ops.eta}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Heavy Equipment Blueprint Line-Art Vector Symbols (Section 02 & 04)
   Industrial line-art schematic symbols for all equipment archetypes
------------------------------------------------------------------- */
function HoloVehicleSymbol({ type, color = "#ffffff", strokeWidth = 1.6 }) {
  switch (type) {
    case "dumper":
      return (
        <g>
          <polygon points="2,3 12,3 15,10 4,10" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <polygon points="14,6 18,6 19,10 14,10" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <line x1="2" y1="11" x2="20" y2="11" stroke={color} strokeWidth={strokeWidth} />
          <circle cx="6" cy="12.5" r="2.5" fill={color} />
          <circle cx="17" cy="12.5" r="2.5" fill={color} />
        </g>
      );
    case "lorry":
      return (
        <g>
          <rect x="7" y="3" width="14" height="7" rx="0.5" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <line x1="12" y1="4" x2="12" y2="9" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <line x1="16" y1="4" x2="16" y2="9" stroke={color} strokeWidth="0.8" opacity="0.6" />
          <path d="M2 10V6a1 1 0 0 1 1-1h3l1 5H2z" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <circle cx="4" cy="12.5" r="2" fill={color} />
          <circle cx="14" cy="12.5" r="2" fill={color} />
          <circle cx="18" cy="12.5" r="2" fill={color} />
        </g>
      );
    case "crane":
      return (
        <g>
          <line x1="2" y1="11" x2="21" y2="11" stroke={color} strokeWidth={strokeWidth} />
          <rect x="4" y="8" width="5" height="3" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <line x1="8" y1="8" x2="21" y2="2" stroke={color} strokeWidth={strokeWidth + 0.3} strokeLinecap="round" />
          <line x1="21" y1="2" x2="21" y2="8" stroke={color} strokeWidth="0.9" strokeDasharray="1.5 1" />
          <path d="M20.5 8c0 1.2 1 1.2 1 0.4" stroke={color} strokeWidth="1.2" fill="none" />
          <circle cx="5" cy="12.5" r="1.8" fill={color} />
          <circle cx="11" cy="12.5" r="1.8" fill={color} />
          <circle cx="17" cy="12.5" r="1.8" fill={color} />
        </g>
      );
    case "excavator":
      return (
        <g>
          <rect x="3" y="11" width="16" height="3.5" rx="1.5" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <circle cx="5" cy="12.7" r="1" fill={color} />
          <circle cx="17" cy="12.7" r="1" fill={color} />
          <rect x="5" y="7" width="8" height="4" rx="0.5" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <path d="M10 8L15 3L20 8" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 8l1.5 3.5h-3z" fill={color} opacity="0.9" />
        </g>
      );
    case "bulldozer":
      return (
        <g>
          <rect x="4" y="11" width="13" height="3.5" rx="1.5" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <circle cx="6" cy="12.7" r="0.9" fill={color} />
          <circle cx="10" cy="12.7" r="0.9" fill={color} />
          <circle cx="14" cy="12.7" r="0.9" fill={color} />
          <polygon points="7,11 7,6 12,6 12,8 15,8 15,11" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <line x1="9" y1="11" x2="20" y2="11" stroke={color} strokeWidth={strokeWidth} />
          <path d="M20 6c1.5 2.5 1.5 5.5 0 8" stroke={color} strokeWidth={strokeWidth + 0.6} strokeLinecap="round" fill="none" />
        </g>
      );
    case "crawler":
      return (
        <g>
          <rect x="2" y="11" width="18" height="4" rx="1.5" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <circle cx="4" cy="13" r="1.1" fill={color} />
          <circle cx="18" cy="13" r="1.1" fill={color} />
          <rect x="5" y="6" width="9" height="5" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <line x1="12" y1="6" x2="20" y2="1" stroke={color} strokeWidth={strokeWidth} />
          <line x1="8" y1="6" x2="16" y2="1" stroke={color} strokeWidth="1" opacity="0.6" />
        </g>
      );
    case "mixer":
      return (
        <g>
          <line x1="2" y1="11" x2="20" y2="11" stroke={color} strokeWidth={strokeWidth} />
          <path d="M2 11V7h4l2 2v2H2z" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <polygon points="8,10 11,4 17,6 15,10" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <line x1="17" y1="7" x2="20" y2="10" stroke={color} strokeWidth={strokeWidth} />
          <circle cx="5" cy="12.5" r="2" fill={color} />
          <circle cx="13" cy="12.5" r="2" fill={color} />
          <circle cx="17" cy="12.5" r="2" fill={color} />
        </g>
      );
    case "pump":
      return (
        <g>
          <line x1="2" y1="11" x2="20" y2="11" stroke={color} strokeWidth={strokeWidth} />
          <path d="M2 11V7h4l2 2v2H2z" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <path d="M8 9L15 4L11 3L19 2" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="5" cy="12.5" r="2" fill={color} />
          <circle cx="15" cy="12.5" r="2" fill={color} />
        </g>
      );
    case "forklift":
      return (
        <g>
          <path d="M3 11h9V8H7L4 10z" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <rect x="6" y="5" width="4" height="4" fill="none" stroke={color} strokeWidth="1" />
          <line x1="13" y1="2" x2="13" y2="12" stroke={color} strokeWidth={strokeWidth} />
          <path d="M13 10h5v1h-5" fill={color} />
          <circle cx="5" cy="12.5" r="1.8" fill={color} />
          <circle cx="11" cy="12.5" r="1.8" fill={color} />
        </g>
      );
    case "hydra":
    case "tele":
    case "boomlift":
    default:
      return (
        <g>
          <line x1="2" y1="11" x2="19" y2="11" stroke={color} strokeWidth={strokeWidth} />
          <path d="M2 11V7h5l2 4H2z" fill="none" stroke={color} strokeWidth={strokeWidth} />
          <line x1="7" y1="8" x2="21" y2="4" stroke={color} strokeWidth={strokeWidth + 0.3} strokeLinecap="round" />
          <line x1="21" y1="4" x2="21" y2="9" stroke={color} strokeWidth="1" />
          <circle cx="5" cy="12.5" r="2.2" fill={color} />
          <circle cx="15" cy="12.5" r="2.2" fill={color} />
        </g>
      );
  }
}

/* Site coordinates & technical telemetry identifiers on 700x420 digital twin canvas */
const VEHICLE_MAP_POS = {
  dumper: { x: 375, y: 205, code: "DUMPER - U07", label: "DUMPER", unit: "U07", speed: "18 km/h", fuel: "62%", zone: "Process Unit - A" },
  crane: { x: 395, y: 125, code: "Crane-01", label: "CRANE", unit: "U01", speed: "0 km/h", fuel: "62%", zone: "North Pipe Rack" },
  excavator: { x: 250, y: 215, code: "EXC-03", label: "EXCAVATOR", unit: "U03", speed: "12 km/h", fuel: "74%", zone: "Construction Zone" },
  lorry: { x: 575, y: 265, code: "Lorry - U11", label: "LORRY", unit: "U11", speed: "24 km/h", fuel: "71%", zone: "Logistics Lane" },
  bulldozer: { x: 510, y: 215, code: "BDZ-02", label: "BULLDOZER", unit: "U02", speed: "0 km/h", fuel: "58%", zone: "Tank Farm Pad" },
  pump: { x: 610, y: 340, code: "PUMP-01", label: "PUMP TRUCK", unit: "U01", speed: "0 km/h", fuel: "54%", zone: "Gate House Road" },
  hydra: { x: 295, y: 305, code: "CRN-07", label: "HYDRA CRANE", unit: "U07", speed: "18 km/h", fuel: "58%", zone: "Utility Area" },
  crawler: { x: 240, y: 105, code: "DMP-04", label: "CRAWLER", unit: "U04", speed: "22 km/h", fuel: "47%", zone: "North Yard" },
  mixer: { x: 340, y: 245, code: "MXR-09", label: "CONCRETE MIXER", unit: "U09", speed: "22 km/h", fuel: "66%", zone: "Utility Access" },
  forklift: { x: 520, y: 310, code: "FLT-11", label: "FORKLIFT", unit: "U11", speed: "8 km/h", fuel: "63%", zone: "Storage - B" },
};

/* 7 Secondary Equipment Markers matching reference specification */
const SECONDARY_ASSETS = [
  { id: "dmp04", type: "dumper", x: 240, y: 105, code: "DMP-04", status: "22 km/h", selectId: "crawler", color: "#ff9d47" },
  { id: "crane01", type: "crane", x: 395, y: 125, code: "Crane-01", status: "Idle", selectId: "crane", color: "#00e5ff" },
  { id: "exc03", type: "excavator", x: 250, y: 215, code: "EXC-03", status: "12 km/h", selectId: "excavator", color: "#ff9d47" },
  { id: "crn07", type: "crane", x: 295, y: 305, code: "CRN-07", status: "Working", selectId: "hydra", color: "#00e5ff" },
  { id: "bdz02", type: "bulldozer", x: 510, y: 215, code: "BDZ-02", status: "Idle", selectId: "bulldozer", color: "#00e5ff" },
  { id: "lorry11", type: "lorry", x: 575, y: 265, code: "Lorry - U11", status: "24 km/h", selectId: "lorry", color: "#00e5ff" },
  { id: "pump01", type: "pump", x: 610, y: 340, code: "PUMP-01", status: "Idle", selectId: "pump", color: "#00e5ff" },
];

/* ------------------------------------------------------------------
   3D Holographic Fleet Map Projection
   Emits from the right edge of the Site Fleet Board panel.
   Recreates the complete reference interface:
   - Floating header with active vehicle, live pill, compass & close button
   - Left/Center: Digital twin industrial map with Periyar River,
     NH-544 highway, Process Units, Tank Farms, Flare Stack,
     glowing active route with pulse, active vehicle marker,
     secondary vehicles, coordinates, skyline, scale, and on-map
     floating telemetry cards (Fuel gauge, Device status, Zone lock, Route ETA)
   - Right: Complete 5-item interactive tactical menu rail
------------------------------------------------------------------- */

const DETAILED_SCHEMATICS = {
  dumper: (
    <svg viewBox="0 0 100 55" className="top-sch-svg" fill="none" stroke="currentColor">
      {/* Chassis and Cabin */}
      <rect x="14" y="22" width="22" height="12" rx="1.5" strokeWidth="1.4" />
      <rect x="18" y="24" width="7" height="6" rx="0.5" strokeWidth="1" />
      <path d="M14 34h30" strokeWidth="1.4" />
      <line x1="12" y1="26" x2="12" y2="34" strokeWidth="1.2" />
      <line x1="38" y1="26" x2="38" y2="34" strokeWidth="1" />
      <line x1="50" y1="24" x2="46" y2="34" strokeWidth="1.6" />

      {/* Tipping Bed */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 74 34; -18 74 34; 0 74 34" dur="6s" repeatCount="indefinite" />
        <polygon points="12,12 85,8 88,24 64,24 58,16 12,18" strokeWidth="1.4" strokeLinejoin="round" />
        <line x1="28" y1="17" x2="28" y2="24" strokeWidth="1" />
        <line x1="44" y1="16" x2="44" y2="24" strokeWidth="1" />
        <line x1="60" y1="16" x2="60" y2="24" strokeWidth="1" />
        <line x1="74" y1="12" x2="74" y2="24" strokeWidth="1" />
      </g>

      {/* Wheels */}
      <g transform-origin="28 38">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
        <circle cx="28" cy="38" r="10" strokeWidth="1.6" />
        <circle cx="28" cy="38" r="5" strokeWidth="1.2" strokeDasharray="3 2" />
        <circle cx="28" cy="38" r="2" fill="currentColor" />
      </g>
      <g transform-origin="70 38">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
        <circle cx="70" cy="38" r="10" strokeWidth="1.6" />
        <circle cx="70" cy="38" r="5" strokeWidth="1.2" strokeDasharray="3 2" />
        <circle cx="70" cy="38" r="2" fill="currentColor" />
      </g>
      <circle cx="82" cy="38" r="10" strokeWidth="1.4" strokeDasharray="4 2" />
      <line x1="6" y1="48" x2="94" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  lorry: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <path d="M14 38V22a2 2 0 0 1 2-2h12l4 6v12H14z" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M18 24h9l2 5h-11z" strokeWidth="1" />
      <rect x="14" y="31" width="5" height="3" strokeWidth="0.9" />
      <path d="M16 20c2-5 8-8 12-8h4v8" strokeWidth="1.2" />
      <rect x="34" y="14" width="66" height="24" rx="1.5" strokeWidth="1.4" />
      <line x1="44" y1="15" x2="44" y2="37" strokeWidth="0.8" opacity="0.6" />
      <line x1="54" y1="15" x2="54" y2="37" strokeWidth="0.8" opacity="0.6" />
      <line x1="64" y1="15" x2="64" y2="37" strokeWidth="0.8" opacity="0.6" />
      <line x1="74" y1="15" x2="74" y2="37" strokeWidth="0.8" opacity="0.6" />
      <line x1="84" y1="15" x2="84" y2="37" strokeWidth="0.8" opacity="0.6" />
      <line x1="94" y1="15" x2="94" y2="37" strokeWidth="0.8" opacity="0.6" />
      <rect x="42" y="38" width="14" height="5" rx="1" strokeWidth="1" />

      {/* Rotating Wheels */}
      {[22, 36, 78, 91].map((cx, i) => (
        <g key={i} transform-origin={`${cx} 42`}>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2.5s" repeatCount="indefinite" />
          <circle cx={cx} cy="42" r="6" strokeWidth="1.4" />
          <circle cx={cx} cy="42" r="3" strokeWidth="1" strokeDasharray="2 1" />
        </g>
      ))}
      <line x1="10" y1="48" x2="102" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  crane: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <rect x="18" y="32" width="64" height="8" rx="1" strokeWidth="1.4" />
      <path d="M18 32V24a2 2 0 0 1 2-2h8l3 10H18z" strokeWidth="1.4" />
      <path d="M21 25h6l1 4h-7z" strokeWidth="0.9" />
      <path d="M16 40h4M80 40h4" strokeWidth="1.4" />
      <line x1="18" y1="36" x2="16" y2="44" strokeWidth="1.2" />
      <line x1="82" y1="36" x2="84" y2="44" strokeWidth="1.2" />

      {/* Lifting Boom */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 42 24; 15 42 24; 0 42 24" dur="7s" repeatCount="indefinite" />
        <rect x="42" y="24" width="14" height="8" rx="1" strokeWidth="1.3" />
        <rect x="36" y="26" width="6" height="6" strokeWidth="1.2" fill="currentColor" fillOpacity="0.2" />
        <path d="M52 24L8 6" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M54 26L10 8" strokeWidth="1.2" opacity="0.7" />
        <line x1="44" y1="21" x2="48" y2="23" strokeWidth="0.9" />
        <line x1="36" y1="18" x2="40" y2="20" strokeWidth="0.9" />
        <line x1="28" y1="14" x2="32" y2="16" strokeWidth="0.9" />
        <line x1="20" y1="11" x2="24" y2="13" strokeWidth="0.9" />
        <circle cx="8" cy="6" r="2.5" strokeWidth="1.2" />
        {/* Hook */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 4; 0 0" dur="7s" repeatCount="indefinite" />
          <line x1="8" y1="8.5" x2="8" y2="26" strokeWidth="1" strokeDasharray="2 1" />
          <rect x="6" y="26" width="4" height="4" rx="0.5" strokeWidth="1" />
          <path d="M8 30c0 3 3 3 3 1" strokeWidth="1.2" />
        </g>
      </g>

      {[28, 42, 62, 74].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy="42" r="5.5" strokeWidth="1.3" />
          <circle cx={cx} cy="42" r="2.5" strokeWidth="0.9" />
        </g>
      ))}
      <line x1="4" y1="48" x2="96" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  excavator: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <path d="M42 42c0-3.5 3-4 5-4h38c2 0 5 .5 5 4s-3 4-5 4H47c-2 0-5-.5-5-4z" strokeWidth="1.4" />
      <circle cx="47" cy="42" r="3.2" strokeWidth="1.2" />
      <circle cx="85" cy="42" r="3.2" strokeWidth="1.2" />
      <circle cx="56" cy="43" r="1.5" strokeWidth="0.9" />
      <circle cx="66" cy="43" r="1.5" strokeWidth="0.9" />
      <circle cx="76" cy="43" r="1.5" strokeWidth="0.9" />
      <path d="M44 38l2-2M88 38l-2-2" strokeWidth="1" />
      <path d="M48 38v-8h38c3 0 5 2 5 5v3H48z" strokeWidth="1.3" />
      <rect x="80" y="27" width="10" height="7" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
      <path d="M54 30v-9h12v9H54z" strokeWidth="1.3" />
      <rect x="56" y="23" width="8" height="5" strokeWidth="0.9" />

      {/* Digging Arm */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 54 28; -10 54 28; 0 54 28" dur="4s" repeatCount="indefinite" />
        <path d="M54 28L32 10 18 20" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M56 30L34 12 20 22" strokeWidth="1.1" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="58" y1="30" x2="42" y2="18" strokeWidth="1.4" />

        {/* Bucket */}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 18 20; 30 18 20; 0 18 20" dur="4s" repeatCount="indefinite" />
          <path d="M18 20L10 35" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="12" x2="16" y2="24" strokeWidth="1.3" />
          <path d="M10 35c-4 2-8 7-4 10s9 0 9-4l-5-6z" strokeWidth="1.4" fill="currentColor" fillOpacity="0.2" />
          <path d="M6 45l-3 3M9 46l-2 3M12 45l-1 3" strokeWidth="1.2" />
        </g>
      </g>

      <line x1="2" y1="48" x2="98" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  bulldozer: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <rect x="24" y="38" width="56" height="10" rx="5" strokeWidth="1.4" />
      <circle cx="29" cy="43" r="3" strokeWidth="1" />
      <circle cx="41" cy="43" r="3" strokeWidth="1" />
      <circle cx="52" cy="43" r="3" strokeWidth="1" />
      <circle cx="63" cy="43" r="3" strokeWidth="1" />
      <circle cx="74" cy="43" r="3" strokeWidth="1" />
      <polygon points="34,38 34,26 58,26 58,38" strokeWidth="1.3" />
      <rect x="37" y="28" width="16" height="5" strokeWidth="0.9" opacity="0.6" />
      <polygon points="58,38 58,16 76,16 80,38" strokeWidth="1.4" />
      <rect x="61" y="19" width="12" height="10" rx="1" strokeWidth="1" />
      <line x1="42" y1="26" x2="42" y2="15" strokeWidth="1.4" />
      <path d="M42 15c0-2 2-2 2-2" strokeWidth="1" />

      {/* Moving Blade */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="3s" repeatCount="indefinite" />
        <path d="M12 28c2 7 2 14 0 19" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="12" y1="30" x2="16" y2="32" strokeWidth="1.2" />
        <line x1="12" y1="45" x2="16" y2="43" strokeWidth="1.2" />
        <line x1="16" y1="32" x2="16" y2="43" strokeWidth="1.2" />
        <line x1="16" y1="38" x2="34" y2="38" strokeWidth="1.8" />
        <line x1="20" y1="32" x2="36" y2="28" strokeWidth="1.2" />
      </g>

      <polygon points="80,36 92,40 90,47 80,42" strokeWidth="1.2" />

      {/* Moving Ground Line */}
      <line x1="6" y1="50" x2="102" y2="50" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5">
        <animate attributeName="stroke-dashoffset" values="0; -10" dur="2s" repeatCount="indefinite" />
      </line>
    </svg>
  ),
  pump: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <path d="M14 38V22a2 2 0 0 1 2-2h12l4 6v12H14z" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M18 24h9l2 5h-11z" strokeWidth="1" />
      <path d="M16 20c2-5 8-8 12-8h4v8" strokeWidth="1.2" />
      <rect x="34" y="28" width="66" height="10" rx="1.5" strokeWidth="1.4" />
      <rect x="36" y="20" width="20" height="8" strokeWidth="1.2" />

      {/* Unfolding Boom */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 46 20; 10 46 20; 0 46 20" dur="5s" repeatCount="indefinite" />
        <circle cx="46" cy="20" r="4" strokeWidth="1.4" />
        <polyline points="46,16 65,5 85,12 70,20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="48,17 63,8 82,14 73,20" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {[22, 36, 82, 95].map((cx, i) => (
        <g key={i} transform-origin={`${cx} 42`}>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
          <circle cx={cx} cy="42" r="6" strokeWidth="1.4" />
          <circle cx={cx} cy="42" r="3" strokeWidth="1" strokeDasharray="2 1" />
        </g>
      ))}
      <line x1="6" y1="48" x2="102" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  hydra: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <rect x="20" y="28" width="45" height="12" rx="2" strokeWidth="1.4" />
      <polygon points="20,28 35,28 35,15 20,20" strokeWidth="1.2" />

      {/* Moving Boom */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 45 28; 15 45 28; 0 45 28" dur="4s" repeatCount="indefinite" />
        <path d="M45 28 L90 12" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M55 24 L95 10" strokeWidth="1.5" strokeLinecap="round" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 3; 0 0" dur="4s" repeatCount="indefinite" />
          <line x1="90" y1="12" x2="90" y2="25" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M88 25 h4 v4 c0 2 -4 2 -4 0" strokeWidth="1.2" />
        </g>
      </g>

      {[30, 55].map((cx, i) => (
        <g key={i} transform-origin={`${cx} 43`}>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2.5s" repeatCount="indefinite" />
          <circle cx={cx} cy="43" r="6" strokeWidth="1.4" />
          <circle cx={cx} cy="43" r="2" strokeWidth="1" strokeDasharray="2 1" />
        </g>
      ))}
      <line x1="6" y1="50" x2="102" y2="50" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  crawler: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <rect x="20" y="36" width="45" height="12" rx="6" strokeWidth="1.4" />
      <circle cx="26" cy="42" r="4" strokeWidth="1" />
      <circle cx="36" cy="42" r="2" strokeWidth="1" />
      <circle cx="42" cy="42" r="2" strokeWidth="1" />
      <circle cx="48" cy="42" r="2" strokeWidth="1" />
      <circle cx="59" cy="42" r="4" strokeWidth="1" />

      <path d="M30 36 V24 c0-2 2-2 4-2 h20 v14 Z" strokeWidth="1.4" />
      <path d="M45 22 V14 h10 v8" strokeWidth="1.2" />

      {/* Lattice Boom Lifting */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 48 30; 5 48 30; 0 48 30" dur="6s" repeatCount="indefinite" />
        <line x1="48" y1="26" x2="92" y2="8" strokeWidth="1.2" />
        <line x1="45" y1="30" x2="89" y2="12" strokeWidth="1.2" />
        <path d="M53 25 l-5 4 m12 -7 l-5 4 m12 -7 l-5 4 m12 -7 l-5 4 m12 -7 l-5 4" strokeWidth="0.8" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 4; 0 0" dur="6s" repeatCount="indefinite" />
          <line x1="90" y1="10" x2="90" y2="32" strokeWidth="0.8" strokeDasharray="2 2" />
          <rect x="88" y="32" width="4" height="4" rx="1" strokeWidth="1.2" />
        </g>
      </g>

      {/* Moving Tracks Line */}
      <line x1="6" y1="50" x2="102" y2="50" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5">
        <animate attributeName="stroke-dashoffset" values="0; -10" dur="3s" repeatCount="indefinite" />
      </line>
    </svg>
  ),
  mixer: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <path d="M14 38V22a2 2 0 0 1 2-2h12l4 6v12H14z" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M18 24h9l2 5h-11z" strokeWidth="1" />
      <rect x="34" y="32" width="60" height="6" rx="1" strokeWidth="1.4" />

      {/* Rotating Drum Illusion */}
      <g>
        <ellipse cx="62" cy="20" rx="20" ry="12" transform="rotate(-15 62 20)" strokeWidth="1.4" />
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; -2 1; 0 0" dur="1s" repeatCount="indefinite" />
          <path d="M52 10 c4 6 14 8 18 2" strokeWidth="0.8" opacity="0.6" />
          <path d="M45 15 c4 6 14 8 18 2" strokeWidth="0.8" opacity="0.6" />
          <path d="M60 7 c4 6 14 8 18 2" strokeWidth="0.8" opacity="0.6" />
        </g>
      </g>

      <path d="M80 14 l12 -4 v14 l-12 4" strokeWidth="1.2" />
      <path d="M85 24 l5 6" strokeWidth="1.4" />

      {[22, 70, 85].map((cx, i) => (
        <g key={i} transform-origin={`${cx} 42`}>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
          <circle cx={cx} cy="42" r="6" strokeWidth="1.4" />
          <circle cx={cx} cy="42" r="3" strokeWidth="1" strokeDasharray="2 1" />
        </g>
      ))}
      <line x1="6" y1="48" x2="102" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  forklift: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <path d="M35 40 L30 30 C30 24 34 22 38 22 L55 22 L65 32 L65 40 Z" strokeWidth="1.4" />

      {[40, 60].map((cx, i) => (
        <g key={i} transform-origin={`${cx} 42`}>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.5s" repeatCount="indefinite" />
          <circle cx={cx} cy="42" r={i === 0 ? 5 : 4} strokeWidth="1.4" />
          <circle cx={cx} cy="42" r={i === 0 ? 2 : 1.5} strokeWidth="1" strokeDasharray="2 1" />
        </g>
      ))}

      <path d="M38 22 V10 H55 V22" strokeWidth="1.4" />
      <line x1="46" y1="10" x2="46" y2="22" strokeWidth="1" opacity="0.5" />
      <rect x="68" y="8" width="4" height="34" rx="1" strokeWidth="1.4" />

      {/* Lifting Forks */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -12; 0 0" dur="4s" repeatCount="indefinite" />
        <path d="M72 38 h16" strokeWidth="2" strokeLinecap="round" />
        <path d="M72 34 h16" strokeWidth="2" strokeLinecap="round" />
      </g>
      <line x1="6" y1="48" x2="102" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  boomlift: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <rect x="30" y="36" width="30" height="8" rx="2" strokeWidth="1.4" />

      {[36, 54].map((cx, i) => (
        <g key={i} transform-origin={`${cx} 44`}>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          <circle cx={cx} cy="44" r="4" strokeWidth="1.4" />
          <circle cx={cx} cy="44" r="1.5" strokeWidth="1" strokeDasharray="2 1" />
        </g>
      ))}

      <circle cx="45" cy="34" r="4" strokeWidth="1.4" />

      {/* Extending Boom */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 45 34; -15 45 34; 0 45 34" dur="5s" repeatCount="indefinite" />
        <polyline points="45,34 65,18 90,14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="48,35 66,21 88,17" strokeWidth="1" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />

        {/* Basket counter-rotate */}
        <g transform-origin="90 14">
          <animateTransform attributeName="transform" type="rotate" values="0; 15; 0" dur="5s" repeatCount="indefinite" />
          <rect x="88" y="8" width="12" height="8" rx="1" strokeWidth="1.2" />
          <line x1="88" y1="12" x2="100" y2="12" strokeWidth="1" opacity="0.7" />
          <path d="M94 8 v-3 c0-2 -2-2 -2-2" strokeWidth="1.2" />
        </g>
      </g>
      <line x1="6" y1="50" x2="102" y2="50" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  welder: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      {/* Vibrating Gen Set */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -0.5; 0 0" dur="0.1s" repeatCount="indefinite" />
        <rect x="25" y="38" width="50" height="4" rx="1" strokeWidth="1.4" />
        <line x1="25" y1="40" x2="15" y2="40" strokeWidth="1.4" />
        <circle cx="15" cy="40" r="1.5" fill="currentColor" />
        <line x1="18" y1="40" x2="18" y2="46" strokeWidth="1.2" />
        <circle cx="50" cy="43" r="5" strokeWidth="1.4" />
        <circle cx="50" cy="43" r="2" strokeWidth="1" />
        <rect x="30" y="15" width="40" height="23" rx="2" strokeWidth="1.4" />
        <rect x="34" y="19" width="10" height="10" rx="1" strokeWidth="1.2" />
        <line x1="50" y1="15" x2="50" y2="38" strokeWidth="1.2" />
        <line x1="58" y1="15" x2="58" y2="38" strokeWidth="1.2" />
        <path d="M35 15 v-4 h12 v4" strokeWidth="1.2" />
      </g>
      <line x1="6" y1="48" x2="102" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  tower: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <rect x="40" y="15" width="8" height="30" strokeWidth="1.4" />
      <path d="M40 20 h8 m-8 5 h8 m-8 5 h8 m-8 5 h8 m-8 5 h8" strokeWidth="0.8" />
      <path d="M40 15 l8 5 m-8 0 l8 5 m-8 0 l8 5 m-8 0 l8 5 m-8 0 l8 5 m-8 0 l8 5" strokeWidth="0.8" opacity="0.6" />
      <path d="M35 45 l18 0 l-4 -5 l-10 0 z" strokeWidth="1.4" />

      {/* Tower Top Rotating/Swinging slightly */}
      <g>
        <rect x="15" y="8" width="75" height="7" strokeWidth="1.2" />
        <path d="M15 8 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7 m4 -7 l4 7" strokeWidth="0.6" opacity="0.6" />
        <rect x="38" y="16" width="6" height="6" rx="1" strokeWidth="1.2" />
        <rect x="15" y="4" width="12" height="4" strokeWidth="1.2" />
        <line x1="18" y1="4" x2="18" y2="8" strokeWidth="1" />
        <line x1="24" y1="4" x2="24" y2="8" strokeWidth="1" />

        {/* Trolley Moving and Hook Lifting */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; -15 0; 0 0" dur="8s" repeatCount="indefinite" />
          <rect x="65" y="15" width="4" height="3" strokeWidth="1" />
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 6; 0 0" dur="4s" repeatCount="indefinite" />
            <line x1="67" y1="18" x2="67" y2="34" strokeWidth="0.8" strokeDasharray="2 2" />
            <path d="M65 34 h4 v4 c0 2 -4 2 -4 0" strokeWidth="1" />
          </g>
        </g>
      </g>
      <line x1="6" y1="48" x2="102" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  tele: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <rect x="25" y="32" width="40" height="12" rx="2" strokeWidth="1.4" />
      <polygon points="40,32 50,32 55,20 40,20" strokeWidth="1.2" />
      {[32, 58].map((cx, i) => (
        <g key={i} transform-origin={`${cx} 42`}>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
          <circle cx={cx} cy="42" r="6" strokeWidth="1.4" />
          <circle cx={cx} cy="42" r="2" strokeWidth="1" strokeDasharray="2 1" />
        </g>
      ))}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 35 25; -15 35 25; 0 35 25" dur="4s" repeatCount="indefinite" />
        <line x1="35" y1="25" x2="85" y2="15" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="25" x2="65" y2="19" strokeWidth="1.5" />
        <path d="M85 15 v10 h8 v-2 h-8" strokeWidth="1.2" />
      </g>
      <line x1="6" y1="48" x2="102" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  ),
  fuel: (
    <svg viewBox="0 0 110 55" className="top-sch-svg" fill="none" stroke="currentColor">
      <path d="M14 38V22a2 2 0 0 1 2-2h12l4 6v12H14z" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M18 24h9l2 5h-11z" strokeWidth="1" />
      <rect x="34" y="34" width="60" height="4" rx="1" strokeWidth="1.4" />
      <rect x="38" y="16" width="50" height="16" rx="8" strokeWidth="1.4" />
      <line x1="45" y1="16" x2="45" y2="32" strokeWidth="0.8" />
      <line x1="75" y1="16" x2="75" y2="32" strokeWidth="0.8" />
      <rect x="58" y="12" width="6" height="4" strokeWidth="1" />
      {[22, 70, 85].map((cx, i) => (
        <g key={i} transform-origin={`${cx} 42`}>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
          <circle cx={cx} cy="42" r="6" strokeWidth="1.4" />
          <circle cx={cx} cy="42" r="3" strokeWidth="1" strokeDasharray="2 1" />
        </g>
      ))}
      <line x1="6" y1="48" x2="102" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
    </svg>
  )
};

function HolographicFleetProjection({ f, ops, speed, onSelect, onClose, isClosing, zoneIdx }) {
  const [page, setPage] = useState(0);
  const [showAllFleet, setShowAllFleet] = useState(false);

  const maxPage = Math.ceil(FLEET_TYPES.length / 5);

  const [activeLayers, setActiveLayers] = useState({
    liveLocation: true,
    routeHistory: true,
    landmarks: true,
    nearbyAssets: true,
    geofence: true,
  });

  const toggleLayer = (key) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentPos = VEHICLE_MAP_POS[f.id] || {
    x: 375,
    y: 205,
    code: f.deviceId || "TRK-01",
    label: `${f.label} · ${f.unit}`,
    speed: speed || "18 km/h",
    fuel: f.fuel || "62%",
    zone: "Process Unit - A",
  };

  const getRoutePath = (pos) => {
    const isDefaultPos = pos.x === 375 && pos.y === 205;
    return isDefaultPos
      ? "M 375,205 L 430,205 C 435,205 440,210 440,215 L 440,265 C 440,270 445,275 450,275 L 490,275 C 495,275 500,280 500,285 L 500,305 C 500,310 505,315 510,315 L 580,315"
      : `M ${pos.x},${pos.y} L 430,${Math.min(pos.y, 205)} C 435,${Math.min(pos.y, 205)} 440,210 440,215 L 440,265 C 440,270 445,275 450,275 L 490,275 C 495,275 500,280 500,285 L 500,305 C 500,310 505,315 510,315 L 580,315`;
  };

  const secondaryTelemetryPath = "M 110,180 L 155,100 L 240,105 L 395,125 L 510,160 L 575,265 L 580,305";

  return (
    <div className={`fleet-holo-projection${isClosing ? " closing" : ""}`}>
      {/* 1. Origin focal beacon on the card edge */}
      <div className="holo-origin-beacon" aria-hidden="true">
        <span className="hob-glow" />
        <span className="hob-core" />
      </div>

      {/* 2. Volumetric Projection Rays SVG */}
      <svg className="holo-beam-svg" viewBox="0 0 160 480" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="refBeamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ff7a18" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#ff8533" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#ff9933" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffaa44" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="refWaveGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#ffaa44" stopOpacity="0.45" />
            <stop offset="80%" stopColor="#ff7a18" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ff5500" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="refRayGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="20%" stopColor="#ffaa44" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#ff7a18" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff6a00" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Volumetric triangular projection planes */}
        <polygon points="0,188 160,20 160,460" fill="url(#refBeamGrad)" className="holo-cone-ambient" />
        <polygon points="0,188 160,20 160,460" fill="url(#refWaveGrad)" className="holo-cone-sweep" />
        <polygon points="0,188 160,95 160,385" fill="url(#refBeamGrad)" opacity="0.4" />

        {/* Primary laser rays connecting to corners and edges */}
        <line x1="0" y1="188" x2="160" y2="20" stroke="url(#refRayGrad)" strokeWidth="1.8" className="holo-ray-stream" />
        <line x1="0" y1="188" x2="160" y2="130" stroke="url(#refRayGrad)" strokeWidth="1.2" />
        <line x1="0" y1="188" x2="160" y2="180" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1" strokeDasharray="5 7" />
        <line x1="0" y1="188" x2="160" y2="240" stroke="url(#refRayGrad)" strokeWidth="1.6" className="holo-ray-stream" />
        <line x1="0" y1="188" x2="160" y2="300" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1" strokeDasharray="5 7" />
        <line x1="0" y1="188" x2="160" y2="350" stroke="url(#refRayGrad)" strokeWidth="1.2" />
        <line x1="0" y1="188" x2="160" y2="460" stroke="url(#refRayGrad)" strokeWidth="1.8" className="holo-ray-stream" />
      </svg>

      {/* 3. 3D Floating Holographic Screen Wrapper with Top Blueprint Vehicles Shelf */}
      <div className="holo-screen-wrap" role="dialog" aria-label="Holographic Industrial Site Board">
        {/* Top Schematic Blueprint Vehicles Shelf */}
        <div className="holo-top-schematics-bar" aria-hidden="true">
          <button className="carousel-arrow left" onClick={() => setPage(p => p === 0 ? maxPage - 1 : p - 1)}>&#10094;</button>
          {FLEET_TYPES.slice(page * 5, (page + 1) * 5).map((v) => (
            <div
              key={v.id}
              className={`top-sch-item${f.id === v.id ? " active" : ""}`}
              onClick={() => onSelect(v.id)}
              style={{ cursor: "pointer" }}
              title={`Select ${v.label}`}
            >
              <span className="top-sch-label">{v.label}</span>
              {DETAILED_SCHEMATICS[v.id] ? DETAILED_SCHEMATICS[v.id] : (
                <svg viewBox="0 0 100 55" className="top-sch-svg" fill="none" stroke="currentColor">
                  <rect x="25" y="10" width="50" height="30" rx="3" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                  <g transform="translate(38, 13) scale(1)">
                    {MACHINE_ICONS[v.id] || v.icon}
                  </g>
                  <line x1="6" y1="48" x2="94" y2="48" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
                </svg>
              )}
            </div>
          ))}
          <button className="carousel-arrow right" onClick={() => setPage(p => (p + 1) % maxPage)}>&#10095;</button>

          <div className="top-sch-meta">
            <span className="tsm-title">HEAVY EQUIPMENT FLEET</span>
            <div className="tsm-sub">
              <span>LIVE · TRACK · MANAGE</span>
              <span className="tsm-bar" />
            </div>
          </div>
        </div>

        {/* Outer Atmospheric Orange Aura */}
        <div className="holo-screen-aura" aria-hidden="true">
          <span className="aura-halo aura-halo-wide" />
          <span className="aura-halo aura-halo-core" />
          <span className="aura-halo aura-halo-fringe" />
        </div>

        {/* The Main Projected Holographic Map Board */}
        <div className="holo-screen-card">
          {/* Real-world optical edge diffraction & glass bevel along all 4 edges */}
          <div className="holo-edge-diffraction" aria-hidden="true">
            <span className="hed-rim hed-top" />
            <span className="hed-rim hed-bottom" />
            <span className="hed-rim hed-left" />
            <span className="hed-rim hed-right" />
            <span className="hed-glare" />
          </div>

          {/* Reference-accurate Chamfered Corner Brackets */}
          <div className="holo-corner holo-corner-tl" aria-hidden="true">
            <svg viewBox="0 0 28 28" fill="none"><path d="M28 2H12L2 12V28" stroke="#ff8533" strokeWidth="2.4" /></svg>
          </div>
          <div className="holo-corner holo-corner-tr" aria-hidden="true">
            <svg viewBox="0 0 28 28" fill="none"><path d="M0 2H16L26 12V28" stroke="#ff8533" strokeWidth="2.4" /><path d="M22 6l4 4" stroke="#ff9d47" strokeWidth="2" /></svg>
          </div>
          <div className="holo-corner holo-corner-bl" aria-hidden="true">
            <svg viewBox="0 0 28 28" fill="none"><path d="M28 26H12L2 16V0" stroke="#ff8533" strokeWidth="2.4" /></svg>
          </div>
          <div className="holo-corner holo-corner-br" aria-hidden="true">
            <svg viewBox="0 0 28 28" fill="none"><path d="M0 26H16L26 16V0" stroke="#ff8533" strokeWidth="2.4" /><path d="M22 22l4-4" stroke="#ff9d47" strokeWidth="2" /></svg>
          </div>

          {/* Top-Left Board Header Bar with Vehicle Title, Live Pill & Compass */}
          <div className="holo-screen-header">
            <div className="hsh-left">
              <div className="hsh-title-row">
                <span className="hsh-title">{showAllFleet ? "ALL FLEET · 13 UNITS" : `${f.label} · ${f.unit}`}</span>
                <span className="hsh-live-pill"><i />Live</span>
              </div>
              <span className="hsh-subtitle">Live Location</span>
            </div>

            <div className="hsh-center">
              <span className="hsh-proj-tag">HOLO-PROJ // SYS-24 · BPCL KOCHI REFINERY</span>
            </div>

            <div className="hsh-right">
              {/* 4-Point Compass Rose */}
              <div className="hsh-compass" title="North Compass" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255, 120, 30, 0.35)" strokeWidth="0.9" />
                  <line x1="12" y1="2" x2="12" y2="22" stroke="rgba(255, 140, 50, 0.4)" strokeWidth="0.8" />
                  <line x1="2" y1="12" x2="22" y2="12" stroke="rgba(255, 140, 50, 0.4)" strokeWidth="0.8" />
                  <polygon points="12,3 14.5,12 12,10 9.5,12" fill="#ff7a18" />
                  <polygon points="12,21 14.5,12 12,14 9.5,12" fill="#64748b" />
                  <text x="12" y="9" textAnchor="middle" fill="#ffaa44" fontSize="5" fontWeight="900" fontFamily="monospace">N</text>
                </svg>
              </div>

              {/* Close Button */}
              <button
                type="button"
                className="holo-close-btn"
                onClick={onClose}
                aria-label="Close holographic map projection"
                title="Close projection (Esc)"
              >
                ×
              </button>
            </div>
          </div>

          {/* Main Body: Digital-Twin Satellite Map (Left) + 5-Item Tactical Layers Rail (Right) */}
          <div className="holo-screen-body">
            {/* Map Viewport Area */}
            <div className="holo-map-viewport">
              <svg className="holo-map-svg" viewBox="0 0 700 420" preserveAspectRatio="xMidYMid slice" role="img" aria-label="BPCL Kochi Refinery Live Digital Twin Site Map">
                <defs>
                  <filter id="roadGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feColorMatrix type="matrix" values="1 0 0 0 1   0 0.5 0 0 0.5   0 0 0 0 0.1   0 0 0 1 0" />
                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0   0 1 0 0 0   0 0 1 0 1   0 0 0 1 0" />
                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* 1. Base Map Image (User Provided Reference) */}
                <image href={mapBgImg} x="0" y="0" width="700" height="420" preserveAspectRatio="xMidYMid slice" />

                {/* 8. Layered Glowing Orange Active Route */}
                {/* Interactive Geofence Overlay */}
                {activeLayers.geofence && (
                  <g className="site-geofence">
                    {/* Geofence Boundary Path */}
                    <path
                      d="M 65,395 L 95,140 L 160,85 L 280,65 L 430,75 L 560,115 L 635,200 L 635,320 L 520,400 Z"
                      fill="rgba(255,133,51,0.03)"
                      stroke="#ff8533"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                    />
                    {/* Travelling Highlight Aura */}
                    <path
                      d="M 65,395 L 95,140 L 160,85 L 280,65 L 430,75 L 560,115 L 635,200 L 635,320 L 520,400 Z"
                      fill="none"
                      stroke="#ffaa44"
                      strokeWidth="3"
                      strokeLinecap="round"
                      filter="url(#roadGlow)"
                    >
                      <animate attributeName="stroke-dasharray" values="0,2000; 150,2000; 0,2000" dur="6s" repeatCount="indefinite" />
                      <animate attributeName="stroke-dashoffset" values="0; -2000" dur="6s" repeatCount="indefinite" />
                    </path>
                    {/* Node Pulses at Vertices */}
                    {[[65, 395], [95, 140], [160, 85], [280, 65], [430, 75], [560, 115], [635, 200], [635, 320], [520, 400]].map(([nx, ny], idx) => (
                      <g key={'gf-node-' + idx} transform={`translate(${nx}, ${ny})`}>
                        <circle cx="0" cy="0" r="2" fill="#ff8533" filter="url(#pulseGlow)" />
                        <circle cx="0" cy="0" r="6" fill="none" stroke="#ff8533" strokeWidth="0.8">
                          <animate attributeName="r" values="2; 10" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8; 0" dur="2s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    ))}
                  </g>
                )}

                {/* Interactive Site Landmarks Overlay */}
                {activeLayers.landmarks && (
                  <g className="site-landmarks">
                    {[
                      { x: 340, y: 190, label: "PROCESS UNIT - A", color: "#e2e8f0" },
                      { x: 450, y: 120, label: "TANK FARM - 1", color: "#e2e8f0" },
                      { x: 550, y: 150, label: "TANK FARM - 2", color: "#e2e8f0" },
                      { x: 500, y: 295, label: "STORAGE", color: "#e2e8f0" },
                      { x: 590, y: 290, label: "GATE HOUSE", color: "#ffaa44" },
                      { x: 230, y: 90, label: "NORTH YARD", color: "#e2e8f0" },
                      { x: 240, y: 240, label: "CONSTRUCTION ZONE", color: "#ffaa44" },
                      { x: 420, y: 250, label: "UTILITY AREA", color: "#e2e8f0" },
                      { x: 190, y: 200, label: "WORKSHOP", color: "#e2e8f0" },
                      { x: 470, y: 95, label: "RESTRICTED AREA", color: "#ef4444" }
                    ].map((lm, idx) => (
                      <g key={'lm-' + idx} transform={`translate(${lm.x}, ${lm.y})`}>
                        <rect x="-4" y="-7" width="4" height="1" fill={lm.color} />
                        <rect x="-4" y="-5" width="2" height="1" fill={lm.color} />
                        <text x="2" y="-3" fill={lm.color} fontSize="6.5" fontWeight="800" fontFamily="var(--font-mono, monospace)" letterSpacing="0.05em">
                          {lm.label}
                        </text>
                        <g opacity="0.8">
                          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" begin={`${idx * 0.3}s`} repeatCount="indefinite" />
                          <path d="M-3,-1 L-3,2 L4,2" fill="none" stroke={lm.color} strokeWidth="0.6" opacity="0.5" />
                        </g>
                      </g>
                    ))}
                  </g>
                )}

                {activeLayers.routeHistory && (
                  <g className="site-active-route">
                    {(showAllFleet ? Object.entries(VEHICLE_MAP_POS).map(([id, pos]) => ({ id, ...pos })) : [{ id: f.id, ...currentPos }]).map((pos, idx) => {
                      const isMain = !showAllFleet || pos.id === f.id;
                      const pathStr = getRoutePath(pos);
                      return (
                        <g key={'path-' + (pos.id || idx)}>
                          <path d={pathStr} fill="none" stroke={isMain ? "#ff8533" : "#00e5ff"} strokeWidth={isMain ? "3" : "1.5"} filter="url(#roadGlow)" opacity="0.8" />
                          <path d={pathStr} fill="none" stroke="#ffffff" strokeWidth={isMain ? "1.5" : "0.5"} strokeLinecap="round" strokeLinejoin="round" />
                          <path d={pathStr} fill="none" stroke={isMain ? "#ffaa44" : "#00e5ff"} strokeWidth={isMain ? "2.5" : "1.5"} strokeLinecap="round">
                            <animate attributeName="stroke-dasharray" values="0,1000; 100,1000; 0,1000" dur="4s" repeatCount="indefinite" />
                            <animate attributeName="stroke-dashoffset" values="0; -1000" dur="4s" repeatCount="indefinite" />
                          </path>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 9. Floating On-Map Telemetry Cards & HUDs */}
                <g className="site-telemetry-huds">
                  <g className="ref-hud-fuel-panel" transform="translate(180, 80)">
                    <rect x="0" y="0" width="85" height="32" rx="4" fill="rgba(8, 14, 24, 0.85)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
                    <text x="10" y="14" fill="#94a3b8" fontSize="7" fontWeight="600" fontFamily="var(--font-mono, monospace)" letterSpacing="0.05em">FUEL LEVEL</text>
                    <text x="60" y="14" fill="#38bdf8" fontSize="8" fontWeight="800" fontFamily="var(--font-mono, monospace)">{f.fuel || '62%'}</text>
                    <rect x="10" y="20" width="65" height="4" rx="2" fill="#1e293b" />
                    <rect x="10" y="20" width="40" height="4" rx="2" fill="#ff8533" filter="url(#pulseGlow)" />
                    <path d="M 85,16 L 105,16 L 110,65" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
                  </g>
                  <g className="ref-hud-device-panel" transform="translate(480, 25)">
                    <rect x="0" y="0" width="95" height="34" rx="4" fill="rgba(8, 14, 24, 0.85)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
                    <circle cx="14" cy="12" r="3" fill="#22c55e" filter="url(#pulseGlow)">
                      <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <text x="22" y="14" fill="#cbd5e1" fontSize="7" fontWeight="700" fontFamily="var(--font-mono, monospace)">CONNECTED</text>
                    <text x="10" y="26" fill="#94a3b8" fontSize="6.5" fontFamily="var(--font-mono, monospace)">4G LTE · 14ms ping</text>
                    <path d="M 0,17 L -40,17 L -60,110" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
                  </g>
                </g>

                {/* 10. Secondary Vehicles / Nearby Assets (Cyan System) */}
                {activeLayers.nearbyAssets && (
                  <g className="site-secondary-assets">
                    <path d={secondaryTelemetryPath} fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" filter="url(#cyanGlow)" />
                    <path d={secondaryTelemetryPath} fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
                    {[
                      { x: 110, y: 180, label: "DMP-04" },
                      { x: 155, y: 100, label: "Crane-01" },
                      { x: 240, y: 105, label: "EXC-03" },
                      { x: 395, y: 125, label: "CRN-07" },
                      { x: 510, y: 160, label: "BDZ-02" },
                      { x: 575, y: 265, label: "Lorry - U11" },
                      { x: 580, y: 305, label: "PUMP-01" }
                    ].map((v, i) => (
                      <g key={i} transform={`translate(${v.x}, ${v.y})`}>
                        <circle cx="0" cy="0" r="3" fill="#38bdf8" filter="url(#cyanGlow)" />
                        <circle cx="0" cy="0" r="7" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.8" />
                        <rect x="8" y="-14" width="45" height="12" rx="2" fill="rgba(8, 14, 24, 0.9)" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="0.5" />
                        <text x="12" y="-5" fill="#e0f2fe" fontSize="5.5" fontWeight="700" fontFamily="var(--font-mono, monospace)">{v.label}</text>
                      </g>
                    ))}
                  </g>
                )}

                {/* 11. Active Vehicle Main Focal Marker (Orange) */}
                {activeLayers.liveLocation && (
                  <g className="fleet-active-layer">
                    {(showAllFleet ? Object.entries(VEHICLE_MAP_POS).map(([id, pos]) => ({ id, ...pos })) : [{ id: f.id, ...currentPos }]).map((pos, idx) => {
                      const isMain = !showAllFleet || pos.id === f.id;
                      return (
                        <g key={pos.id || idx} className="site-active-vehicle" transform={`translate(${pos.x}, ${pos.y})`}>
                          <circle cx="0" cy="0" r="4" fill={isMain ? "#ff8533" : "#00e5ff"} filter="url(#pulseGlow)" />
                          <circle cx="0" cy="0" r="12" fill="none" stroke={isMain ? "#ffaa44" : "#00e5ff"} strokeWidth="1" opacity="0.8" />
                          <circle cx="0" cy="0" r="18" fill="none" stroke={isMain ? "#ff8533" : "#00e5ff"} strokeWidth="0.5" strokeDasharray="2 4" />
                          {isMain && (
                            <>
                              <line x1="-22" y1="0" x2="-8" y2="0" stroke="#ffaa44" strokeWidth="0.8" />
                              <line x1="8" y1="0" x2="22" y2="0" stroke="#ffaa44" strokeWidth="0.8" />
                              <line x1="0" y1="-22" x2="0" y2="-8" stroke="#ffaa44" strokeWidth="0.8" />
                              <line x1="0" y1="8" x2="0" y2="22" stroke="#ffaa44" strokeWidth="0.8" />
                              <path d="M 12,-12 L 25,-25 L 45,-25" fill="none" stroke="#ff8533" strokeWidth="1.2" opacity="0.8" />
                              <g className="ref-hud-route-card" transform="translate(45, -45)">
                                <rect x="0" y="0" width="85" height="40" rx="4" fill="rgba(12, 10, 8, 0.9)" stroke="#ff8533" strokeWidth="1.2" />
                                <text x="10" y="12" fill="#ffaa44" fontSize="7" fontWeight="800" fontFamily="var(--font-mono, monospace)" letterSpacing="0.05em">{pos.code}</text>
                                <text x="10" y="24" fill="#cbd5e1" fontSize="6.5" fontFamily="var(--font-mono, monospace)">Spd: {pos.speed}</text>
                                <text x="10" y="34" fill="#cbd5e1" fontSize="6.5" fontFamily="var(--font-mono, monospace)">Zone: {pos.zone}</text>
                                <circle cx="75" cy="10" r="2.5" fill="#ffaa44" filter="url(#pulseGlow)" />
                              </g>
                            </>
                          )}
                          {!isMain && (
                            <text x="14" y="3" fill="#00e5ff" fontSize="6" fontWeight="700" fontFamily="var(--font-mono, monospace)">{pos.code}</text>
                          )}
                          <g transform="translate(-10, -30)">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isMain ? "#ff8533" : "#00e5ff"} strokeWidth="1.6">
                              {(MACHINE_ICONS[pos.id] || MACHINE_ICONS.excavator).props.children}
                            </svg>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>
            </div>

            {/* Right-Side Tactical Layers Rail (Section 07 Specification) */}
            <div className="holo-layers-rail" role="region" aria-label="Tactical map layers">
              <div className="hlr-header">
                <span className="hlr-title">MAP LAYERS</span>
                <span className="hlr-active-count">
                  {Object.values(activeLayers).filter(Boolean).length}/5 ACTIVE
                </span>
              </div>

              {[
                {
                  key: "liveLocation",
                  title: "Live Location",
                  sub: "Real-time tracking",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                  ),
                },
                {
                  key: "routeHistory",
                  title: "Route History",
                  sub: "View movement",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" />
                      <path d="M8 19h4a4 4 0 0 0 4-4V9a4 4 0 0 1 4-4" />
                    </svg>
                  ),
                },
                {
                  key: "landmarks",
                  title: "Site Landmarks",
                  sub: "Key locations",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                    </svg>
                  ),
                },
                {
                  key: "nearbyAssets",
                  title: "Nearby Assets",
                  sub: "Other units",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  ),
                },
                {
                  key: "geofence",
                  title: "Geofence",
                  sub: "Site boundaries",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                },
              ].map((layer) => {
                const isActive = activeLayers[layer.key];
                return (
                  <button
                    type="button"
                    key={layer.key}
                    className={`holo-layer-item${isActive ? " active" : ""}`}
                    onClick={() => toggleLayer(layer.key)}
                    aria-pressed={isActive}
                    title={`Toggle ${layer.title}`}
                  >
                    <span className="hli-icon">{layer.icon}</span>
                    <div className="hli-text">
                      <strong className="hli-title">{layer.title}</strong>
                      <span className="hli-sub">{layer.sub}</span>
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                className={`holo-layer-item${showAllFleet ? " active" : ""}`}
                onClick={() => setShowAllFleet(!showAllFleet)}
                title="Toggle All Fleet View"
                style={{ marginTop: "16px", borderColor: showAllFleet ? "#ff8533" : "rgba(255,133,51,0.3)" }}
              >
                <span className="hli-icon" style={{ color: showAllFleet ? "#ff8533" : "" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" strokeDasharray="4 3" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </span>
                <div className="hli-text">
                  <strong className="hli-title" style={{ color: showAllFleet ? "#ff8533" : "" }}>All Fleet View</strong>
                  <span className="hli-sub">Show 13 live vehicles</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FLEET_CAPABILITIES = [
  {
    id: "live-monitoring",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 9 9" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 12l5 -3" />
      </svg>
    ),
    title: "Live fleet monitoring",
    desc: "Track connected vehicles and machinery in real time with current operating status and location.",
  },
  {
    id: "dual-tracking",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17h11M14 17h3v-4l-2.5-3h-4.5v7" />
        <circle cx="6.5" cy="17" r="1.8" /><circle cx="14.5" cy="17" r="1.8" />
        <circle cx="18.5" cy="6" r="2" /><path d="M16 11c0-1.4 1.1-2.5 2.5-2.5" />
      </svg>
    ),
    title: "Vehicle and manpower tracking",
    desc: "Monitor FMB120 vehicle devices and FMC920 manpower devices from one connected system.",
  },
  {
    id: "operational-status",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 3" />
        <path d="M16.5 7.5a6 6 0 0 0-9 0" />
      </svg>
    ),
    title: "Operational status visibility",
    desc: "View ignition, speed, fuel level, connectivity, and current operating condition.",
  },
  {
    id: "movement-intel",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="18" r="2" /><circle cx="19" cy="6" r="2" />
        <path d="M7 18h4a4 4 0 0 0 4-4V10a4 4 0 0 1 4-4" />
        <polyline points="15 8 19 6 17 10" />
      </svg>
    ),
    title: "Site movement intelligence",
    desc: "Understand asset movement across the project site, including current location and route activity.",
  },
  {
    id: "gps-connectivity",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
        <path d="M3 21h18" strokeDasharray="2 2" />
      </svg>
    ),
    title: "Live GPS and server connectivity",
    desc: "Display whether the device is online, connected, and transmitting reliable location data.",
  },
  {
    id: "central-control",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    ),
    title: "Centralized fleet control",
    desc: "Manage multiple asset categories from one unified fleet dashboard.",
  },
];

/* ------------------------------------------------------------------
   Hero live "device record" card — live IoT telemetry.
   Manual sensor switch between FMB120 (vehicle tracking with neon
   fleet schematics) and FMC920 (manpower + fleet).
------------------------------------------------------------------- */
function DeviceRecordCard({ mode, onModeChange }) {
  const [fleetId, setFleetId] = useState("dumper");
  const [zoneIdx, setZoneIdx] = useState(0);
  const [speedTick, setSpeedTick] = useState(0);
  const [routeOpen, setRouteOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [windowStart, setWindowStart] = useState(0);
  const windowStartRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setZoneIdx((i) => (i + 1) % SITE_ZONES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const [manualHold, setManualHold] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (manualHold) return;
      const ns = (windowStartRef.current + 4) % FLEET_TYPES.length;
      windowStartRef.current = ns;
      setWindowStart(ns);
      const window = Array.from({ length: 4 }, (_, i) => FLEET_TYPES[(ns + i) % FLEET_TYPES.length]);
      setFleetId(window[Math.floor(Math.random() * window.length)].id);
    }, 8000);
    return () => clearInterval(id);
  }, [manualHold]);

  useEffect(() => {
    const id = setInterval(() => setSpeedTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const f = FLEET_TYPES.find((x) => x.id === fleetId) || FLEET_TYPES[0];
  const ops = FLEET_OPS[f.id] || OPS_FALLBACK;
  const speed = f.id === "dumper" ? "18 km/h" : f.speed;

  const closeRoute = () => {
    setIsClosing(true);
    setTimeout(() => {
      setRouteOpen(false);
      setIsClosing(false);
    }, 320);
  };

  const selectVehicle = (id) => {
    setFleetId(id);
    setRouteOpen(true);
    setIsClosing(false);
    setManualHold(true);
  };

  const toggleRoute = () => {
    if (routeOpen && !isClosing) {
      closeRoute();
    } else {
      setRouteOpen(true);
      setIsClosing(false);
      setManualHold(true);
    }
  };

  // Close hologram on Escape key
  useEffect(() => {
    if (!routeOpen || isClosing) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeRoute();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [routeOpen, isClosing]);
  const handleModeChange = (m) => onModeChange(m);
  const rackTypes = Array.from({ length: 4 }, (_, i) => FLEET_TYPES[(windowStart + i) % FLEET_TYPES.length]);

  return (
    <>
      <div className="record-card">
        {/* Physical projection emitter node on right edge */}
        <div className={`fleet-emitter-node${routeOpen && !isClosing ? " active" : ""}`} aria-hidden="true">
          <span className="emitter-slit" />
          <span className="emitter-glow" />
          <span className="emitter-core" />
        </div>

        <div className="record-card-head">
          <div className="record-avatar">EV</div>
          <div className="record-id">
            <span className="record-name">{mode === "fmb120" ? "SITE FLEET BOARD" : MANPOWER_MODE.name}</span>
            <span className="record-meta">{mode === "fmb120" ? "13 units · rotating deck" : MANPOWER_MODE.meta}</span>
          </div>
          <span className="record-pill">Live</span>
        </div>

        <div className="record-switch" role="tablist" aria-label="Active sensor">
          {[
            { id: "fmb120", label: "FMB120 · VEHICLE" },
            { id: "fmc920", label: "FMC920 · MANPOWER" },
          ].map((t) => (
            <button
              type="button"
              role="tab"
              key={t.id}
              className={`record-switch-btn${mode === t.id ? " active" : ""}`}
              onClick={() => handleModeChange(t.id)}
              aria-selected={mode === t.id}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="record-stage" key={mode}>
          {mode === "fmb120" ? (
            <>
              {/* Neon fleet schematic rack */}
              <div className="fleet-rack-head">
                <span>FLEET BOARD</span>
                <button
                  type="button"
                  className={`fleet-map-toggle-btn${routeOpen && !isClosing ? " active" : ""}`}
                  onClick={toggleRoute}
                  aria-expanded={routeOpen && !isClosing}
                  title={routeOpen && !isClosing ? "Retract holographic projection" : "Project holographic map console"}
                >
                  <span className="fmt-dot" />
                  {routeOpen && !isClosing ? "HIDE MAP" : "VIEW MAP"}
                </button>
                <i className="rack-grid" aria-hidden="true" />
              </div>
              <div className="fleet-rack">
                {rackTypes.map((m, i) => (
                  <button
                    type="button"
                    key={m.id}
                    className={`fleet-cell${fleetId === m.id ? " active" : ""}`}
                    style={{ "--i": i }}
                    onClick={() => selectVehicle(m.id)}
                    aria-pressed={fleetId === m.id}
                  >
                    <span className="fleet-cell-ico">{m.icon}</span>
                    <span className="fleet-cell-label">{m.label}</span>
                    <span className="fleet-cell-ign">
                      <i className={`ign-dot ${m.ignitionCls}`} />
                      {m.ignition}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active machine detail */}
              <div className="fleet-detail">
                <div className="fleet-detail-top">
                  <span className="record-interested-kicker">{f.label} · {f.unit}</span>
                  <strong className="fleet-detail-name">
                    {f.label} <em>·</em> {f.unit}
                  </strong>
                  <small className="fleet-detail-id">Device {f.deviceId}</small>
                </div>
                <div className="fleet-stats">
                  <div className="fleet-stat">
                    <span>IGNITION</span>
                    <strong className={f.ignitionCls}>{f.ignition}</strong>
                  </div>
                  <div className="fleet-stat">
                    <span>SPEED</span>
                    <strong>{f.speed}</strong>
                  </div>
                  <div className="fleet-stat">
                    <span>FUEL</span>
                    <strong className={f.fuelCls}>{f.fuel}</strong>
                  </div>
                </div>
              </div>

              {/* Rotating current location */}
              <div
                className="fleet-location"
                key={zoneIdx}
                onClick={() => { setRouteOpen(true); setManualHold(true); }}
                title="Click to view live site route console"
                role="button"
                tabIndex={0}
              >
                <div className="fleet-location-pin" aria-hidden="true">
                  {ICONS.geolocate}
                </div>
                <div className="fleet-location-copy">
                  <span className="fleet-location-label">CURRENT LOCATION</span>
                  <strong className="fleet-location-name">{SITE_ZONES[zoneIdx]}</strong>
                  <div className="fleet-location-zones">
                    {SITE_ZONES.map((z, i) => (
                      <i key={z} className={i === zoneIdx ? "on" : ""} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <ManpowerBoard />
          )}
        </div>

        <div className="record-footer">
          <span>{mode === "fmb120" ? `FMB120 · ${f.label} ${f.unit}` : "FMC920 · Manpower + Fleet"}</span>
        </div>
      </div>

      {/* 3D Holographic Projection emitted from right edge */}
      {mode === "fmb120" && (routeOpen || isClosing) && (
        <HolographicFleetProjection
          f={f}
          ops={ops}
          speed={speed}
          onSelect={selectVehicle}
          onClose={closeRoute}
          isClosing={isClosing}
          zoneIdx={zoneIdx}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------
   Manpower board — full remodel of the FMC920 tab. Animated live
   site-map with drifting worker beacons, radar sweeps, dynamic
   telemetry reads and a live contact age.
------------------------------------------------------------------- */

function useTick() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function ManpowerBoard() {
  const tick = useTick();

  const online = 24 + ((tick * 3) % 6);
  const batt = (94 - (tick % 5)).toFixed(0);
  const activeGt = tick % GT_POINT_COUNT;
  const activeGtName = GT_POINTS[activeGt].label;
  const gtOnline = GT_POINT_COUNT - ((tick * 2) % 3);

  /* Sequential GT "network sweep" — a rolling pack of poles lights up
     and drops, so the whole set is never visible at once. */
  const sweepHead = activeGt;
  const litPoints = new Set([
    sweepHead,
    (sweepHead + 1) % GT_POINT_COUNT,
    (sweepHead + 2) % GT_POINT_COUNT,
  ]);

  /* A zone is in a violation window — the current alert stays on
     screen at all times and rotates zones every few seconds. */
  const violationOn = true;
  const violationZone = VIOLATION_ZONES[Math.floor(tick / 8) % VIOLATION_ZONES.length];
  const violationCount = 3 + ((tick * 2) % 5);
  const violationGt = (tick * 2) % GT_POINT_COUNT;

  const workersTotal = 1002 + ((tick * 5) % 40);
  const workersNear = 12 + ((tick * 3) % 9);

  const rows = [
    { label: "Workforce on site", value: `${workersTotal} WORKERS`, cls: workersTotal > 1028 ? "warn" : "ok" },
    { label: "Tags in range", value: `${online} TAGS`, cls: "ok" },
    { label: "GT points online", value: `${gtOnline} / ${GT_POINT_COUNT}`, cls: "ok" },
    { label: "Nearest GT", value: activeGtName, cls: "ok" },
    { label: "Zone status", value: violationOn ? "VIOLATION" : "SECURED", cls: violationOn ? "warn" : "ok" },
    { label: "Tag battery", value: `${batt}%`, cls: "" },
  ];

  return (
    <div className="mp-board">
      {/* device image + enhanced double scan */}
      <div className="mp-device">
        <span className="mp-device-img">
          <img src={MANPOWER_MODE.img} alt={`Teltonika ${MANPOWER_MODE.tag}`} />
          <i className="mp-scan-a" />
          <i className="mp-scan-b" />
        </span>
        <span className="mp-device-copy">
          <span className="record-interested-kicker">{MANPOWER_MODE.kicker}</span>
          <strong>{MANPOWER_MODE.device}</strong>
          <small>{MANPOWER_MODE.small}</small>
        </span>
      </div>

      {/* live site map — sequential GT sweep, workforce density, zone watch */}
      <div className="mp-map">
        <span className="mp-map-head">
          <span>LIVE SITE MAP</span>
          <i
            className={`mp-map-radar-label${violationOn ? " mp-map-radar-alert" : ""}`}
          >
            {violationOn
              ? `!! ZONE VIOLATION · ${violationZone} (${violationCount})`
              : `GT SWEEP · ${activeGtName}`}
          </i>
        </span>
        <div className="mp-map-canvas">
          <i className="mp-radar-sweep" aria-hidden="true" />
          <i className="mp-radar-ring mp-ring-1" aria-hidden="true" />
          <i className="mp-radar-ring mp-ring-2" aria-hidden="true" />
          <i className="mp-radar-ring mp-ring-3" aria-hidden="true" />
          <i className="mp-grid-h" aria-hidden="true" />
          <i className="mp-grid-v" aria-hidden="true" />

          {/* workforce density clusters — 1000+ workers */}
          {WORKFORCE_CLUSTERS.map((c) => (
            <span
              className={`mp-cluster${violationOn && violationZone === c.label ? " mp-cluster-violation" : ""}`}
              key={c.label}
              style={{
                left: `${c.left}%`,
                top: `${c.top}%`,
                "--pulse": `${c.pulse}s`,
              }}
            >
              <i className="mp-cluster-dot" />
              <em className="mp-cluster-num">{c.count}</em>
            </span>
          ))}

          {/* GT poles — silent except the swept pack in the scan window */}
          {GT_POINTS.map((gt) => {
            const lit = litPoints.has(gt.id - 1);
            return (
              <span
                className={`mp-gt${lit ? " mp-gt-lit" : ""}${gt.id - 1 === sweepHead ? " mp-gt-active" : ""}`}
                key={gt.id}
                style={{ left: `${gt.left}%`, top: `${gt.top}%`, "--tilt": `${gt.tilt}deg` }}
              >
                <GTIcon active={gt.id - 1 === sweepHead} />
                <em className="mp-gt-label">{gt.label}</em>
                <i className="mp-gt-beam" aria-hidden="true" />
                <i className="mp-gt-link" aria-hidden="true" />
              </span>
            );
          })}

          {/* worker beacons — compact, dim, drifting */}
          {WORKFORCE_DOTS.map((dot, i) => {
            const pulse = i % 2 === 0;
            return (
              <span
                className={`mp-worker mp-worker-${dot.color}`}
                key={i}
                style={{
                  left: `${dot.left}%`,
                  top: `${dot.top}%`,
                  "--dx": `${dot.dz.x}%`,
                  "--dy": `${dot.dz.y}%`,
                  "--drift": `${dot.d}s`,
                  "--pulse-delay": `${i * 0.28}s`,
                }}
              >
                {pulse && <i className="mp-ping" />}
                <i className="mp-worker-core" />
              </span>
            );
          })}
        </div>

        {/* violation banner */}
        {violationOn && (
          <div className="mp-violation" key={violationZone}>
            <span>ZONE VIOLATION</span>
            <strong>{violationZone} · {violationCount} UNREGISTERED TAGS</strong>
            <small>GT-{String(violationGt + 1).padStart(2, "0")} FLAGGED</small>
          </div>
        )}
      </div>

      <div className="mp-stats">
        <div className="mp-stat">
          <span>WORKFORCE ON SITE</span>
          <strong className="ok">{workersTotal}<small className="mp-stat-sub"> · {online} TAGS</small></strong>
        </div>
        <div className="mp-stat">
          <span>GT NETWORK</span>
          <strong className="ok">{gtOnline} / {GT_POINT_COUNT} LIVE</strong>
        </div>
        <div className="mp-stat">
          <span>NEARBY</span>
          <strong className="record-num">{workersNear} NEAR {activeGtName}</strong>
        </div>
      </div>

      <div className="record-alerts">
        <span className={`record-alerts-head${violationOn ? " record-alerts-head-alert" : ""}`}>
          {violationOn ? "ALERT · ZONE WATCH ACTIVE" : `TELEMETRY SIGNALS · ${MANPOWER_MODE.tag}`}
        </span>
        <div className="signal-meter" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} className={i < (tick + i) % 5 ? "on" : ""} style={{ "--sig": i }} />
          ))}
        </div>
        {rows.map((r) => (
          <div className="record-alert-row" key={r.label}>
            <span>{r.label}</span>
            <strong className={r.cls}>{r.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Hero copy — live HUD. Premium animated headline + believable
   live metrics ticker so the hero reads as a real operational feed.
------------------------------------------------------------------- */

const HERO_DESC_TEXT = "VERTEX connects vehicles, heavy machinery, workforce and site infrastructure through IoT-driven automation — so industrial operations become visible, organized and measurable. Built in the field, ready for your site.";
const HERO_DESC_GLOW = ["visible,", "organized", "measurable.", "IoT-driven"];

function HeroTyped({ text, glowWords, start = 1200, speed = 24 }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let timer = null;
    let interval = null;

    timer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, start);

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [text, start, speed]);

  const words = text.slice(0, count).split(" ");

  return (
    <span className="hero-typed">
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className={glowWords && glowWords.includes(w) ? "typed-glow" : undefined}>
          {w}{i < words.length - 1 ? " " : ""}
        </span>
      ))}
      <i className={`typed-caret${done ? " done" : ""}`} aria-hidden="true" />
    </span>
  );
}

/* ------------------------------------------------------------------
   GLOBAL ARCHITECTURAL INDUSTRIAL BACKDROP
   Rendered at app root level via imported ArchitecturalIndustrialBackdrop
------------------------------------------------------------------- */

/* ------------------------------------------------------------------
   CODE DRIZZLE — drifting coding symbols rising through a section head
------------------------------------------------------------------ */
const CODE_DRIZZLE = ["</>", "{ }", "&&", "//", "[ ]", "01", "::", "if()", "#", "_", "=>"];
const DRIZZLE_COLORS = ["var(--neon-orange)", "var(--neon-sky)", "var(--neon-blue)"];

function CodeDrizzle() {
  return null;
}

/* ------------------------------------------------------------------
   LOGIC STRIP — full-width scrolling marquee of code / IoT symbols
------------------------------------------------------------------ */
const LOGIC_CHIPS = ["</>", "{ }", "&&", "//", "[ ]", "01", "::", "if()", "#", "=>", "<IoT/>", "0110", "µ", "◉l"];

function LogicStrip() {
  const two = [...LOGIC_CHIPS, ...LOGIC_CHIPS];
  return (
    <div className="logic-strip" aria-hidden="true">
      <div className="logic-track">
        {two.map((c, i) => (
          <span key={i} className={`logic-chip c-${i % 3}`}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function HeroLiveMetrics() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const uplink = (99.4 + Math.sin(tick / 3.1) * 0.4).toFixed(2);
  const pkt = 12840 + tick * 13 + (tick % 9);
  const lat = 12 + (tick % 5);
  const fix = `9.9816${(tick * 7) % 10}° N · 76.299${(tick * 3) % 10}° E`;

  return (
    <div className="hero-ticker" aria-hidden="true">
      <span className="ht-cell"><i className="ht-blink" />UPLINK<em>{uplink}%</em></span>
      <span className="ht-cell"><i className="ht-blink ht-blink-lag" />PKT/S<em>{pkt.toLocaleString()}</em></span>
      <span className="ht-cell"><i className="ht-blink" />LATENCY<em>{lat} ms</em></span>
      <span className="ht-cell ht-cell-fix"><i className="ht-blink ht-blink-lag" />FIX<em>{fix}</em></span>
    </div>
  );
}

/* ------------------------------------------------------------------
   Animated status chips — staged boot/live cycle with believable
   telemetry readouts. Deterministic timeline (no random jumps).
   Vehicle chip: GPS blink → handshake → signal strength → active.
   Worker chip:  beacon scan → locate → tower online → sync complete.
------------------------------------------------------------------- */

/* ------------------------------------------------------------------
   Animated stat counter — counts up when scrolled into view
------------------------------------------------------------------- */
function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const sigLevel = (t) => clamp(2 + Math.round(1.6 * Math.sin(t / 2.4)), 1, 4);

function makeLivestats(base, fade, msjitter, kmh, pkg) {
  return {
    strong: base,
    small: (t) => {
      const pack = (pkg || 1451) + t * 7 + Math.round(t / 2);
      const ms = (msjitter || 13) + (t % 5);
      const speed = (kmh || [18, 22, 26, 14])[t % 4];
      return `pkg ${pack} · ${ms} ms · ${speed} km/h`;
    },
  };
}

const VEHICLE_CHIP = [
  { icon: "gps", stage: "init", strong: "Vehicle tracking", small: "Initializing uplink…", dur: 2500 },
  { icon: "gps", stage: "link", strong: "Handshaking", small: "Authenticating TRK-2291", dur: 2700 },
  {
    icon: "sig",
    stage: "signal",
    strong: "Server connected",
    level: sigLevel,
    small: (t) => `RSSI ${-(64 + Math.round(3 * Math.sin(t / 2.6)))} dBm · ${14 + (t % 5)} ms`,
    dur: 5400,
  },
  {
    icon: "gps",
    stage: "active",
    strong: "Vehicle tracking active",
    ...makeLivestats("Vehicle tracking active"),
    dur: 6400,
  },
];

const WORKER_CHIP = [
  { icon: "scan", stage: "init", strong: "Syncing GPS point", small: "Scanning beacons…", dur: 2800 },
  { icon: "scan", stage: "locate", strong: "Locating beacons", small: (t) => `${8 + (t % 6)} targets in radius`, dur: 3200 },
  { icon: "tower", stage: "signal", strong: "GPS point online", small: (t) => `${228 + (t % 38)} m from gate`, dur: 4600 },
  { icon: "tower", stage: "complete", strong: "Data sync complete", small: (t) => `${311 + t * 3} records synced`, dur: 5600 },
];

const CHIP_HOLD = 20000;

function StatusChip({ cycles, tint }) {
  const [step, setStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setStep((s) => (s + 1) % cycles.length), CHIP_HOLD);
    return () => clearTimeout(id);
  }, [step, cycles]);

  const c = cycles[step];
  const strong = typeof c.strong === "function" ? c.strong(tick) : c.strong;
  const small = typeof c.small === "function" ? c.small(tick) : c.small;
  const level = typeof c.level === "function" ? c.level(tick) : null;

  return (
    <div className={`hero-float chip-${tint} chip-stage-${c.stage}`}>
      <span className="hf-ico chip-ico">
        {c.icon === "gps" && (
          <span className="ico-wrap" key={`ico-${step}`}><i className="ico-dot" />{ICONS.geolocate}</span>
        )}
        {c.icon === "sig" && (
          <span className="sig-bars" key={`sig-${step}`} data-level={level}>
            <i /><i /><i /><i />
          </span>
        )}
        {c.icon === "scan" && (
          <span className="scan-wrap" key={`scan-${step}`}>{ICONS.workforce}<i className="scan-beam" /></span>
        )}
        {c.icon === "tower" && (
          <span className="tower-wrap" key={`tower-${step}`}>{ICONS.tower}</span>
        )}
      </span>
      <span className="chip-copy" key={`copy-${step}`}>
        <strong>{strong}</strong>
        <small>{small}</small>
      </span>
      <i className="chip-progress" style={{ "--chipdur": `${CHIP_HOLD}ms` }} key={`p-${step}`} aria-hidden="true" />
    </div>
  );
}

/* ------------------------------------------------------------------
   Reconcile connector logic moved to ProblemReconcileBoard below
------------------------------------------------------------------- */

/* ------------------------------------------------------------------
   "Find your seat" — persona tabs (pain / fix / outcome)
------------------------------------------------------------------- */
const PERSONAS = [
  {
    id: "operations",
    label: "Operations",
    pain: "Someone on your team spends hours every week reconciling site activity, manually matching vehicles to zones and correcting worker logs by hand.",
    fixes: ["AUTOMATED ZONE MAPPING", "DEDUPLICATION", "CONTINUOUS CADENCE"],
    outcome:
      "Reclaim the hours lost to manual cleanup. Site activity stays organized by itself and every report reconciles.",
  },
  {
    id: "fleet",
    label: "Fleet / Logistics",
    pain: "Tracking gaps. Vehicles disappear between zones, journeys are reconstructed from memory, and utilization is a guess.",
    fixes: ["GPS TRACKING", "MOVEMENT HISTORY", "UTILIZATION DATA"],
    outcome:
      "Every vehicle and machine shows up, with a complete movement history you can trust for dispatch, billing and utilization.",
  },
  {
    id: "safety",
    label: "Safety / Compliance",
    pain: "You can't always confirm which workers were in a zone at a given moment, or show it clearly when asked.",
    fixes: ["WORKER ZONE DETECTION", "GATEWAY LOGS", "SITE MAPS"],
    outcome:
      "A clear, verifiable record of workforce presence at monitored points — ready when regulators or reports ask for it.",
  },
  {
    id: "leadership",
    label: "Executive / GM",
    pain: "You're making operational decisions off data that never fully lines up across vehicles, workforce and site.",
    fixes: ["FULL DATA ENRICHMENT", "CONTINUOUS CADENCE", "OPERATIONAL DASHBOARDS"],
    outcome:
      "One trusted source of truth for site operations, under every dashboard and every decision you plan.",
  },
];

/* ------------------------------------------------------------------
   "The Real Problem" — four systems, one clean device record
------------------------------------------------------------------- */
const MESSY_SOURCES = [
  { system: "GPS TRACKER", note: "signal delay", line: "VH-2291 · 10.03, 76.31" },
  { system: "MANUAL LOGBOOK", note: "handwritten", line: "Excavator #7 — Driver R." },
  { system: "BEACON GATE SCAN", note: "duplicate x2", line: "TAG-88231 @ Gate B" },
  { system: "LEGACY ERP", note: "outdated", line: "Asset EXC-04 · Zone 3" },
];

const CLEAN_RECORD = [
  { label: "UNIT", value: "VH-2291 · Excavator", status: "verified" },
  { label: "ZONE", value: "North Refinery · Zone 3", status: "verified" },
  { label: "STATUS", value: "Active · On Route", status: "live" },
  { label: "LAST SYNCED", value: "2 seconds ago", status: "synced" },
];

function ProblemReconcileBoard() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const centerRef = useRef(null);
  const rightCardRef = useRef(null);
  const [paths, setPaths] = useState(null);

  const updatePaths = useCallback(() => {
    if (!containerRef.current || !centerRef.current || !rightCardRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerRect = centerRef.current.getBoundingClientRect();
    const rightRect = rightCardRef.current.getBoundingClientRect();

    if (containerRect.width === 0 || containerRect.height === 0) return;

    // Diamond stack within 160x120 SVG:
    // Left tip is at x = 26 (out of 160)
    // Right tip is at x = 134 (out of 160)
    // Center Y of top plate is at y = 42 (out of 120)
    const scaleX = centerRect.width / 160;
    const scaleY = centerRect.height / 120;
    const diamondLeftX = centerRect.left - containerRect.left + 26 * scaleX;
    const diamondCenterY = centerRect.top - containerRect.top + 42 * scaleY;
    const diamondRightX = centerRect.left - containerRect.left + 134 * scaleX;

    const inLines = [];
    cardRefs.current.forEach((cardEl, idx) => {
      if (!cardEl) return;
      const cardRect = cardEl.getBoundingClientRect();
      const startX = cardRect.right - containerRect.left;
      const startY = cardRect.top + cardRect.height / 2 - containerRect.top;

      const dx = diamondLeftX - startX;
      const cp1X = startX + dx * 0.52;
      const cp1Y = startY;
      const cp2X = diamondLeftX - dx * 0.24;
      const cp2Y = diamondCenterY;

      const d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${diamondLeftX.toFixed(1)} ${diamondCenterY.toFixed(1)}`;
      inLines.push({
        id: `rp-in-path-${idx}`,
        startX,
        startY,
        d,
        delay: idx * 0.35,
      });
    });

    const rightStartX = rightRect.left - containerRect.left;
    const rightCenterY = diamondCenterY;
    const outDx = rightStartX - diamondRightX;
    const outD = `M ${diamondRightX.toFixed(1)} ${diamondCenterY.toFixed(1)} C ${(diamondRightX + outDx * 0.4).toFixed(1)} ${diamondCenterY.toFixed(1)}, ${(rightStartX - outDx * 0.28).toFixed(1)} ${rightCenterY.toFixed(1)}, ${rightStartX.toFixed(1)} ${rightCenterY.toFixed(1)}`;

    setPaths({
      width: containerRect.width,
      height: containerRect.height,
      diamondLeftX,
      diamondCenterY,
      diamondRightX,
      inLines,
      outLine: {
        id: "rp-out-path-0",
        startX: diamondRightX,
        startY: diamondCenterY,
        endX: rightStartX,
        endY: rightCenterY,
        d: outD,
      }
    });
  }, []);

  useLayoutEffect(() => {
    updatePaths();
    const ro = new ResizeObserver(() => {
      updatePaths();
    });
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updatePaths);
    const timer = setTimeout(updatePaths, 100);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updatePaths);
      clearTimeout(timer);
    };
  }, [updatePaths]);

  return (
    <div className="problem-board-new reveal" ref={containerRef}>
      {/* Dynamic SVG Connecting Wire Pipeline */}
      <svg
        className="problem-board-svg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
          overflow: "visible",
          opacity: paths ? 1 : 0,
          transition: "opacity 0.2s ease"
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id="rpWireGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 4 Incoming signals from left cards to diamond stack */}
        {paths && paths.inLines.map((p) => (
          <g key={p.id}>
            {/* Ambient Trace */}
            <path
              d={p.d}
              fill="none"
              stroke="rgba(255, 122, 26, 0.16)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Core Circuit Line */}
            <path
              id={p.id}
              d={p.d}
              fill="none"
              stroke="rgba(255, 140, 50, 0.72)"
              strokeWidth="1.6"
              strokeLinecap="round"
              filter="url(#rpWireGlow)"
            />
            {/* Anchor Dot on Card Right Edge */}
            <circle
              cx={p.startX}
              cy={p.startY}
              r="3.8"
              fill="#ff7a1a"
              stroke="#0d0e12"
              strokeWidth="1.5"
            />
            <circle
              cx={p.startX}
              cy={p.startY}
              r="7"
              fill="none"
              stroke="rgba(255, 122, 26, 0.45)"
              strokeWidth="1"
            />
            {/* Animated Traveling Pulse */}
            <circle r="3" fill="#ffffff" filter="url(#rpWireGlow)">
              <animateMotion
                dur="2.3s"
                repeatCount="indefinite"
                begin={`-${p.delay}s`}
                calcMode="linear"
                keyPoints="0;1"
                keyTimes="0;1"
              >
                <mpath href={`#${p.id}`} />
              </animateMotion>
            </circle>
          </g>
        ))}

        {/* Outgoing signal from diamond stack to right card */}
        {paths && paths.outLine && (
          <g key={paths.outLine.id}>
            {/* Ambient Trace */}
            <path
              d={paths.outLine.d}
              fill="none"
              stroke="rgba(34, 197, 94, 0.18)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Core Circuit Line */}
            <path
              id={paths.outLine.id}
              d={paths.outLine.d}
              fill="none"
              stroke="rgba(74, 222, 128, 0.75)"
              strokeWidth="1.6"
              strokeLinecap="round"
              filter="url(#rpWireGlow)"
            />
            {/* Mid-point Node Dot */}
            <circle
              cx={(paths.outLine.startX + paths.outLine.endX) / 2}
              cy={(paths.outLine.startY + paths.outLine.endY) / 2}
              r="3"
              fill="#ff7a1a"
              filter="url(#rpWireGlow)"
            />
            {/* Anchor Dot on Right Card Left Edge */}
            <circle
              cx={paths.outLine.endX}
              cy={paths.outLine.endY}
              r="3.8"
              fill="#22c55e"
              stroke="#0d0e12"
              strokeWidth="1.5"
            />
            <circle
              cx={paths.outLine.endX}
              cy={paths.outLine.endY}
              r="7"
              fill="none"
              stroke="rgba(34, 197, 94, 0.45)"
              strokeWidth="1"
            />
            {/* Animated Traveling Pulse */}
            <circle r="3" fill="#ffffff" filter="url(#rpWireGlow)">
              <animateMotion
                dur="2.3s"
                repeatCount="indefinite"
                begin="-0.7s"
                calcMode="linear"
                keyPoints="0;1"
                keyTimes="0;1"
              >
                <mpath href={`#${paths.outLine.id}`} />
              </animateMotion>
            </circle>
          </g>
        )}
      </svg>

      {/* Left Column: Messy Systems */}
      <div className="problem-col-left">
        <p className="box-title-orange">
          <span className="title-dot">●</span> TODAY, IN YOUR SYSTEMS
        </p>
        <div className="problem-stack">
          {MESSY_SOURCES.map((s, idx) => (
            <div
              className="problem-card-small"
              key={s.system}
              ref={(el) => (cardRefs.current[idx] = el)}
            >
              <div className="card-top">
                <span className="box-row-tag">{s.system}</span>
                <span className="box-row-note">{s.note}</span>
              </div>
              <div className="card-bottom">
                <span className="box-row-line">{s.line}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Column: 3D Stack & Tree Labels */}
      <div className="reconcile-center-col">
        <div className="diamond-stack-wrapper" ref={centerRef}>
          <div className="diamond-ambient-glow" />
          <svg className="diamond-stack-svg" viewBox="0 0 160 120" width="160" height="120">
            <defs>
              <radialGradient id="stackGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#ff5500" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ff5500" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="plateTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff9a3c" />
                <stop offset="50%" stopColor="#ff7014" />
                <stop offset="100%" stopColor="#d94800" />
              </linearGradient>
              <linearGradient id="plateBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffc078" />
                <stop offset="100%" stopColor="#ff5500" />
              </linearGradient>
              <filter id="topPlateGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#ff6a00" floodOpacity="0.55" />
              </filter>
            </defs>

            {/* Layer 4 (Bottom plate) */}
            <g transform="translate(80, 78) scale(1, 0.52) rotate(45)">
              <rect x="-38" y="-38" width="76" height="76" rx="14" fill="#2d0d02" stroke="#661f00" strokeWidth="1.5" />
            </g>

            {/* Layer 3 */}
            <g transform="translate(80, 66) scale(1, 0.52) rotate(45)">
              <rect x="-38" y="-38" width="76" height="76" rx="14" fill="#4d1600" stroke="#992d00" strokeWidth="1.5" />
            </g>

            {/* Layer 2 */}
            <g transform="translate(80, 54) scale(1, 0.52) rotate(45)">
              <rect x="-38" y="-38" width="76" height="76" rx="14" fill="#7d2400" stroke="#cc3e00" strokeWidth="1.5" />
            </g>

            {/* Layer 1 (Top Hero Plate) */}
            <g transform="translate(80, 42) scale(1, 0.52) rotate(45)" filter="url(#topPlateGlow)">
              <rect x="-38" y="-38" width="76" height="76" rx="14" fill="url(#plateTopGrad)" stroke="url(#plateBorderGrad)" strokeWidth="2" />
              <rect x="-34" y="-34" width="68" height="68" rx="11" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />

              {/* Chevron Arrow pointing up-right */}
              <g transform="rotate(-45) translate(0, 2)">
                <path d="M -14,6 L 0,-8 L 14,6 L 14,-1 L 0,-15 L -14,-1 Z" fill="#ffffff" filter="drop-shadow(0 0 4px rgba(255,255,255,0.85))" />
                <path d="M -14,19 L 0,5 L 14,19 L 14,12 L 0,-2 L -14,12 Z" fill="#ffffff" opacity="0.65" />
              </g>
            </g>

            {/* Left and Right Connection Dots on Diamond Tips */}
            <circle cx="26" cy="42" r="3.2" fill="#ff9a3c" filter="drop-shadow(0 0 5px #ff7a1a)" />
            <circle cx="134" cy="42" r="3.2" fill="#ff9a3c" filter="drop-shadow(0 0 5px #ff7a1a)" />
          </svg>
        </div>

        {/* Tree Labels */}
        <div className="reconcile-tree-labels">
          <div className="tree-stem" />
          <div className="tree-items">
            <div className="tree-item"><span className="tree-branch" />RECONCILED</div>
            <div className="tree-item"><span className="tree-branch" />DEDUPLICATED</div>
            <div className="tree-item"><span className="tree-branch" />VERIFIED &amp; APPENDED</div>
            <div className="tree-item"><span className="tree-branch" />STANDARDIZED</div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Record */}
      <div className="problem-col-right">
        <p className="box-title-orange">WHAT YOU GET BACK</p>
        <div className="problem-box-large" ref={rightCardRef}>
          <span className="box-clean-head">ONE RECORD YOU CAN TRUST</span>
          <div className="box-list">
            {CLEAN_RECORD.map((r) => (
              <div className="box-row" key={r.label}>
                <span className="box-row-line">{r.value}</span>
                <span className="box-row-status">{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Technical services (analog of the reference service grid)
------------------------------------------------------------------- */
const SERVICES = [
  { icon: "geolocate", title: "GPS & Vehicle Tracking", desc: "Continuous location and movement history for every vehicle and machine on site." },
  { icon: "workforce", title: "Workforce Zone Mapping", desc: "Digital site maps with gateways that detect workers as they move through zones." },
  { icon: "signal", title: "Worker Identification", desc: "Individual beacon assignment so each detected presence maps to a real person." },
  { icon: "monitor", title: "Operational Monitoring", desc: "Live visibility across vehicles, workforce and site infrastructure in one view." },
  { icon: "dedupe", title: "Data Deduplication", desc: "One person, one vehicle, one record — merged and cleaned from overlapping signals." },
  { icon: "bolt", title: "IoT Hardware Deployment", desc: "Field-ready Teltonika devices installed and configured for any industrial site." },
  { icon: "automation", title: "Automation & Integration", desc: "Connect live field data into your reporting tools, ERP and dashboards." },
  { icon: "fleet", title: "Fleet & Asset Management", desc: "Utilization, status and movement across fleets of vehicles and heavy machinery." },
];

/* ------------------------------------------------------------------
   "The Deployment Moment" — 3-step process
------------------------------------------------------------------- */
const STEPS = [
  {
    title: "Map the site",
    desc: "Your industrial site is digitally mapped and divided into monitoring zones and gateway points. Nothing about your workflow changes.",
  },
  {
    title: "Deploy in the field",
    desc: "Devices are installed in vehicles and machinery, and gateways are positioned at designated points. Workers receive their assigned beacons.",
  },
  {
    title: "Monitor live",
    desc: "Day one on the platform starts clean: vehicles, workforce and site activity in connected, organized operational data.",
  },
];

/* ------------------------------------------------------------------
   Hardware devices
------------------------------------------------------------------- */
const HARDWARE = [
  {
    img: "/images/hardware/fmb120.png",
    name: "Teltonika FMB120",
    desc: "Vehicle and heavy machinery tracking device installed directly into the machine electrical system.",
    tags: ["Vehicle Tracking", "Ignition Status", "Movement History"],
  },
  {
    img: "/images/hardware/fmc920.png",
    name: "Teltonika FMC920",
    desc: "Site-based IoT gateway units positioned at designated points to detect workforce movement across mapped zones.",
    tags: ["Gateway Point", "Zone Detection", "Solar Powered"],
  },
  {
    img: "/images/hardware/eye-beacon.png",
    name: "Teltonika Eye Beacon",
    desc: "Individual beacons assigned to workers and registered with worker information for identification in zones.",
    tags: ["Worker ID", "Beacon Detection", "Location"],
  },
];

function App() {
  const [activeView, setActiveView] = useState(null);
  const [persona, setPersona] = useState("operations");
  const [cardMode, setCardMode] = useState("fmb120");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [bootState, setBootState] = useState("iot-intro");

  const brandRef = useRef(null);

  const handleIntroComplete = useCallback(() => {
    setBootState("complete");
  }, []);

  /* streamlined brand signature state machine */
  useEffect(() => {
    if (bootState === "iot-intro") {
      // Safety guard: guarantee transition within 1.8s max even if tab is unfocused
      const fallbackTimer = setTimeout(() => {
        setBootState("complete");
      }, 1800);
      return () => clearTimeout(fallbackTimer);
    }
  }, [bootState]);

  /* calculate perfect screen center for seamless glide */
  useEffect(() => {
    const calculateBootPosition = () => {
      if (!brandRef.current) return;
      const el = brandRef.current;

      // Temporarily clear transform to measure natural resting position in navbar
      const prevTransform = el.style.transform;
      const prevTransition = el.style.transition;
      el.style.transition = 'none';
      el.style.transform = 'none';

      const rect = el.getBoundingClientRect();
      const centerX = window.innerWidth / 2 - rect.left - rect.width / 2;
      const centerY = window.innerHeight / 2 - rect.top - rect.height / 2;

      el.style.transform = prevTransform;
      el.style.transition = prevTransition;

      el.style.setProperty('--boot-x', `${centerX}px`);
      el.style.setProperty('--boot-y', `${centerY}px`);
    };

    calculateBootPosition();
    window.addEventListener('resize', calculateBootPosition);
    return () => window.removeEventListener('resize', calculateBootPosition);
  }, []);

  /* sliding indicator state */
  const navContainerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredNav, setHoveredNav] = useState(null);

  /* update indicator position */
  useEffect(() => {
    if (!navContainerRef.current) return;

    // determine target item (hovered takes priority over active)
    const targetId = hoveredNav || activeSection;
    if (!targetId || targetId === "top") {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      return;
    }

    // find the DOM node
    let targetNode = null;
    if (hoveredNav) {
      targetNode = document.querySelector(`.nav-links [data-nav="${hoveredNav}"]`);
    } else {
      targetNode = document.querySelector(`.nav-links [data-nav="${activeSection}"]`);
    }

    if (targetNode) {
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const nodeRect = targetNode.getBoundingClientRect();
      setIndicatorStyle({
        left: nodeRect.left - containerRect.left,
        width: nodeRect.width,
        opacity: 1
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [hoveredNav, activeSection, scrolled]);

  /* magnetic interaction for premium elements */
  useEffect(() => {
    const isTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    if (isTouch) return;

    const handleMagneticMove = (e) => {
      const targets = document.querySelectorAll('.magnetic');
      targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // distance from center
        const dist = Math.sqrt(x * x + y * y);
        const maxDist = 120; // magnetic field size

        if (dist < maxDist) {
          const power = (maxDist - dist) / maxDist;
          // max move 4px, max rotate 3deg
          const tx = (x / maxDist) * 4 * power;
          const ty = (y / maxDist) * 4 * power;
          const rx = -(y / maxDist) * 3 * power;
          const ry = (x / maxDist) * 3 * power;

          target.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
          // pass mouse coords for lighting sweep
          target.style.setProperty('--mx', `${(e.clientX - rect.left) / rect.width * 100}%`);
          target.style.setProperty('--my', `${(e.clientY - rect.top) / rect.height * 100}%`);
        } else {
          target.style.transform = `translate3d(0,0,0) rotateX(0deg) rotateY(0deg)`;
          target.style.setProperty('--mx', `50%`);
          target.style.setProperty('--my', `50%`);
        }
      });
    };

    window.addEventListener('mousemove', handleMagneticMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMagneticMove);
  }, []);

  /* compact instrument state — the bar tightens once the page is scrolled */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* track active section for navbar highlight */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll("section[id], main[id='top']");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.spotlight-card');
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollRef = useRef(null);

  /* Lock body scroll when a detail view is open, and stamp the value
     at open time so closing returns to the same Explore section. */
  useEffect(() => {
    if (activeView) {
      scrollRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        document.querySelector(".detail-view-scroll")?.scrollTo({ top: 0 });
      });
    } else {
      document.body.style.overflow = "";
      if (scrollRef.current != null) {
        window.scrollTo({ top: scrollRef.current, behavior: "auto" });
        scrollRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeView]);

  const openView = (view) => {
    setMenuOpen(false);
    setActiveView(view);
  };
  const closeView = () => {
    setMenuOpen(false);
    setActiveView(null);
  };

  useEffect(() => {
    const els = document.querySelectorAll(
      ".reveal, .reveal-grid > *, .step-col"
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    els.forEach((el) => {
      el.classList.remove("is-in");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [activeView]);

  const activePersona = PERSONAS.find((p) => p.id === persona) || PERSONAS[0];

  return (
    <div className={`app boot-${bootState}`}>
      {bootState === "iot-intro" && (
        <LaunchCinematic onComplete={handleIntroComplete} />
      )}
      <div className="premium-intro-overlay" aria-hidden="true" />
      <header className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a
            href="#top"
            className="nav-brand-group magnetic"
            aria-label="VERTEX home"
            ref={brandRef}
          >
            <div className="nav-brand">
              <span className="nav-mark" aria-hidden="true">
                <img
                  className="nav-logo-img"
                  src="/images/onelastride.png"
                  alt=""
                  width="1601"
                  height="982"
                />
              </span>
              <span className="nav-word" aria-label="VERTEX">
                {"VERTEX".split("").map((letter, index) => (
                  <span
                    className="nav-let"
                    key={`vxName-${index}`}
                    style={{ "--i": index }}
                    aria-hidden="true"
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </div>
          </a>

          <nav
            className="nav-links"
            aria-label="Primary"
            ref={navContainerRef}
            onMouseLeave={() => setHoveredNav(null)}
          >
            <div
              className="nav-sliding-indicator"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity
              }}
              aria-hidden="true"
            />
            <a
              href="#company"
              data-nav="company"
              className={activeSection === "company" ? "active" : ""}
              onMouseEnter={() => setHoveredNav("company")}
            >
              Company
            </a>
            <button
              type="button"
              data-nav="technology"
              className={`nav-link-button ${activeSection === "technology" ? "active" : ""}`}
              onClick={() => openView("technology")}
              onMouseEnter={() => setHoveredNav("technology")}
            >
              Technology
            </button>
            <button
              type="button"
              data-nav="projects"
              className={`nav-link-button ${activeSection === "projects" ? "active" : ""}`}
              onClick={() => openView("projects")}
              onMouseEnter={() => setHoveredNav("projects")}
            >
              Projects
            </button>
            <a
              href="#services"
              data-nav="services"
              className={activeSection === "services" ? "active" : ""}
              onMouseEnter={() => setHoveredNav("services")}
            >
              Services
            </a>
            <a
              href="#contact"
              data-nav="contact"
              className={activeSection === "contact" ? "active" : ""}
              onMouseEnter={() => setHoveredNav("contact")}
            >
              Contact
            </a>
          </nav>

          <div className="nav-cta">
            <a href="#contact" className="nav-button magnetic">
              <span>Let's Talk</span>
              <span className="nav-button-arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <div className="nav-ruler" aria-hidden="true"><i /><i /><i /></div>

          <button
            type="button"
            className="nav-burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#company" onClick={() => setMenuOpen(false)}>Company</a>
            <button type="button" className="nav-link-button" onClick={() => openView("technology")}>
              Technology
            </button>
            <button type="button" className="nav-link-button" onClick={() => openView("projects")}>
              Projects
            </button>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
        )}
      </header>

      <main id="top">
        {/* ----------------------------------------------------------
            HERO — bold headline + live device record card
        ---------------------------------------------------------- */}
        <section className="hero" aria-label="Intro">
          <HeroControlRoom />

          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-label-row">
                <span className="hero-live-badge"><i />SYS ONLINE</span>
                <p className="hero-label">INDUSTRIAL TECHNOLOGY &amp; AUTOMATION</p>
              </div>
              <h1>
                <span className="hl-line hl-ink" style={{ "--hd": "0.18s" }}>
                  <span className="ink-base">
                    {"ENGINEERING\u00A0THE".split("").map((c, i) => (
                      <span className="hl-let" key={i}>{c}</span>
                    ))}
                  </span>
                  <span className="ink l1-core" aria-hidden="true">
                    {"ENGINEERING\u00A0THE".split("").map((c, i) => (
                      <span className="hl-let" key={i}>{c}</span>
                    ))}
                  </span>
                  <span className="ink l1-halo" aria-hidden="true">
                    {"ENGINEERING\u00A0THE".split("").map((c, i) => (
                      <span className="hl-let" key={i}>{c}</span>
                    ))}
                  </span>
                </span>
                <span className="hl-line hl-ink" style={{ "--hd": "0.30s" }}>
                  <span className="ink-base">
                    {"NEXT\u00A0INDUSTRIAL".split("").map((c, i) => (
                      <span className="hl-let" key={i}>{c}</span>
                    ))}
                  </span>
                  <span className="ink l2-core" aria-hidden="true">
                    {"NEXT\u00A0INDUSTRIAL".split("").map((c, i) => (
                      <span className="hl-let" key={i}>{c}</span>
                    ))}
                  </span>
                  <span className="ink l2-halo" aria-hidden="true">
                    {"NEXT\u00A0INDUSTRIAL".split("").map((c, i) => (
                      <span className="hl-let" key={i}>{c}</span>
                    ))}
                  </span>
                </span>
                <span className="hl-line hl-ink hl-rev" style={{ "--hd": "0.42s" }}>
                  <span className="ink-base">
                    {"REVOLUTION".split("").map((c, i) => (
                      <span className="hl-let" key={i}>{c}</span>
                    ))}
                  </span>
                  <span className="ink rev-ink rev-cyan" aria-hidden="true">REVOLUTION</span>
                  <span className="ink rev-ink rev-orange" aria-hidden="true">REVOLUTION</span>
                  <span className="ink rev-ink rev-hot" aria-hidden="true">REVOLUTION</span>
                </span>
              </h1>

              <div className="hero-signal" aria-hidden="true">
                <i className="hs-line" />
                <span className="hs-core">{ICONS.signal}</span>
                <i className="hs-line hs-cyan" />
              </div>

              <p className="hero-description">
                <HeroTyped text={HERO_DESC_TEXT} glowWords={HERO_DESC_GLOW} start={1400} speed={22} />
              </p>
              <HeroLiveMetrics />
              <div className="hero-actions">
                <a href="#company" className="btn btn-dark">Explore the platform <i className="btn-arrow" /></a>
                <a href="#services" className="btn btn-ghost btn-ghost-play"><i className="btn-play" />See how it works</a>
              </div>
              <p className="hero-note"><i className="note-cursor" />No sales spam. One conversation that's actually about your operation.</p>
            </div>

            {/* Right side: Video Carousel Placeholder */}
            <HeroVideoCarousel />
          </div>
        </section>

        {/* ----------------------------------------------------------
            CONNECTED INDUSTRIAL FLEET — repositioned dashboard section
        ---------------------------------------------------------- */}
        <section id="fleet" className="fleet-section" aria-label="Connected Industrial Fleet">
          <div className="fleet-section-glow" aria-hidden="true" />
          <div className="fleet-section-inner">
            {/* Left side: Site Fleet Board panel */}
            <div className="fleet-col-panel">
              <div className={`hero-float-wrap${cardMode === "fmc920" ? " chips-top" : ""}`}>
                <DeviceRecordCard mode={cardMode} onModeChange={setCardMode} />
                <div className="hero-floats">
                  <StatusChip cycles={VEHICLE_CHIP} tint="vehicle" />
                  <StatusChip cycles={WORKER_CHIP} tint="workers" />
                </div>
              </div>
            </div>

            {/* Right side: Explanation of fleet monitoring capabilities */}
            <div className="fleet-col-content">
              <div className="fleet-eyebrow">
                <span className="fleet-eyebrow-dot" />
                <span className="fleet-eyebrow-text">CONNECTED INDUSTRIAL FLEET</span>
              </div>
              <h2 className="fleet-heading">
                Complete visibility across every moving asset.
              </h2>
              <p className="fleet-lead">
                The system provides continuous real-time visibility of vehicles, heavy machinery, field personnel, and operational activity across the entire project site.
              </p>

              <div className="fleet-capabilities-grid">
                {FLEET_CAPABILITIES.map((item) => (
                  <div key={item.id} className="fleet-cap-item">
                    <div className="fleet-cap-icon" aria-hidden="true">
                      {item.icon}
                    </div>
                    <div className="fleet-cap-body">
                      <h3 className="fleet-cap-title">{item.title}</h3>
                      <p className="fleet-cap-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------
            STATS BAR
        ---------------------------------------------------------- */}
        <section className="stats-bar" aria-label="Impact">
          <div className="stat"><strong><AnimatedCounter end={350} suffix="+" /></strong><span>Connected devices deployed</span></div>
          <div className="stat"><strong>4.2M</strong><span>Telemetry signals / month</span></div>
          <div className="stat"><strong>24/7</strong><span>Live operational monitoring</span></div>
          <div className="stat"><strong><AnimatedCounter end={1} suffix="" /></strong><span>Source of connected truth</span></div>
        </section>

        {/* ----------------------------------------------------------
            COMPANY — dark accent section
        ---------------------------------------------------------- */}
        <section id="company" className="company-section">
          <div className="company-intro reveal">
            <div>
              <p className="section-label">COMPANY</p>
              <h2>Making industrial operations smarter.</h2>
            </div>
            <p className="company-statement">
              VERTEX is an industrial technology and automation
              company focused on connecting people, vehicles, machines and
              operational data through IoT-driven solutions. Our approach is
              simple: use connected technology to make industrial operations
              more visible, organized, measurable and easier to manage.
            </p>
          </div>

          <div className="caps-grid reveal-grid">
            <div className="cap spotlight-card reveal" style={{ "--i": 0 }}>
              <span className="cap-ico">{ICONS.automation}</span>
              <h3>Industrial Automation</h3>
              <p>Automation solutions built around connected IoT technology.</p>
            </div>
            <div className="cap spotlight-card reveal" style={{ "--i": 1 }}>
              <span className="cap-ico">{ICONS.fleet}</span>
              <h3>Fleet Management</h3>
              <p>Connected monitoring of industrial vehicles and fleet movement.</p>
            </div>
            <div className="cap spotlight-card reveal" style={{ "--i": 2 }}>
              <span className="cap-ico">{ICONS.vehicle}</span>
              <h3>Vehicle Monitoring</h3>
              <p>Real-time visibility into vehicle location and movement.</p>
            </div>
            <div className="cap spotlight-card reveal" style={{ "--i": 3 }}>
              <span className="cap-ico">{ICONS.workforce}</span>
              <h3>Workforce Tracking</h3>
              <p>IoT-based manpower tracking for large industrial environments.</p>
            </div>
          </div>

          <div className="vision-mission reveal-grid">
            <div className="vm spotlight-card reveal" style={{ "--i": 0 }}>
              <p className="vm-label">VISION</p>
              <h3>Smarter operations through intelligent automation.</h3>
              <p>To make industrial operations smoother, more organized and easier to manage through intelligent automation and clear visibility.</p>
            </div>
            <div className="vm spotlight-card reveal" style={{ "--i": 1 }}>
              <p className="vm-label">MISSION</p>
              <h3>Keeping industry moving with technology.</h3>
              <p>To continuously evolve with the technology revolution and transform conventional work into smarter, simpler, more efficient operations.</p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------
            FIND YOUR SEAT — persona tabs
        ---------------------------------------------------------- */}
        <section id="services" className="persona-section">
          <div className="section-head">
            <p className="section-label">WHERE YOUR OPERATION FEELS THE PAIN</p>
            <h2>Every industrial operation carries different friction.</h2>
            <p className="lead">
              Find the seat you sit in. Each operation sees connected data
              differently — here's what it fixes for yours.
            </p>
          </div>

          <div className="persona-tabs" role="tablist">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={persona === p.id}
                className={persona === p.id ? "is-active" : ""}
                onClick={() => setPersona(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="persona-panel reveal">
            <div className="panel-col">
              <p className="panel-kicker">THE PAIN</p>
              <p className="panel-text">{activePersona.pain}</p>
            </div>
            <div className="panel-col">
              <p className="panel-kicker">WHAT FIXES IT</p>
              <ul className="panel-fixes">
                {activePersona.fixes.map((f) => (
                  <li key={f}>{ICONS.check}{f}</li>
                ))}
              </ul>
            </div>
            <div className="panel-col panel-outcome">
              <p className="panel-kicker">THE OUTCOME</p>
              <p className="panel-text">{activePersona.outcome}</p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------
            THE REAL PROBLEM — four systems → one clean record (dark)
        ---------------------------------------------------------- */}
        <section className="problem-section">
          <div className="problem-head reveal">
            <p className="section-label light">THE REAL PROBLEM</p>
            <h2>FOUR SYSTEMS.<br />FOUR VERSIONS OF THE SAME OPERATION.</h2>
            <p className="lead light">
              Your GPS trackers, logbooks, gate readers and legacy ERP each
              hold a different version of the same field activity — and no one
              knows which to trust. We connect them all and return one clean,
              verified operational record.
            </p>
          </div>

          <ProblemReconcileBoard />
        </section>

        {/* ----------------------------------------------------------
            SERVICES GRID
        ---------------------------------------------------------- */}
        <section className="services-section">
          <div className="section-head">
            <CodeDrizzle count={8} />
            <p className="section-label">CAPABILITIES</p>
            <h2>Messy operations don't fix themselves. We do.</h2>
            <p className="lead">
              Run one capability or all of them, once or on a continuous
              cadence. One connected platform for vehicles, workforce and site.
            </p>
          </div>

          <div className="services-grid reveal-grid">
            {SERVICES.map((s, idx) => (
              <div className="service-card spotlight-card reveal" style={{ "--i": idx }} key={s.title}>
                <span className="service-ico">{ICONS[s.icon]}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------
            THE DEPLOYMENT MOMENT
        ---------------------------------------------------------- */}
        <section className="steps-section">
          <div className="section-head">
            <CodeDrizzle count={9} />
            <p className="section-label light">THE DEPLOYMENT MOMENT</p>
            <h2>Connected field data doesn't land by itself. We deploy it.</h2>
            <p className="lead light">
              A new monitoring rollout is the one time getting your operations
              connected is easy. Clean it in transit — and your new system
              starts on a foundation you trust.
            </p>
          </div>

          <div className="steps reveal-grid">
            {STEPS.map((s, idx) => (
              <div className="step-box reveal" style={{ "--i": idx }} key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <LogicStrip />

        {/* ----------------------------------------------------------
            EXPLORE — gateway tiles
        ---------------------------------------------------------- */}
        <section className="explore-section">
          <div className="section-head">
            <CodeDrizzle count={7} />
            <p className="section-label">EXPLORE</p>
            <h2>Go inside the connected system.</h2>
            <p className="lead">
              Open the full detailed view of our technology architecture and
              the real industrial deployment behind it.
            </p>
          </div>

          <div className="explore-grid reveal-grid">
            <button
              type="button"
              className="explore-card reveal"
              style={{ "--i": 0 }}
              onClick={() => openView("technology")}
            >
              <span className="explore-kicker">TECHNOLOGY</span>
              <h3>Inside the architecture</h3>
              <p>From physical field signals to intelligent operational data.</p>
              <span className="explore-open">OPEN DETAILED VIEW →</span>
            </button>

            <button
              type="button"
              className="explore-card reveal explore-card-dark"
              style={{ "--i": 1 }}
              onClick={() => openView("projects")}
            >
              <span className="explore-kicker">PROJECTS</span>
              <h3>A real industrial deployment</h3>
              <p>BPCL Kochi Refinery — vehicles, workforce and site, connected.</p>
              <span className="explore-open">OPEN CASE STUDY →</span>
            </button>
          </div>
        </section>



        {/* ----------------------------------------------------------
            CONTACT — light
        ---------------------------------------------------------- */}
        <section id="contact" className="contact-section">
          <div className="contact-head">
            <div>
              <p className="section-label">CONTACT</p>
              <h2>Let's engineer what's next.</h2>
            </div>
            <p className="contact-intro">
              Have an industrial challenge, monitoring requirement or
              automation opportunity? Let's discuss how connected technology
              can make your operation smarter and easier to manage.
            </p>
          </div>

          <div className="contact-grid reveal-grid">
            <a href="mailto:vertex@hotmail.com" className="contact-card reveal" style={{ "--i": 0 }}>
              <span>EMAIL</span>
              <strong>vertex@hotmail.com</strong>
              <small>Send us an enquiry →</small>
            </a>
            <a href="tel:123456789" className="contact-card reveal" style={{ "--i": 1 }}>
              <span>PHONE</span>
              <strong>123456789</strong>
              <small>Speak with us →</small>
            </a>
            <div className="contact-card reveal" style={{ "--i": 2 }}>
              <span>OFFICE</span>
              <strong>Ambalamugal, Kochi, Kerala</strong>
              <small>X9C9+HRJ — 682302</small>
            </div>
          </div>

          <div className="contact-bottom">
            <p>VERTEX</p>
            <p>ENGINEERING THE NEXT INDUSTRIAL REVOLUTION</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 VERTEX</p>
        <p>Engineering the next industrial revolution</p>
      </footer>

      {/* ----------------------------------------------------------
          DETAIL VIEW — Technology / Projects
      ---------------------------------------------------------- */}
      {activeView && (
        <div className="detail-view" role="dialog" aria-modal="true">
          <div className="detail-topbar">
            <button type="button" className="detail-back" onClick={closeView}>← Back</button>
            <span className="detail-status">
              {activeView === "technology"
                ? "VERTEX / TECHNOLOGY"
                : "VERTEX / PROJECTS"}
            </span>
          </div>

          <div className="detail-scroll">
            {activeView === "technology" ? (
              <>
                <section className="dt-hero">
                  <p className="section-label">TECHNOLOGY</p>
                  <h2>From physical signals to intelligent data.</h2>
                  <p>
                    Our IoT architecture connects vehicles, heavy machinery,
                    workforce and site infrastructure to create a clearer
                    picture of industrial operations.
                  </p>
                </section>

                <section className="dt-section tech-detail">
                  <div className="tech-flow">
                    {[
                      ["Vehicles & Heavy Machinery", "Teltonika FMB120 devices are installed directly in vehicles and heavy machinery to capture operational movement and vehicle status.", ["FMB120", "Vehicle Tracking", "Ignition Status", "Movement History"]],
                      ["Site-Wide Workforce Tracking", "The project site is digitally mapped and divided into monitoring zones. Solar-powered Teltonika FMC920 units sit at designated gateway points across the site.", ["FMC920", "Gateway Points", "Mapped Zones", "Solar Powered"]],
                      ["Worker Identification", "Each worker is assigned an individual Teltonika Eye Beacon, registered against their information so the system associates people with detected locations.", ["Eye Beacon", "Worker ID", "Zone Detection", "Gateway Detection"]],
                      ["Connected Operational Data", "Data from vehicles, machinery and workforce monitoring points is brought together for visibility across the industrial site.", ["Location", "Movement", "Site Activity", "Visibility"]],
                      ["Monitoring & Reporting", "Connected data is used to understand site activity, track movement and generate organized operational information for easier monitoring.", ["Monitoring", "Analysis", "Reports", "Insights"]],
                    ].map(([title, desc, tags], i) => (
                      <div className="tech-block" key={title}>
                        <div className="tech-rail" aria-hidden="true">
                          <i className="tech-node" />
                          <span className="tech-index">0{i + 1}</span>
                        </div>
                        <div className="tech-body">
                          <h3>{title}</h3>
                          <p>{desc}</p>
                          <div className="tech-tags">{tags.map((t) => <span key={t}>{t}</span>)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="dt-section hw-detail">
                  <div className="section-label">SENSORS &amp; HARDWARE</div>
                  <div className="hw-detail-intro">
                    <h2>Connected hardware built for the field.</h2>
                    <p>Reliable IoT devices and sensors that capture real-world movement, location and operational data across industrial environments.</p>
                  </div>
                  <div className="hw-detail-grid">
                    {HARDWARE.map((h) => (
                      <article className="hw-card" key={h.name}>
                        <div className="hw-image"><img src={h.img} alt={h.name} /></div>
                        <h3>{h.name}</h3>
                        <p>{h.desc}</p>
                        <div className="hw-tags">{h.tags.map((t) => <span key={t}>{t}</span>)}</div>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <>
                <section className="dt-hero">
                  <p className="section-label">PROJECTS</p>
                  <h2>Engineering in the real world.</h2>
                  <p>
                    Our systems are designed around real industrial environments,
                    where vehicles, workforce, site infrastructure and operational
                    data need to work together.
                  </p>
                </section>

                <section className="dt-section projects-detail">
                  <article className="featured-project">
                    <div className="project-topline">
                      <span>FEATURED PROJECT</span>
                      <span>INDUSTRIAL IoT &amp; AUTOMATION</span>
                    </div>

                    <div className="project-title">
                      <p className="project-location">KOCHI, KERALA — INDIA</p>
                      <h3>BPCL Kochi Refinery<br />Polypropylene Project</h3>
                      <p>IoT-based vehicle and workforce monitoring for a large under-construction industrial environment.</p>
                    </div>

                    <div className="project-overview">
                      <div className="project-overview-item"><span>ENVIRONMENT</span><strong>Large industrial construction site</strong><p>A digitally mapped site divided into monitoring zones and gateway points for connected operational visibility.</p></div>
                      <div className="project-overview-item"><span>VEHICLES</span><strong>Vehicles &amp; heavy machinery</strong><p>Teltonika FMB120 devices are installed in vehicles and heavy machinery to monitor movement and status.</p></div>
                      <div className="project-overview-item"><span>WORKFORCE</span><strong>Individual worker identification</strong><p>Workers are assigned individual Teltonika Eye Beacons, registered against their worker information.</p></div>
                      <div className="project-overview-item"><span>SITE TRACKING</span><strong>Gateway &amp; zone detection</strong><p>Solar-powered Teltonika FMC920 units are positioned at designated gateway points across the mapped site.</p></div>
                    </div>

                    <div className="project-flow">
                      <div><span>FIELD</span><strong>Vehicles</strong><strong>Workers</strong><strong>Machinery</strong></div>
                      <div className="project-flow-arrow">→</div>
                      <div><span>CONNECTED DEVICES</span><strong>FMB120</strong><strong>FMC920</strong><strong>EYE Beacon</strong></div>
                      <div className="project-flow-arrow">→</div>
                      <div><span>OPERATIONAL DATA</span><strong>Movement</strong><strong>Location</strong><strong>Status</strong></div>
                      <div className="project-flow-arrow">→</div>
                      <div><span>RESULT</span><strong>Visibility</strong><strong>Monitoring</strong><strong>Reporting</strong></div>
                    </div>

                    <div className="project-result">
                      <div><span>THE APPROACH</span></div>
                      <div>
                        <p>
                          Instead of treating vehicles, workforce and site
                          activity as separate elements, the system connects the
                          physical field environment with IoT devices and
                          monitoring software to create a clearer operational
                          picture.
                        </p>
                        <p>
                          The result is a more organized way to understand
                          movement, identify workers at monitored points and
                          bring operational information together for easier
                          monitoring and reporting.
                        </p>
                      </div>
                    </div>
                  </article>

                  <div className="projects-footer">
                    <p>FROM INDUSTRIAL CHALLENGE</p><span>→</span><p>TO CONNECTED SOLUTION</p><span>→</span><p>TO OPERATIONAL VISIBILITY</p>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;