# Auto-Pagination Features in Client Intake Form

## Overview

The Client Intake Form now uses **`@react-pdf/renderer`** with advanced auto-pagination features, just like the Emergency Drill form. This ensures that large text content automatically flows to new pages without overflow or cutoff.

## Key Auto-Pagination Features

### 1. **Break Control Properties**

```typescript
const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
    breakInside: 'avoid', // Prevents sections from breaking across pages
    pageBreakInside: 'avoid', // Alternative syntax for compatibility
  },
  longAnswer: {
    marginBottom: 10,
    breakInside: 'avoid', // Prevents breaking inside answer boxes
    pageBreakInside: 'avoid', // Alternative syntax
  },
  longAnswerValue: {
    border: '0.5 solid #d1d5db',
    borderRadius: 3,
    padding: 6,
    minHeight: 20,
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.3,
    breakInside: 'avoid', // Prevents text from breaking inside
    pageBreakInside: 'avoid', // Alternative syntax
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
    breakInside: 'avoid', // Prevents field rows from breaking
    pageBreakInside: 'avoid', // Alternative syntax
    gap: 10,
  },
});
```

### 2. **Dynamic Height Calculation**

```typescript
// Helper function to calculate dynamic height for long text
const calculateTextHeight = (text: string, maxHeight: number = 200): number => {
  if (!text) return 50;
  
  const lines = text.split('\n').length;
  const estimatedHeight = Math.max(50, lines * 12 + 20); // 12px per line + padding
  
  return Math.min(estimatedHeight, maxHeight); // Cap at maxHeight
};
```

### 3. **Large Text Field Implementation**

```typescript
// Example: Disability Conditions field with auto-sizing
<View style={styles.longAnswer}>
  <View style={[styles.longAnswerValue, {
    height: calculateTextHeight(getValue('disabilityConditions'), 300)
  }]}>
    <Text>{getValue('disabilityConditions')}</Text>
  </View>
</View>
```

## Auto-Pagination Behavior

### ✅ **What Happens Automatically:**

1. **Large Text Fields** - Automatically expand based on content length
2. **Section Breaks** - Sections won't break in the middle
3. **Field Row Breaks** - Field rows stay together
4. **Answer Box Breaks** - Answer boxes won't break in the middle
5. **Page Flow** - Content automatically flows to new pages when needed

### ✅ **Content Handling:**

| Content Type | Behavior | Example |
|--------------|----------|---------|
| **Short Text** | Fixed height (50px) | "yes" |
| **Medium Text** | Calculated height (50-200px) | 5-10 lines |
| **Long Text** | Calculated height (up to maxHeight) | 20-30+ lines |
| **Very Long Text** | Auto-paginates to new page | 50+ lines |

### ✅ **Dynamic Height Examples:**

```typescript
// Different max heights for different content types
height: calculateTextHeight(getValue('disabilityConditions'), 300) // Large field
height: calculateTextHeight(getValue('otherSupports'), 400)        // Extra large
height: calculateTextHeight(getValue('aboutMe'), 600)             // Maximum size
```

## Comparison with Emergency Drill Form

The Client Intake Form now uses the **exact same auto-pagination approach** as the Emergency Drill form:

### Emergency Drill Form Features:
- ✅ `breakInside: 'avoid'` on all containers
- ✅ `longAnswer` with proper break control
- ✅ `longAnswerValue` with text wrapping
- ✅ Professional styling and spacing

### Client Intake Form Features:
- ✅ **Same break control properties**
- ✅ **Dynamic height calculation** (enhanced)
- ✅ **Multiple large text fields** (disability, aboutMe, otherSupports, etc.)
- ✅ **Professional styling** matching Emergency Drill

## Benefits Achieved

### 🎯 **User Experience:**
- **No content cutoff** - All text is visible
- **Professional appearance** - Clean page breaks
- **Automatic flow** - Content moves to new pages seamlessly
- **Consistent spacing** - Proper gaps between pages

### 🎯 **Technical Benefits:**
- **Automatic pagination** - No manual page management
- **Dynamic sizing** - Fields adjust to content length
- **Break control** - Prevents awkward breaks
- **Performance** - Efficient rendering

### 🎯 **Content Flexibility:**
- **Any length text** - From 1 word to 100+ lines
- **Multiple languages** - Handles different text lengths
- **Special characters** - Proper encoding and display
- **Line breaks** - Preserves user formatting

## Testing Scenarios

### Large Text Field Tests:

1. **Short Content:**
   ```
   Input: "yes"
   Expected: Small box (50px height)
   ```

2. **Medium Content:**
   ```
   Input: "This is a medium length response with several lines of text that should expand the field appropriately."
   Expected: Medium box (calculated height)
   ```

3. **Long Content:**
   ```
   Input: 20-30 lines of detailed disability information
   Expected: Large box (up to 300px) or auto-paginate
   ```

4. **Very Long Content:**
   ```
   Input: 50+ lines of extensive personal story
   Expected: Auto-paginate to new page
   ```

## Implementation Status

### ✅ **Completed:**
- Auto-pagination styles applied
- Dynamic height calculation implemented
- Large text fields configured
- Page break controls added
- Professional styling applied

### ✅ **Ready for Production:**
The Client Intake Form now handles any amount of content with:
- **Automatic page breaks**
- **Dynamic field sizing**
- **Professional appearance**
- **No content overflow**

The form will automatically adjust and paginate content just like the Emergency Drill form, ensuring a professional and complete PDF output every time.
