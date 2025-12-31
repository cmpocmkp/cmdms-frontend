/**
 * ReadMore Component
 * Matches the exact structure from old CMDMS read-more.blade.php component
 */

import { useState } from 'react';

interface ReadMoreProps {
  text: string;
  maxLength?: number;
}

export default function ReadMore({ text, maxLength = 100 }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Strip HTML tags to check length
  const cleanText = text.replace(/<[^>]*>/g, '');
  const hasMore = cleanText.length > maxLength;
  
  // Get short text (first maxLength characters)
  const shortText = hasMore ? cleanText.substring(0, maxLength) + '...' : cleanText;
  
  // For HTML content, we need to preserve HTML in full text
  const fullText = text;
  
  if (!hasMore) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  }
  
  return (
    <div className="read-more-container">
      <div className={`read-more-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className={isExpanded ? 'd-none' : ''} dangerouslySetInnerHTML={{ __html: shortText }} />
        <div className={isExpanded ? '' : 'd-none'} dangerouslySetInnerHTML={{ __html: fullText }} />
      </div>
      <a 
        href="javascript:void(0);" 
        className="read-more-toggle"
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? '- Read less' : '+ Read more'}
      </a>
    </div>
  );
}

