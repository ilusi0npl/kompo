import { Rule } from 'sanity'

/**
 * Fundacja Page Schema
 *
 * Singleton document for foundation page configuration
 *
 * Features:
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
            // Bilingual text fields
            {
              name: 'textPl',
              title: 'Opis projektu (PL)',
              type: 'text',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'textEn',
              title: 'Opis projektu (EN)',
              type: 'text',
              validation: (Rule: Rule) => Rule.required(),
            },
            // Old text field - hidden for backward compatibility
            {
              name: 'text',
              title: 'Opis projektu (deprecated)',
              type: 'text',
              hidden: true,
            },
            // Bilingual link text fields
            {
              name: 'linkTextPl',
              title: 'Tekst linku PL (opcjonalny)',
              type: 'string',
            },
            {
              name: 'linkTextEn',
              title: 'Tekst linku EN (opcjonalny)',
              type: 'string',
            },
            // Old linkText field - hidden for backward compatibility
            {
              name: 'linkText',
              title: 'Tekst linku (deprecated)',
              type: 'string',
              hidden: true,
            },
            {
              name: 'linkUrl',
              title: 'URL linku (opcjonalny)',
              type: 'url',
            },
          ],
          preview: {
            select: {
              title: 'textPl',
              subtitle: 'linkTextPl',
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
      krs: 'krs',
    },
    prepare(selection: { krs: string }) {
      const { krs } = selection
      return {
        title: 'Fundacja',
        subtitle: `KRS: ${krs}`,
      }
    },
  },
}
