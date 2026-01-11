// Main translations export
// Combines all page-specific translations

import { pl as commonPl, en as commonEn } from './common';
import { pl as homepagePl, en as homepageEn } from './homepage';
import { pl as bioPl, en as bioEn } from './bio';
import { pl as kalendarzPl, en as kalendarzEn } from './kalendarz';
import { pl as kontaktPl, en as kontaktEn } from './kontakt';
import { pl as mediaPl, en as mediaEn } from './media';
import { pl as wydarzeniePl, en as wydarzenieEn } from './wydarzenie';
import { pl as archiwalnePl, en as archiwalneEn } from './archiwalne';
import { pl as repertuarPl, en as repertuarEn } from './repertuar';

export const translations = {
  pl: {
    common: commonPl,
    homepage: homepagePl,
    bio: bioPl,
    kalendarz: kalendarzPl,
    kontakt: kontaktPl,
    media: mediaPl,
    wydarzenie: wydarzeniePl,
    archiwalne: archiwalnePl,
    repertuar: repertuarPl,
  },
  en: {
    common: commonEn,
    homepage: homepageEn,
    bio: bioEn,
    kalendarz: kalendarzEn,
    kontakt: kontaktEn,
    media: mediaEn,
    wydarzenie: wydarzenieEn,
    archiwalne: archiwalneEn,
    repertuar: repertuarEn,
  },
};
