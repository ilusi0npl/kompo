// Konfiguracja slajdów Bio
// Dane bazowane na designie Figma

import { isLargeTestMode, generateBioProfiles } from '../../test-data/large-data-generator';

const realDesktopBioSlides = [
  {
    id: 'bio1',
    backgroundColor: '#FDFDFD',
    name: 'Ensemble KOMPOPOLEX',
    lineColor: '#A0E38A',
    textColor: '#131313',
    image: '/assets/bio/bio1-ensemble.webp',
    // Bio1 uses object-cover centered (different base image)
    imageStyle: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: '50% 50%',
    },
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Trio specjalizujące się w muzyce najnowszej, założone w 2017 roku we Wrocławiu. Wykonują utwory zaangażowane i angażujące, często porzucając swoje instrumenty na rzecz kabli, samplerów, klawiatur, tańca i śpiewu. W jego skład wchodzą Aleksandra Gołaj (perkusja), Rafał Łuc (akordeon) i Jacek Sotomski (komputery).',
      'Na przestrzeni lat zespół występował na najważniejszych festiwalach muzyki współczesnej w Polsce: Warszawskiej Jesieni, Sacrum Profanum, Festiwalu Prawykonań w Katowicach, Musica Polonica Nova oraz Musica Electronica Nova, w cyklu Experimental Tuesdays w Sinfonii Varsovii, na Festiwalu Kontrapunkt w Szczecinie oraz Festiwalu NeoArte – Synthesizer of Art w Gdańsku. Trio występowało także na europejskich festiwalach, takich jak: Time of Music (Finlandia), Mixtur Festival (Hiszpania), Klang Festival (Dania) oraz Heroines of Sound Festival (Niemcy).',
      'Od początku swojej działalności zespół współpracuje z młodym pokoleniem artystów z Polski, m.in. z Piotrem Bednarczykiem, Moniką Dalach Sayers, Niną Fukuoką, Kubą Krzewińskim, Pawłem Malinowskim, Piotrem Peszatem, Teoniki Rożynek, Rafałem Ryterskim, Moniką Szpyrką, Martą Śniady, Rafałem Zapałą oraz Aleksandrą Słyż, a także z uznanymi na arenie międzynarodowej kompozytorami, takimi jak: Cezary Duchnowski, Neo Hülcker, Kelley Sheehan, Matthias Kranebitter, Simon Løffler, Jorge Sanchez-Chiong, Mathew Shlomowitz oraz Jennifer Walshe.',
      'Artyści występowali również na jednej scenie z Joanną Freszel, Barbarą Kingą Majewską, Michałem Pepolem, Maciejem Koczurem oraz Rafałem Zalechem. Oprócz działalności w Ensemble Kompopolex jego członkowie są aktywni także jako soliści oraz muzycy zespołów kameralnych i orkiestr symfonicznych.'
    ],
    paragraphTops: [260, 420],
    hasFooter: false
  },
  {
    id: 'bio2',
    backgroundColor: '#FF734C',
    name: 'Aleksandra Gołaj',
    lineColor: '#FFBD19',
    textColor: '#131313',
    image: '/assets/bio/bio2-aleksandra.webp',
    // From Figma: h-[159.57%] left-[0.75%] top-[-28.91%] w-[342.5%]
    imageStyle: {
      position: 'absolute',
      width: '342.5%',
      height: '159.57%',
      left: '0.75%',
      top: '-28.91%',
      maxWidth: 'none',
    },
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Na stałe związana z Orkiestrą Symfoniczną NFM Filharmonia Wrocławska. Jako kameralistka regularnie występuje na festiwalach związanych z muzyką współczesną m. in. MUSMA, Musica Polonica Nova, Musica Electronica Nova, ISCM World Music Days 2014, Poznańska Wiosna Muzyczna, Muzyka na Szczytach, Warszawska Jesień.',
      'W latach 2015-2018 wykładowca Akademii Muzycznej we Wrocławiu. Zaangażowana w umuzykalnianie młodzieży. Bierze udział w pilotażowym projekcie Dolnośląskiego Towarzystwa Muzycznego, polegającym na wprowadzeniu orkiestr dętych jako zajęć pozalekcyjnych.'
    ],
    paragraphTops: [260, 446],
    hasFooter: false
  },
  {
    id: 'bio3',
    backgroundColor: '#34B898',
    name: 'Rafał Łuc',
    lineColor: '#01936F',
    textColor: '#131313',
    image: '/assets/bio/bio3-rafal.webp',
    // From Figma: h-[153.91%] left-[-101.18%] top-[-13.7%] w-[330.37%]
    imageStyle: {
      position: 'absolute',
      width: '330.37%',
      height: '153.91%',
      left: '-101.18%',
      top: '-13.7%',
      maxWidth: 'none',
    },
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Wielokrotnie nagradzany muzyk, akordeonista. Absolwent Royal Academy of Music w Londynie, Musikene w San Sebastian, Akademii Muzycznej im. Karola Lipińskiego we Wrocławiu, w której zatrudniony jest na stanowisku adiunkta. We wrześniu 2018 r. uzyskał tytuł doktora habilitowanego, dwukrotnie kandydat do nominacji Paszportów Polityki.',
      'Koncertuje na całym świecie solo, kameralnie oraz z takimi zespołami orkiestrowymi jak BBC Symphony Orchestra, London Sinfonietta, Aurora Orchestra, Rambert Dance Company, NFM Filharmonią Wrocławską.',
      'Jego nagrania znajdują się na 10 płytach CD. Neil Fisher z dziennika \'The Times\' określił Rafała Łuca jako: \'dojrzałego muzyka wyróżniającego się głębokim zaangażowaniem w wykorzystanie całego potencjału swojego instrumentu\'.'
    ],
    paragraphTops: [260, 444, 556],
    hasFooter: false
  },
  {
    id: 'bio4',
    backgroundColor: '#73A1FE',
    name: 'Jacek Sotomski',
    lineColor: '#3478FF',
    textColor: '#131313',
    image: '/assets/bio/bio4-jacek.webp',
    // From Figma: h-[140.43%] left-[-198.05%] top-[-0.22%] w-[301.44%]
    imageStyle: {
      position: 'absolute',
      width: '301.44%',
      height: '140.43%',
      left: '-198.05%',
      top: '-0.22%',
      maxWidth: 'none',
    },
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Jego utwory były wykonywane na festiwalach World Music Days, Warszawska Jesień, BIFEM w Bendigo (Australia), Ostrava Music Days, Musica Polonica Nova, Musica Electronica Nova, oprócz tego jako wykonawca wystąpił na Festival Licences w Paryżu, Ring Ring w Belgradzie, Cinemascope w Mińsku.',
      'W 2018 roku był nominowany do nagrody polskiego środowiska muzycznego Koryfeusz Muzyki Polskiej w kategorii Odkrycie Roku. W 2011 roku założył z Mikołajem Laskowskim duet sultan hagavik, z którym dwa lata po rozpoczęciu działalności wygrał nagrodę nurtu OFF na Przeglądzie Piosenki Aktorskiej we Wrocławiu.'
    ],
    paragraphTops: [256, 416],
    hasFooter: true,
    height: 850
  }
];

const realMobileBioSlides = [
  {
    id: 1,
    backgroundColor: '#FDFDFD',
    name: 'Ensemble KOMPOPOLEX',
    lineColor: '#A0E38A',
    textColor: '#131313',
    image: '/assets/bio/bio1-ensemble.webp',
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Trio specjalizujące się w muzyce najnowszej, założone w 2017 roku we Wrocławiu. Wykonują utwory zaangażowane i angażujące, często porzucając swoje instrumenty na rzecz kabli, samplerów, klawiatur, tańca i śpiewu. W jego skład wchodzą Aleksandra Gołaj (perkusja), Rafał Łuc (akordeon) i Jacek Sotomski (komputery).',
      'Na przestrzeni lat zespół występował na najważniejszych festiwalach muzyki współczesnej w Polsce: Warszawskiej Jesieni, Sacrum Profanum, Festiwalu Prawykonań w Katowicach, Musica Polonica Nova oraz Musica Electronica Nova, w cyklu Experimental Tuesdays w Sinfonii Varsovii, na Festiwalu Kontrapunkt w Szczecinie oraz Festiwalu NeoArte – Synthesizer of Art w Gdańsku. Trio występowało także na europejskich festiwalach, takich jak: Time of Music (Finlandia), Mixtur Festival (Hiszpania), Klang Festival (Dania) oraz Heroines of Sound Festival (Niemcy).',
      'Od początku swojej działalności zespół współpracuje z młodym pokoleniem artystów z Polski, m.in. z Piotrem Bednarczykiem, Moniką Dalach Sayers, Niną Fukuoką, Kubą Krzewińskim, Pawłem Malinowskim, Piotrem Peszatem, Teoniki Rożynek, Rafałem Ryterskim, Moniką Szpyrką, Martą Śniady, Rafałem Zapałą oraz Aleksandrą Słyż, a także z uznanymi na arenie międzynarodowej kompozytorami, takimi jak: Cezary Duchnowski, Neo Hülcker, Kelley Sheehan, Matthias Kranebitter, Simon Løffler, Jorge Sanchez-Chiong, Mathew Shlomowitz oraz Jennifer Walshe.',
      'Artyści występowali również na jednej scenie z Joanną Freszel, Barbarą Kingą Majewską, Michałem Pepolem, Maciejem Koczurem oraz Rafałem Zalechem. Oprócz działalności w Ensemble Kompopolex jego członkowie są aktywni także jako soliści oraz muzycy zespołów kameralnych i orkiestr symfonicznych.'
    ],
    hasFooter: false
  },
  {
    id: 2,
    backgroundColor: '#FF734C',
    name: 'Aleksandra Gołaj',
    lineColor: '#FFBD19',
    textColor: '#131313',
    image: '/assets/bio/bio2-aleksandra.webp',
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Na stałe związana z Orkiestrą Symfoniczną NFM Filharmonia Wrocławska. Jako kameralistka regularnie występuje na festiwalach związanych z muzyką współczesną m. in. MUSMA, Musica Polonica Nova, Musica Electronica Nova, ISCM World Music Days 2014, Poznańska Wiosna Muzyczna, Muzyka na Szczytach, Warszawska Jesień.',
      'W latach 2015-2018 wykładowca Akademii Muzycznej we Wrocławiu. Zaangażowana w umuzykalnianie młodzieży. Bierze udział w pilotażowym projekcie Dolnośląskiego Towarzystwa Muzycznego, polegającym na wprowadzeniu orkiestr dętych jako zajęć pozalekcyjnych.'
    ],
    hasFooter: false
  },
  {
    id: 3,
    backgroundColor: '#34B898',
    name: 'Rafał Łuc',
    lineColor: '#01936F',
    textColor: '#131313',
    image: '/assets/bio/bio3-rafal.webp',
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Wielokrotnie nagradzany muzyk, akordeonista. Absolwent Royal Academy of Music w Londynie, Musikene w San Sebastian, Akademii Muzycznej im. Karola Lipińskiego we Wrocławiu, w której zatrudniony jest na stanowisku adiunkta. We wrześniu 2018 r. uzyskał tytuł doktora habilitowanego, dwukrotnie kandydat do nominacji Paszportów Polityki.',
      'Koncertuje na całym świecie solo, kameralnie oraz z takimi zespołami orkiestrowymi jak BBC Symphony Orchestra, London Sinfonietta, Aurora Orchestra, Rambert Dance Company, NFM Filharmonią Wrocławską.',
      'Jego nagrania znajdują się na 10 płytach CD. Neil Fisher z dziennika \'The Times\' określił Rafała Łuca jako: \'dojrzałego muzyka wyróżniającego się głębokim zaangażowaniem w wykorzystanie całego potencjału swojego instrumentu\'.'
    ],
    hasFooter: false
  },
  {
    id: 4,
    backgroundColor: '#73A1FE',
    name: 'Jacek Sotomski',
    lineColor: '#3478FF',
    textColor: '#131313',
    image: '/assets/bio/bio4-jacek.webp',
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Jego utwory były wykonywane na festiwalach World Music Days, Warszawska Jesień, BIFEM w Bendigo (Australia), Ostrava Music Days, Musica Polonica Nova, Musica Electronica Nova, oprócz tego jako wykonawca wystąpił na Festival Licences w Paryżu, Ring Ring w Belgradzie, Cinemascope w Mińsku.',
      'W 2018 roku był nominowany do nagrody polskiego środowiska muzycznego Koryfeusz Muzyki Polskiej w kategorii Odkrycie Roku. W 2011 roku założył z Mikołajem Laskowskim duet sultan hagavik, z którym dwa lata po rozpoczęciu działalności wygrał nagrodę nurtu OFF na Przeglądzie Piosenki Aktorskiej we Wrocławiu.'
    ],
    hasFooter: true
  }
];

// Merges Sanity CMS content with hardcoded design values from a config slides array.
// Preserves: colors, layout, hasFooter — all Figma-derived.
// Overrides: name, image (imageUrl), paragraphs (mainParagraphs with fallback).
export function transformSanityProfiles(configSlides, sanityProfiles) {
  return configSlides.map((configSlide, index) => {
    const sanityProfile = sanityProfiles[index];
    if (!sanityProfile) return configSlide;
    return {
      ...configSlide,
      name: sanityProfile.name || configSlide.name,
      image: sanityProfile.imageUrl || configSlide.image,
      paragraphs: sanityProfile.mainParagraphs || sanityProfile.paragraphs?.map(p => p.text) || [],
      hasMoreParagraphs: (sanityProfile.moreParagraphs || []).length > 0,
    };
  });
}

// Pozycje pionowych linii (z Figma)
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];
export const mobileLinePositions = [97, 195, 292];

// Wymiary
export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 700;
export const MOBILE_WIDTH = 390;
export const MOBILE_HEIGHT = 1418;

// Export - use large test data when VITE_LARGE_TEST_DATA=true
const largeTestBioSlides = generateBioProfiles(10);
export const desktopBioSlides = isLargeTestMode ? largeTestBioSlides : realDesktopBioSlides;
export const mobileBioSlides = isLargeTestMode ? largeTestBioSlides : realMobileBioSlides;
