/**
 * GROQ Queries for Kompopolex CMS
 *
 * GROQ Syntax Guide:
 * - *[filter] - Query documents with filter
 * - defined(field) - Field exists and is not null
 * - order(field asc/desc) - Sort results
 * - "alias": field.nested->ref - Dereference and alias
 * - [0] - Get first element
 * - $param - Query parameter
 */

// Upcoming events (published only, sorted by date ascending)
export const upcomingEventsQuery = `
  *[_type == "event" && status == "upcoming" && defined(publishedAt)] | order(date asc) {
    _id,
    title,
    date,
    performers,
    program,
    description,
    location,
    "imageUrl": image.asset->url,
    imageStyle
  }
`

// Archived events (published only, sorted by date descending)
export const archivedEventsQuery = `
  *[_type == "event" && status == "archived" && defined(publishedAt)] | order(date desc) {
    _id,
    title,
    date,
    performers,
    program,
    description,
    location,
    "imageUrl": image.asset->url,
    imageStyle
  }
`

// All events (for testing, includes drafts)
export const allEventsQuery = `
  *[_type == "event"] | order(date desc) {
    _id,
    title,
    date,
    status,
    publishedAt,
    "imageUrl": image.asset->url
  }
`

// Bio profiles (published only, sorted by order ascending)
export const bioProfilesQuery = `
  *[_type == "bioProfile" && defined(publishedAt)] | order(order asc) {
    _id,
    name,
    order,
    "backgroundColor": backgroundColor.hex,
    "lineColor": lineColor.hex,
    "textColor": textColor.hex,
    "imageUrl": image.asset->url,
    imageStyle,
    paragraphs,
    paragraphTops,
    hasFooter
  }
`

// Single event by ID
export const eventByIdQuery = `
  *[_type == "event" && _id == $id][0] {
    _id,
    title,
    date,
    performers,
    program,
    description,
    location,
    "imageUrl": image.asset->url,
    imageStyle,
    status,
    publishedAt
  }
`

// Media items (published only)
export const mediaItemsQuery = `
  *[_type == "mediaItem" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    type,
    "imageUrl": file.asset->url,
    videoUrl,
    publishedAt
  }
`
