/**
 * Constantes inmutables y tipadas para la integración del widget de accesibilidad WAW.
 * Centraliza identificadores del DOM, selectores, clases CSS inyectadas y configuración.
 */

export const WAW_DOM_IDS = {
  WIDGET: 'waw-widget',
  BACKDROP_OVERLAY: 'waw-backdrop-overlay',
  CLOSE_BUTTON: 'close-button',
  OPEN_BUTTON: 'open-button',
  READING_LINE: 'waw-reading-line',
  READING_MASK: 'waw-reading-mask',
  MUTE_INDICATOR: 'waw-mute-indicator',
  SPRITES_CONTAINER: 'waw-svg-sprites-preinjected',
} as const;

export const WAW_FEATURE_BUTTON_IDS = {
  DYSLEXIA: 'btn-apto-dislexia',
  BIG_CURSOR: 'btn-big-cursor',
  READING_LINE: 'btn-reading-line',
  READING_MASK: 'btn-reading-mask',
  SCREEN_READER: 'btn-voice-reading',
  ANIMATIONS: 'btn-animations',
  HIGHLIGHT_LINKS: 'btn-highlight-links',
  HIGHLIGHT_HEADERS: 'btn-highlight-headers',
  HIDE_IMAGES: 'btn-hide-img',
  MUTE: 'btn-mute-sound',
} as const;

export const WAW_CSS_CLASSES = {
  // Estados de control del contenedor y app
  PANEL_OPEN: 'waw-panel-open',
  OVERLAY_VISIBLE: 'visible',
  OVERLAY_CUSTOM: 'waw-custom-backdrop',
  ACTIVE: 'active',
  HIDDEN: 'hidden',
  OPEN: 'open',

  // Clases inyectadas por WAW en <html>
  ROOT_DYSLEXIA: 'WAWDyslexicFont',
  ROOT_BIG_CURSOR: 'WAWBigCursor',
  ROOT_NO_ANIMATIONS: 'WAWNoAnimations',
  ROOT_HIDE_IMAGES: 'WAWHideImages',
  ROOT_HIGHLIGHT_LINKS: 'WAWHighlightLinks',
  ROOT_HIGHLIGHT_HEADERS: 'WAWHighlightHeaders',
  ROOT_GREYSCALE: 'WAWGreyscale',
  ROOT_INVERT_COLOR: 'WAWInvertedColor',
} as const;

export const ALL_WAW_ROOT_CLASSES: readonly string[] = [
  WAW_CSS_CLASSES.ROOT_DYSLEXIA,
  WAW_CSS_CLASSES.ROOT_BIG_CURSOR,
  WAW_CSS_CLASSES.ROOT_NO_ANIMATIONS,
  WAW_CSS_CLASSES.ROOT_HIDE_IMAGES,
  WAW_CSS_CLASSES.ROOT_HIGHLIGHT_LINKS,
  WAW_CSS_CLASSES.ROOT_HIGHLIGHT_HEADERS,
  WAW_CSS_CLASSES.ROOT_GREYSCALE,
  WAW_CSS_CLASSES.ROOT_INVERT_COLOR,
] as const;

export const WAW_STORAGE_KEYS = {
  STATES: 'wawStates',
} as const;

export const WAW_THEME_COLORS = {
  MAIN: '#486EAB',
  SECOND: '#1A1A40',
} as const;

export const WAW_SPRITE_PATHS = [
  '/assets/icons/icons.svg',
  '/assets/icons/options.svg',
] as const;

export type WawFeatureKey =
  | 'dyslexia'
  | 'reading-line'
  | 'reading-mask'
  | 'big-cursor'
  | 'screen-reader'
  | 'animations'
  | 'links'
  | 'headers'
  | 'hide-img'
  | 'mute';

export const WAW_FEATURE_MAP: Record<WawFeatureKey, string> = {
  dyslexia: WAW_FEATURE_BUTTON_IDS.DYSLEXIA,
  'reading-line': WAW_FEATURE_BUTTON_IDS.READING_LINE,
  'reading-mask': WAW_FEATURE_BUTTON_IDS.READING_MASK,
  'big-cursor': WAW_FEATURE_BUTTON_IDS.BIG_CURSOR,
  'screen-reader': WAW_FEATURE_BUTTON_IDS.SCREEN_READER,
  animations: WAW_FEATURE_BUTTON_IDS.ANIMATIONS,
  links: WAW_FEATURE_BUTTON_IDS.HIGHLIGHT_LINKS,
  headers: WAW_FEATURE_BUTTON_IDS.HIGHLIGHT_HEADERS,
  'hide-img': WAW_FEATURE_BUTTON_IDS.HIDE_IMAGES,
  mute: WAW_FEATURE_BUTTON_IDS.MUTE,
} as const;

