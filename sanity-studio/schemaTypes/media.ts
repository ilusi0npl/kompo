import type {Rule} from '@sanity/types'

export default {
  name: 'mediaItem',
  title: 'Media',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
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
      hidden: ({parent}: any) => parent?.type === 'video',
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
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - media jest opublikowane',
    },
  ],
  preview: {
    select: {
      title: 'title',
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
}
