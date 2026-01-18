import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageToggle from '../../../src/components/LanguageToggle/LanguageToggle'
import { LanguageProvider } from '../../../src/context/LanguageContext'

describe('LanguageToggle', () => {
  beforeEach(() => {
    // Reset localStorage mock
    localStorage.getItem.mockReturnValue(null)
    localStorage.setItem.mockClear()
    vi.clearAllMocks()
  })

  it('should render "ENG" when language is Polish', () => {
    // Default language is 'pl'
    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    expect(screen.getByText('ENG')).toBeInTheDocument()
    expect(screen.queryByText('PL')).not.toBeInTheDocument()
  })

  it('should render "PL" when language is English', () => {
    // Set localStorage to return 'en'
    localStorage.getItem.mockReturnValue('en')

    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    expect(screen.getByText('PL')).toBeInTheDocument()
    expect(screen.queryByText('ENG')).not.toBeInTheDocument()
  })

  it('should toggle language from PL to EN when clicked', async () => {
    const user = userEvent.setup()

    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    // Initially shows "ENG" (current language is PL)
    expect(screen.getByText('ENG')).toBeInTheDocument()

    // Click the button
    const button = screen.getByRole('button')
    await user.click(button)

    // After click, should show "PL" (current language is now EN)
    expect(screen.getByText('PL')).toBeInTheDocument()
    expect(screen.queryByText('ENG')).not.toBeInTheDocument()
  })

  it('should toggle language from EN to PL when clicked', async () => {
    const user = userEvent.setup()

    // Set initial language to 'en'
    localStorage.getItem.mockReturnValue('en')

    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    // Initially shows "PL" (current language is EN)
    expect(screen.getByText('PL')).toBeInTheDocument()

    // Click the button
    const button = screen.getByRole('button')
    await user.click(button)

    // After click, should show "ENG" (current language is now PL)
    expect(screen.getByText('ENG')).toBeInTheDocument()
    expect(screen.queryByText('PL')).not.toBeInTheDocument()
  })

  it('should apply custom text color', () => {
    render(
      <LanguageProvider>
        <LanguageToggle textColor="#FF0000" />
      </LanguageProvider>
    )

    const text = screen.getByText('ENG')
    expect(text).toHaveStyle({ color: '#FF0000' })
  })

  it('should apply custom scale', () => {
    const { container } = render(
      <LanguageProvider>
        <LanguageToggle scale={2} />
      </LanguageProvider>
    )

    const text = screen.getByText('ENG')
    // Font size should be 20 * 2 = 40px
    expect(text).toHaveStyle({ fontSize: '40px' })

    // SVG should be 28 * 2 = 56px
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '56')
    expect(svg).toHaveAttribute('height', '56')
  })

  it('should apply custom styles', () => {
    render(
      <LanguageProvider>
        <LanguageToggle style={{ marginTop: '20px', paddingLeft: '10px' }} />
      </LanguageProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ marginTop: '20px', paddingLeft: '10px' })
  })

  it('should include globe icon SVG', () => {
    const { container } = render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    // Check SVG exists
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 28 28')

    // Check path exists (globe icon)
    const path = svg.querySelector('path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('fill', 'currentColor')
  })

  it('should apply transition when provided', () => {
    const { container } = render(
      <LanguageProvider>
        <LanguageToggle transition="0.3s ease" />
      </LanguageProvider>
    )

    const text = screen.getByText('ENG')
    expect(text).toHaveStyle({ transition: 'color 0.3s ease' })

    // SVG should also have transition
    const svg = container.querySelector('svg')
    expect(svg).toHaveStyle({ transition: 'color 0.3s ease' })
  })
})
