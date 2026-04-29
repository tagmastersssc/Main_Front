import React, { useEffect, useState } from "react";
import logo from "/bilai-brand-wordmark-cropped.png";
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

const heroSignals = ["Dian al día", "Inventario vivo", "Ventas visibles", "Decisión asistida"];

const statCards = [
  {
    value: 4,
    suffix: " capas",
    label: "conectadas en una sola plataforma",
    detail: "Facturación, ventas, inventario y reportes en una superficie coherente.",
  },
  {
    value: 1,
    suffix: " flujo",
    label: "para operar, cumplir y decidir mejor",
    detail: "Menos herramientas sueltas, más claridad para el equipo y la gerencia.",
  },
  {
    value: 30,
    suffix: " días",
    label: "de prueba para validar el ajuste",
    detail: "Comprueba el valor sobre tu operación real antes de avanzar a un plan.",
  },
];

const storyMoments = [
  {
    step: "01",
    title: "Registra ventas y comprobantes en un mismo flujo",
    description:
      "La operación diaria entra una sola vez y queda lista para emitir, controlar y analizar sin reprocesos ni cruces manuales.",
  },
  {
    step: "02",
    title: "Mantén inventario y cumplimiento sincronizados",
    description:
      "Cada movimiento actualiza stock y contexto fiscal para reducir fricción, errores y pasos innecesarios antes de emitir.",
  },
  {
    step: "03",
    title: "Convierte el dato operativo en lectura gerencial",
    description:
      "El sistema organiza señales de ventas, inventario y documentos para priorizar acciones con mejor criterio y más contexto.",
  },
];

const platformModules = [
  {
    icon: "receipt_long",
    eyebrow: "Cumplimiento",
    title: "Facturación electrónica lista para operar sin fricción",
    description:
      "Emite con validaciones útiles y una base operativa pensada para cumplir con la Dian sin romper el ritmo del negocio.",
  },
  {
    icon: "point_of_sale",
    eyebrow: "Operación comercial",
    title: "Ventas y documentos dentro del mismo sistema",
    description:
      "Cada venta deja trazabilidad, alimenta indicadores y mantiene el negocio visible sin depender de procesos paralelos.",
  },
  {
    icon: "inventory_2",
    eyebrow: "Control operativo",
    title: "Inventario conectado con la realidad del día a día",
    description:
      "El stock se mueve con la operación real, evitando descoordinaciones entre lo que se vende, lo que se factura y lo que queda disponible.",
  },
  {
    icon: "monitoring",
    eyebrow: "Lectura ejecutiva",
    title: "Reportes que convierten datos en decisiones",
    description:
      "Lecturas comerciales y operativas más limpias para detectar qué está funcionando, qué está drenando margen y dónde intervenir primero.",
  },
];

const solutions = [
  {
    title: "Pymes en crecimiento que necesitan ordenar ventas, inventario y cumplimiento",
    text: "BilAI reemplaza hojas sueltas y procesos paralelos por un flujo más claro para emitir, vender y controlar.",
  },
  {
    title: "Equipos administrativos que necesitan emitir mejor y reducir reprocesos",
    text: "La plataforma organiza la captura del dato y las validaciones para que cumplir con la Dian no frene la operación.",
  },
  {
    title: "Negocios que quieren empezar rápido sin montar una operación compleja",
    text: "Activa la plataforma en pocos pasos y empieza a trabajar con una base más ordenada desde el primer día.",
  },
];

const intelligenceHighlights = [
  {
    title: "Señales comerciales más rápidas",
    text: "Detecta cambios en ventas, periodos y movimientos con una lectura más útil que una tabla estática.",
  },
  {
    title: "Menos trabajo manual para entender qué está pasando",
    text: "BilAI organiza el dato operativo para que el equipo pueda leerlo mejor, no solo capturarlo.",
  },
  {
    title: "IA aplicada con intención, no como decoración",
    text: "La capa de inteligencia está pensada para ayudarte a ver mejor el negocio y decidir con mayor precisión.",
  },
];

const complianceItems = [
  "Controles previos para reducir errores antes de emitir o registrar.",
  "Trazabilidad entre ventas, inventario y reportes para no perder contexto.",
  "Lectura más clara para equipos operativos, administrativos y gerenciales.",
  "Una base útil para actuar antes, no solo para revisar después.",
];

const faqItems = [
  {
    question: "¿BilAI sirve para personas naturales, pymes y empresas?",
    answer:
      "Sí. BilAI está diseñada para adaptarse a operaciones pequeñas y grandes, con una experiencia simple de activar y sólida para crecer.",
  },
  {
    question: "¿Cómo me ayuda BilAI con la Dian?",
    answer:
      "BilAI organiza la emisión y el control operativo para que cumplir con la Dian se sienta más claro, menos manual y mejor integrado al negocio.",
  },
  {
    question: "¿Necesito instalar algo para comenzar?",
    answer:
      "No. Es una plataforma web. Te registras, configuras lo esencial y puedes comenzar a operar sin instalaciones ni dependencias técnicas complejas.",
  },
  {
    question: "¿Puedo probar BilAI antes de contratar?",
    answer:
      "Sí. Puedes iniciar con una prueba gratis de 1 mes para validar el ajuste con tu operación antes de tomar una decisión.",
  },
];

function AnimatedStat({ value, suffix, label, detail }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId;
    let startTime;

    const step = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [value]);

  return (
    <article className="stat-card" data-reveal>
      <strong>
        {displayValue}
        <span>{suffix}</span>
      </strong>
      <h3>{label}</h3>
      <p>{detail}</p>
    </article>
  );
}

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
          logo: `${runtimeSiteUrl}/bilai-brand-wordmark-cropped.png`,
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
      "Plataforma web para facturación electrónica en Colombia con inventarios, ventas y reportes impulsados con IA.",
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
    } else {
      mobileBreakpoint.addListener(handleBreakpointChange);
    }

    return () => {
      if (typeof mobileBreakpoint.removeEventListener === "function") {
        mobileBreakpoint.removeEventListener("change", handleBreakpointChange);
      } else {
        mobileBreakpoint.removeListener(handleBreakpointChange);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
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

      <header className="site-header site-header--calibrated">
        <a href="#inicio" className="brand-link brand-link--full" aria-label="BilAI inicio">
          <img src={logo} alt="BilAI" className="brand-logo brand-logo--full" />
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

      <main className="site-main">
        <section className="hero hero--viewport" id="inicio">
          <div className="hero-copy hero-copy--viewport" data-reveal>
            <p className="hero-kicker">De datos a decisiones, en tiempo real</p>
            <h1>Control comercial y fiscal para decidir con claridad.</h1>
            <p className="hero-lead">
              BilAI conecta facturación electrónica, inventario, ventas y reportes en una plataforma
              precisa y elegante, diseñada para ayudarte a operar mejor y leer el negocio con más control.
            </p>
            <div className="hero-actions">
              <a className="btn-primary" href="#contacto">
                Quiero iniciar
              </a>
              <a className="btn-secondary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Hablar por WhatsApp
              </a>
            </div>
            <div className="hero-proofline">
              <span className="hero-proof-label">BilAI Signal Layer</span>
              <div className="hero-proof-marquee" aria-hidden="true">
                <div className="hero-proof-track">
                  {[...heroSignals, ...heroSignals].map((signal, index) => (
                    <span className="proof-chip" key={`${signal}-${index}`}>
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hero-system hero-system--viewport" data-reveal>
            <div className="system-shell system-shell--viewport">
              <div className="system-topbar">
                <div>
                  <strong>BilAI control surface</strong>
                  <span>Facturación, operación y lectura gerencial</span>
                </div>
                <p>Plataforma web lista para producir</p>
              </div>
              <div className="system-main-grid">
                <article className="system-command-card">
                  <div className="system-command-stage">
                    <div className="system-stage-bar">
                      <span>Evento operativo</span>
                      <strong>Una venta actualiza todo el sistema</strong>
                    </div>
                    <div className="system-stage-grid">
                      <article className="system-stage-tile">
                        <small>01</small>
                        <strong>Factura emitida</strong>
                        <p>Validaciones listas para producir sin separar la operación del cumplimiento.</p>
                      </article>
                      <article className="system-stage-tile">
                        <small>02</small>
                        <strong>Stock ajustado</strong>
                        <p>Inventario sincronizado al instante con cada movimiento confirmado.</p>
                      </article>
                      <article className="system-stage-tile system-stage-tile--wide">
                        <small>03</small>
                        <strong>Lectura gerencial activada</strong>
                        <p>La venta alimenta señales comerciales y operativas para decidir con más contexto.</p>
                      </article>
                    </div>
                  </div>
                  <div className="system-command-copy">
                    <span>Core layer</span>
                    <h2>Opera, cumple y decide desde una sola base.</h2>
                  </div>
                </article>

                <div className="system-side-stack">
                  <article className="system-mini-card system-mini-card--ice">
                    <span className="material-symbols-rounded">receipt_long</span>
                    <strong>Facturación con criterio operativo</strong>
                    <p>Emitir correctamente sin separar lo fiscal de lo comercial.</p>
                  </article>
                  <article className="system-mini-card">
                    <span className="material-symbols-rounded">inventory_2</span>
                    <strong>Inventario que responde al movimiento real</strong>
                    <p>Lo que vendes, lo que facturas y lo que queda disponible se mantiene alineado.</p>
                  </article>
                  <article className="system-mini-card system-mini-card--mint">
                    <span className="material-symbols-rounded">monitoring</span>
                    <strong>Señales de negocio más rápidas</strong>
                    <p>Menos intuición ciega, más contexto para actuar con precisión.</p>
                  </article>
                </div>
              </div>
              <div className="system-floor">
                <p>BilAI no es solo una herramienta para emitir. Es una capa operativa para vender, cumplir y decidir con más control.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-band" data-reveal>
          {statCards.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </section>

        <section className="narrative-section narrative-section--compact section-shell" id="facturacion-electronica">
          <div className="narrative-intro narrative-intro--split" data-reveal>
            <div className="section-head-main">
              <p className="section-kicker">Facturación electrónica</p>
              <h2>Facturación electrónica conectada con la operación real del negocio.</h2>
              <p>
                Emitir bien importa, pero el valor aparece cuando cada documento alimenta inventario, ventas y lectura gerencial sin pasos paralelos.
              </p>
            </div>
            <aside className="section-head-aside">
              <span>Un solo flujo</span>
              <p>Registro, emisión y lectura operativa dentro de una misma base, sin procesos paralelos ni dobles capturas.</p>
              <div className="section-inline-actions">
                <a className="btn-secondary" href="/facturacion-electronica-colombia/">
                  Ver página de facturación electrónica
                </a>
              </div>
            </aside>
          </div>
          <div className="story-layout">
            <aside className="story-anchor" data-reveal>
              <span className="story-anchor-line" />
              <strong>Del documento a la decisión</strong>
              <p>Tres pasos para convertir emisión, control y lectura del negocio en un solo flujo.</p>
            </aside>
            <div className="story-stack">
              {storyMoments.map((moment, index) => (
                <article
                  className="story-card"
                  key={moment.step}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 0.08}s` }}
                >
                  <span className="story-step">{moment.step}</span>
                  <h3>{moment.title}</h3>
                  <p>{moment.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell platform-section platform-section--compact" id="producto">
          <div className="section-head section-head--split" data-reveal>
            <div className="section-head-main">
              <p className="section-kicker">Producto</p>
              <h2>Una plataforma que conecta cumplimiento, operación y lectura comercial.</h2>
              <p>
                Cada módulo resuelve una parte crítica del negocio, pero gana valor cuando trabaja conectado con los demás.
              </p>
            </div>
            <aside className="section-head-aside">
              <span>4 módulos conectados</span>
              <p>Facturación, ventas, inventario y reportes comparten contexto para que la operación no dependa de herramientas sueltas.</p>
            </aside>
          </div>
          <div className="platform-grid">
            {platformModules.map((module, index) => (
              <article
                className="platform-card"
                key={module.title}
                data-reveal
                style={{ "--reveal-delay": `${index * 0.07}s` }}
              >
                <div className="platform-card-head">
                  <span className="material-symbols-rounded">{module.icon}</span>
                  <p>{module.eyebrow}</p>
                </div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell solutions-section" id="soluciones">
          <div className="section-head section-head--split" data-reveal>
            <div className="section-head-main">
              <p className="section-kicker">Soluciones</p>
              <h2>BilAI se adapta a distintas operaciones sin perder claridad ni control.</h2>
              <p>
                La plataforma cambia según el ritmo del negocio, pero mantiene la misma base: emitir mejor, operar con más orden y decidir con mejor información.
              </p>
            </div>
            <aside className="section-head-aside">
              <span>Distintos ritmos, misma base</span>
              <p>La misma plataforma sirve para ordenar una pyme, profesionalizar un equipo administrativo o arrancar una operación nueva sin complejidad extra.</p>
            </aside>
          </div>
          <div className="solutions-grid">
            {solutions.map((item, index) => (
              <article
                className="solution-panel"
                key={item.title}
                data-reveal
                style={{ "--reveal-delay": `${index * 0.08}s` }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="intelligence-section section-shell" id="ia">
          <div className="intelligence-shell">
            <div className="intelligence-copy" data-reveal>
              <p className="section-kicker">IA aplicada al negocio</p>
              <h2>IA para leer mejor el negocio, no solo para mostrar datos.</h2>
              <p>
                BilAI organiza señales comerciales y operativas para ayudarte a detectar cambios, priorizar acciones y decidir con más rapidez.
              </p>
              <div className="intelligence-highlights">
                {intelligenceHighlights.map((item, index) => (
                  <article
                    className="intelligence-card"
                    key={item.title}
                    data-reveal
                    style={{ "--reveal-delay": `${index * 0.08}s` }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="intelligence-panel" data-reveal>
              <h3>Control operativo y cumplimiento con una lectura más visible</h3>
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

        <section className="section-shell faq-section" id="faq">
          <div className="section-head section-head--split" data-reveal>
            <div className="section-head-main">
              <p className="section-kicker">FAQ</p>
              <h2>Respuestas claras antes de comenzar</h2>
            </div>
            <aside className="section-head-aside">
              <span>Lo esencial primero</span>
              <p>Una vista rápida de lo que más suele preguntarse antes de activar la plataforma o iniciar la prueba.</p>
            </aside>
          </div>
          <div className="faq-grid">
            {faqItems.map((item, index) => (
              <article className="faq-card" key={item.question} data-reveal style={{ "--reveal-delay": `${index * 0.06}s` }}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell contact-section" id="contacto">
          <div className="contact-copy" data-reveal>
            <p className="section-kicker">Hablemos</p>
            <h2>Conversemos sobre tu operación y pongamos la base correcta desde el inicio.</h2>
            <p>
              Cuéntanos cómo facturas, vendes y controlas hoy. Te mostramos cómo empezar con una base más clara para cumplimiento, inventario y reportes.
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

          <form className="contact-form" onSubmit={handleSubmit} data-reveal>
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
          <p>BilAI | Plataforma para facturación electrónica, inventario, ventas y reportes con una lectura comercial y fiscal más clara, precisa y accionable.</p>
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
