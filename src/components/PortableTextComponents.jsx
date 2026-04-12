/**
 * Shared custom block renderers for Sanity Portable Text.
 * Adds text alignment support (left, center, right, justify).
 */
export const portableTextComponents = {
  block: {
    left: ({ children }) => (
      <p style={{ textAlign: 'left' }}>{children}</p>
    ),
    center: ({ children }) => (
      <p style={{ textAlign: 'center' }}>{children}</p>
    ),
    right: ({ children }) => (
      <p style={{ textAlign: 'right' }}>{children}</p>
    ),
    justify: ({ children }) => (
      <p style={{ textAlign: 'justify' }}>{children}</p>
    ),
  },
}
