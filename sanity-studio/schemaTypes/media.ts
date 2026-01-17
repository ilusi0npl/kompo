import type {Rule} from '@sanity/types'

export default {
  name: 'mediaItem',
  title: 'Media',
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
    // Bilingual description fields
    {
      name: 'descriptionPl',
      title: 'Opis (PL)',
      type: 'text',
    },
    {
      name: 'descriptionEn',
      title: 'Opis (EN)',
      type: 'text',
    },
    {
      name: 'type',
      title: 'Typ',
      type: 'string',
      options: {
        list: [
          {title: 'Zdjęcie', value: 'photo'},
          {title: 'Wideo', value: 'video'},
        ],
        layout: 'radio',
      },
      validation: (Rule: Rule) => Rule.required(),
      initialValue: 'photo',
    },
    {
      name: 'file',
      title: 'Plik',
      type: 'image',
      description: 'Upload zdjęcia',
      options: {hotspot: true},
      hidden: ({parent}: any) => parent?.type === 'video',
      validation: (Rule: Rule) => Rule.custom((file: any, context: any) => {
        const type = context.parent?.type
        if (type === 'photo' && !file) {
          return 'Plik zdjęcia jest wymagany'
        }
        return true
      }),
    },
    {
      name: 'videoUrl',
      title: 'URL Wideo (YouTube/Vimeo)',
      type: 'url',
      description: 'Link do wideo na YouTube lub Vimeo',
      hidden: ({parent}: any) => parent?.type !== 'video',
      validation: (Rule: Rule) => Rule.custom((url: any, context: any) => {
        const type = context.parent?.type
        if (type === 'video' && !url) {
          return 'URL wideo jest wymagany'
        }
        return true
      }),
    },
    {
      name: 'thumbnail',
      title: 'Miniatura (dla wideo)',
      type: 'image',
      description: 'Miniatura wyświetlana dla filmu',
      options: {hotspot: true},
      hidden: ({parent}: any) => parent?.type !== 'video',
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - media jest opublikowane',
    },
  ],
  preview: {
    select: {
      title: 'titlePl',
      type: 'type',
      media: 'file',
    },
    prepare({title, type, media}: any) {
      const icon = type === 'photo' ? '📷' : '🎥'
      return {
        title: `${icon} ${title}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Data publikacji (najnowsze)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Tytuł (A-Z)',
      name: 'titleAsc',
      by: [{field: 'titlePl', direction: 'asc'}],
    },
  ],
}
