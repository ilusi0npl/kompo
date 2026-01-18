// Fundacja page configuration
// Based on Figma designs: node 172-423 (collapsed), node 182-77 (expanded)

export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 1379; // Collapsed state height

// Vertical decorative lines - same positions as other pages
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];

// Line color for Fundacja page (dark green)
export const LINE_COLOR = 'var(--contrast-line-alt)';

// Background color (light green)
export const BACKGROUND_COLOR = 'var(--contrast-line)';

// Text colors
export const TEXT_COLOR = 'var(--contrast-text)';
export const LINK_COLOR = 'var(--contrast-accent)';

// Foundation data
export const fundacjaData = {
  krs: '0000590463',
  regon: '363197180',
  nip: '8982215656',
  bankAccount: '13 1090 1522 0000 0001 4279 3816',
  email: 'KOMPOPOLEX@GMAIL.COM',
};

// Projects data
export const projectsData = [
  {
    text: 'wydanie płyty z akordeonową muzyką kameralną Cezarego Duchnowskiego',
    linkText: 'CROSSFADE, WYD. REQUIEM RECORDS',
    linkUrl: 'https://requiemrecords.eu/product/cezary-duchnowski-crossfade/',
  },
  {
    text: 'zamówienie nowych kompozycji u Moniki Szpyrki i Piotra Tabakiernika dla Duo van Vliet',
    linkText: null,
    linkUrl: null,
  },
  {
    text: 'organizacja koncertu Duo van Vliet (+ przyjaciele) w Centrum Sztuki Wro',
    linkText: 'DUO VAN VLIET',
    linkUrl: 'https://www.duovanvliet.com/',
  },
];

// Accessibility declaration texts (3 paragraphs)
export const accessibilityDeclaration = {
  pl: [
    'Fundacja Kompopolex zobowiązuje się zapewnić dostępność swojej strony internetowej zgodnie z przepisami ustawy z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych. Oświadczenie w sprawie dostępności ma zastosowanie do strony internetowej Strony Domowej Fundacji Kompopolex.',
    'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
    'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
  ],
  en: [
    'Fundacja Kompopolex is committed to ensuring the accessibility of its website in accordance with the provisions of the Act of April 4, 2019 on the digital accessibility of websites and mobile applications of public entities. The accessibility statement applies to the Home Page of the Kompopolex Foundation.',
    'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
    'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
  ],
};
