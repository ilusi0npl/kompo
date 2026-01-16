import { Rule } from 'sanity'

/**
 * Fundacja Page Schema
 *
 * Singleton document for foundation page configuration
 *
 * Features:
 * - Page colors (background, lines, text)
 * - Foundation registration data (KRS, REGON, NIP, bank account, email)
 * - Projects list with optional links
 * - Accessibility declaration (multilingual)
 */
export default {
  name: 'fundacjaPage',
  title: 'Strona Fundacja',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      initialValue: 'Fundacja',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'backgroundColor',
      title: 'Kolor tła',
      type: 'color',
      description: 'Jasny zielony kolor tła (#34B898)',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'lineColor',
      title: 'Kolor linii',
      type: 'color',
      description: 'Ciemny zielony kolor linii (#01936F)',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'textColor',
      title: 'Kolor tekstu',
      type: 'color',
      description: 'Kolor tekstu (#131313)',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'linkColor',
      title: 'Kolor linków',
      type: 'color',
      description: 'Kolor linków (#761FE0)',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'krs',
      title: 'KRS',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'regon',
      title: 'REGON',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'nip',
      title: 'NIP',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'bankAccount',
      title: 'Numer konta bankowego',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: Rule) =>
        Rule.required().email().uppercase().custom((email) => {
          if (email && email !== email.toUpperCase()) {
            return 'Email musi być wielkimi literami'
          }
          return true
        }),
    },
    {
      name: 'projects',
      title: 'Projekty',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'project',
          title: 'Projekt',
          fields: [
            {
              name: 'text',
              title: 'Opis projektu',
              type: 'text',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'linkText',
              title: 'Tekst linku (opcjonalny)',
              type: 'string',
            },
            {
              name: 'linkUrl',
              title: 'URL linku (opcjonalny)',
              type: 'url',
            },
          ],
          preview: {
            select: {
              title: 'text',
              subtitle: 'linkText',
            },
          },
        },
      ],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'accessibilityDeclarationPl',
      title: 'Deklaracja dostępności (PL)',
      type: 'array',
      of: [{ type: 'text' }],
      description: '3 akapity deklaracji dostępności w języku polskim',
      validation: (Rule: Rule) => Rule.required().length(3),
    },
    {
      name: 'accessibilityDeclarationEn',
      title: 'Deklaracja dostępności (EN)',
      type: 'array',
      of: [{ type: 'text' }],
      description: '3 akapity deklaracji dostępności w języku angielskim',
      validation: (Rule: Rule) => Rule.required().length(3),
    },
    {
      name: 'publishedAt',
      title: 'Opublikowano',
      type: 'datetime',
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      krs: 'krs',
    },
    prepare(selection: { title: string; krs: string }) {
      const { title, krs } = selection
      return {
        title: title || 'Fundacja',
        subtitle: `KRS: ${krs}`,
      }
    },
  },
}
