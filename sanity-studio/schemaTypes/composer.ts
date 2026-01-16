import type {Rule} from '@sanity/types'

export default {
  name: 'composer',
  title: 'Kompozytor',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Imię i nazwisko',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Rok urodzenia (opcjonalnie śmierci)',
      type: 'string',
      description: 'Format: (1975) lub (1929-2019) lub puste',
    },
    {
      name: 'works',
      title: 'Utwory',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'work',
          title: 'Utwór',
          fields: [
            {
              name: 'title',
              title: 'Tytuł utworu',
              type: 'string',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'isSpecial',
              title: 'Napisany specjalnie dla Ensemble Kompopolex?',
              type: 'boolean',
              description: 'Zaznacz, jeśli utwór został skomponowany na zamówienie zespołu',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'title',
              isSpecial: 'isSpecial',
            },
            prepare({title, isSpecial}: any) {
              return {
                title: isSpecial ? `⭐ ${title}` : title,
                subtitle: isSpecial ? 'Specjalnie dla Ensemble Kompopolex' : 'Repertuar',
              }
            },
          },
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
    {
      name: 'category',
      title: 'Kategoria',
      type: 'string',
      options: {
        list: [
          {title: 'Repertuar', value: 'repertuar'},
          {title: 'Projekty Specjalne', value: 'specialne'},
        ],
        layout: 'radio',
      },
      validation: (Rule: Rule) => Rule.required(),
      description: 'Wybierz, gdzie kompozytor powinien się wyświetlać',
    },
    {
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      description: 'Kolejność w liście (1, 2, 3, ...)',
      validation: (Rule: Rule) => Rule.required().min(1).integer(),
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - kompozytor jest opublikowany',
    },
  ],
  preview: {
    select: {
      name: 'name',
      year: 'year',
      category: 'category',
      worksCount: 'works',
    },
    prepare({name, year, category, worksCount}: any) {
      const categoryLabel = category === 'repertuar' ? '📚' : '⭐'
      return {
        title: `${categoryLabel} ${name}`,
        subtitle: `${year || ''} • ${worksCount?.length || 0} ${
          worksCount?.length === 1 ? 'utwór' : 'utworów'
        }`,
      }
    },
  },
  orderings: [
    {
      title: 'Kolejność (rosnąco)',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Nazwisko (A-Z)',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
}
