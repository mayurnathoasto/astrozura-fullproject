/**
 * AstroZura Multi-Language Translation Service
 * 100% Free Client-Side Neural Translation Engine Controller
 * Translates UI and dynamic API response data on the fly.
 */

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
];

const STORAGE_KEY = "astrozura_selected_language";

/**
 * Get the currently active language code
 */
export function getCurrentLanguage() {
  if (typeof window === "undefined") return "en";

  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;

  // Check googtrans cookie: format /en/hi or /auto/hi
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (match && match[1]) {
    const parts = match[1].split("/");
    const lang = parts[parts.length - 1];
    if (lang && SUPPORTED_LANGUAGES.some((l) => l.code === lang)) {
      return lang;
    }
  }

  return "en";
}

/**
 * Set cookie across paths and subdomains
 */
function setTranslationCookie(value) {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  const hostname = window.location.hostname;

  // Set on root path
  document.cookie = `googtrans=${value}; expires=${expires}; path=/;`;

  // Set on host domain if applicable
  if (hostname && !hostname.includes("localhost") && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    document.cookie = `googtrans=${value}; expires=${expires}; path=/; domain=.${hostname};`;
  }
}

/**
 * Clear the translation cookie
 */
function clearTranslationCookie() {
  const pastDate = "Thu, 01 Jan 1970 00:00:00 UTC";
  const hostname = window.location.hostname;

  document.cookie = `googtrans=; expires=${pastDate}; path=/;`;
  document.cookie = `googtrans=; expires=${pastDate}; path=/; domain=${hostname};`;
  if (hostname && !hostname.includes("localhost") && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    document.cookie = `googtrans=; expires=${pastDate}; path=/; domain=.${hostname};`;
  }
}

/**
 * Apply selected language programmatically
 */
export function applyLanguage(targetLang) {
  if (typeof window === "undefined") return;

  const validLang = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang)?.code || "en";
  localStorage.setItem(STORAGE_KEY, validLang);

  if (validLang === "en") {
    clearTranslationCookie();
    setTranslationCookie("/en/en");
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = "en";
      combo.dispatchEvent(new Event("change"));
      setTimeout(() => {
        clearTranslationCookie();
        window.location.reload();
      }, 150);
    } else {
      clearTranslationCookie();
      window.location.reload();
    }
    return;
  }

  // Set cookies for target language
  const cookieVal = `/en/${validLang}`;
  setTranslationCookie(cookieVal);

  const combo = document.querySelector(".goog-te-combo");
  if (combo) {
    combo.value = validLang;
    combo.dispatchEvent(new Event("change"));
  } else {
    window.location.reload();
  }
}

/**
 * Initialize on page load to restore active language if needed
 */
export function initTranslation() {
  if (typeof window === "undefined") return;

  const current = getCurrentLanguage();
  if (current && current !== "en") {
    const cookieVal = `/en/${current}`;
    setTranslationCookie(cookieVal);

    // Wait for the Google Translate combo element to appear and sync its value
    const checkCombo = setInterval(() => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        clearInterval(checkCombo);
        if (combo.value !== current) {
          combo.value = current;
          combo.dispatchEvent(new Event("change"));
        }
      }
    }, 200);

    setTimeout(() => clearInterval(checkCombo), 5000);
  }
}
