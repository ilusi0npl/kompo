import type {Rule} from '@sanity/types'

export default {
  name: 'homepageSlide',
  title: 'Slajd Homepage',
  type: 'document',
  fields: [
    {
      name: 'word',
      title: 'Słowo',
      type: 'string',
      description: 'Główne słowo slajdu (np. "Trio", "Kompo", "Polex", "Ensemble")',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Opis pod słowem (np. "specjalizujemy się w muzyce najnowszej")',
      validation: (Rule: Rule) => Rule.required(),
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
      title: 'word',
      tagline: 'tagline',
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
