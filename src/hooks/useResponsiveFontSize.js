/**
 * useResponsiveFontSize Hook
 *
 * Calculates font size that fits content within a container.
 * Only reduces font size when content exceeds the limit.
 *
 * @param {Object} options
 * @param {number} options.baseFontSize - Default font size (px)
 * @param {number} options.minFontSize - Minimum allowed font size (px)
 * @param {number} options.maxHeight - Maximum container height (px)
 * @param {number} options.contentLength - Length of content (characters or paragraphs)
 * @param {number} options.threshold - Content length threshold before scaling starts
 * @param {number} options.lineHeight - Line height multiplier (default 1.48)
 * @returns {number} Calculated font size in pixels
 */
export function useResponsiveFontSize({
  baseFontSize = 16,
  minFontSize = 12,
  maxHeight = 500,
  contentLength = 0,
  threshold = 500,
  lineHeight = 1.48,
}) {
  // If content is below threshold, use base font size
  if (contentLength <= threshold) {
    return baseFontSize;
  }

  // Calculate scale factor based on how much content exceeds threshold
  // More content = smaller font
  const excessRatio = contentLength / threshold;
  const scaleFactor = 1 / Math.sqrt(excessRatio); // Square root for gentler scaling

  const calculatedSize = Math.round(baseFontSize * scaleFactor);

  // Clamp between min and base
  return Math.max(minFontSize, Math.min(baseFontSize, calculatedSize));
}

/**
 * Calculate responsive font size for bio paragraphs
 *
 * @param {string[]} paragraphs - Array of paragraph texts
 * @param {Object} options
 * @param {number} options.baseFontSize - Default font size (default: 16)
 * @param {number} options.minFontSize - Minimum font size (default: 12)
 * @param {number} options.maxParagraphs - Max paragraphs before scaling (default: 2)
 * @param {number} options.maxCharsPerParagraph - Max chars per paragraph before scaling (default: 400)
 * @returns {number} Font size in pixels
 */
export function calculateBioFontSize(paragraphs, options = {}) {
  const {
    baseFontSize = 16,
    minFontSize = 12,
    maxParagraphs = 2,
    maxCharsPerParagraph = 400,
  } = options;

  if (!paragraphs || paragraphs.length === 0) {
    return baseFontSize;
  }

  const paragraphCount = paragraphs.length;
  const totalChars = paragraphs.reduce((sum, p) => sum + (p?.length || 0), 0);
  const avgCharsPerParagraph = totalChars / paragraphCount;

  // Calculate overflow factors
  const paragraphOverflow = paragraphCount / maxParagraphs;
  const charOverflow = avgCharsPerParagraph / maxCharsPerParagraph;

  // If within limits, use base font size
  if (paragraphOverflow <= 1 && charOverflow <= 1) {
    return baseFontSize;
  }

  // Scale based on the larger overflow
  const maxOverflow = Math.max(paragraphOverflow, charOverflow);
  const scaleFactor = 1 / Math.pow(maxOverflow, 0.4); // Gentle scaling curve

  const calculatedSize = Math.round(baseFontSize * scaleFactor);

  return Math.max(minFontSize, Math.min(baseFontSize, calculatedSize));
}

/**
 * Calculate responsive title font size
 *
 * @param {string} name - Profile name
 * @param {Object} options
 * @param {number} options.baseFontSize - Default font size (default: 40)
 * @param {number} options.minFontSize - Minimum font size (default: 28)
 * @param {number} options.maxChars - Max characters before scaling (default: 20)
 * @returns {number} Font size in pixels
 */
export function calculateTitleFontSize(name, options = {}) {
  const {
    baseFontSize = 40,
    minFontSize = 28,
    maxChars = 20,
  } = options;

  if (!name || name.length <= maxChars) {
    return baseFontSize;
  }

  // Scale down for longer names
  const overflow = name.length / maxChars;
  const scaleFactor = 1 / Math.pow(overflow, 0.5);

  const calculatedSize = Math.round(baseFontSize * scaleFactor);

  return Math.max(minFontSize, Math.min(baseFontSize, calculatedSize));
}
