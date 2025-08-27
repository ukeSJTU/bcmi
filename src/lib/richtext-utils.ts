import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/**
 * Utility function to safely convert Payload CMS richText fields to HTML
 * Handles both Lexical SerializedEditorState objects and fallback strings
 * 
 * @param richTextData - The richText field data from Payload CMS
 * @returns HTML string ready to be rendered with dangerouslySetInnerHTML
 */
export function convertRichTextToHTML(richTextData: unknown): string {
  try {
    if (!richTextData) return ''
    
    // Check if it's already a string (HTML or plain text)
    if (typeof richTextData === 'string') {
      return richTextData
    }
    
    // Check if it's a Lexical SerializedEditorState
    if (typeof richTextData === 'object' && richTextData !== null && 'root' in richTextData) {
      return convertLexicalToHTML({ data: richTextData as SerializedEditorState })
    }
    
    // Fallback: convert to string
    return String(richTextData)
  } catch (error) {
    console.warn('Failed to convert richText to HTML:', error)
    // Return as string if it's a string, otherwise empty
    return typeof richTextData === 'string' ? richTextData : ''
  }
}

/**
 * Extract plain text from richText data for use in meta descriptions, summaries, etc.
 * 
 * @param richTextData - The richText field data from Payload CMS
 * @param maxLength - Maximum length for the extracted text (default: 160)
 * @returns Plain text string
 */
export function extractTextFromRichText(richTextData: unknown, maxLength: number = 160): string {
  try {
    const htmlString = convertRichTextToHTML(richTextData)
    
    // Strip HTML tags and decode entities
    const textContent = htmlString
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with regular space
      .replace(/&amp;/g, '&')  // Decode common HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
    
    // Truncate if needed
    if (textContent.length > maxLength) {
      return textContent.substring(0, maxLength - 3) + '...'
    }
    
    return textContent
  } catch (error) {
    console.warn('Failed to extract text from richText:', error)
    return ''
  }
}

/**
 * Check if richText field has content
 * 
 * @param richTextData - The richText field data from Payload CMS
 * @returns Boolean indicating if there's meaningful content
 */
export function hasRichTextContent(richTextData: unknown): boolean {
  try {
    if (!richTextData) return false
    
    if (typeof richTextData === 'string') {
      return richTextData.trim().length > 0
    }
    
    if (typeof richTextData === 'object' && richTextData !== null && 'root' in richTextData) {
      const htmlString = convertLexicalToHTML({ data: richTextData as SerializedEditorState })
      const textContent = htmlString.replace(/<[^>]*>/g, '').trim()
      return textContent.length > 0
    }
    
    return false
  } catch (error) {
    console.warn('Failed to check richText content:', error)
    return false
  }
}
