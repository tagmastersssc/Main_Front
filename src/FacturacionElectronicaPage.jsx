import { useEffect, useMemo, useState } from "react";
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

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL || "http://localhost:5173";
const WHATSAPP_URL =
  import.meta.env.VITE_WHATSAPP_URL ||
  "https://wa.me/573001112233?text=Hola%20BilAI%2C%20quiero%20conocer%20la%20plataforma.";
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "hola@bilai.co";
const SITE_URL = (import.meta.env.VITE_SITE_URL || "").trim().replace(/\/+$/, "");
const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();

const valueProps = [
  {
    title: "Cumplimiento DIAN con menos fricción",
    text: "Automatiza validaciones clave para emitir factura electrónica reduciendo errores operativos.",
  },
  {
    title: "Facturación para pymes y empresas",
    text: "Escala desde operaciones pequeñas hasta volúmenes altos sin cambiar de plataforma.",
  },
  {
    title: "Inventario y ventas sincronizados",
    text: "Cada documento impacta stock y reportes en tiempo real para una gestión comercial más precisa.",
  },
];

const workflowSteps = [
  "Configura datos fiscales, catálogo y reglas de operación.",
  "Emite facturas electrónicas y controla ventas en un mismo flujo.",
  "Analiza reportes con IA para mejorar margen y rotación.",
];

const faqItems = [
  {
    question: "¿BilAI es un software de facturación electrónica válido para Colombia?",
    answer:
      "BilAI está diseñado para operar facturación electrónica alineada con necesidades de cumplimiento en Colombia y procesos tributarios asociados a DIAN.",
  },
  {
    question: "¿Puedo usar BilAI si hoy manejo Excel o procesos manuales?",
    answer:
      "Sí. BilAI está pensado para simplificar la transición desde procesos manuales y centralizar facturación, inventario y ventas en una sola operación.",
  },
  {
    question: "¿La plataforma sirve solo para empresas grandes?",
    answer:
      "No. BilAI está preparado para personas naturales, pymes y empresas con estructuras comerciales de mayor tamaño.",
  },
];

const upsertMeta = (selector, createElement) => {
  if (typeof document === "undefined") {
    return null;
  }

  const existing = document.head.querySelector(selector);
  if (existing) {
    return existing;
  }

  const element = createElement();
  document.head.appendChild(element);
  return element;
};

const setSeoMetadata = ({ pageUrl }) => {
  if (typeof document === "undefined") {
    return;
  }

  const title = "Facturación Electrónica Colombia para Empresas y Pymes | BilAI";
  const description =
    "Landing de facturación electrónica en Colombia: cumple DIAN, controla ventas, inventario y reportes con IA en BilAI.";
  const canonicalUrl = pageUrl ? `${pageUrl}/facturacion-electronica-colombia/` : "";
  const imageUrl = pageUrl ? `${pageUrl}/bilailogocompleto.png` : "";

  document.title = title;

  const descriptionMeta = upsertMeta('meta[name="description"]', () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    return meta;
  });
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", description);
  }

  if (canonicalUrl) {
    const canonicalLink = document.head.querySelector('link[rel="canonical"]') || document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    canonicalLink.setAttribute("href", canonicalUrl);
    if (!canonicalLink.parentNode) {
      document.head.appendChild(canonicalLink);
    }
  }

  const ogTitle = upsertMeta('meta[property="og:title"]', () => {
    const meta = document.createElement("meta");
    meta.setAttribute("property", "og:title");
    return meta;
  });
  if (ogTitle) {
    ogTitle.setAttribute("content", title);
  }

  const ogDescription = upsertMeta('meta[property="og:description"]', () => {
    const meta = document.createElement("meta");
    meta.setAttribute("property", "og:description");
    return meta;
  });
  if (ogDescription) {
    ogDescription.setAttribute("content", description);
  }

  if (canonicalUrl) {
    const ogUrl = upsertMeta('meta[property="og:url"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:url");
      return meta;
    });
    if (ogUrl) {
      ogUrl.setAttribute("content", canonicalUrl);
    }
  }

  if (imageUrl) {
    const ogImage = upsertMeta('meta[property="og:image"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:image");
      return meta;
    });
    if (ogImage) {
      ogImage.setAttribute("content", imageUrl);
    }

    const twitterImage = upsertMeta('meta[name="twitter:image"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "twitter:image");
      return meta;
    });
    if (twitterImage) {
      twitterImage.setAttribute("content", imageUrl);
    }
  }
};

function FacturacionElectronicaPage() {
  const [cookieConsent, setCookieConsent] = useState(getInitialCookieState);
  const [cookieDraft, setCookieDraft] = useState({ ...DEFAULT_COOKIE_PREFERENCES });
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  const runtimeSiteUrl =
    SITE_URL || (typeof window !== "undefined" ? window.location.origin.replace(/\/+$/, "") : "");

  const pageSchemas = useMemo(() => {
    const pageUrl = runtimeSiteUrl ? `${runtimeSiteUrl}/facturacion-electronica-colombia/` : undefined;

    return [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Facturación Electrónica Colombia | BilAI",
        description:
          "Solución de facturación electrónica en Colombia para empresas y pymes con control de inventario, ventas y reportes con IA.",
        ...(pageUrl ? { url: pageUrl } : {}),
      },
      {
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
      },
    ];
  }, [runtimeSiteUrl]);

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
    setSeoMetadata({ pageUrl: runtimeSiteUrl });
  }, [runtimeSiteUrl]);

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

  return (
    <div className="site-shell">
      {pageSchemas.map((schema, index) => (
        <script
          key={`fe-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <header className="site-header">
        <a href="/" className="brand-link" aria-label="Volver al sitio principal de BilAI">
          <img src={logo} alt="BilAI" className="brand-logo" />
        </a>
        <nav className="site-nav" aria-label="Navegación principal de la landing">
          <a href="#beneficios">Beneficios</a>
          <a href="#proceso">Proceso</a>
          <a href="#faq">FAQ</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <div className="header-actions">
          <a className="header-login" href="/">
            Ir al inicio
          </a>
          <a className="header-cta" href="#contacto">
            Solicitar demo
          </a>
        </div>
      </header>

      <main>
        <section className="hero fe-hero" id="inicio">
          <div className="hero-copy reveal">
            <p className="hero-kicker">Landing especializada</p>
            <h1>Software de facturación electrónica para Colombia</h1>
            <p className="hero-lead">
              BilAI te ayuda a implementar facturación electrónica para cumplir DIAN y conectar tu
              operación comercial con inventario, ventas y reportes con IA.
            </p>
            <div className="hero-actions">
              <a className="btn-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Hablar por WhatsApp
              </a>
              <a className="btn-secondary" href={LOGIN_URL}>
                Iniciar sesión
              </a>
            </div>
            <ul className="hero-proof">
              <li>
                <span className="material-symbols-rounded">verified</span>
                Facturación electrónica orientada a cumplimiento DIAN
              </li>
              <li>
                <span className="material-symbols-rounded">insights</span>
                Datos de ventas e inventario en una sola vista
              </li>
              <li>
                <span className="material-symbols-rounded">auto_awesome</span>
                Reportes accionables impulsados con IA
              </li>
            </ul>
          </div>
          <div className="fe-hero-panel reveal delay-1" aria-hidden="true">
            <h2>¿Buscas facturación electrónica para tu empresa?</h2>
            <p>
              Esta landing está diseñada para ayudarte a comparar y decidir rápido. BilAI combina
              operación diaria y cumplimiento en un flujo único.
            </p>
            <a className="btn-primary full" href="#contacto">
              Quiero una asesoría
            </a>
          </div>
        </section>

        <section className="section reveal" id="beneficios">
          <div className="section-head">
            <p className="section-kicker">Beneficios</p>
            <h2>Por qué elegir BilAI para facturación electrónica</h2>
          </div>
          <div className="seo-grid">
            {valueProps.map((item) => (
              <article className="seo-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-soft reveal" id="proceso">
          <div className="section-head">
            <p className="section-kicker">Proceso</p>
            <h2>Implementa tu facturación electrónica en pasos claros</h2>
          </div>
          <div className="fe-step-grid">
            {workflowSteps.map((step, index) => (
              <article className="step-card" key={step}>
                <span>{`0${index + 1}`}</span>
                <h3>Paso {index + 1}</h3>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal" id="faq">
          <div className="section-head">
            <p className="section-kicker">FAQ</p>
            <h2>Preguntas frecuentes sobre facturación electrónica en Colombia</h2>
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

        <section className="section section-soft reveal" id="contacto">
          <div className="section-head">
            <p className="section-kicker">Contacto</p>
            <h2>Activa tu proceso de facturación electrónica con BilAI</h2>
            <p>
              Si quieres evaluar costos, implementación o una demo, nuestro equipo te guía para que
              tomes la mejor decisión según tu operación.
            </p>
          </div>
          <div className="fe-contact-actions">
            <a className="btn-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Contactar por WhatsApp
            </a>
            <a className="btn-secondary" href={`mailto:${CONTACT_EMAIL}`}>
              Escribir a {CONTACT_EMAIL}
            </a>
            <a className="btn-secondary" href={LOGIN_URL}>
              Ir al login de clientes
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <img src={logo} alt="BilAI" />
        <div className="footer-meta">
          <p>BilAI | Facturación electrónica, inventarios, ventas y reportes con IA.</p>
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

export default FacturacionElectronicaPage;
