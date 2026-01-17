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
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'paragraphs',
      title: 'Paragrafy',
      type: 'array',
      of: [{type: 'text'}],
      validation: (Rule: Rule) => Rule.required().min(1),
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
