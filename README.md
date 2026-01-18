# Kompopolex

Pixel-perfect React implementation from Figma designs with Sanity CMS integration.

## Tech Stack

- **React 18+** - UI framework
- **React Router v7** - Routing
- **Vite** - Build tool and dev server
- **Tailwind CSS 4.x** - Utility-first styling
- **Sanity CMS v3** - Content management

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Dev server (http://localhost:5173/)
npm run build    # Production build
npm run lint     # Check code quality
```

## Testing

Kompopolex has comprehensive test coverage with unit and E2E tests.

### Quick Start
```bash
# Run all tests
npm run test:all

# Unit tests only
npm test

# E2E tests only
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Reports
- **Coverage**: `./coverage/index.html`
- **E2E Report**: `./tmp/playwright-report/index.html`

For detailed testing documentation, see [docs/TESTING.md](docs/TESTING.md).

## Project Documentation

- [CLAUDE.md](CLAUDE.md) - Development guide and Figma integration
- [docs/TESTING.md](docs/TESTING.md) - Testing documentation
- [CMS_PLAN.md](CMS_PLAN.md) - Sanity CMS implementation plan
