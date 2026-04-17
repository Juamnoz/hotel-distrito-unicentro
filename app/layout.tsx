import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel Distrito Unicentro | Laureles · Medellín",
  description: "Hotel 3 estrellas en Laureles-Estadio, Medellín. Habitaciones confortables, desayuno americano incluido y jardín privado.",
  icons: { icon: "/hotels/distrito-unicentro/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
