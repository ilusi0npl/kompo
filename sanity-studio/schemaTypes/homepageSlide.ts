import type {Rule} from '@sanity/types'

export default {
  name: 'homepageSlide',
  title: 'Slajd Homepage',
  type: 'document',
  fields: [
    // Bilingual word fields
    {
      name: 'wordPl',
      title: 'Słowo (PL)',
      type: 'string',
      description: 'Główne słowo slajdu (np. "Trio", "Kompo", "Polex", "Ensemble")',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'wordEn',
      title: 'Słowo (EN)',
      type: 'string',
      description: 'Main slide word (e.g., "Trio", "Kompo", "Polex", "Ensemble")',
      validation: (Rule: Rule) => Rule.required(),
    },
    // Old word field - hidden for backward compatibility
    {
      name: 'word',
      title: 'Słowo (deprecated)',
      type: 'string',
      hidden: true,
    },
    // Bilingual tagline fields
    {
      name: 'taglinePl',
      title: 'Tagline (PL)',
      type: 'string',
      description: 'Opis pod słowem (np. "specjalizujemy się w muzyce najnowszej")',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'taglineEn',
      title: 'Tagline (EN)',
      type: 'string',
      description: 'Description under the word (e.g., "we specialize in contemporary music")',
      validation: (Rule: Rule) => Rule.required(),
    },
    // Old tagline field - hidden for backward compatibility
    {
      name: 'tagline',
      title: 'Tagline (deprecated)',
      type: 'string',
      hidden: true,
    },
    {
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - slajd jest opublikowany',
    },
  ],
  preview: {
    select: {
      title: 'wordPl',
      tagline: 'taglinePl',
      media: 'image',
    },
    prepare({title, tagline, media}: any) {
      return {
        title,
        subtitle: tagline,
        media,
      }
    },
  },
}
