import React from 'react';
import styled from 'styled-components';

export const MarkdownPreview = ({ content }) => {
    const renderMarkdown = (text) => {
        return text
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*)\*/g, '<em>$1</em>')
            .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
            .replace(/^\- (.*$)/gm, '<li>$1</li>')
            .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
            .replace(/\n/g, '<br>');
    };

    return (
        <PreviewContainer
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
    );
};

const PreviewContainer = styled.div`
    padding: 24px;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    min-height: 500px;
    color: #f9fafb;
    
    h1, h2, h3 { 
        color: #f1f5f9; 
        margin-top: 24px;
        margin-bottom: 16px;
    }
    
    code {
        background: #111827;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Consolas', monospace;
    }
    
    blockquote {
        border-left: 4px solid #fbbf24;
        margin: 16px 0;
        padding: 16px;
        background: #111827;
        border-radius: 4px;
    }
    
    img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 16px 0;
    }
`;