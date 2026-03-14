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
    // Bilingual title fields
    {
      name: 'titlePl',
      title: 'Tytuł albumu (PL)',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'titleEn',
      title: 'Tytuł albumu (EN)',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    // Old title field - hidden for backward compatibility
    {
      name: 'title',
      title: 'Tytuł albumu (deprecated)',
      type: 'string',
      hidden: true,
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
      description: 'Prosta lista zdjęć (używaj tej opcji LUB sekcji poniżej)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule: Rule) => Rule.custom((images: any[] | undefined, context: any) => {
        const sections = context.document?.sections
        if ((!images || images.length === 0) && (!sections || sections.length === 0)) {
          return 'Album musi mieć zdjęcia lub sekcje'
        }
        return true
      }),
    },
    {
      name: 'sections',
      title: 'Sekcje albumu',
      description: 'Opcjonalne: organizuj zdjęcia w nazwane grupy (np. "Scena", "Publiczność")',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'albumSection',
          fields: [
            {
              name: 'namePl',
              title: 'Nazwa sekcji (PL)',
              type: 'string',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'nameEn',
              title: 'Nazwa sekcji (EN)',
              type: 'string',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'images',
              title: 'Zdjęcia',
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
          ],
          preview: {
            select: {
              title: 'namePl',
              images: 'images',
            },
            prepare(selection: { title: string; images: any[] }) {
              const { title, images } = selection
              return {
                title: title || 'Bez nazwy',
                subtitle: `${images?.length || 0} zdjęć`,
              }
            },
          },
        },
      ],
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
      title: 'titlePl',
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
