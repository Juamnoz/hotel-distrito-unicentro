"use client";

import { useState } from "react";
import { CalendarDays, Users, BedDouble, ChevronDown, Plus, Minus } from "lucide-react";

interface Room {
  id: string;
  name: string;
  capacity: string;
}

interface BookingEngineProps {
  hotelName: string;
  accent: string;
  pmsUrl?: string;
  whatsapp?: string;
  rooms: Room[];
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#888" }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "#2a2a2a", border: `1px solid ${accent}40`, color: accent }}
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-base font-bold text-white">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "#2a2a2a", border: `1px solid ${accent}40`, color: accent }}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export default function BookingEngine({
  hotelName,
  accent,
  pmsUrl,
  whatsapp,
  rooms,
}: BookingEngineProps) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];

  const [checkin, setCheckin] = useState(today);
  const [checkout, setCheckout] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkout).getTime() - new Date(checkin).getTime()) / 86_400_000
    )
  );

  const handleCheckin = (v: string) => {
    setCheckin(v);
    if (v >= checkout) {
      const next = new Date(new Date(v).getTime() + 86_400_000)
        .toISOString()
        .split("T")[0];
      setCheckout(next);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedRoom = rooms.find((r) => r.id === roomId);

    if (pmsUrl) {
      const url = new URL(pmsUrl);
      url.searchParams.set("checkin", checkin);
      url.searchParams.set("checkout", checkout);
      url.searchParams.set("adults", String(adults));
      url.searchParams.set("children", String(children));
      window.open(url.toString(), "_blank", "noopener,noreferrer");
      return;
    }

    if (whatsapp) {
      const msg = encodeURIComponent(
        `Hola, quiero reservar en ${hotelName}.\n\n` +
          `📅 Entrada: ${checkin}\n` +
          `📅 Salida: ${checkout}\n` +
          `🌙 Noches: ${nights}\n` +
          `👥 Adultos: ${adults}` +
          (children > 0 ? `\n👶 Niños: ${children}` : "") +
          `\n🛏 Habitación: ${selectedRoom?.name ?? roomId}\n\n` +
          `¿Hay disponibilidad?`
      );
      window.open(
        `https://wa.me/57${whatsapp}?text=${msg}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const fieldStyle: React.CSSProperties = {
    background: "#1e1e1e",
    border: `1px solid ${accent}30`,
    borderRadius: 10,
    color: "#fff",
    padding: "10px 14px",
    width: "100%",
    fontSize: 14,
    outline: "none",
    colorScheme: "dark",
  };

  return (
    <div
      className="rounded-2xl overflow-hidden w-full max-w-2xl mx-auto"
      style={{ background: "#141414", border: `1px solid ${accent}30` }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${accent}20` }}
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={18} style={{ color: accent }} />
          <span className="font-semibold text-white text-sm">Motor de Reservas</span>
        </div>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: `${accent}18`, color: accent }}
        >
          Mejor precio garantizado
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        {/* Dates row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#888" }}>
              Check-in
            </label>
            <input
              type="date"
              value={checkin}
              min={today}
              onChange={(e) => handleCheckin(e.target.value)}
              required
              style={fieldStyle}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#888" }}>
              Check-out
            </label>
            <input
              type="date"
              value={checkout}
              min={checkin}
              onChange={(e) => setCheckout(e.target.value)}
              required
              style={fieldStyle}
            />
          </div>
        </div>

        {/* Guests + room row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          {/* Steppers */}
          <div
            className="flex items-end gap-6 p-4 rounded-xl"
            style={{ background: "#1e1e1e", border: `1px solid ${accent}20` }}
          >
            <div className="flex items-center gap-1 self-center mb-1 mr-1">
              <Users size={15} style={{ color: accent }} />
            </div>
            <Stepper
              label="Adultos"
              value={adults}
              min={1}
              max={10}
              onChange={setAdults}
              accent={accent}
            />
            <Stepper
              label="Niños"
              value={children}
              min={0}
              max={6}
              onChange={setChildren}
              accent={accent}
            />
          </div>

          {/* Room type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#888" }}>
              <BedDouble size={13} />
              Tipo de habitación
            </label>
            <div className="relative">
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={{ ...fieldStyle, paddingRight: 36, appearance: "none" }}
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id} style={{ background: "#1e1e1e" }}>
                    {r.name} · {r.capacity}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: accent }}
              />
            </div>
          </div>
        </div>

        {/* Nights summary */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
          style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}
        >
          <span style={{ color: "#aaa" }}>
            {nights} noche{nights !== 1 ? "s" : ""} · {adults + children} huésped
            {adults + children !== 1 ? "es" : ""}
          </span>
          <span className="font-semibold" style={{ color: accent }}>
            {pmsUrl ? "Ver disponibilidad →" : "Consultar precio →"}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-opacity hover:opacity-85 active:scale-[0.98]"
          style={{ background: accent, color: "#111" }}
        >
          Verificar disponibilidad
        </button>

        <p className="text-center text-xs" style={{ color: "#555" }}>
          Sin cargos ocultos · Confirmación inmediata
        </p>
      </form>
    </div>
  );
}
