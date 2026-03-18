import React, { useEffect, useState } from "react";
import logo from "/bilailogocompleto.png";
import CookieConsentLayer from "./components/CookieConsentLayer";
import {
  DEFAULT_COOKIE_PREFERENCES,
  applyRuntimeCookiePermissions,
  getInitialCookieState,
  persistCookieConsent,
  sanitizeCookiePreferences,
  syncGoogleAnalyticsWithConsent,
} from "./lib/privacy";
import { getRuntimeEnv } from "./runtimeConfig";

const LOGIN_URL = getRuntimeEnv("VITE_LOGIN_URL", "/login");
LOGIN_URL.replace(/"/g, "");
console.log("LOGIN_URL:", LOGIN_URL);
const WHATSAPP_URL = getRuntimeEnv(
  "VITE_WHATSAPP_URL",
  "https://wa.me/573001112233?text=Hola%20BilAI%2C%20quiero%20conocer%20la%20plataforma."
);
const CONTACT_EMAIL = getRuntimeEnv("VITE_CONTACT_EMAIL", "hola@bilai.co");
const GA_MEASUREMENT_ID = getRuntimeEnv("VITE_GA_MEASUREMENT_ID", "");
const SITE_URL = getRuntimeEnv("VITE_SITE_URL", "").replace(/\/+$/, "");

const featureCards = [
  {
    icon: "receipt_long",
    title: "Facturación electrónica lista para la Dian",
    description:
      "Emite comprobantes electrónicos en minutos, con validaciones inteligentes para cumplir normativa sin fricción.",
  },
  {
    icon: "inventory_2",
    title: "Inventario conectado en tiempo real",
    description:
      "Cada venta impacta existencias automáticamente para que tomes decisiones con stock actualizado siempre.",
  },
  {
    icon: "insights",
    title: "Ventas que se entienden mejor",
    description:
      "Centraliza tus canales y analiza desempeño por cliente, periodo y producto desde una sola vista.",
  },
  {
    icon: "auto_awesome",
    title: "Reportes impulsados con IA",
    description:
      "Obtén recomendaciones accionables para mejorar margen, rotación y flujo de caja con menos esfuerzo manual.",
  },
];

const solutions = [
  {
    title: "Empresas en crecimiento",
    text: "Escala procesos de facturación, inventario y reporte sin ampliar equipos administrativos.",
  },
  {
    title: "Negocios y pymes",
    text: "Controla operación diaria con una plataforma simple, clara y lista para usar desde el día uno.",
  },
  {
    title: "Personas naturales",
    text: "Cumple tus obligaciones tributarias con una experiencia guiada y soporte cercano cuando lo necesites.",
  },
];

const steps = [
  {
    number: "01",
    title: "Configura tu operación",
    description:
      "Definimos contigo datos fiscales, catálogo y flujos clave para empezar con estructura sólida.",
  },
  {
    number: "02",
    title: "Factura y vende desde un solo lugar",
    description:
      "Gestiona facturas, ventas e inventario en tiempo real sin saltar entre herramientas.",
  },
  {
    number: "03",
    title: "Toma decisiones con IA",
    description:
      "Usa reportes inteligentes para reducir reprocesos y mejorar resultados comerciales cada semana.",
  },
];

const complianceItems = [
  "Flujos diseñados para cumplimiento con la Dian",
  "Controles automáticos para evitar errores frecuentes",
  "Trazabilidad completa de ventas, inventarios y reportes",
  "Soporte para equipos operativos y financieros",
];

const faqItems = [
  {
    question: "¿BilAI sirve para personas naturales, pymes y empresas?",
    answer:
      "Sí. BilAI está diseñada para adaptarse a operaciones pequeñas y grandes, con una experiencia simple desde el primer día.",
  },
  {
    question: "¿Cómo me ayuda BilAI con la Dian?",
    answer:
      "BilAI simplifica la emisión de facturación electrónica y el control operativo para ayudarte a cumplir con la Dian con menos fricción.",
  },
  {
    question: "¿Necesito instalar algo para comenzar?",
    answer:
      "No. Es una plataforma web. Te registras en pocos clics y comienzas a operar sin instalaciones ni procesos técnicos complejos.",
  },
  {
    question: "¿Puedo probar BilAI antes de contratar?",
    answer:
      "Sí. Puedes iniciar con una prueba gratis de 1 mes para validar el ajuste con tu negocio.",
  },
];

const heroMotionPrimary = [
  "Factura emitida",
  "Inventario sincronizado",
  "Venta conciliada",
  "Reporte inteligente",
];

const heroMotionSecondary = [
  "Dian validada",
  "Flujo de caja al día",
  "Riesgo tributario bajo",
  "Operación sin fricción",
];

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(getInitialCookieState);
  const [cookieDraft, setCookieDraft] = useState({ ...DEFAULT_COOKIE_PREFERENCES });
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const runtimeSiteUrl =
    SITE_URL || (typeof window !== "undefined" ? window.location.origin.replace(/\/+$/, "") : "");

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BilAI",
    ...(runtimeSiteUrl
      ? {
          url: runtimeSiteUrl,
          logo: `${runtimeSiteUrl}/bilailogocompleto.png`,
        }
      : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT_EMAIL,
        areaServed: "CO",
        availableLanguage: ["es"],
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BilAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Software de facturación electrónica para Colombia con inventarios, ventas y reportes con IA.",
    ...(runtimeSiteUrl ? { url: runtimeSiteUrl } : {}),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const seoSchemas = [orgSchema, softwareSchema, faqSchema];

  useEffect(() => {
    applyRuntimeCookiePermissions(cookieConsent);
  }, [cookieConsent]);

  useEffect(() => {
    syncGoogleAnalyticsWithConsent({
      ...cookieConsent,
      measurementId: GA_MEASUREMENT_ID,
    });
  }, [cookieConsent]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mobileBreakpoint = window.matchMedia("(max-width: 760px)");
    const handleBreakpointChange = (event) => {
      if (!event.matches) {
        setIsMobileNavOpen(false);
      }
    };

    if (typeof mobileBreakpoint.addEventListener === "function") {
      mobileBreakpoint.addEventListener("change", handleBreakpointChange);
      return () => mobileBreakpoint.removeEventListener("change", handleBreakpointChange);
    }

    mobileBreakpoint.addListener(handleBreakpointChange);
    return () => mobileBreakpoint.removeListener(handleBreakpointChange);
  }, []);

  const setCookieConsentAndClose = (preferences, status) => {
    const normalizedPreferences = sanitizeCookiePreferences(preferences);
    const nextState = {
      hasDecision: true,
      preferences: normalizedPreferences,
    };

    setCookieConsent(nextState);
    setShowCookieSettings(false);
    persistCookieConsent({
      preferences: normalizedPreferences,
      status,
    });
  };

  const openCookieSettings = () => {
    setCookieDraft({ ...cookieConsent.preferences });
    setShowCookieSettings(true);
  };

  const closeCookieSettings = () => {
    setShowCookieSettings(false);
  };

  const toggleDraftPreference = (key) => {
    setCookieDraft((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const acceptAllCookies = () => {
    setCookieConsentAndClose(
      {
        necessary: true,
        analytics: true,
        marketing: true,
      },
      "accepted_all"
    );
  };

  const rejectOptionalCookies = () => {
    setCookieConsentAndClose(
      {
        necessary: true,
        analytics: false,
        marketing: false,
      },
      "necessary_only"
    );
  };

  const saveCustomCookies = () => {
    setCookieConsentAndClose(cookieDraft, "customized");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent("Quiero iniciar con BilAI");
    const body = encodeURIComponent(
      `Nombre: ${formData.name}\nCorreo: ${formData.email}\nEmpresa: ${formData.company}\n\nNecesidad:\n${formData.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <div className="site-shell">
      {seoSchemas.map((schema, index) => (
        <script
          key={`home-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <header className="site-header">
        <a href="#inicio" className="brand-link" aria-label="BilAI inicio">
          <img src={logo} alt="BilAI" className="brand-logo" />
        </a>
        <button
          type="button"
          className="header-menu-toggle"
          aria-expanded={isMobileNavOpen}
          aria-controls="site-main-nav"
          aria-label={isMobileNavOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={handleMobileNavToggle}
        >
          <span className="material-symbols-rounded">{isMobileNavOpen ? "close" : "menu"}</span>
        </button>
        <nav
          id="site-main-nav"
          className={`site-nav${isMobileNavOpen ? " is-open" : ""}`}
          aria-label="Navegación principal"
        >
          <a href="#facturacion-electronica" onClick={closeMobileNav}>
            Facturación electrónica
          </a>
          <a href="#producto" onClick={closeMobileNav}>
            Producto
          </a>
          <a href="#soluciones" onClick={closeMobileNav}>
            Soluciones
          </a>
          <a href="#faq" onClick={closeMobileNav}>
            FAQ
          </a>
          <a href="#ia" onClick={closeMobileNav}>
            IA
          </a>
          <a href="#contacto" onClick={closeMobileNav}>
            Contacto
          </a>
        </nav>
        <div className="header-actions">
          <a className="header-login" href={LOGIN_URL}>
            Iniciar sesión
          </a>
          <a className="header-cta" href="#contacto">
            Solicitar demo
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy reveal">
            <p className="hero-kicker">Fintech colombiana para empresas y personas naturales</p>
            <h1>Factura fácil. Cumple con la Dian. Gestiona todo con IA.</h1>
            <p className="hero-lead">
              BilAI transforma cómo administras facturación electrónica, inventarios, ventas y
              reportes para que tu operación sea más simple, más rápida y más confiable.
            </p>
            <div className="hero-motion reveal delay-2" aria-hidden="true">
              <div className="hero-motion-head">
                <span className="material-symbols-rounded">auto_awesome</span>
                <p>Operación inteligente en movimiento</p>
              </div>
              <div className="hero-motion-marquee">
                <div className="hero-motion-row">
                  {[...heroMotionPrimary, ...heroMotionPrimary].map((item, index) => (
                    <span className="motion-pill" key={`primary-${item}-${index}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hero-motion-marquee">
                <div className="hero-motion-row hero-motion-row--reverse">
                  {[...heroMotionSecondary, ...heroMotionSecondary].map((item, index) => (
                    <span className="motion-pill motion-pill--alt" key={`secondary-${item}-${index}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="hero-actions">
              <a className="btn-primary" href="#contacto">
                Quiero iniciar
              </a>
              <a className="btn-secondary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Hablar por WhatsApp
              </a>
            </div>
            <ul className="hero-proof">
              <li>
                <span className="material-symbols-rounded">verified</span>
                Cumplimiento tributario asistido
              </li>
              <li>
                <span className="material-symbols-rounded">bolt</span>
                Implementación ágil para cualquier tamaño de negocio
              </li>
              <li>
                <span className="material-symbols-rounded">shield</span>
                Plataforma segura y escalable
              </li>
            </ul>
          </div>

          <div className="hero-visual reveal delay-1" aria-hidden="true">
            <div className="orb orb-a" />
            <div className="orb orb-b" />
            <div className="product-frame">
              <div className="frame-head">
                <strong>BilAI Platform</strong>
                <span>Operación en tiempo real</span>
              </div>
              <div className="frame-grid">
                <article>
                  <span className="material-symbols-rounded">receipt</span>
                  <h3>Factura electrónica</h3>
                  <p>Emitida y validada para la Dian.</p>
                </article>
                <article>
                  <span className="material-symbols-rounded">inventory_2</span>
                  <h3>Inventario vivo</h3>
                  <p>Stock ajustado con cada venta.</p>
                </article>
                <article>
                  <span className="material-symbols-rounded">insights</span>
                  <h3>Ventas inteligentes</h3>
                  <p>Métricas accionables por canal.</p>
                </article>
                <article>
                  <span className="material-symbols-rounded">auto_awesome</span>
                  <h3>Reportes con IA</h3>
                  <p>Recomendaciones para crecer.</p>
                </article>
              </div>
            </div>
            <div className="floating-note note-top">Listo para cumplimiento con la Dian</div>
            <div className="floating-note note-bottom">Soporte para equipos de cualquier tamaño</div>
          </div>
        </section>

        <section className="signal-bar reveal">
          <p>Una sola plataforma para ventas, facturación, inventario y reportes confiables.</p>
        </section>

        <section className="section section-soft reveal" id="facturacion-electronica">
          <div className="section-head">
            <p className="section-kicker">Facturación Electrónica</p>
            <h2>La forma más simple de facturar electrónicamente y cumplir con la Dian</h2>
            <p>
              Regístrate en pocos clics, sin instalación, y empieza a operar con facturación
              electrónica, ventas, inventario y reportes desde una sola plataforma.
            </p>
            <div className="section-inline-actions">
              <a className="btn-secondary" href="/facturacion-electronica-colombia/">
                Ver página de facturación electrónica
              </a>
            </div>
          </div>
          <div className="seo-grid">
            <article className="seo-card">
              <h3>Cumplimiento con la Dian, sin complicaciones</h3>
              <p>
                Estructura y validaciones pensadas para ayudarte a operar correctamente desde el
                primer día.
              </p>
            </article>
            <article className="seo-card">
              <h3>Onboarding rápido para empezar hoy</h3>
              <p>
                Crea tu cuenta, configura lo esencial y empieza a emitir sin procesos largos ni
                dependencias técnicas.
              </p>
            </article>
            <article className="seo-card">
              <h3>Prueba gratis de 1 mes</h3>
              <p>
                Evalúa BilAI en tu operación real y decide con datos antes de avanzar a un plan.
              </p>
            </article>
          </div>
        </section>

        <section className="section reveal" id="producto">
          <div className="section-head">
            <p className="section-kicker">Producto</p>
            <h2>Todo lo que necesitas para operar sin fricciones</h2>
            <p>
              Diseñamos BilAI para simplificar la gestión comercial y tributaria con una
              experiencia clara, moderna y accionable.
            </p>
          </div>
          <div className="feature-grid">
            {featureCards.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span className="material-symbols-rounded">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-soft reveal" id="soluciones">
          <div className="section-head">
            <p className="section-kicker">Soluciones</p>
            <h2>Hecho para cada etapa de crecimiento</h2>
            <p>
              Desde profesionales independientes hasta empresas consolidadas: BilAI acompaña tu
              evolución con procesos simples y control total.
            </p>
          </div>
          <div className="solution-grid">
            {solutions.map((item) => (
              <article className="solution-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal" id="ia">
          <div className="ai-layout">
            <div className="ai-panel">
              <p className="section-kicker">IA aplicada al negocio</p>
              <h2>De datos sueltos a decisiones precisas</h2>
              <p>
                Nuestra IA convierte datos operativos en recomendaciones prácticas para optimizar
                ventas, inventario y cumplimiento tributario.
              </p>
              <div className="step-grid">
                {steps.map((step) => (
                  <article className="step-card" key={step.number}>
                    <span>{step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="compliance-panel">
              <h3>Compromiso con la Dian y control operativo</h3>
              <ul>
                {complianceItems.map((item) => (
                  <li key={item}>
                    <span className="material-symbols-rounded">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a className="btn-primary full" href="#contacto">
                Agendar diagnóstico
              </a>
            </aside>
          </div>
        </section>

        <section className="section section-soft reveal" id="faq">
          <div className="section-head">
            <p className="section-kicker">FAQ</p>
            <h2>Respuestas rápidas antes de comenzar</h2>
          </div>
          <div className="faq-grid">
            {faqItems.map((item) => (
              <article className="faq-card" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact-section reveal" id="contacto">
          <div className="contact-copy">
            <p className="section-kicker">Hablemos</p>
            <h2>Capta más valor desde tu primera factura</h2>
            <p>
              Cuéntanos tu operación y te ayudamos a iniciar con un plan claro para facturación,
              inventarios, ventas y reportes.
            </p>
            <div className="contact-links">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <span className="material-symbols-rounded">chat</span>
                WhatsApp comercial
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <span className="material-symbols-rounded">mail</span>
                {CONTACT_EMAIL}
              </a>
              <a href={LOGIN_URL}>
                <span className="material-symbols-rounded">login</span>
                Ir al login de clientes
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Nombre
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </label>
            <label>
              Correo
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@empresa.com"
                required
              />
            </label>
            <label>
              Empresa o negocio
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Nombre de tu empresa"
              />
            </label>
            <label>
              ¿Qué quieres resolver con BilAI?
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Cuéntanos tu contexto"
                required
              />
            </label>
            <button type="submit" className="btn-primary full">
              Quiero que me contacten
            </button>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <img src={logo} alt="BilAI" />
        <div className="footer-meta">
          <p>BilAI | Fintech Colombiana para facturación electrónica, inventarios, ventas y reportes.</p>
          <button type="button" className="footer-cookie-btn" onClick={openCookieSettings}>
            Preferencias de cookies
          </button>
        </div>
      </footer>

      <CookieConsentLayer
        hasDecision={cookieConsent.hasDecision}
        showSettings={showCookieSettings}
        cookieDraft={cookieDraft}
        onOpenSettings={openCookieSettings}
        onCloseSettings={closeCookieSettings}
        onToggleDraft={toggleDraftPreference}
        onRejectOptional={rejectOptionalCookies}
        onAcceptAll={acceptAllCookies}
        onSaveCustom={saveCustomCookies}
      />
    </div>
  );
}

export default App;
