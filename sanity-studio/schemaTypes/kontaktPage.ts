import { Rule } from 'sanity'

/**
 * Kontakt Page Schema
 *
 * Singleton document for contact page configuration
 *
 * Features:
 * - Page colors (background, lines)
 * - Contact email
 * - Team photo
 */
export default {
  name: 'kontaktPage',
  title: 'Strona Kontakt',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      initialValue: 'Kontakt',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'backgroundColor',
      title: 'Kolor tła',
      type: 'color',
      description: 'Pomarańczowy kolor tła strony (#FF734C)',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'lineColor',
      title: 'Kolor linii',
      type: 'color',
      description: 'Żółty kolor pionowych linii (#FFBD19)',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email kontaktowy',
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
      name: 'teamImage',
      title: 'Zdjęcie zespołu',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: Rule) => Rule.required(),
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
      email: 'email',
      media: 'teamImage',
    },
    prepare(selection: { title: string; email: string; media: any }) {
      const { title, email } = selection
      return {
        title: title || 'Kontakt',
        subtitle: email,
        media: selection.media,
      }
    },
  },
}
