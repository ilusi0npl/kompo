import type {Rule} from '@sanity/types'

export default {
  name: 'bioProfile',
  title: 'Profile Bio',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nazwa',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      description: 'Kolejność slajdu (1, 2, 3, 4)',
      validation: (Rule: Rule) => Rule.required().min(1).integer(),
    },
    {
      name: 'backgroundColor',
      title: 'Kolor tła',
      type: 'color',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'lineColor',
      title: 'Kolor linii',
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
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'imageStyle',
      title: 'Styl obrazu (Figma CSS)',
      type: 'object',
      description: 'Pozycjonowanie z Figma - opcjonalne',
      fields: [
        {name: 'width', type: 'string', title: 'Width'},
        {name: 'height', type: 'string', title: 'Height'},
        {name: 'left', type: 'string', title: 'Left'},
        {name: 'top', type: 'string', title: 'Top'},
        {name: 'objectFit', type: 'string', title: 'Object Fit'},
        {name: 'objectPosition', type: 'string', title: 'Object Position'},
      ],
    },
    {
      name: 'paragraphs',
      title: 'Paragrafy',
      type: 'array',
      of: [{type: 'text'}],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
    {
      name: 'paragraphTops',
      title: 'Pozycje Y paragrafów (desktop)',
      type: 'array',
      of: [{type: 'number'}],
      description: 'Pozycje top dla każdego paragrafu w px (np. [260, 420])',
    },
    {
      name: 'hasFooter',
      title: 'Pokaż stopkę',
      type: 'boolean',
      description: 'Tylko ostatni profil (Bio4) ma stopkę',
      initialValue: false,
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - profil jest opublikowany',
    },
  ],
  preview: {
    select: {
      title: 'name',
      order: 'order',
      media: 'image',
    },
    prepare({title, order, media}: any) {
      return {
        title: `${order}. ${title}`,
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
