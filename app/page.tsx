"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, MessageSquare, Calendar, Info,
  Wifi, Coffee, Car, Shield, MapPin, Users,
  X, ChevronLeft, ChevronRight,
} from "lucide-react";
import BookingEngine from "@/components/BookingEngine";
import HotelChat from "@/components/HotelChat";

const ACCENT    = "#8a8a8a";
const ACCENT_LT = "#d0d0d0";
const BOOKING   = "https://www.booking.com/hotel/co/palermo-real.html";
const MAPS      = "https://www.google.com/maps/search/Laureles+Estadio+Medellin+hotel";

const ROOMS = [
  {
    id: "doble",
    name: "Habitación Doble",
    capacity: "1 – 2 personas",
    description: "Cama doble, baño privado con bidet, TV con múltiples canales y WiFi de alta velocidad. Ideal para parejas y viajeros individuales.",
    amenities: ["Baño privado", "TV", "WiFi", "Agua caliente"],
    images: ["/hotels/distrito-unicentro/named-hab-doble-1.jpg", "/hotels/distrito-unicentro/named-hab-doble-2.jpg"],
  },
  {
    id: "sencilla",
    name: "Habitación Sencilla",
    capacity: "1 persona",
    description: "Cama sencilla, baño privado, TV y WiFi. Perfecta para el viajero individual.",
    amenities: ["Baño privado", "TV", "WiFi", "Agua caliente"],
    images: ["/hotels/distrito-unicentro/named-hab-sencilla.jpg"],
  },
  {
    id: "social",
    name: "Espacios Sociales",
    capacity: "Todos los huéspedes",
    description: "Amplias zonas comunes diseñadas para la convivencia y el descanso de nuestros huéspedes.",
    amenities: ["Zona social", "WiFi", "Vista jardín", "A/C"],
    images: ["/hotels/distrito-unicentro/named-social-1.jpg", "/hotels/distrito-unicentro/named-social-3.jpg", "/hotels/distrito-unicentro/named-social-4.jpg"],
  },
];

const GALLERY_IMGS = [
  { src: "/hotels/distrito-unicentro/named-hab-doble-1.jpg",  alt: "Habitación doble"    },
  { src: "/hotels/distrito-unicentro/named-hab-doble-2.jpg",  alt: "Habitación doble 2"  },
  { src: "/hotels/distrito-unicentro/named-hab-sencilla.jpg", alt: "Habitación sencilla" },
  { src: "/hotels/distrito-unicentro/named-social-1.jpg",     alt: "Área social"         },
  { src: "/hotels/distrito-unicentro/named-social-3.jpg",     alt: "Espacios comunes"    },
  { src: "/hotels/distrito-unicentro/named-social-4.jpg",     alt: "Instalaciones"       },
];

const AMENITIES = [
  { Icon: Coffee,  label: "Desayuno americano", desc: "Incluido en restaurante" },
  { Icon: Wifi,    label: "WiFi gratis",         desc: "En todo el hotel"        },
  { Icon: Shield,  label: "Seguridad 24 h",      desc: "Vigilancia permanente"   },
  { Icon: Car,     label: "Bici-parqueadero",    desc: "Parqueo de bicicletas"   },
  { Icon: Users,   label: "Jardín",              desc: "Zona verde exterior"     },
  { Icon: MapPin,  label: "Laureles-Estadio",    desc: "Zona exclusiva Medellín" },
];

const BOOKING_ROOMS = ROOMS.map((r) => ({ id: r.id, name: r.name, capacity: r.capacity }));

type Tab = "habitaciones" | "chat" | "reservar" | "info";

const TABS: { id: Tab; label: string; desc: string; Icon: React.ElementType }[] = [
  { id: "habitaciones", label: "Habitaciones", desc: "Ver espacios",         Icon: Home          },
  { id: "chat",         label: "Asistente",    desc: "Pregunta lo que sea",  Icon: MessageSquare },
  { id: "reservar",     label: "Reservar",     desc: "Ver disponibilidad",   Icon: Calendar      },
  { id: "info",         label: "Información",  desc: "Galería y servicios",  Icon: Info          },
];

function DistritoLogo({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/hotels/distrito-unicentro/logo.png"
      alt="Distrito Unicentro"
      width={size}
      height={size}
      style={{ objectFit: "contain" }}
      unoptimized
    />
  );
}

function RoomCard({ room, i }: { room: (typeof ROOMS)[0]; i: number }) {
  const [idx, setIdx] = useState(0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="relative h-48">
        <Image src={room.images[idx]} alt={room.name} fill className="object-cover" unoptimized sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
        <span className="absolute bottom-3 right-3 text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(4px)" }}>{room.capacity}</span>
        <div className="absolute bottom-3 left-3 flex gap-1">
          {room.images.map((_, j) => (
            <button key={j} onClick={() => setIdx(j)} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ background: j === idx ? "#d0d0d0" : "rgba(255,255,255,0.35)" }} />
          ))}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-base mb-1.5" style={{ fontFamily: "Georgia, serif", color: "#d8d8d8" }}>{room.name}</h3>
        <p className="text-sm text-white/55 mb-4 flex-1">{room.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {room.amenities.map((a) => (
            <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "#b0b0b0", border: "1px solid rgba(255,255,255,0.1)" }}>{a}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({ images, index, onClose }: { images: { src: string; alt: string }[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }} />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
      >
        <X size={18} />
      </button>

      {/* Counter */}
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-medium z-10" style={{ color: "rgba(255,255,255,0.45)" }}>
        {current + 1} / {images.length}
      </span>

      {/* Image */}
      <motion.div
        key={current}
        className="relative z-10 max-w-5xl w-full mx-6"
        style={{ maxHeight: "85dvh", aspectRatio: "4/3" }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current].src}
          alt={images[current].alt}
          fill
          className="object-contain rounded-2xl"
          unoptimized
          sizes="90vw"
        />
      </motion.div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{ background: i === current ? "#fff" : "rgba(255,255,255,0.3)", transform: i === current ? "scale(1.3)" : "scale(1)" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function InfoPanel() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div className="space-y-10 pb-8">
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={GALLERY_IMGS} index={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      {/* Hero banner */}
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 500 }}>
        <Image
          src="/hotels/distrito-unicentro/principal.jpg"
          alt="Hotel Distrito Unicentro"
          fill
          className="object-cover"
          unoptimized
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
        <div className="absolute bottom-5 left-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>★★★ Laureles · Medellín</p>
          <h3 className="text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>Hotel Distrito Unicentro</h3>
        </div>
      </div>

      {/* Galería */}
      <section>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: ACCENT_LT }}>Galería</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY_IMGS.map((img, i) => (
            <motion.button
              key={img.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-xl overflow-hidden cursor-zoom-in"
              style={{ aspectRatio: "4/3" }}
              onClick={() => setLightbox(i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500" unoptimized sizes="(max-width: 768px) 50vw, 33vw" />
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(4px)" }}>Ver</span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: ACCENT_LT }}>Servicios</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AMENITIES.map(({ Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                <Icon size={16} style={{ color: "#b0b0b0" }} />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">{label}</p>
                <p className="text-xs text-white/40 mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ubicación */}
      <section>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: ACCENT_LT }}>Ubicación</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "#161616" }}>
              <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "#b0b0b0" }} />
              <div>
                <p className="font-semibold text-sm">Dirección</p>
                <p className="text-sm text-white/50 mt-0.5">Laureles - Estadio, Medellín, Antioquia</p>
              </div>
            </div>
            <div className="p-4 rounded-xl text-sm text-white/55 space-y-1.5" style={{ background: "#161616" }}>
              <p>🛍️ <strong>CC Unicentro Medellín:</strong> zona</p>
              <p>🚇 <strong>Metro Estadio:</strong> accesible</p>
              <p>🏟️ <strong>Estadio Atanasio:</strong> área</p>
              <p>✈️ <strong>Aeropuerto Olaya Herrera:</strong> cerca</p>
            </div>
            <a href={MAPS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "#ffffff", color: "#111" }}>
              <MapPin size={13} /> Ver en Google Maps
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ height: 260 }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966!2d-75.5950!3d6.2440!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMzguNCJOIDc1wrAzNSc0Mi4wIlc!5e0!3m2!1ses!2sco!4v1" width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Ubicación Distrito Unicentro" />
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: ACCENT_LT }}>Contacto</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="#" onClick={(e) => { e.preventDefault(); }} className="flex items-center gap-4 p-4 rounded-2xl hover:opacity-85 transition-opacity" style={{ background: "#ffffff", color: "#111" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,0,0,0.1)" }}><Calendar size={18} /></div>
            <div><p className="font-semibold text-sm">Motor de Reservas</p><p className="text-xs opacity-55">Verificar disponibilidad</p></div>
          </a>
          <a href={BOOKING} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl hover:opacity-85 transition-opacity" style={{ background: "#003580", color: "#fff" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}><MapPin size={18} /></div>
            <div><p className="font-semibold text-sm">Booking.com</p><p className="text-xs opacity-70">Ver disponibilidad</p></div>
          </a>
        </div>
        <p className="text-xs text-white/25 mt-5">Diseñado por <a href="https://www.instagram.com/laagenciacreativa" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">La Agencia ✦</a></p>
      </section>
    </div>
  );
}

const SLIDE = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -10 },
  transition: { duration: 0.25 },
};

export default function DistritoUnicentroPage() {
  const [activeTab, setActiveTab] = useState<Tab>("habitaciones");
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-[#0a0a0a] text-white flex flex-col" style={{ height: "100dvh", overflow: "hidden" }}>

      {/* Splash screen */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => {}}
          >
            <Image
              src="/hotels/distrito-unicentro/principal.jpg"
              alt=""
              fill
              className="object-cover"
              unoptimized
              priority
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.78) 100%)" }} />
            <motion.div
              className="relative z-10 flex flex-col items-center gap-5 text-center px-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onAnimationComplete={() => setTimeout(() => setLoading(false), 1200)}
            >
              <DistritoLogo size={64} />
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>★★★ LAURELES · MEDELLÍN</p>
                <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  Hotel Distrito Unicentro
                </h1>
              </div>
              <motion.div
                className="flex gap-1.5 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topbar */}
      <header
        className="shrink-0 flex items-center justify-between px-5 h-14"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0a0a0a" }}
      >
        <div className="flex items-center gap-3">
          <DistritoLogo size={34} />
          <div>
            <p className="text-xs font-semibold leading-tight text-white">Hotel Distrito Unicentro</p>
            <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>★★★ Laureles · Medellín</p>
          </div>
        </div>
        <a
          href={BOOKING}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-85 transition-opacity"
          style={{ background: "#fff", color: "#111" }}
        >
          Reservar en Booking
        </a>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar — desktop */}
        <aside
          className="hidden md:flex flex-col w-56 shrink-0 py-4 px-3 gap-1"
          style={{ borderRight: "1px solid rgba(255,255,255,0.07)", background: "#080808" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase px-3 mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Hotel</p>
          {TABS.map(({ id, label, desc, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
              style={{
                background: activeTab === id ? "rgba(255,255,255,0.08)" : "transparent",
                border: activeTab === id ? "1px solid rgba(255,255,255,0.11)" : "1px solid transparent",
              }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: activeTab === id ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)" }}
              >
                <Icon size={15} style={{ color: activeTab === id ? "#fff" : "#666" }} />
              </span>
              <span>
                <span className="block text-sm font-medium leading-tight" style={{ color: activeTab === id ? "#fff" : "rgba(255,255,255,0.45)" }}>{label}</span>
                <span className="block text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{desc}</span>
              </span>
            </button>
          ))}
        </aside>

        {/* Content panel */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "habitaciones" && (
              <motion.div key="habitaciones" {...SLIDE} className="p-6">
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: ACCENT_LT }}>Alojamiento</p>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Georgia, serif" }}>Nuestras Habitaciones</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {ROOMS.map((room, i) => <RoomCard key={room.id} room={room} i={i} />)}
                </div>
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div key="chat" {...SLIDE} className="p-6 h-full flex flex-col" style={{ minHeight: "calc(100dvh - 56px - 56px)" }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: ACCENT_LT }}>AI</p>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Georgia, serif" }}>Asistente del Hotel</h2>
                <div className="flex-1 min-h-0">
                  <HotelChat accent={ACCENT_LT} />
                </div>
              </motion.div>
            )}

            {activeTab === "reservar" && (
              <motion.div key="reservar" {...SLIDE} className="p-6">
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: ACCENT_LT }}>Disponibilidad</p>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Georgia, serif" }}>Motor de Reservas</h2>
                <div className="max-w-2xl p-6 rounded-2xl" style={{ background: "#111", border: "1px solid rgba(255,255,255,0.09)" }}>
                  <BookingEngine hotelName="Hotel Distrito Unicentro" accent={ACCENT} pmsUrl={BOOKING} rooms={BOOKING_ROOMS} />
                </div>
              </motion.div>
            )}

            {activeTab === "info" && (
              <motion.div key="info" {...SLIDE} className="p-6">
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: ACCENT_LT }}>El hotel</p>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Georgia, serif" }}>Información</h2>
                <InfoPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav
        className="md:hidden shrink-0 flex items-center justify-around px-2 h-14"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#080808" }}
      >
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all"
            style={{ color: activeTab === id ? "#fff" : "rgba(255,255,255,0.35)" }}
          >
            <Icon size={19} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
