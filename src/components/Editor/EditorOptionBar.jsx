import React, {useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import "tippy.js/dist/tippy.css";
import { Guide } from "./Guide";
import { EditorLeftOptionBar } from "./EditorLeftOptionBar";
import { EditorRightOptionBar } from "./EditorRightOptionBar";

export const EditorOptionBar = (
    {
        handleOptions, uploadImage, storeData, handleChangeData
     }
) => {
    const [leftOption, setLeftOption] = useState(0);
    
    
        // Function for find & click on left side options
        const handleLeftOptions = (option) => {
            switch(option) {
                case 'write':
                    setLeftOption(0);
                    break;
                case 'preview':
                    setLeftOption(1);
                    break;
                case 'guide':
                    setLeftOption(2);
                    break;
                default:
                    setLeftOption(0);
            }
        };
    
    return (
        <>
            <OptionsDiv>
                <OptionsContainer>
                    <OptionsWrapper>
                        <OptionsInnerMainDiv>
                            <EditorLeftOptionBar
                                handleLeftOptions={handleLeftOptions} leftOption={leftOption} />
                           <EditorRightOptionBar handleOptions={handleOptions} leftOption={leftOption} 
                            uploadImage={uploadImage}/>
                        </OptionsInnerMainDiv>
                    </OptionsWrapper>
                </OptionsContainer>
            </OptionsDiv>
            {leftOption === 0 ? (
                <ContentContainer>
                    <StoryDiv>
                        <textarea
                            value={storeData}
                            onChange={(e) => {
                                handleChangeData(e);
                            }}
                            placeholder="Tell your story..."
                            id=""
                        ></textarea>
                    </StoryDiv>
                </ContentContainer>
            ) : leftOption === 1 ? (
                <ContentContainer>
                    <PreviewDiv>
                        <ReactMarkdown>
                            {storeData ? storeData : "Nothing to preview 🧐"}
                        </ReactMarkdown>
                    </PreviewDiv>
                </ContentContainer>
            ) : leftOption === 2 ? (
                <ContentContainer>
                    <Guide />
                </ContentContainer>
            ) : null}
        </>
    );
};

const OptionsDiv = styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #1f2937; // Dark background
    line-height: 1.5;
    border: 1px solid #374151; // Gray border
    border-radius: 0.5rem;
    
    @media (max-width: 768px) {
        border-radius: 0.375rem;
        margin: 0 -0.5rem;
        border-left: none;
        border-right: none;
    }
    
    @media (max-width: 480px) {
        border-radius: 0;
        margin: 0 -0.75rem;
    }
`;

const OptionsContainer = styled.div`
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const OptionsWrapper = styled.div`
    padding: 0.5rem;
    border-radius: 0.25rem;
    z-index: 1;
    
    @media (max-width: 768px) {
        padding: 0.375rem 0.5rem;
    }
    
    @media (max-width: 480px) {
        padding: 0.25rem 0.375rem;
    }
`;

const OptionsInnerMainDiv = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    
    @media (max-width: 768px) {
        gap: 0.5rem;
    }
    
    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
    }

    & > :nth-child(1) > :nth-child(2) > :nth-child(1) {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: -6px;
        
        @media (max-width: 480px) {
            width: 1.25rem;
            height: 1.25rem;
            margin-bottom: -4px;
        }
    }

    & > div > :hover {
        background-color: #374151; // Darker hover
        border-radius: 5px;
    }
`;

const ContentContainer = styled.div`
    @media (max-width: 768px) {
        margin: 0 -0.5rem;
    }
    
    @media (max-width: 480px) {
        margin: 0 -0.75rem;
    }
`;

const StoryDiv = styled.div`
    & > textArea {
        min-height: 100vh;
        outline: 2px solid transparent;
        outline-offset: 2px;
        line-height: 1.375;
        font-weight: 300;
        padding: 3rem 1rem;
        background-color: #111827; // Dark background
        font-size: 1.25rem;
        appearance: none;
        resize: none;
        margin-top: 0.5rem;
        margin-bottom: 1.25rem;
        border: none;
        text-align: left;
        width: 100%;
        color: #f9fafb; // Light text
        
        &::placeholder {
            color: #9ca3af; // Gray placeholder
        }
        
        @media (max-width: 768px) {
            padding: 2rem 1rem;
            font-size: 1.125rem;
            line-height: 1.5;
            margin-top: 0.375rem;
            margin-bottom: 1rem;
        }
        
        @media (max-width: 480px) {
            padding: 1.5rem 0.75rem;
            font-size: 1rem;
            line-height: 1.6;
            margin-top: 0.25rem;
            margin-bottom: 0.75rem;
            min-height: 80vh;
        }
        
        // Improve mobile typing experience
        @media (max-width: 480px) {
            -webkit-text-size-adjust: 100%;
            -webkit-appearance: none;
            border-radius: 0;
        }
    }
`;

const PreviewDiv = styled.div`
    font-size: 1.25rem;
    line-height: 1.8;
    overflow-wrap: break-word;
    word-break: break-word;
    letter-spacing: -0.025em;
    padding: 3rem 1rem;
    width: 100%;
    min-height: 30vh;
    color: #f9fafb; // Light text
    max-width: 65ch;
    text-align: left;
    background-color: #111827; // Dark background
    
    @media (max-width: 768px) {
        padding: 2rem 1rem;
        font-size: 1.125rem;
        line-height: 1.7;
        max-width: none;
        min-height: 25vh;
    }
    
    @media (max-width: 480px) {
        padding: 1.5rem 0.75rem;
        font-size: 1rem;
        line-height: 1.7;
        letter-spacing: -0.015em;
        min-height: 20vh;
    }

    & > :nth-child(1) {
        margin-top: 0;
    }
    & > :last-child {
        margin-bottom: 0;
    }
    & ul,
    ol > li {
        padding-left: 1em;
        
        @media (max-width: 480px) {
            padding-left: 0.75em;
        }
    }
    & ol,
    ul > li {
        padding-left: 1em;
        
        @media (max-width: 480px) {
            padding-left: 0.75em;
        }
    }
    & img {
        margin-top: 2em;
        margin-bottom: 2em;
        max-width: 100%;
        height: auto;
        
        @media (max-width: 480px) {
            margin-top: 1.5em;
            margin-bottom: 1.5em;
        }
    }
    
    // Style markdown elements
    & h1, h2, h3, h4, h5, h6 {
        color: #fbbf24; // Yellow headings
        
        @media (max-width: 768px) {
            margin-top: 1.5em;
            margin-bottom: 0.75em;
        }
        
        @media (max-width: 480px) {
            margin-top: 1.25em;
            margin-bottom: 0.5em;
        }
    }
    
    & h1 {
        @media (max-width: 768px) {
            font-size: 1.875rem;
        }
        
        @media (max-width: 480px) {
            font-size: 1.5rem;
        }
    }
    
    & h2 {
        @media (max-width: 768px) {
            font-size: 1.5rem;
        }
        
        @media (max-width: 480px) {
            font-size: 1.25rem;
        }
    }
    
    & h3 {
        @media (max-width: 768px) {
            font-size: 1.25rem;
        }
        
        @media (max-width: 480px) {
            font-size: 1.125rem;
        }
    }
    
    & blockquote {
        border-left: 4px solid #fbbf24; // Yellow accent
        padding-left: 1rem;
        margin-left: 0;
        color: #d1d5db;
        
        @media (max-width: 480px) {
            border-left-width: 3px;
            padding-left: 0.75rem;
            margin: 1em 0;
        }
    }
    
    & code {
        background-color: #374151;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        color: #fbbf24;
        font-size: 0.875em;
        
        @media (max-width: 480px) {
            padding: 0.1rem 0.2rem;
            font-size: 0.8125em;
        }
    }
    
    & pre {
        background-color: #374151;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        
        @media (max-width: 768px) {
            padding: 0.75rem;
            border-radius: 0.375rem;
        }
        
        @media (max-width: 480px) {
            padding: 0.5rem;
            border-radius: 0.25rem;
            margin: 1em -0.25rem;
        }
        
        & code {
            background: none;
            padding: 0;
            font-size: 0.875em;
            
            @media (max-width: 480px) {
                font-size: 0.8125em;
            }
        }
    }
    
    & p {
        margin: 1em 0;
        
        @media (max-width: 480px) {
            margin: 0.875em 0;
        }
    }
    
    & strong {
        font-weight: 600;
        color: #fbbf24;
    }
    
    & em {
        font-style: italic;
        color: #d1d5db;
    }
    
    & a {
        color: #60a5fa;
        text-decoration: underline;
        
        &:hover {
            color: #93c5fd;
        }
    }
`;