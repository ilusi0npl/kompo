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
    "imageUrl": image.asset->url
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
    "imageUrl": image.asset->url
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

// Bio profiles (published only, sorted by creation date ascending)
export const bioProfilesQuery = `
  *[_type == "bioProfile" && defined(publishedAt)] | order(_createdAt asc) {
    _id,
    name,
    "imageUrl": image.asset->url,
    paragraphs
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

// Video items (published only, type="video")
export const videoItemsQuery = `
  *[_type == "mediaItem" && type == "video" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    videoUrl,
    "thumbnailUrl": thumbnail.asset->url
  }
`

// Homepage slides (published only, sorted by creation date ascending)
export const homepageSlidesQuery = `
  *[_type == "homepageSlide" && defined(publishedAt)] | order(_createdAt asc) {
    _id,
    word,
    tagline,
    "imageUrl": image.asset->url
  }
`

// Kontakt page (singleton, published only)
export const kontaktPageQuery = `
  *[_type == "kontaktPage" && defined(publishedAt)][0] {
    email,
    "teamImageUrl": teamImage.asset->url
  }
`

// Fundacja page (singleton, published only)
export const fundacjaPageQuery = `
  *[_type == "fundacjaPage" && defined(publishedAt)][0] {
    krs,
    regon,
    nip,
    bankAccount,
    email,
    projects,
    accessibilityDeclarationPl,
    accessibilityDeclarationEn
  }
`

// Photo albums (published only, sorted by creation date ascending)
export const photoAlbumsQuery = `
  *[_type == "photoAlbum" && defined(publishedAt)] | order(_createdAt asc) {
    _id,
    title,
    photographer,
    "thumbnailUrl": thumbnail.asset->url,
    "imageUrls": images[].asset->url
  }
`

// Repertuar composers (published only, sorted by creation date ascending)
export const repertuarComposersQuery = `
  *[_type == "composer" && category == "repertuar" && defined(publishedAt)] | order(_createdAt asc) {
    _id,
    name,
    year,
    works
  }
`

// Specialne composers (published only, sorted by creation date ascending)
export const specialneComposersQuery = `
  *[_type == "composer" && category == "specialne" && defined(publishedAt)] | order(_createdAt asc) {
    _id,
    name,
    year,
    works
  }
`
