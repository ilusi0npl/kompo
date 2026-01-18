// Konfiguracja slajdów Bio
// Dane bazowane na designie Figma

export const desktopBioSlides = [
  {
    id: 'bio1',
    backgroundColor: 'var(--contrast-bg)',
    name: 'Ensemble KOMPOPOLEX',
    lineColor: 'var(--contrast-line)',
    textColor: 'var(--contrast-text)',
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
      'Trio specjalizujące się w muzyce najnowszej, założone 2017 roku we Wrocławiu. Wykonują utwory zaangażowane i angażujące, często porzucają swoje instrumenty na rzecz kabli, keyboardów, tańca i śpiewu. W jego skład wchodzą Aleksandra Gołaj (perkusja), Rafał Łuc (akordeon) i Jacek Sotomski (komputery).',
      'Przez lata działalności zespół zdążył zagrać na najważniejszych festiwalach muzyki nowej w Polsce i za granicą: Mixtur Festival, Warszawskiej Jesieni, Sacrum Profanum, Festiwalu Prawykonań, Musica Polonica Nova oraz Musica Electronica Nova. Wystąpił również na MMMM 2.1 w Stalowej Woli, Eksperymentalnych Wtorkach w Sinfonii Varsovii, teatralnym Festiwalu Kontrapunkt w Szczecinie, Festiwalu NeoArte Syntezator Sztuki.'
    ],
    paragraphTops: [260, 420],
    hasFooter: false
  },
  {
    id: 'bio2',
    backgroundColor: '#FF734C',
    name: 'Aleksandra Gołaj',
    lineColor: '#FFBD19',
    textColor: 'var(--contrast-text)',
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
    backgroundColor: 'var(--contrast-line)',
    name: 'Rafał Łuc',
    lineColor: 'var(--contrast-line-alt)',
    textColor: 'var(--contrast-text)',
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
    lineColor: 'var(--contrast-button-primary-hover)',
    textColor: 'var(--contrast-text)',
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

export const mobileBioSlides = [
  {
    id: 1,
    backgroundColor: 'var(--contrast-bg)',
    name: 'Ensemble KOMPOPOLEX',
    lineColor: 'var(--contrast-line)',
    textColor: 'var(--contrast-text)',
    image: '/assets/bio/bio1-ensemble.webp',
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Trio specjalizujące się w muzyce najnowszej, założone 2017 roku we Wrocławiu. Wykonują utwory zaangażowane i angażujące, często porzucają swoje instrumenty na rzecz kabli, keyboardów, tańca i śpiewu. W jego skład wchodzą Aleksandra Gołaj (perkusja), Rafał Łuc (akordeon) i Jacek Sotomski (komputery).',
      'Przez lata działalności zespół zdążył zagrać na najważniejszych festiwalach muzyki nowej w Polsce i za granicą: Mixtur Festival, Warszawskiej Jesieni, Sacrum Profanum, Festiwalu Prawykonań, Musica Polonica Nova oraz Musica Electronica Nova. Wystąpił również na MMMM 2.1 w Stalowej Woli, Eksperymentalnych Wtorkach w Sinfonii Varsovii, teatralnym Festiwalu Kontrapunkt w Szczecinie, Festiwalu NeoArte Syntezator Sztuki.'
    ],
    hasFooter: false
  },
  {
    id: 2,
    backgroundColor: '#FF734C',
    name: 'Aleksandra Gołaj',
    lineColor: '#FFBD19',
    textColor: 'var(--contrast-text)',
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
    backgroundColor: 'var(--contrast-line)',
    name: 'Rafał Łuc',
    lineColor: 'var(--contrast-line-alt)',
    textColor: 'var(--contrast-text)',
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
    lineColor: 'var(--contrast-button-primary-hover)',
    textColor: 'var(--contrast-text)',
    image: '/assets/bio/bio4-jacek.webp',
    logoSrc: '/assets/logo.svg',
    paragraphs: [
      'Jego utwory były wykonywane na festiwalach World Music Days, Warszawska Jesień, BIFEM w Bendigo (Australia), Ostrava Music Days, Musica Polonica Nova, Musica Electronica Nova, oprócz tego jako wykonawca wystąpił na Festival Licences w Paryżu, Ring Ring w Belgradzie, Cinemascope w Mińsku.',
      'W 2018 roku był nominowany do nagrody polskiego środowiska muzycznego Koryfeusz Muzyki Polskiej w kategorii Odkrycie Roku. W 2011 roku założył z Mikołajem Laskowskim duet sultan hagavik, z którym dwa lata po rozpoczęciu działalności wygrał nagrodę nurtu OFF na Przeglądzie Piosenki Aktorskiej we Wrocławiu.'
    ],
    hasFooter: true
  }
];

// Pozycje pionowych linii (z Figma)
export const desktopLinePositions = [155, 375, 595, 815, 1035, 1255];
export const mobileLinePositions = [97, 195, 292];

// Wymiary
export const DESKTOP_WIDTH = 1440;
export const DESKTOP_HEIGHT = 700;
export const MOBILE_WIDTH = 390;
export const MOBILE_HEIGHT = 1418;
