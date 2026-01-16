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
 * - Order for display
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
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().min(1).integer(),
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
      order: 'order',
    },
    prepare(selection: { title: string; photographer: string; media: any; order: number }) {
      const { title, photographer, order } = selection
      return {
        title: `${order}. ${title}`,
        subtitle: `Fotograf: ${photographer}`,
        media: selection.media,
      }
    },
  },
  orderings: [
    {
      title: 'Kolejność (rosnąco)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Data publikacji (najnowsze)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
}
