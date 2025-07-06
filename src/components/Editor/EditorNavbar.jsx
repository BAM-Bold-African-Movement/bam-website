import React, { useState } from "react";
import styled from "styled-components";
import publishIcon from "../../images/publishIcon.svg";
import roundLoading1 from "../../images/roundLoading1.gif";
import { AiOutlineSetting, AiOutlineCloud, AiOutlineMenu } from "react-icons/ai";
import { NewLogo } from "../../images/NewLogo";
import { SettingDiv } from "./SettingDiv";
import { Link } from "react-router-dom";

export const EditorNavbar = ({
    liveSaving,
    publishBlog,
    wordCount,
    paragraphCount,
    readTime,
    showTags,
    lastSaved,
    autoSaveStatus 
}) => {
    const [settingDisplay, setSettingDisplay] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <HeaderDiv>
                <LeftSection>
                    <Link to="/">
                        <LogoWrapper>
                            <NewLogo width="128px" height="21.95px" />
                        </LogoWrapper>
                    </Link>
                    <MobileSaveStatus>
                        {!liveSaving ? (
                            <SaveIndicator>
                                <AiOutlineCloud />
                            </SaveIndicator>
                        ) : (
                            <SaveIndicator>
                                <img
                                    src={roundLoading1}
                                    alt="Saving"
                                    style={{ width: "1rem" }}
                                />
                            </SaveIndicator>
                        )}
                    </MobileSaveStatus>
                </LeftSection>

                <RightSection>
                    {/* Desktop Layout */}
                    <DesktopControls>
                        {!liveSaving ? (
                            <SettingButton1>
                                <AiOutlineCloud />
                                <p>Saved</p>
                            </SettingButton1>
                        ) : (
                            <SettingButton1>
                                <img
                                    src={roundLoading1}
                                    alt="Saving"
                                    style={{ width: "1rem" }}
                                />
                                <p>Saving</p>
                            </SettingButton1>
                        )}
                        <StatusSection>
                            <StatusItem>{wordCount} words</StatusItem>
                            <StatusItem>{paragraphCount} paragraphs</StatusItem>
                            <StatusItem>{readTime} min read</StatusItem>
                            {lastSaved && (
                                <SaveStatus>
                                    {autoSaveStatus === 'saving' ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString()}`}
                                </SaveStatus>
                            )}
                        </StatusSection>

                        <SettingButton onClick={() => setSettingDisplay(true)}>
                            <AiOutlineSetting />
                            <p>Settings</p>
                        </SettingButton>
                        <PublishButton onClick={publishBlog}>
                            <img src={publishIcon} alt="Publish" />
                            <p>Publish</p>
                        </PublishButton>
                    </DesktopControls>

                    {/* Mobile Layout */}
                    <MobileControls>
                        <MobilePublishButton onClick={publishBlog}>
                            <img src={publishIcon} alt="Publish" />
                            <span>Publish</span>
                        </MobilePublishButton>
                        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <AiOutlineMenu />
                        </MobileMenuButton>
                    </MobileControls>
                </RightSection>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <MobileMenu>
                        <MobileMenuItem>
                            <StatusSection>
                                <StatusItem>{wordCount} words</StatusItem>
                                <StatusItem>{paragraphCount} paragraphs</StatusItem>
                                <StatusItem>{readTime} min read</StatusItem>
                            </StatusSection>
                        </MobileMenuItem>
                        {lastSaved && (
                            <MobileMenuItem>
                                <SaveStatus>
                                    {autoSaveStatus === 'saving' ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString()}`}
                                </SaveStatus>
                            </MobileMenuItem>
                        )}
                        <MobileMenuItem>
                            <MobileSettingButton onClick={() => {
                                setSettingDisplay(true);
                                setMobileMenuOpen(false);
                            }}>
                                <AiOutlineSetting />
                                <span>Settings</span>
                            </MobileSettingButton>
                        </MobileMenuItem>
                    </MobileMenu>
                )}

                {settingDisplay ? (
                    <SettingDiv
                        wordCount={wordCount}
                        paragraphCount={paragraphCount}
                        readTime={readTime}
                        setSettingDisplay={setSettingDisplay}
                        publishBlog={publishBlog}
                        showTags={showTags}
                    />
                ) : null}
            </HeaderDiv>
        </>
    );
};

const HeaderDiv = styled.div`
    width: 92%;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgb(229, 231, 235);
    padding: 1rem 0.5rem;
    margin-top: 0 !important;
    position: relative;

    @media (max-width: 768px) {
        width: 95%;
        padding: 0.75rem 0.5rem;
    }
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const LogoWrapper = styled.div`
    @media (max-width: 480px) {
        svg {
            width: 100px !important;
            height: 17px !important;
        }
    }
`;

const MobileSaveStatus = styled.div`
    display: none;
    
    @media (max-width: 768px) {
        display: flex;
        align-items: center;
    }
`;

const SaveIndicator = styled.div`
    display: flex;
    align-items: center;
    color: #10b981;
    font-size: 1.2rem;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
`;

const DesktopControls = styled.div`
    display: flex;
    align-items: center;
    
    @media (max-width: 768px) {
        display: none;
    }
`;

const MobileControls = styled.div`
    display: none;
    
    @media (max-width: 768px) {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;

const MobilePublishButton = styled.button`
    border-radius: 0.5rem;
    border: 1px solid rgb(41, 98, 255);
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgb(41, 98, 255);
    background-color: #ffffff;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 150ms ease;

    &:hover {
        background-color: rgb(227, 242, 253);
    }

    & > img {
        width: 16px;
    }

    & > span {
        font-weight: 500;
    }
`;

const MobileMenuButton = styled.button`
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    background-color: white;
    color: #374151;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 150ms ease;

    &:hover {
        background-color: #f3f4f6;
    }
`;

const MobileMenu = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
    min-width: 200px;
    padding: 0.5rem 0;
    
    @media (max-width: 480px) {
        right: -0.5rem;
        left: -0.5rem;
        width: calc(100vw - 1rem);
        max-width: none;
    }
`;

const MobileMenuItem = styled.div`
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f3f4f6;
    
    &:last-child {
        border-bottom: none;
    }
`;

const MobileSettingButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #374151;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    
    &:hover {
        color: #1f2937;
    }
`;

const SettingButton1 = styled.button`
    border-radius: 0.5rem;
    border-width: 1px;
    border-color: transparent;
    padding-top: 0.5rem !important;
    padding: 0.25rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    line-height: 1.625;
    --tw-text-opacity: 1;
    color: rgba(55, 65, 81, var(--tw-text-opacity));
    background-color: white;
    margin-right: 1rem;

    & > :nth-child(1) {
        margin-bottom: -5px;
        font-size: 1.3rem;
        opacity: 0.75;
    }

    & > p {
        display: inline;
        margin-left: 10px;
        padding-bottom: 2px;
        font-weight: 500;
    }
`;

const SettingButton = styled.button`
    border-radius: 0.5rem;
    border-width: 1px;
    border-color: transparent;
    padding-top: 0.5rem !important;
    padding: 0.25rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    line-height: 1.625;
    --tw-text-opacity: 1;
    color: rgba(55, 65, 81, var(--tw-text-opacity));
    cursor: pointer;
    background-color: white;
    margin-right: 1rem;

    &:hover {
        background-color: #efefef;
    }

    & > :nth-child(1) {
        margin-bottom: -5px;
        font-size: 1.3rem;
        opacity: 0.75;
    }

    & > p {
        display: inline;
        margin-left: 10px;
        padding-bottom: 2px;
        font-weight: 500;
    }
`;

const PublishButton = styled.button`
    border-radius: 0.5rem;
    border: 1px solid rgb(41, 98, 255);
    padding: 0.25rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    line-height: 1.625;
    color: rgb(41, 98, 255);
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    transition-duration: 150ms;
    background-color: #ffffff;

    &:hover {
        background-color: rgb(227, 242, 253);
    }

    & > img {
        width: 18px;
        fill: rgb(124, 153, 235) !important;
    }

    & > :nth-child(1) {
        margin-bottom: -3px;
        font-size: 1.3rem;
        opacity: 0.75;
    }

    & > p {
        display: inline;
        margin-left: 10px;
        padding-bottom: 2px;
        font-weight: 500;
    }
`;

const StatusSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
    color: #94a3b8;
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
`;

const StatusItem = styled.span`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const SaveStatus = styled.span`
    color: #10b981;
    font-weight: 500;
`;