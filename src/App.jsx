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

const WHATSAPP_URL = getRuntimeEnv(
  "VITE_WHATSAPP_URL",
  "https://wa.me/573001112233?text=Hola%20BilAI%2C%20quiero%20conocer%20la%20plataforma."
);
const CONTACT_EMAIL = getRuntimeEnv("VITE_CONTACT_EMAIL", "hola@bilai.co");
const GA_MEASUREMENT_ID = getRuntimeEnv("VITE_GA_MEASUREMENT_ID", "");
const SITE_URL = getRuntimeEnv("VITE_SITE_URL", "").replace(/\/+$/, "");

const featureCards = [
  {
    icon: "inventory_2",
    title: "Inventario en tiempo real",
    description: "Cada venta ajusta el stock automáticamente. Cero desincronización entre canales.",
  },
  {
    icon: "insights",
    title: "Ventas centralizadas",
    description: "Todos tus canales en una sola vista con métricas accionables por cliente y periodo.",
  },
  {
    icon: "auto_awesome",
    title: "Reportes con IA",
    description: "Recomendaciones concretas sobre margen, rotación y flujo de caja. Menos análisis manual.",
  },
];

const solutions = [
  {
    title: "Empresas en crecimiento",
    text: "Escala facturación, inventario y reportes sin ampliar tu equipo administrativo. Más operación, mismo esfuerzo.",
  },
  {
    title: "Pymes y negocios establecidos",
    text: "Controla tu operación diaria con una plataforma estructurada, clara y lista para usar desde el día uno.",
  },
  {
    title: "Personas naturales",
    text: "Cumple tus obligaciones tributarias con una experiencia guiada y soporte disponible cuando lo necesites.",
  },
];

const steps = [
  {
    number: "01",
    title: "Configura tu operación",
    description:
      "Definimos contigo datos fiscales, catálogo de productos y flujos clave. Setup sólido desde el primer día.",
  },
  {
    number: "02",
    title: "Factura, vende y gestiona",
    description:
      "Emite facturas, registra ventas y controla inventario en tiempo real. Todo desde una sola interfaz.",
  },
  {
    number: "03",
    title: "Decide con inteligencia",
    description:
      "La IA analiza tu operación y entrega recomendaciones semanales para mejorar resultados comerciales.",
  },
];

const complianceItems = [
  "Flujos habilitados para cumplimiento con la Dian",
  "Controles automáticos para evitar errores de emisión",
  "Trazabilidad completa de facturas, inventario y reportes",
  "Soporte para equipos operativos y financieros",
];

const faqItems = [
  {
    question: "¿BilAI funciona para personas naturales, pymes y empresas?",
    answer:
      "Sí. BilAI está construida para adaptarse a cualquier escala de operación. Desde el profesional independiente hasta la empresa con múltiples sedes, con una experiencia clara desde el primer día.",
  },
  {
    question: "¿Cómo me ayuda BilAI a cumplir con la Dian?",
    answer:
      "BilAI integra la emisión de facturación electrónica con validaciones automáticas y trazabilidad completa. Cada comprobante se genera con los controles necesarios para reducir errores y mantener el historial ordenado.",
  },
  {
    question: "¿Necesito instalar algo para empezar?",
    answer:
      "No. Es una plataforma completamente web. Te registras en minutos y comienzas a operar sin instalaciones, dependencias técnicas ni configuraciones complejas.",
  },
  {
    question: "¿Puedo probar BilAI antes de contratar un plan?",
    answer:
      "Sí. Ofrecemos una prueba gratuita de 1 mes para que valides el ajuste con tu operación real antes de tomar una decisión.",
  },
];

const platformModules = [
  { icon: "receipt_long", label: "Facturación DIAN" },
  { icon: "inventory_2", label: "Inventario" },
  { icon: "insights", label: "Ventas" },
  { icon: "auto_awesome", label: "IA Analytics" },
  { icon: "gavel", label: "Cumplimiento fiscal" },
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
  const [openFaq, setOpenFaq] = useState(null);
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

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
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
            Facturación
          </a>
          <a href="#producto" onClick={closeMobileNav}>
            Producto
          </a>
          <a href="#soluciones" onClick={closeMobileNav}>
            Soluciones
          </a>
          <a href="#ia" onClick={closeMobileNav}>
            IA
          </a>
          <a href="#faq" onClick={closeMobileNav}>
            FAQ
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
        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="hero" id="inicio">
          <div className="hero-copy reveal">
            <p className="hero-kicker">Sistema comercial y fiscal · Colombia</p>
            <h1>Tu operación, unificada e inteligente.</h1>
            <p className="hero-lead">
              Facturación electrónica para la Dian, inventario en tiempo real, ventas centralizadas
              y análisis con IA. Todo conectado desde una sola plataforma.
            </p>
            <div className="hero-actions">
              <a className="btn-primary" href="#contacto">
                Solicitar demo
              </a>
              <a className="btn-secondary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Hablar por WhatsApp
              </a>
            </div>
            <ul className="hero-proof">
              <li>
                <span className="material-symbols-rounded">verified</span>
                Habilitado para cumplimiento con la Dian
              </li>
              <li>
                <span className="material-symbols-rounded">bolt</span>
                Sin instalaciones — operativo en horas
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
            <div className="platform-surface">
              <div className="ps-header">
                <div className="ps-status">
                  <span className="status-dot" />
                  BilAI Platform
                </div>
                <span className="ps-label">En tiempo real</span>
              </div>
              <div className="ps-metrics">
                <div className="ps-metric">
                  <span className="ps-metric-label">Facturas / mes</span>
                  <span className="ps-metric-value">2,847</span>
                  <span className="ps-metric-delta ps-metric-delta--up">+14%</span>
                </div>
                <div className="ps-metric">
                  <span className="ps-metric-label">Ingresos</span>
                  <span className="ps-metric-value">$84.2M</span>
                  <span className="ps-metric-delta ps-metric-delta--up">+8%</span>
                </div>
                <div className="ps-metric">
                  <span className="ps-metric-label">Stock activo</span>
                  <span className="ps-metric-value">1,340</span>
                  <span className="ps-metric-delta">SKUs</span>
                </div>
              </div>
              <div className="ps-modules">
                <div className="ps-module">
                  <span className="material-symbols-rounded">receipt_long</span>
                  <span className="ps-module-name">Facturación</span>
                  <span className="ps-module-status">DIAN activa</span>
                </div>
                <div className="ps-module">
                  <span className="material-symbols-rounded">inventory_2</span>
                  <span className="ps-module-name">Inventario</span>
                  <span className="ps-module-status">Sincronizado</span>
                </div>
                <div className="ps-module">
                  <span className="material-symbols-rounded">auto_awesome</span>
                  <span className="ps-module-name">IA Analytics</span>
                  <span className="ps-module-status ps-module-status--ai">Activa</span>
                </div>
              </div>
              <div className="ps-activity">
                <div className="ps-activity-item">
                  <span className="activity-dot activity-dot--green" />
                  <span className="activity-text">Factura FV-08471 validada por DIAN</span>
                  <span className="activity-time">2 min</span>
                </div>
                <div className="ps-activity-item">
                  <span className="activity-dot" />
                  <span className="activity-text">Stock Producto A ajustado: −12 uds</span>
                  <span className="activity-time">5 min</span>
                </div>
                <div className="ps-activity-item">
                  <span className="activity-dot activity-dot--blue" />
                  <span className="activity-text">Reporte semanal generado por IA</span>
                  <span className="activity-time">18 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PLATFORM BAR ──────────────────────────────────── */}
        <div className="platform-bar reveal">
          <div className="platform-bar-inner" aria-hidden="true">
            {platformModules.map((mod, i) => (
              <React.Fragment key={mod.label}>
                <div className="pbar-module">
                  <span className="material-symbols-rounded">{mod.icon}</span>
                  {mod.label}
                </div>
                {i < platformModules.length - 1 && (
                  <span className="pbar-connector">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── FACTURACIÓN ───────────────────────────────────── */}
        <section className="section section-soft reveal" id="facturacion-electronica">
          <div className="editorial-layout">
            <div className="editorial-copy">
              <p className="section-kicker">Facturación electrónica</p>
              <h2>Emite, valida y cumple con la Dian. Sin fricción.</h2>
              <p>
                La ruta más directa desde tu catálogo hasta el comprobante electrónico.
                Configuración en minutos, validaciones automáticas y trazabilidad total de
                cada documento emitido.
              </p>
              <ul className="feature-list">
                <li>Facturación electrónica habilitada para Colombia</li>
                <li>Validaciones automáticas antes del envío</li>
                <li>Notas crédito, débito y documentos de soporte</li>
                <li>Historial completo y descargable</li>
              </ul>
              <div className="section-inline-actions">
                <a className="btn-primary" href="/facturacion-electronica-colombia/">
                  Ver todo sobre facturación
                </a>
                <a className="btn-secondary" href="#contacto">
                  Solicitar demo
                </a>
              </div>
            </div>
            <div className="editorial-visual">
              <div className="invoice-card" aria-hidden="true">
                <div className="inv-status">
                  <span className="status-dot" />
                  Enviada a DIAN · Validada
                </div>
                <div className="inv-number">FV-2024-08471</div>
                <div className="inv-party">
                  <span className="inv-label">Para</span>
                  <strong>Empresa Cliente S.A.S.</strong>
                  <span className="inv-nit">NIT 900.123.456-7</span>
                </div>
                <div className="inv-lines">
                  <div className="inv-line">
                    <span>Servicio de consultoría</span>
                    <strong>$4.800.000</strong>
                  </div>
                  <div className="inv-line">
                    <span>IVA 19%</span>
                    <strong>$912.000</strong>
                  </div>
                </div>
                <div className="inv-total">
                  <span>Total</span>
                  <strong>$5.712.000 COP</strong>
                </div>
                <div className="inv-footer">
                  <span className="material-symbols-rounded">verified</span>
                  CUFE generado · Trazable
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUCTO ──────────────────────────────────────── */}
        <section className="section reveal" id="producto">
          <div className="section-head">
            <p className="section-kicker">Plataforma</p>
            <h2>Todos los módulos. Un solo sistema.</h2>
            <p>
              BilAI integra facturación, inventario, ventas y análisis en una arquitectura donde
              cada pieza informa a las demás. Sin saltar entre herramientas.
            </p>
          </div>
          <div className="feature-showcase">
            <article className="feature-hero-card">
              <span className="material-symbols-rounded">receipt_long</span>
              <h3>Facturación electrónica lista para la Dian</h3>
              <p>
                Emite comprobantes electrónicos con validaciones integradas. Diseñada para cumplir
                normativa colombiana desde el primer día, sin configuraciones técnicas complejas ni
                integraciones externas.
              </p>
            </article>
            <div className="feature-side-grid">
              {featureCards.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <span className="material-symbols-rounded">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOLUCIONES — DARK ─────────────────────────────── */}
        <section className="section section--dark reveal" id="soluciones">
          <div className="section-head">
            <p className="section-kicker">Para quién es BilAI</p>
            <h2>Diseñado para cada escala de negocio.</h2>
            <p>
              Desde el profesional independiente hasta la empresa con múltiples sedes.
              BilAI adapta su estructura a tu operación sin compromisos de escala.
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

        {/* ── IA ────────────────────────────────────────────── */}
        <section className="section section--ia reveal" id="ia">
          <div className="ia-intro">
            <p className="section-kicker">Inteligencia aplicada</p>
            <h2>De datos operativos a decisiones precisas.</h2>
            <p>
              La IA de BilAI convierte el rastro de tu operación diaria en recomendaciones
              concretas para mejorar margen, inventario y flujo de caja. Sin análisis manual.
            </p>
          </div>
          <div className="ia-steps-bar">
            {steps.map((step) => (
              <article className="ia-step" key={step.number}>
                <span className="ia-step-num">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
          <div className="ia-compliance">
            {complianceItems.map((item) => (
              <div className="compliance-tag" key={item}>
                <span className="material-symbols-rounded">check_circle</span>
                {item}
              </div>
            ))}
            <a className="btn-primary ia-cta" href="#contacto">
              Agendar diagnóstico
            </a>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section className="section section-soft reveal" id="faq">
          <div className="faq-layout">
            <div className="faq-intro">
              <p className="section-kicker">FAQ</p>
              <h2>Lo más preguntado antes de empezar.</h2>
              <p>Respuestas directas para que tomes la decisión con claridad.</p>
            </div>
            <div className="faq-list">
              {faqItems.map((item, i) => (
                <article
                  key={item.question}
                  className={`faq-item${openFaq === i ? " faq-item--open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{item.question}</span>
                    <span className="material-symbols-rounded faq-icon">
                      {openFaq === i ? "remove" : "add"}
                    </span>
                  </button>
                  {openFaq === i && <p className="faq-body">{item.answer}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACTO ──────────────────────────────────────── */}
        <section className="section contact-section reveal" id="contacto">
          <div className="contact-copy">
            <p className="section-kicker">Empecemos</p>
            <h2>Tu primera factura inteligente empieza aquí.</h2>
            <p>
              Cuéntanos tu operación y te ayudamos a iniciar con un plan claro para
              facturación, inventario, ventas y análisis.
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
              Correo electrónico
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
                placeholder="Cuéntanos tu operación actual"
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
          <p>BilAI · Plataforma comercial y fiscal para Colombia.</p>
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
