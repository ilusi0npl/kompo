import { Rule } from 'sanity'

/**
 * Review Event Schema
 *
 * One document per reviewed event (concert or festival appearance).
 * Each event holds one or more press reviews; only the excerpt about
 * Kompopolex is pasted here, the full text stays behind the source link.
 */
export default {
  name: 'reviewEvent',
  title: 'Recenzje',
  type: 'document',
  fields: [
    {
      name: 'titlePl',
      title: 'Wydarzenie (PL)',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'titleEn',
      title: 'Wydarzenie (EN)',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Adres strony',
      type: 'slug',
      description: 'Kliknij "Generate" - tworzy adres /media/recenzje/...',
      options: { source: 'titlePl', maxLength: 80 },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'festivalPl',
      title: 'Festiwal / organizator (PL)',
      type: 'string',
    },
    {
      name: 'festivalEn',
      title: 'Festiwal / organizator (EN)',
      type: 'string',
    },
    {
      name: 'date',
      title: 'Data wydarzenia',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'placePl',
      title: 'Miejsce (PL)',
      type: 'string',
    },
    {
      name: 'placeEn',
      title: 'Miejsce (EN)',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Zdjęcie na kafelku',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'reviews',
      title: 'Recenzje',
      type: 'array',
      validation: (Rule: Rule) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'review',
          title: 'Recenzja',
          fields: [
            { name: 'outlet', title: 'Portal / czasopismo', type: 'string', validation: (Rule: Rule) => Rule.required() },
            { name: 'author', title: 'Autor/ka', type: 'string' },
            { name: 'publishedOn', title: 'Data publikacji', type: 'string', description: 'Np. 07.12.2020 albo 12.2020' },
            { name: 'url', title: 'Link do recenzji', type: 'url', validation: (Rule: Rule) => Rule.required() },
            { name: 'sourceTitle', title: 'Tytuł artykułu (w oryginale)', type: 'string', validation: (Rule: Rule) => Rule.required() },
            {
              name: 'textPl',
              title: 'Fragment recenzji (PL)',
              type: 'text',
              rows: 10,
              description: 'Wklej tekst. Pusta linia = nowy akapit.',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'textEn',
              title: 'Fragment recenzji (EN)',
              type: 'text',
              rows: 10,
              description: 'Tłumaczenie fragmentu. Puste = na stronie EN pokaże się tekst polski.',
            },
            { name: 'photo', title: 'Zdjęcie (opcjonalne)', type: 'image', options: { hotspot: true } },
            { name: 'photoCaptionPl', title: 'Podpis zdjęcia (PL)', type: 'string' },
            { name: 'photoCaptionEn', title: 'Podpis zdjęcia (EN)', type: 'string' },
          ],
          preview: {
            select: { title: 'outlet', subtitle: 'author' },
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - wydarzenie z recenzjami jest widoczne na stronie',
    },
  ],
  preview: {
    select: { title: 'titlePl', subtitle: 'date', media: 'image' },
  },
  orderings: [
    {
      title: 'Data wydarzenia (najnowsze)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
}
