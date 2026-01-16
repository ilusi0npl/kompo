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
      name: 'order',
      title: 'Kolejność',
      type: 'number',
      description: 'Kolejność slajdu (1, 2, 3, 4)',
      validation: (Rule: Rule) => Rule.required().min(1).integer(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Opis pod słowem (np. "specjalizujemy się w muzyce najnowszej")',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'backgroundColor',
      title: 'Kolor tła',
      type: 'color',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'textColor',
      title: 'Kolor tekstu',
      type: 'color',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'lineColor',
      title: 'Kolor linii',
      type: 'color',
      description: 'Kolor pionowych linii dekoracyjnych',
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
      name: 'wordSvg',
      title: 'SVG słowa',
      type: 'file',
      description: 'Plik SVG z napisem (opcjonalny - jeśli nie podany, używa zwykłego tekstu)',
      options: {
        accept: '.svg',
      },
    },
    {
      name: 'wordPosition',
      title: 'Pozycja słowa (desktop)',
      type: 'object',
      description: 'Pozycjonowanie SVG słowa na desktop',
      fields: [
        {
          name: 'wordY',
          type: 'number',
          title: 'Y Position',
          description: 'Pozycja top w px',
        },
        {
          name: 'wordHeight',
          type: 'number',
          title: 'Height',
          description: 'Wysokość SVG w px',
        },
        {
          name: 'wordWidth',
          type: 'number',
          title: 'Width',
          description: 'Szerokość SVG w px',
        },
      ],
    },
    {
      name: 'taglineX',
      title: 'Tagline X Position (desktop)',
      type: 'number',
      description: 'Pozycja left tagline w px',
    },
    {
      name: 'logoSrc',
      title: 'Logo',
      type: 'string',
      description: 'Ścieżka do logo (/assets/logo.svg lub /assets/logo-white.svg)',
      options: {
        list: [
          {title: 'Logo czarne', value: '/assets/logo.svg'},
          {title: 'Logo białe', value: '/assets/logo-white.svg'},
        ],
      },
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
      order: 'order',
      tagline: 'tagline',
      media: 'image',
    },
    prepare({title, order, tagline, media}: any) {
      return {
        title: `${order}. ${title}`,
        subtitle: tagline,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Kolejność',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
}
