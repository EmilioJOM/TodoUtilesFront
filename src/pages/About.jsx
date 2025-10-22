import { wrap, card, palette } from "../utils/styles.jsx";

export default function About() {
  return (
    <div style={{ ...wrap }}>
      <div style={{ textAlign: "center", margin: "8px 0 16px" }}>
        <h2 style={{ margin: 0 }}>
          Sobre <span style={{ color: "#2563eb" }}>Todo Útiles</span>
        </h2>
        <div style={{ color: palette.muted }}>
          Conectando la educación y la productividad desde 2005.
        </div>
      </div>

      {/* Historia + Imagen */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...card, padding: 16 }}>
          <h3>Nuestra Historia</h3>
          <p style={{ color: palette.muted }}>
            Desde nuestros humildes comienzos en 2005, hemos crecido hasta convertirnos en un proveedor líder de artículos escolares y de oficina.
            Nuestra misión es ofrecer productos de alta calidad que apoyen el aprendizaje y la productividad.
          </p>
        </div>
        <div style={{ ...card, padding: 16, minHeight: 180 }}>
          <img
            src="/libreria.jpg"
            alt="Nuestra historia"
            style={{ height: 180, width: "100%", objectFit: "cover", borderRadius: 12 }}
          />
        </div>
      </div>

      {/* Misión */}
      <div style={{ ...card, padding: 16, marginTop: 16, background: "#eef2ff", borderColor: "#e0e7ff" }}>
        <h3 style={{ textAlign: "center", marginTop: 0 }}>Misión</h3>
        <p style={{ color: palette.muted, textAlign: "center", margin: 0 }}>
          Empoderar a estudiantes, educadores y profesionales con herramientas necesarias para alcanzar sus metas.
        </p>
      </div>

      {/* Valores */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 16 }}>
        {["Calidad", "Innovación", "Integridad", "Servicio"].map((t) => (
          <div key={t} style={{ ...card, padding: 16 }}>
            <h4 style={{ marginTop: 0 }}>{t}</h4>
            <p style={{ color: palette.muted, fontSize: 14 }}>
              Nuestro compromiso con {t.toLowerCase()} guía cada interacción y producto que ofrecemos.
            </p>
          </div>
        ))}
      </div>

      {/* Equipo + Imagen */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ ...card, padding: 16 }}>
          <img
            src="/equipo.jpg"
            alt="Nuestro equipo"
            style={{ height: 220, width: "100%", objectFit: "cover", borderRadius: 12 }}
          />
        </div>
        <div style={{ ...card, padding: 16 }}>
          <h3>Nuestro Equipo</h3>
          <p style={{ color: palette.muted }}>
            Un equipo apasionado y experimentado, comprometido con la satisfacción del cliente.
          </p>
        </div>
      </div>
    </div>
  );
}