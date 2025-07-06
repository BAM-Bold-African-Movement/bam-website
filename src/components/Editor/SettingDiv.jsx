import React from "react";
import styled from "styled-components";
import { AiOutlineSetting } from "react-icons/ai";
import publishIcon from "../../images/publishIcon.svg";
import { GrClose } from "react-icons/gr";
import { Inputbox } from "./Inputbox";

export const SettingDiv = ({
    setSettingDisplay,
    wordCount,
    paragraphCount,
    readTime,
    publishBlog,
    showTags,
}) => {
    return (
        <>
            <SettingMainDiv>
                <SettingContent>
                    <CloseButtonToPublish>
                        <HeaderDiv>
                            <SettingCloseButton
                                onClick={() => setSettingDisplay(false)}
                            >
                                <GrClose />
                                <p>Close</p>
                            </SettingCloseButton>
                            <PublishButton onClick={() => publishBlog()}>
                                <img src={publishIcon} alt="publish" />
                                <p>Publish</p>
                            </PublishButton>
                        </HeaderDiv>
                        <PublishPrompt>
                            <h2>Are you ready to publish?</h2>
                            <p>
                                Double-check your article settings before
                                publishing.
                            </p>
                        </PublishPrompt>
                    </CloseButtonToPublish>
                    
                    {showTags && (
                        <SettingCard>
                            <h3>Story Stats</h3>
                            <StoryStatDiv>
                                <StatLabel>
                                    <p>Word count:</p>
                                </StatLabel>
                                <StatValue>
                                    <p>{wordCount} words</p>
                                </StatValue>
                            </StoryStatDiv>
                            <StoryStatDiv>
                                <StatLabel>
                                    <p>Paragraphs:</p>
                                </StatLabel>
                                <StatValue>
                                    <p>{paragraphCount} paragraphs</p>
                                </StatValue>
                            </StoryStatDiv>
                            <StoryStatDiv>
                                <StatLabel>
                                    <p>Read time:</p>
                                </StatLabel>
                                <StatValue>
                                    <p>{readTime} {readTime === 1 ? 'minute' : 'minutes'}</p>
                                </StatValue>
                            </StoryStatDiv>
                        </SettingCard>
                    )}

                    <SettingCard>
                        <Inputbox />
                    </SettingCard>
                    
                    <SettingCard>
                        <h3>SEO Title (Optional)</h3>
                        <p>
                            The SEO Title will be shown in place of your Title
                            on search engine results pages, such as a Google
                            search. SEO titles between 40 and 50 characters with
                            commonly searched words have the best
                            click-through-rates.
                        </p>
                        <SeoTitleTextAreaDiv>
                            <textarea
                                type="text"
                                maxLength="70"
                                placeholder="Enter meta title"
                                cols="30"
                                rows="3"
                            />
                        </SeoTitleTextAreaDiv>
                    </SettingCard>
                </SettingContent>
            </SettingMainDiv>
        </>
    );
};

const SettingMainDiv = styled.div`
    margin-top: 0 !important;
    width: 27rem;
    --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
        var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    background-color: rgb(250, 250, 250);
    border-left-width: 1px;
    overflow: auto;
    height: 100vh;
    z-index: 50;
    position: fixed;
    top: 0;
    right: 0;
    border-color: rgb(229, 231, 235);
    line-height: 1.5;
    text-align: left;

    @media (max-width: 768px) {
        width: 100vw;
        left: 0;
        right: 0;
        border-left: none;
        border-top: 1px solid rgb(229, 231, 235);
    }

    @media (max-width: 480px) {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
    }
`;

const SettingContent = styled.div`
    padding: 1rem 1.5rem 2.5rem;
    
    @media (max-width: 768px) {
        padding: 1rem 1rem 2.5rem;
    }
    
    @media (max-width: 480px) {
        padding: 0.75rem 0.75rem 2rem;
    }
`;

const SeoTitleTextAreaDiv = styled.div`
    & textarea {
        width: 100%;
        border-radius: 0.5rem;
        background-color: transparent;
        padding: 1rem;
        outline-color: rgba(59, 131, 246, 0.582);
        font-size: 1rem;
        line-height: 1.5rem;
        min-height: 58px;
        resize: vertical;
        border: 1px solid rgb(229, 231, 235);
        box-sizing: border-box;
        font-family: inherit;
        
        @media (max-width: 480px) {
            padding: 0.75rem;
            font-size: 0.875rem;
            min-height: 52px;
        }
    }
`;

const CloseButtonToPublish = styled.div`
    position: relative;
`;

const HeaderDiv = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    padding-bottom: 1rem;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgb(229, 231, 235);
    
    @media (max-width: 480px) {
        padding-bottom: 0.75rem;
        gap: 0.5rem;
    }
`;

const PublishPrompt = styled.div`
    line-height: 1.375;
    margin: 1.25rem 0;

    & > h2 {
        font-weight: 700;
        font-size: 1.25rem;
        line-height: 1.75rem;
        margin-bottom: 0.25rem !important;
        margin: 0;
        
        @media (max-width: 480px) {
            font-size: 1.125rem;
            line-height: 1.625rem;
        }
    }
    
    & > p {
        color: rgb(97, 97, 97);
        font-size: 1rem;
        line-height: 1.5rem;
        margin: 0;
        
        @media (max-width: 480px) {
            font-size: 0.875rem;
            line-height: 1.375rem;
        }
    }
`;

const SettingCard = styled.div`
    padding: 1rem;
    line-height: 1.5;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(229, 231, 235);
    border-radius: 0.5rem;
    margin-top: 1.25rem;
    
    @media (max-width: 480px) {
        padding: 0.75rem;
        margin-top: 1rem;
    }

    & h3 {
        color: rgb(97, 97, 97);
        font-weight: 700;
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-bottom: 0.5rem;
        margin-top: 0;
        
        @media (max-width: 480px) {
            font-size: 0.8125rem;
        }
    }
    
    & p {
        color: rgb(117, 117, 117);
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-bottom: 0.5rem;
        margin-top: 0;
        
        @media (max-width: 480px) {
            font-size: 0.8125rem;
            line-height: 1.1875rem;
        }
    }
`;

const StoryStatDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgb(97, 97, 97);
    margin-bottom: 0.5rem;
    
    @media (max-width: 480px) {
        font-size: 0.8125rem;
        line-height: 1.1875rem;
        margin-bottom: 0.375rem;
    }
`;

const StatLabel = styled.div`
    font-weight: 500;
    width: 6rem;
    
    @media (max-width: 480px) {
        width: 5rem;
    }
    
    & p {
        margin: 0;
    }
`;

const StatValue = styled.div`
    font-weight: 600;
    width: 8rem;
    
    @media (max-width: 480px) {
        width: auto;
        flex: 1;
    }
    
    & p {
        margin: 0;
    }
`;

const SettingCloseButton = styled.button`
    border-radius: 0.5rem;
    border: 1px solid transparent;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    color: rgba(55, 65, 81, 1);
    cursor: pointer;
    background-color: rgb(250, 250, 250);
    margin-right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px; /* Touch-friendly minimum height */

    &:hover {
        background-color: #efefef;
    }

    & > p {
        margin: 0;
        font-weight: 500;
    }
    
    @media (max-width: 480px) {
        padding: 0.625rem 0.75rem;
        font-size: 0.875rem;
        margin-right: 0.5rem;
        gap: 0.375rem;
        
        & > p {
            display: none; /* Hide text on very small screens */
        }
    }
`;

const PublishButton = styled.button`
    border-radius: 0.5rem;
    border: 1px solid rgb(41, 98, 255);
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    color: rgb(41, 98, 255);
    transition: all 0.15s ease-in-out;
    background-color: rgb(250, 250, 250);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px; /* Touch-friendly minimum height */

    &:hover {
        background-color: rgb(227, 242, 253);
    }

    & > img {
        width: 18px;
        height: 18px;
        
        @media (max-width: 480px) {
            width: 16px;
            height: 16px;
        }
    }

    & > p {
        margin: 0;
        font-weight: 500;
    }
    
    @media (max-width: 480px) {
        padding: 0.625rem 0.875rem;
        font-size: 0.875rem;
        gap: 0.375rem;
        flex-shrink: 0;
    }
`;