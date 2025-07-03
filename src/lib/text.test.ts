import { truncateContent } from './text';

describe('truncateContent', () => {
  it('returns empty text for empty input', () => {
    const result = truncateContent('');
    expect(result).toEqual({ text: '', isTruncated: false });
  });

  it('returns original text when under limit', () => {
    const content = 'This is a short text.';
    const result = truncateContent(content, 100);
    expect(result).toEqual({ text: content, isTruncated: false });
  });

  it('truncates at first paragraph break when available', () => {
    const content = 'First paragraph text.\n\nSecond paragraph text.';
    const result = truncateContent(content, 200);
    expect(result).toEqual({
      text: 'First paragraph text.',
      isTruncated: true,
    });
  });

  it('truncates long single paragraph at word boundary', () => {
    const content =
      'This is a very long text that should be truncated at a word boundary to avoid cutting words in the middle of them.';
    const result = truncateContent(content, 50);
    expect(result.text.length).toBeLessThanOrEqual(50);
    expect(result.isTruncated).toBe(true);
    // Check that we broke at a word boundary (should end with a complete word)
    expect(result.text).toMatch(/\w$/);
    // The result should be "This is a very long text that should be truncated"
    expect(result.text).toBe(
      'This is a very long text that should be truncated'
    );
  });

  it('truncates even when no good word boundary exists', () => {
    const content =
      'Verylongwordwithoutanyspacesinitthatcannotbebrokenatwordboundary';
    const result = truncateContent(content, 30);
    expect(result.text.length).toBeLessThanOrEqual(30);
    expect(result.isTruncated).toBe(true);
  });

  it('uses default max length when not specified', () => {
    const content = 'A'.repeat(300); // 300 character string
    const result = truncateContent(content);
    expect(result.text.length).toBeLessThanOrEqual(200);
    expect(result.isTruncated).toBe(true);
  });

  it('handles content with only newlines', () => {
    const content = 'First line\nSecond line\nThird line';
    const result = truncateContent(content, 100);
    expect(result).toEqual({ text: content, isTruncated: false });
  });
});
