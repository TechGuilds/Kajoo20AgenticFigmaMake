import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';

interface MarkdownFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function MarkdownField({
  value,
  onChange,
  placeholder = 'Enter content here...',
  className = '',
  minHeight = '320px'
}: MarkdownFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to exit edit mode
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isEditing]);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div ref={containerRef} className={className}>
        <Card className="p-[var(--spacing-4)] bg-background border-[var(--color-primary)] flex flex-col" style={{ minHeight }}>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="resize-none bg-transparent border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-h-0"
          />
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <Card
        className="p-[var(--spacing-4)] bg-background border-border cursor-text hover:border-primary/50 transition-colors flex flex-col"
        style={{ minHeight }}
        onClick={() => setIsEditing(true)}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert flex-1 overflow-y-auto min-h-0">
          {value ? (
            <ReactMarkdown
              components={{
                // Style headings
                h1: ({ node, ...props }) => <h1 className="mb-[var(--spacing-4)]" {...props} />,
                h2: ({ node, ...props }) => <h2 className="mb-[var(--spacing-3)]" {...props} />,
                h3: ({ node, ...props }) => <h3 className="mb-[var(--spacing-2)]" {...props} />,
                h4: ({ node, ...props }) => <h4 className="mb-[var(--spacing-2)]" {...props} />,
                // Style paragraphs
                p: ({ node, ...props }) => <p className="mb-[var(--spacing-3)] text-foreground" {...props} />,
                // Style lists
                ul: ({ node, ...props }) => <ul className="mb-[var(--spacing-3)] ml-[var(--spacing-6)] list-disc text-foreground" {...props} />,
                ol: ({ node, ...props }) => <ol className="mb-[var(--spacing-3)] ml-[var(--spacing-6)] list-decimal text-foreground" {...props} />,
                li: ({ node, ...props }) => <li className="mb-[var(--spacing-1)]" {...props} />,
                // Style code blocks
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code className="px-[var(--spacing-1.5)] py-[var(--spacing-0.5)] rounded-[var(--radius-sm)] bg-muted text-foreground" {...props} />
                  ) : (
                    <code className="block p-[var(--spacing-3)] rounded-[var(--radius-md)] bg-muted text-foreground overflow-x-auto" {...props} />
                  ),
                pre: ({ node, ...props }) => <pre className="mb-[var(--spacing-3)] overflow-x-auto" {...props} />,
                // Style strong/bold
                strong: ({ node, ...props }) => <strong {...props} />,
                // Style blockquotes
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-border pl-[var(--spacing-4)] italic text-muted-foreground mb-[var(--spacing-3)]" {...props} />
                ),
                // Style links
                a: ({ node, ...props }) => <a className="text-[var(--color-primary)] hover:underline" {...props} />,
              }}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">{placeholder}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
