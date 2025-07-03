/**
 * Truncates text content for preview display
 * @param content - The content to truncate
 * @param maxLength - Maximum character length (default: 200)
 * @returns Object with truncated text and whether it was truncated
 */
export function truncateContent(
  content: string,
  maxLength: number = 200
): { text: string; isTruncated: boolean } {
  if (!content) {
    return { text: '', isTruncated: false };
  }

  // First try to truncate at first paragraph break
  const firstParagraph = content.split('\n\n')[0]?.trim() || content;

  // If first paragraph is short enough, use it
  if (firstParagraph.length <= maxLength) {
    const isTruncated = firstParagraph !== content.trim();
    return { text: firstParagraph, isTruncated };
  }

  // Otherwise, truncate at character limit, trying to break at word boundary
  if (content.length <= maxLength) {
    return { text: content, isTruncated: false };
  }

  const truncated = content.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  // If we can break at a word boundary, do so
  const finalText =
    lastSpaceIndex > maxLength * 0.8
      ? truncated.substring(0, lastSpaceIndex)
      : truncated;

  return { text: finalText, isTruncated: true };
}
