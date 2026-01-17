#!/usr/bin/env node

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

// Professional bio translations
const bioTranslations = {
  'Ensemble KOMPOPOLEX': {
    nameEn: 'Ensemble KOMPOPOLEX',
    paragraphsEn: [
      'A trio specializing in contemporary music, founded in 2017 in Wrocław. They perform committed and engaging works, often abandoning their instruments for cables, keyboards, dance and singing. The ensemble consists of Aleksandra Gołaj (percussion), Rafał Łuc (accordion) and Jacek Sotomski (computers).',
      'Over the years, the ensemble has performed at the most important new music festivals in Poland and abroad: Mixtur Festival, Warsaw Autumn, Sacrum Profanum, Festival of Premieres, Musica Polonica Nova and Musica Electronica Nova. They also appeared at MMMM 2.1 in Stalowa Wola, Experimental Tuesdays at Sinfonia Varsovia, the theatrical Kontrapunkt Festival in Szczecin, and NeoArte Syntezator Sztuki Festival.'
    ]
  },
  'Aleksandra Gołaj': {
    nameEn: 'Aleksandra Gołaj',
    paragraphsEn: [
      'Permanently associated with the NFM Wrocław Philharmonic Symphony Orchestra. As a chamber musician, she regularly performs at festivals related to contemporary music, including MUSMA, Musica Polonica Nova, Musica Electronica Nova, ISCM World Music Days 2014, Poznań Musical Spring, Music on the Peaks, Warsaw Autumn.',
      'In 2015-2018, lecturer at the Academy of Music in Wrocław. Engaged in music education for young people. She participates in the pilot project of the Lower Silesian Music Society, consisting of introducing wind orchestras as extracurricular activities.'
    ]
  },
  'Jacek Sotomski': {
    nameEn: 'Jacek Sotomski',
    paragraphsEn: [
      'His works have been performed at festivals including World Music Days, Warsaw Autumn, BIFEM in Bendigo (Australia), Ostrava Music Days, Musica Polonica Nova, Musica Electronica Nova. In addition, as a performer he has appeared at Festival Licences in Paris, Ring Ring in Belgrade, Cinemascope in Minsk.',
      'In 2018, he was nominated for the Polish Music Coryphaeus award in the Discovery of the Year category. In 2011, he founded the sultan hagavik duo with Mikołaj Laskowski, with which two years after starting their activity they won the OFF stream award at the Actor\'s Song Review in Wrocław.'
    ]
  },
  'Rafał Łuc': {
    nameEn: 'Rafał Łuc',
    paragraphsEn: [
      'Multi-award-winning musician and accordionist. Graduate of Royal Academy of Music in London, Musikene in San Sebastian, Academy of Music in Wrocław, where he is employed as associate professor. In September 2018, he obtained the title of Doctor of Arts (habilitation), twice a candidate for the Polityka Passports nomination.',
      'He performs worldwide solo, in chamber ensembles and with orchestras such as BBC Symphony Orchestra, London Sinfonietta, Aurora Orchestra, Rambert Dance Company, NFM Wrocław Philharmonic.',
      'His recordings can be found on 10 CDs. Neil Fisher from The Times described Rafał Łuc as: "a mature musician distinguished by deep commitment to exploring the full potential of his instrument".'
    ]
  }
};

async function updateBioTranslations() {
  console.log('🌍 Updating Bio Profile translations with full content...\n');

  const profiles = await client.fetch(`
    *[_type == "bioProfile"] {
      _id,
      namePl
    }
  `);

  for (const profile of profiles) {
    const translation = bioTranslations[profile.namePl];

    if (translation) {
      await client
        .patch(profile._id)
        .set({
          nameEn: translation.nameEn,
          paragraphsEn: translation.paragraphsEn
        })
        .commit();

      console.log(`✅ Updated: ${profile.namePl}`);
      console.log(`   - ${translation.paragraphsEn.length} paragraphs translated`);
    }
  }

  console.log('\n✨ Bio translations updated successfully!');
}

updateBioTranslations();
