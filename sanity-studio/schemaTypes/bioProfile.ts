import type {Rule} from '@sanity/types'

export default {
  name: 'bioProfile',
  title: 'Profile Bio',
  type: 'document',
  fields: [
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
    // Bilingual paragraphs fields
    {
      name: 'paragraphsPl',
      title: 'Paragrafy (PL)',
      type: 'array',
      of: [{type: 'text'}],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
    {
      name: 'paragraphsEn',
      title: 'Paragrafy (EN)',
      type: 'array',
      of: [{type: 'text'}],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
    // Old paragraphs field - hidden for backward compatibility
    {
      name: 'paragraphs',
      title: 'Paragrafy (deprecated)',
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
