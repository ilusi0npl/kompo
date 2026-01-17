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
      name: 'ticketUrl',
      title: 'Link do biletu',
      type: 'url',
      description: 'URL do strony z biletami (opcjonalne)',
      validation: (Rule: Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    },
    {
      name: 'showTicketButton',
      title: 'Pokaż przycisk "Kup bilet"',
      type: 'boolean',
      description: 'Czy wyświetlić przycisk kupna biletu na stronie wydarzenia',
      initialValue: false,
    },
    {
      name: 'partners',
      title: 'Partnerzy',
      type: 'array',
      description: 'Lista partnerów wydarzenia (wyświetlana na dole strony)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Nazwa partnera',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'logo',
              type: 'image',
              title: 'Logo partnera',
              options: {hotspot: true},
              validation: (Rule: Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
            },
          },
        },
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
