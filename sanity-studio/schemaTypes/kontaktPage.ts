import { Rule } from 'sanity'

/**
 * Kontakt Page Schema
 *
 * Singleton document for contact page configuration
 *
 * Features:
 * - Contact email
 * - Team photo
 */
export default {
  name: 'kontaktPage',
  title: 'Strona Kontakt',
  type: 'document',
  fields: [
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
      email: 'email',
      media: 'teamImage',
    },
    prepare(selection: { email: string; media: any }) {
      const { email } = selection
      return {
        title: 'Kontakt',
        subtitle: email,
        media: selection.media,
      }
    },
  },
}
