const CookieConsentLayer = ({
  hasDecision,
  showSettings,
  cookieDraft,
  onOpenSettings,
  onCloseSettings,
  onToggleDraft,
  onRejectOptional,
  onAcceptAll,
  onSaveCustom,
}) => (
  <>
    {!hasDecision ? (
      <section
        className="cookie-banner"
        role="dialog"
        aria-label="Consentimiento de cookies"
        aria-live="polite"
      >
        <div className="cookie-banner-copy">
          <strong>Usamos cookies para mejorar tu experiencia</strong>
          <p>
            Las cookies necesarias mantienen el sitio operativo. Puedes aceptar cookies de
            analítica y marketing, o configurarlas según tu preferencia.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button type="button" className="cookie-btn cookie-btn--ghost" onClick={onOpenSettings}>
            Configurar
          </button>
          <button type="button" className="cookie-btn cookie-btn--soft" onClick={onRejectOptional}>
            Solo necesarias
          </button>
          <button type="button" className="cookie-btn cookie-btn--primary" onClick={onAcceptAll}>
            Aceptar todas
          </button>
        </div>
      </section>
    ) : null}

    {showSettings ? (
      <div className="cookie-overlay" onClick={onCloseSettings}>
        <section
          className="cookie-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="cookie-modal-head">
            <h2 id="cookie-settings-title">Preferencias de cookies</h2>
            <button
              type="button"
              className="cookie-close-btn"
              onClick={onCloseSettings}
              aria-label="Cerrar preferencias de cookies"
            >
              <span className="material-symbols-rounded">close</span>
            </button>
          </header>

          <p className="cookie-modal-intro">
            Decide qué tipo de cookies quieres permitir. Puedes actualizar esta configuración en
            cualquier momento desde el pie de página.
          </p>

          <div className="cookie-options">
            <label className="cookie-option cookie-option--required">
              <input type="checkbox" checked disabled readOnly />
              <div>
                <strong>Cookies necesarias</strong>
                <p>Son obligatorias para seguridad, navegación y funcionamiento básico del sitio.</p>
              </div>
            </label>

            <label className="cookie-option">
              <input
                type="checkbox"
                checked={cookieDraft.analytics}
                onChange={() => onToggleDraft("analytics")}
              />
              <div>
                <strong>Cookies de analítica</strong>
                <p>Nos ayudan a medir uso y rendimiento para mejorar la experiencia.</p>
              </div>
            </label>

            <label className="cookie-option">
              <input
                type="checkbox"
                checked={cookieDraft.marketing}
                onChange={() => onToggleDraft("marketing")}
              />
              <div>
                <strong>Cookies de marketing</strong>
                <p>Permiten personalizar campañas y medir interacciones comerciales.</p>
              </div>
            </label>
          </div>

          <div className="cookie-modal-actions">
            <button type="button" className="cookie-btn cookie-btn--ghost" onClick={onCloseSettings}>
              Cancelar
            </button>
            <button type="button" className="cookie-btn cookie-btn--soft" onClick={onRejectOptional}>
              Solo necesarias
            </button>
            <button type="button" className="cookie-btn cookie-btn--primary" onClick={onSaveCustom}>
              Guardar preferencias
            </button>
          </div>
        </section>
      </div>
    ) : null}
  </>
);

export default CookieConsentLayer;
