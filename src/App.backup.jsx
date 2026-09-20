import "./App.css";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import LaunchCinematic from "./LaunchCinematic";
import LiquidEnergyField from "./LiquidEnergyField";

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
  { id: "excavator", label: "EXCAVATOR", unit: "UNIT 07", deviceId: "TRK-2291", icon: MACHINE_ICONS.excavator, ignition: "ON", ignitionCls: "ok", speed: "0 km/h", fuel: "74%", fuelCls: "warn" },
  { id: "hydra", label: "HYDRA", unit: "UNIT 12", deviceId: "TRK-1186", icon: MACHINE_ICONS.hydra, ignition: "ON", ignitionCls: "ok", speed: "18 km/h", fuel: "58%", fuelCls: "warn" },
  { id: "dumper", label: "DUMPER", unit: "UNIT 03", deviceId: "TRK-0418", icon: MACHINE_ICONS.dumper, ignition: "OFF", ignitionCls: "off", speed: "—", fuel: "91%", fuelCls: "ok" },
  { id: "crane", label: "CRANE", unit: "UNIT 21", deviceId: "TRK-3324", icon: MACHINE_ICONS.crane, ignition: "ON", ignitionCls: "ok", speed: "0 km/h", fuel: "62%", fuelCls: "warn" },
  { id: "mixer", label: "CONCRETE MIXER", unit: "UNIT 09", deviceId: "TRK-7751", icon: MACHINE_ICONS.mixer, ignition: "ON", ignitionCls: "ok", speed: "22 km/h", fuel: "66%", fuelCls: "warn" },
  { id: "pump", label: "PUMP TRUCK", unit: "UNIT 18", deviceId: "TRK-6610", icon: MACHINE_ICONS.pump, ignition: "ON", ignitionCls: "ok", speed: "12 km/h", fuel: "54%", fuelCls: "warn" },
  { id: "lowboy", label: "LOWBOY", unit: "UNIT 05", deviceId: "TRK-8822", icon: MACHINE_ICONS.lowboy, ignition: "OFF", ignitionCls: "off", speed: "—", fuel: "71%", fuelCls: "ok" },
  { id: "bulldozer", label: "BULLDOZER", unit: "UNIT 02", deviceId: "TRK-3310", icon: MACHINE_ICONS.bulldozer, ignition: "ON", ignitionCls: "ok", speed: "6 km/h", fuel: "58%", fuelCls: "warn" },
  { id: "boomlift", label: "BOOM LIFT", unit: "UNIT 14", deviceId: "TRK-5093", icon: MACHINE_ICONS.boomlift, ignition: "ON", ignitionCls: "ok", speed: "4 km/h", fuel: "82%", fuelCls: "ok" },
  { id: "forklift", label: "FORKLIFT", unit: "UNIT 11", deviceId: "TRK-4477", icon: MACHINE_ICONS.forklift, ignition: "ON", ignitionCls: "ok", speed: "8 km/h", fuel: "63%", fuelCls: "warn" },
  { id: "tele", label: "TELEHANDLER", unit: "UNIT 16", deviceId: "TRK-5236", icon: MACHINE_ICONS.tele, ignition: "ON", ignitionCls: "ok", speed: "11 km/h", fuel: "69%", fuelCls: "ok" },
  { id: "crawler", label: "CRAWLER", unit: "UNIT 22", deviceId: "TRK-9105", icon: MACHINE_ICONS.crawler, ignition: "ON", ignitionCls: "ok", speed: "3 km/h", fuel: "47%", fuelCls: "warn" },
  { id: "fuel", label: "FUEL & LUBE", unit: "UNIT 08", deviceId: "TRK-6644", icon: MACHINE_ICONS.fuel, ignition: "ON", ignitionCls: "ok", speed: "15 km/h", fuel: "90%", fuelCls: "ok" },
];

const SITE_ZONES = ["Zone 1", "N2 Plant", "B2 Zone", "Gate House"];

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

/* Floating route window with Fleet Map vs Vehicle Detail Map modes */
function FleetRoutePop({ f, ops, speed, onSelect, onClose }) {
  const [mapMode, setMapMode] = useState("detail");

  return (
    <div className="fleet-pop">
      <div className="fleet-pop-card" key={f.id} role="dialog" aria-label={`${f.label} live route console`}>
        <div className="fleet-pop-bar">
          <span className="fleet-pop-lights" aria-hidden="true"><i /><i /><i /></span>
          <span className="fleet-pop-title">
            {mapMode === "detail" ? `${f.label} • ${f.unit}` : "SITE FLEET OVERVIEW"}
          </span>
          <button
            type="button"
            className="fleet-pop-mode-btn"
            onClick={() => setMapMode((m) => (m === "detail" ? "fleet" : "detail"))}
            title={mapMode === "detail" ? "View all fleet vehicles" : `Focus on ${f.label}`}
          >
            {mapMode === "detail" ? "FLEET VIEW" : `← ${f.label}`}
          </button>
        </div>
        <FleetRouteMap
          f={f}
          ops={ops}
          speed={speed}
          mapMode={mapMode}
          onSelectVehicle={(id) => {
            onSelect && onSelect(id);
            setMapMode("detail");
          }}
        />
      </div>
      <button type="button" className="fleet-pop-close" onClick={onClose} aria-label="Close route view">×</button>
    </div>
  );
}

/* ------------------------------------------------------------------
   Hero live "device record" card — live IoT telemetry.
   Manual sensor switch between FMB120 (vehicle tracking with neon
   fleet schematics) and FMC920 (manpower + fleet).
------------------------------------------------------------------- */
function DeviceRecordCard({ mode, onModeChange }) {
  const [fleetId, setFleetId] = useState("excavator");
  const [zoneIdx, setZoneIdx] = useState(0);
  const [speedTick, setSpeedTick] = useState(0);
  const [routeOpen, setRouteOpen] = useState(true);
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
  const speed = f.id === "dumper" ? `${34 + (speedTick % 17)} km/h` : f.speed;
  const closeRoute = () => setRouteOpen(false);
  const selectVehicle = (id) => {
    setFleetId(id);
    setRouteOpen(true);
    setManualHold(true);
  };
  const handleModeChange = (m) => onModeChange(m);
  const rackTypes = Array.from({ length: 4 }, (_, i) => FLEET_TYPES[(windowStart + i) % FLEET_TYPES.length]);

  return (
    <>
      <div className="record-card">
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
              <div className="fleet-location" key={zoneIdx}>
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

      {/* floating route window — left of the card, outside the border */}
      {mode === "fmb120" && routeOpen && (
        <FleetRoutePop
          f={f}
          ops={ops}
          speed={speed}
          onSelect={selectVehicle}
          onClose={closeRoute}
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
   Hero mesh — "living energy streams". Particles are continuously
   emitted and flow along organic, undulating field lines across the
   hero — like data currents. Never-restarting, non-looping motion.
   Fully drawn code, no video/network assets.
------------------------------------------------------------------- */
/* ---- HeroBackdrop: procedural fire/plasma energy field ---------- */
function HeroBackdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const TAU = Math.PI * 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let raf = 0;
    let prev = 0;
    let ro = null;

    /* ---- simplex-style noise ---- */
    const P = new Uint8Array(512);
    const perm = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30,
      69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203,
      117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
      134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55,
      46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
      200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124,
      123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
      223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
      39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242,
      193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
      181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222,
      114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
    for (let i = 0; i < 256; i += 1) { P[i] = perm[i]; P[i + 256] = perm[i]; }

    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerpN = (a, b, t) => a + t * (b - a);
    const grad2 = (h, x, y) => {
      const u = h < 8 ? x : y;
      const v = h < 8 ? y : x;
      return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
    };

    function noise2(x, y) {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = fade(xf);
      const v = fade(yf);
      const a = P[X] + Y;
      const b = P[X + 1] + Y;
      return lerpN(
        lerpN(grad2(P[a] & 15, xf, yf), grad2(P[b] & 15, xf - 1, yf), u),
        lerpN(grad2(P[a + 1] & 15, xf, yf - 1), grad2(P[b + 1] & 15, xf - 1, yf - 1), u),
        v
      );
    }

    function fbm(x, y) {
      let v = 0;
      let a = 0.5;
      let f = 1;
      for (let i = 0; i < 4; i += 1) { v += a * noise2(x * f, y * f); f *= 2; a *= 0.5; }
      return v;
    }

    /* ---- flow field angle ---- */
    const flowAngle = (x, y, t) => {
      const s = 0.0018;
      const n1 = noise2(x * s + t * 0.015, y * s + t * 0.012);
      const n2 = noise2(x * s * 2.1 + 50 + t * 0.008, y * s * 2.1 + 60 + t * 0.006);
      return (n1 * 0.7 + n2 * 0.3) * TAU;
    };

    /* ---- turbulence displacement ---- */
    const turb = (x, y, t) => {
      const s = 0.003;
      return fbm(x * s + t * 0.02, y * s + t * 0.015) * 0.6 +
        fbm(x * s * 2.5 + 20 + t * 0.012, y * s * 2.5 + 30 + t * 0.01) * 0.4;
    };

    /* ---- state ---- */
    let particles = [];
    let cores = [];

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = parent.clientWidth;
      H = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = W < 768;
      const pCount = isMobile ? 120 : 320;

      particles = [];
      for (let i = 0; i < pCount; i += 1) {
        particles.push(makeParticle(true));
      }

      cores = [
        { x: W * 0.78, y: H * 0.25, r: isMobile ? 120 : 200, orange: true, ph: 0 },
        { x: W * 0.88, y: H * 0.42, r: isMobile ? 80 : 140, orange: true, ph: 1.5 },
        { x: W * 0.72, y: H * 0.62, r: isMobile ? 100 : 170, orange: false, ph: 0.8 },
        { x: W * 0.84, y: H * 0.78, r: isMobile ? 70 : 120, orange: false, ph: 2.2 },
      ];
    };

    function makeParticle(init) {
      const isOrange = Math.random() < 0.52;
      const region = isOrange
        ? { cx: W * 0.76, cy: H * 0.28, rx: W * 0.22, ry: H * 0.28 }
        : { cx: W * 0.74, cy: H * 0.65, rx: W * 0.2, ry: H * 0.25 };
      const depth = Math.random();
      const speedMul = 0.4 + depth * 0.6;
      const sizeMul = 0.3 + depth * 0.7;
      const px = region.cx + (Math.random() - 0.5) * region.rx * 2;
      const py = region.cy + (Math.random() - 0.5) * region.ry * 2;
      const fa = flowAngle(px, py, 0);
      const sp = (15 + Math.random() * 30) * speedMul;
      return {
        x: px,
        y: py,
        vx: Math.cos(fa) * sp * 0.3,
        vy: Math.sin(fa) * sp * 0.3 - (isOrange ? 5 : 1),
        orange: isOrange,
        depth,
        size: (0.4 + Math.random() * 1.6) * sizeMul,
        alpha: init ? Math.random() * 0.6 : 0,
        maxAlpha: (0.2 + Math.random() * 0.7) * (isOrange ? 0.85 : 0.75),
        life: init ? Math.random() * 15 : 0,
        maxLife: 8 + Math.random() * 14,
        speed: sp,
        trail: [],
        trailLen: Math.floor(5 + Math.random() * 12),
        flick: 1.5 + Math.random() * 4,
        ph: Math.random() * TAU,
        isCore: Math.random() < 0.04,
        region,
      };
    }

    /* ---- update ---- */
    const update = (dt, t) => {
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const fa = flowAngle(p.x, p.y, t);
        const tx = turb(p.x, p.y, t);

        p.vx += (Math.cos(fa) * p.speed + tx * 25) * dt;
        p.vy += (Math.sin(fa) * p.speed * 0.8 - (p.orange ? 8 : 2) + tx * 18) * dt;
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.trail.unshift({ x: p.x, y: p.y });
        if (p.trail.length > p.trailLen) p.trail.length = p.trailLen;

        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        p.life += dt;

        if (p.life < 1.5) p.alpha = p.maxAlpha * (p.life / 1.5);
        else if (p.life > p.maxLife - 1.5) p.alpha = p.maxAlpha * Math.max(0, (p.maxLife - p.life) / 1.5);
        else p.alpha = p.maxAlpha;

        if (p.life >= p.maxLife || p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) {
          Object.assign(p, makeParticle(false));
        }
      }
    };

    /* ---- draw ---- */
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);

      /* atmospheric haze */
      ctx.globalCompositeOperation = "lighter";
      const hp1 = 0.65 + 0.35 * Math.sin(t * 0.06);
      const hp2 = 0.65 + 0.35 * Math.sin(t * 0.08 + 1.5);
      const h1 = ctx.createRadialGradient(W * 0.78, H * 0.2, 0, W * 0.78, H * 0.2, W * 0.35);
      h1.addColorStop(0, `rgba(255,90,15,${(0.1 * hp1).toFixed(3)})`);
      h1.addColorStop(0.4, `rgba(200,50,8,${(0.04 * hp1).toFixed(3)})`);
      h1.addColorStop(1, "rgba(120,20,2,0)");
      ctx.fillStyle = h1;
      ctx.fillRect(0, 0, W, H);
      const h2 = ctx.createRadialGradient(W * 0.72, H * 0.65, 0, W * 0.72, H * 0.65, W * 0.3);
      h2.addColorStop(0, `rgba(15,180,255,${(0.08 * hp2).toFixed(3)})`);
      h2.addColorStop(0.4, `rgba(8,110,190,${(0.03 * hp2).toFixed(3)})`);
      h2.addColorStop(1, `rgba(3,50,120,0)`);
      ctx.fillStyle = h2;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      /* energy cores */
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < cores.length; i += 1) {
        const c = cores[i];
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.08 + c.ph);
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * pulse);
        if (c.orange) {
          g.addColorStop(0, `rgba(255,110,25,${(0.12 * pulse).toFixed(3)})`);
          g.addColorStop(0.4, `rgba(220,70,10,${(0.05 * pulse).toFixed(3)})`);
          g.addColorStop(1, "rgba(160,30,5,0)");
        } else {
          g.addColorStop(0, `rgba(25,200,255,${(0.1 * pulse).toFixed(3)})`);
          g.addColorStop(0.4, `rgba(12,130,210,${(0.04 * pulse).toFixed(3)})`);
          g.addColorStop(1, `rgba(5,60,140,0)`);
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r * pulse, 0, TAU);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      /* particle trails + glow + core */
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        if (p.alpha < 0.003) continue;

        const flick = 0.7 + 0.3 * Math.sin(t * p.flick + p.ph);
        const a = p.alpha * flick;

        /* trail */
        if (p.trail.length > 1) {
          for (let j = 1; j < p.trail.length; j += 1) {
            const ta = a * (1 - j / p.trail.length) * 0.5;
            if (ta < 0.003) continue;
            const tw = p.size * (1 - j / p.trail.length * 0.6);
            ctx.strokeStyle = p.orange
              ? `rgba(255,140,40,${ta.toFixed(3)})`
              : `rgba(50,200,255,${ta.toFixed(3)})`;
            ctx.lineWidth = tw;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(p.trail[j - 1].x, p.trail[j - 1].y);
            ctx.lineTo(p.trail[j].x, p.trail[j].y);
            ctx.stroke();
          }
        }

        /* glow around particle */
        const glowR = p.size * (p.isCore ? 8 : 4);
        const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        if (p.orange) {
          gg.addColorStop(0, `rgba(255,180,80,${(a * 0.4).toFixed(3)})`);
          gg.addColorStop(0.4, `rgba(255,100,25,${(a * 0.12).toFixed(3)})`);
          gg.addColorStop(1, "rgba(200,50,8,0)");
        } else {
          gg.addColorStop(0, `rgba(100,230,255,${(a * 0.35).toFixed(3)})`);
          gg.addColorStop(0.4, `rgba(30,170,240,${(a * 0.1).toFixed(3)})`);
          gg.addColorStop(1, `rgba(10,80,160,0)`);
        }
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, TAU);
        ctx.fill();

        /* bright core dot */
        const coreA = p.isCore ? Math.min(1, a * 1.5) : a;
        ctx.fillStyle = p.orange
          ? `rgba(255,230,170,${coreA.toFixed(3)})`
          : `rgba(180,245,255,${coreA.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.isCore ? p.size * 1.8 : p.size, 0, TAU);
        ctx.fill();
      }
    };

    const frame = (now) => {
      const dt = Math.min(50, now - prev || 16) / 1000;
      prev = now;
      const t = now / 1000;
      const steps = Math.max(1, Math.round(dt * 1000 / 16));
      const sub = dt / steps;
      for (let s = 0; s < steps; s += 1) update(sub, t);
      draw(t);
      raf = requestAnimationFrame(frame);
    };

    build();
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(build);
      ro.observe(parent);
    }
    if (reduceMotion) {
      draw(0);
    } else {
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
  }, []);

  return <canvas className="hero-backdrop" ref={ref} aria-hidden="true" />;
}

/* ------------------------------------------------------------------
   GLOBAL BACKDROP — Powered by LiquidEnergyField (3D WebGL)
------------------------------------------------------------------ */

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
    setBootState("reveal");
  }, []);

  /* premium brand intro state machine */
  useEffect(() => {
    if (bootState === "iot-intro") {
      // Safety guard: guarantee progression even if tab is unfocused/backgrounded
      const fallbackTimer = setTimeout(() => {
        setBootState("reveal");
      }, 5500);
      return () => clearTimeout(fallbackTimer);
    }
    if (bootState === "init") {
      const t = setTimeout(() => setBootState("reveal"), 300);
      return () => clearTimeout(t);
    }
    if (bootState === "reveal") {
      // Begin seamless glide to navbar after logo & name reveal
      const t1 = setTimeout(() => setBootState("glide"), 1700);
      return () => clearTimeout(t1);
    }
    if (bootState === "glide") {
      // Complete hand-off, dissolve overlay after glide animation
      const t2 = setTimeout(() => setBootState("complete"), 1200);
      return () => clearTimeout(t2);
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
      <LiquidEnergyField />
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

            <div className="hero-visual">
              <div className={`hero-float-wrap${cardMode === "fmc920" ? " chips-top" : ""}`}>
                <DeviceRecordCard mode={cardMode} onModeChange={setCardMode} />
                <div className="hero-floats">
                  <StatusChip cycles={VEHICLE_CHIP} tint="vehicle" />
                  <StatusChip cycles={WORKER_CHIP} tint="workers" />
                </div>
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