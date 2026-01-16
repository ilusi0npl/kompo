import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'kompopolex',
  title: 'Kompopolex CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  deployment: {
    appId: 'tdpjn80tkyc9hgx4hvgvrv21',
  },

  plugins: [
    structureTool({structure}),
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
