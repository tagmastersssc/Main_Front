const COOKIE_STORAGE_KEY = "bilai_cookie_consent_v1";
const COOKIE_NAME = "bilai_cookie_consent";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const GA_SCRIPT_ID = "bilai-ga-script";
const GA_CONFIG_FLAG = "__bilaiGaConfigured";

export const DEFAULT_COOKIE_PREFERENCES = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export const sanitizeCookiePreferences = (value) => ({
  necessary: true,
  analytics: Boolean(value?.analytics),
  marketing: Boolean(value?.marketing),
});

const readStoredCookieConsent = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);
    const preferences = sanitizeCookiePreferences(parsed?.preferences);

    return {
      status: typeof parsed?.status === "string" ? parsed.status : "customized",
      updatedAt: parsed?.updatedAt || new Date().toISOString(),
      preferences,
    };
  } catch {
    return null;
  }
};

export const getInitialCookieState = () => {
  const storedConsent = readStoredCookieConsent();

  if (!storedConsent) {
    return {
      hasDecision: false,
      preferences: { ...DEFAULT_COOKIE_PREFERENCES },
    };
  }

  return {
    hasDecision: true,
    preferences: sanitizeCookiePreferences(storedConsent.preferences),
  };
};

export const persistCookieConsent = ({ preferences, status }) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    status,
    updatedAt: new Date().toISOString(),
    preferences: sanitizeCookiePreferences(preferences),
  };

  window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(payload));
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    payload.status
  )}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
};

export const applyRuntimeCookiePermissions = ({ preferences, hasDecision }) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedPreferences = sanitizeCookiePreferences(preferences);

  window.BilAICookies = {
    hasDecision,
    preferences: normalizedPreferences,
    canUse(category) {
      if (category === "necessary") {
        return true;
      }
      return Boolean(normalizedPreferences[category]);
    },
  };

  window.dispatchEvent(
    new CustomEvent("bilai:cookie-consent-updated", {
      detail: {
        hasDecision,
        preferences: normalizedPreferences,
      },
    })
  );
};

const ensureGoogleAnalyticsQueue = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args) => {
      window.dataLayer.push(args);
    };
  }
};

export const syncGoogleAnalyticsWithConsent = ({ hasDecision, preferences, measurementId }) => {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !measurementId ||
    !measurementId.trim()
  ) {
    return;
  }

  const normalizedMeasurementId = measurementId.trim();
  const analyticsEnabled = Boolean(hasDecision && preferences?.analytics);
  const gaDisableKey = `ga-disable-${normalizedMeasurementId}`;

  ensureGoogleAnalyticsQueue();
  window[gaDisableKey] = !analyticsEnabled;

  window.gtag("consent", "update", {
    analytics_storage: analyticsEnabled ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (!analyticsEnabled) {
    return;
  }

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${normalizedMeasurementId}`;
    document.head.appendChild(script);
  }

  if (!window[GA_CONFIG_FLAG]) {
    window.gtag("js", new Date());
    window.gtag("config", normalizedMeasurementId, {
      anonymize_ip: true,
      transport_type: "beacon",
    });
    window[GA_CONFIG_FLAG] = true;
  }
};
