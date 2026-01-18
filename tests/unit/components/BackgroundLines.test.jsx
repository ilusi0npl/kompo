import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BackgroundLines from '../../../src/components/BackgroundLines/BackgroundLines'

describe('BackgroundLines', () => {
  it('should render desktop lines at correct positions', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={1} />
    )

    const lines = container.querySelectorAll('.absolute.top-0.h-full')
    expect(lines).toHaveLength(6)

    const expectedPositions = [155, 375, 595, 815, 1035, 1255]
    lines.forEach((line, index) => {
      expect(line.style.left).toBe(`${expectedPositions[index]}px`)
    })
  })

  it('should render mobile lines at correct positions', () => {
    const { container } = render(
      <BackgroundLines isMobile={true} lineColor="#A0E38A" scale={1} />
    )

    const lines = container.querySelectorAll('.absolute.top-0.h-full')
    expect(lines).toHaveLength(3)

    const expectedPositions = [97, 195, 292]
    lines.forEach((line, index) => {
      expect(line.style.left).toBe(`${expectedPositions[index]}px`)
    })
  })

  it('should apply line color correctly', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#FF0000" scale={1} />
    )

    const lines = container.querySelectorAll('.absolute.top-0.h-full')
    lines.forEach((line) => {
      expect(line.style.backgroundColor).toBe('#FF0000')
    })
  })

  it('should apply scale to line positions', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={0.5} />
    )

    const lines = container.querySelectorAll('.absolute.top-0.h-full')
    const expectedPositions = [155, 375, 595, 815, 1035, 1255]
    lines.forEach((line, index) => {
      expect(line.style.left).toBe(`${expectedPositions[index] * 0.5}px`)
    })
  })

  it('should position desktop lines at [155, 375, 595, 815, 1035, 1255]', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={1} />
    )

    const lines = container.querySelectorAll('.absolute.top-0.h-full')
    const positions = Array.from(lines).map((line) => parseInt(line.style.left))

    expect(positions).toEqual([155, 375, 595, 815, 1035, 1255])
  })

  it('should position mobile lines at [97, 195, 292]', () => {
    const { container } = render(
      <BackgroundLines isMobile={true} lineColor="#A0E38A" scale={1} />
    )

    const lines = container.querySelectorAll('.absolute.top-0.h-full')
    const positions = Array.from(lines).map((line) => parseInt(line.style.left))

    expect(positions).toEqual([97, 195, 292])
  })

  it('should render lines with 1px width', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={1} />
    )

    const lines = container.querySelectorAll('.absolute.top-0.h-full')
    lines.forEach((line) => {
      expect(line.style.width).toBe('1px')
    })
  })

  it('should render lines with full height (100%)', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={1} />
    )

    const lines = container.querySelectorAll('.absolute.top-0.h-full')
    lines.forEach((line) => {
      expect(line).toHaveClass('h-full')
    })
  })
})
