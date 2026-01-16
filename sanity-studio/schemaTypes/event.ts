import type {Rule} from '@sanity/types'

export default {
  name: 'event',
  title: 'Wydarzenia',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Data i godzina',
      type: 'datetime',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'performers',
      title: 'Wykonawcy',
      type: 'text',
      description: 'Opcjonalne - jeśli brak, użyj Program',
    },
    {
      name: 'program',
      title: 'Program',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'composer',
            type: 'string',
            title: 'Kompozytor',
            validation: (Rule: Rule) => Rule.required(),
          },
          {
            name: 'piece',
            type: 'string',
            title: 'Utwór',
            validation: (Rule: Rule) => Rule.required(),
          },
        ],
      }],
    },
    {
      name: 'description',
      title: 'Opis',
      type: 'text',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Lokalizacja',
      type: 'text',
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
        {name: 'objectFit', type: 'string', title: 'Object Fit'},
        {name: 'objectPosition', type: 'string', title: 'Object Position'},
        {name: 'width', type: 'string', title: 'Width'},
        {name: 'height', type: 'string', title: 'Height'},
        {name: 'left', type: 'string', title: 'Left'},
        {name: 'top', type: 'string', title: 'Top'},
      ],
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Nadchodzące', value: 'upcoming'},
          {title: 'Archiwalne', value: 'archived'},
        ],
        layout: 'radio',
      },
      validation: (Rule: Rule) => Rule.required(),
      initialValue: 'upcoming',
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - event jest opublikowany na stronie',
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
      status: 'status',
    },
    prepare({title, date, media, status}: any) {
      const dateStr = date ? new Date(date).toLocaleDateString('pl-PL') : 'Brak daty'
      const statusLabel = status === 'upcoming' ? '📅' : '📦'
      return {
        title: `${statusLabel} ${title}`,
        subtitle: dateStr,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Data (najnowsze)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Data (najstarsze)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
}
