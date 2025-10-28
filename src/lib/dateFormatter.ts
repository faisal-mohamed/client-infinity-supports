/**
 * Date formatting utilities for PDF generation
 */

export function formatDateForPDF(date: string | Date | null | undefined): string {
  if (!date) return "—";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "—";
    
    // Format as DD/MM/YYYY for Australian locale
    return dateObj.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return "—";
  }
}

export function formatDateTimeForPDF(date: string | Date | null | undefined): string {
  if (!date) return "—";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return "—";
    
    // Format as DD/MM/YYYY HH:MM
    const dateStr = dateObj.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const timeStr = dateObj.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    return `${dateStr} ${timeStr}`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return "—";
  }
}

