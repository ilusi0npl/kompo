import type {Rule} from '@sanity/types'

export default {
  name: 'bioProfile',
  title: 'Profile Bio',
  type: 'document',
  fields: [
    {
      name: 'slug',
      title: 'Slug (identyfikator)',
      type: 'string',
      description: 'Unique identifier used by the website to find this profile (e.g. "ensemble").',
    },
    // Bilingual name fields
    {
      name: 'namePl',
      title: 'Nazwa (PL)',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'nameEn',
      title: 'Nazwa (EN)',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    // Old name field - hidden for backward compatibility
    {
      name: 'name',
      title: 'Nazwa (deprecated)',
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
    // Unified paragraphs with bilingual text and visibility control
    {
      name: 'paragraphs',
      title: 'Akapity / Paragraphs',
      type: 'array',
      description: 'Each paragraph contains PL/EN text and visibility control (main Bio page, "More" page, or both).',
      of: [
        {
          type: 'object',
          name: 'bioParagraph',
          fields: [
            {
              name: 'textPl',
              title: 'Tekst (PL)',
              type: 'text',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'textEn',
              title: 'Text (EN)',
              type: 'text',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'display',
              title: 'Gdzie wyświetlać / Where to display',
              type: 'string',
              options: {
                list: [
                  {title: 'Strona główna Bio / Main Bio page', value: 'main'},
                  {title: 'Strona "Więcej" / "More" page', value: 'more'},
                  {title: 'Oba / Both', value: 'both'},
                ],
                layout: 'radio',
              },
              initialValue: 'both',
              validation: (Rule: Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {textPl: 'textPl', display: 'display'},
            prepare({textPl, display}: any) {
              const labels: Record<string, string> = {main: 'Bio glowna', more: 'Wiecej', both: 'Oba'}
              return {
                title: (textPl?.substring(0, 80) || '') + '...',
                subtitle: labels[display] || display,
              }
            },
          },
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
    // Old paragraph fields - hidden for backward compatibility (data preserved for rollback)
    {
      name: 'paragraphsPl',
      title: 'Paragrafy PL (deprecated)',
      type: 'array',
      of: [{type: 'text'}],
      hidden: true,
    },
    {
      name: 'paragraphsEn',
      title: 'Paragrafy EN (deprecated)',
      type: 'array',
      of: [{type: 'text'}],
      hidden: true,
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
      title: 'namePl',
      media: 'image',
    },
    prepare({title, media}: any) {
      return {
        title,
        media,
      }
    },
  },
}
