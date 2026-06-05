export interface DictationRecord {
  id: string;
  title: string;
  text: string;
  originalText?: string;
  timestamp: string;
  language: string;
  durationSecs: number;
  isAIPolished: boolean;
  historyActions?: string[]; // Log of actions done on it: "polish", "summarize", etc.
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "es-ES", name: "Español (España)", flag: "🇪🇸" },
  { code: "es-MX", name: "Español (México)", flag: "🇲🇽" },
  { code: "en-US", name: "Inglés (EE.UU.)", flag: "🇺🇸" },
  { code: "en-GB", name: "Inglés (Reino Unido)", flag: "🇬🇧" },
  { code: "fr-FR", name: "Francés", flag: "🇫🇷" },
  { code: "de-DE", name: "Alemán", flag: "🇩🇪" },
  { code: "it-IT", name: "Italiano", flag: "🇮🇹" },
  { code: "pt-BR", name: "Portugués (Brasil)", flag: "🇧🇷" },
];
