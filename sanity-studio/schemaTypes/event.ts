import type {Rule} from '@sanity/types'

const alignedBlock = {
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'Left', value: 'left'},
    {title: 'Center', value: 'center'},
    {title: 'Right', value: 'right'},
    {title: 'Justify', value: 'justify'},
  ],
}

export default {
  name: 'event',
  title: 'Wydarzenia',
  type: 'document',
  fields: [
    // Bilingual title fields
    {
      name: 'titlePl',
      title: 'Tytuł (PL)',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'titleEn',
      title: 'Tytuł (EN)',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    // Old title field - hidden for backward compatibility
    {
      name: 'title',
      title: 'Tytuł (deprecated)',
      type: 'string',
      hidden: true,
    },
    {
      name: 'date',
      title: 'Data i godzina',
      type: 'datetime',
      validation: (Rule: Rule) => Rule.required(),
    },
    // Bilingual performers fields
    {
      name: 'performersPl',
      title: 'Wykonawcy (PL)',
      type: 'text',
      description: 'Opcjonalne - jeśli brak, użyj Program',
    },
    {
      name: 'performersEn',
      title: 'Wykonawcy (EN)',
      type: 'text',
      description: 'Optional - if empty, use Program',
    },
    // Old performers field - hidden for backward compatibility
    {
      name: 'performers',
      title: 'Wykonawcy (deprecated)',
      type: 'text',
      hidden: true,
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
    // Bilingual description fields (Portable Text for rich text formatting)
    {
      name: 'descriptionPl',
      title: 'Opis (PL)',
      type: 'array',
      of: [alignedBlock],
      description: 'Rich text description - supports bold, italic, paragraphs',
    },
    {
      name: 'descriptionEn',
      title: 'Opis (EN)',
      type: 'array',
      of: [alignedBlock],
      description: 'Rich text description - supports bold, italic, paragraphs',
    },
    // Old description field - hidden for backward compatibility
    {
      name: 'description',
      title: 'Opis (deprecated)',
      type: 'text',
      hidden: true,
    },
    // Bilingual location fields
    {
      name: 'locationPl',
      title: 'Lokalizacja (PL)',
      type: 'text',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'locationEn',
      title: 'Lokalizacja (EN)',
      type: 'text',
      validation: (Rule: Rule) => Rule.required(),
    },
    // Old location field - hidden for backward compatibility
    {
      name: 'location',
      title: 'Lokalizacja (deprecated)',
      type: 'text',
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
      title: 'titlePl',
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
