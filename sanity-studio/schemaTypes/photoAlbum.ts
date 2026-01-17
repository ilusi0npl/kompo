import { Rule } from 'sanity'

/**
 * Photo Album Schema
 *
 * Schema for photo galleries/albums with multiple images
 *
 * Features:
 * - Album title and photographer credit
 * - Thumbnail image (cover)
 * - Multiple images in the album
 */
export default {
  name: 'photoAlbum',
  title: 'Album Zdjęciowy',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł albumu',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'photographer',
      title: 'Fotograf',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'thumbnail',
      title: 'Miniatura (okładka albumu)',
      type: 'image',
      description: 'Zdjęcie wyświetlane w siatce albumów',
      options: {
        hotspot: true,
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Zdjęcia w albumie',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - album jest opublikowany',
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      photographer: 'photographer',
      media: 'thumbnail',
    },
    prepare(selection: { title: string; photographer: string; media: any }) {
      const { title, photographer } = selection
      return {
        title,
        subtitle: `Fotograf: ${photographer}`,
        media: selection.media,
      }
    },
  },
  orderings: [
    {
      title: 'Data publikacji (najnowsze)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
}
