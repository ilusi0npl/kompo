import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Kompopolex CMS')
    .items([
      // Homepage
      S.listItem()
        .title('🏠 Homepage')
        .child(
          S.list()
            .title('Homepage')
            .items([
              S.documentTypeListItem('homepageSlide')
                .title('Slajdy (3)')
                .icon(() => '📸'),
            ])
        ),

      S.divider(),

      // Bio
      S.listItem()
        .title('👤 Bio')
        .child(
          S.list()
            .title('Bio')
            .items([
              S.documentTypeListItem('bioProfile')
                .title('Profile (4)')
                .icon(() => '👥'),
            ])
        ),

      S.divider(),

      // Kalendarz
      S.listItem()
        .title('📅 Kalendarz')
        .child(
          S.list()
            .title('Kalendarz')
            .items([
              S.listItem()
                .title('Nadchodzące')
                .icon(() => '🔜')
                .child(
                  S.documentTypeList('event')
                    .title('Nadchodzące wydarzenia')
                    .filter('_type == "event" && date >= now() && defined(publishedAt)')
                    .defaultOrdering([{field: 'date', direction: 'asc'}])
                ),
              S.listItem()
                .title('Archiwalne')
                .icon(() => '📦')
                .child(
                  S.documentTypeList('event')
                    .title('Archiwalne wydarzenia')
                    .filter('_type == "event" && date < now() && defined(publishedAt)')
                    .defaultOrdering([{field: 'date', direction: 'desc'}])
                ),
              S.listItem()
                .title('Wszystkie wydarzenia')
                .icon(() => '📋')
                .child(
                  S.documentTypeList('event')
                    .title('Wszystkie wydarzenia')
                    .defaultOrdering([{field: 'date', direction: 'desc'}])
                ),
            ])
        ),

      S.divider(),

      // Media
      S.listItem()
        .title('🎨 Media')
        .child(
          S.list()
            .title('Media')
            .items([
              S.documentTypeListItem('photoAlbum')
                .title('Galeria (Albumy)')
                .icon(() => '📷'),
              S.documentTypeListItem('media')
                .title('Wideo')
                .icon(() => '🎥'),
            ])
        ),

      S.divider(),

      // Repertuar
      S.listItem()
        .title('🎵 Repertuar')
        .child(
          S.documentTypeList('composer')
            .title('Kompozytorzy (Repertuar)')
            .filter('_type == "composer" && category == "repertuar" && defined(publishedAt)')
            .defaultOrdering([{field: 'order', direction: 'asc'}])
        ),

      S.divider(),

      // Projekty Specjalne
      S.listItem()
        .title('⭐ Projekty Specjalne')
        .child(
          S.documentTypeList('composer')
            .title('Kompozytorzy (Projekty Specjalne)')
            .filter('_type == "composer" && category == "specialne" && defined(publishedAt)')
            .defaultOrdering([{field: 'order', direction: 'asc'}])
        ),

      S.divider(),

      // Kontakt
      S.listItem()
        .title('📧 Kontakt')
        .child(
          S.document()
            .schemaType('kontaktPage')
            .documentId('kontaktPage')
            .title('Strona Kontakt')
        ),

      S.divider(),

      // Fundacja
      S.listItem()
        .title('🏛️ Fundacja')
        .child(
          S.document()
            .schemaType('fundacjaPage')
            .documentId('fundacjaPage')
            .title('Strona Fundacja')
        ),

      S.divider(),

      // All Documents (for advanced users)
      S.listItem()
        .title('🔧 Wszystkie dokumenty')
        .child(
          S.list()
            .title('Wszystkie typy dokumentów')
            .items([
              S.documentTypeListItem('bioProfile').title('Bio Profile'),
              S.documentTypeListItem('composer').title('Composers'),
              S.documentTypeListItem('event').title('Events'),
              S.documentTypeListItem('fundacjaPage').title('Fundacja Page'),
              S.documentTypeListItem('homepageSlide').title('Homepage Slides'),
              S.documentTypeListItem('kontaktPage').title('Kontakt Page'),
              S.documentTypeListItem('media').title('Media Items'),
              S.documentTypeListItem('photoAlbum').title('Photo Albums'),
            ])
        ),
    ])
