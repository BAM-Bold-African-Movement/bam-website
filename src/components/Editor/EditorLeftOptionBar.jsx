import React from "react";
import styled from "styled-components";
import { BsPencil } from "react-icons/bs";
import { TiEyeOutline } from "react-icons/ti";
import { RiBookOpenLine } from "react-icons/ri";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const clickedColor = {
    color: "#fbbf24",
    backgroundColor: "rgba(251, 191, 36, 0.1)"
};

export const EditorLeftOptionBar = ({
    leftOption,
    handleLeftOptions,
}) => {
    return (
        <OptionBarContainer>
            <Tippy placement="bottom" content="Write Markdown">
                <OptionLeftButtons
                    onClick={() => handleLeftOptions("write")}
                    style={leftOption === 0 ? clickedColor : {}}
                >
                    <BsPencil />
                    <p>Write</p>
                </OptionLeftButtons>
            </Tippy>
            
            <Tippy placement="bottom" content="Preview Markdown">
                <OptionLeftButtons
                    onClick={() => handleLeftOptions("preview")}
                    style={leftOption === 1 ? clickedColor : {}}
                >
                    <TiEyeOutline />
                    <p>Preview</p>
                </OptionLeftButtons>
            </Tippy>
            
            <Tippy placement="bottom" content="Guide">
                <OptionLeftButtons
                    onClick={() => handleLeftOptions("guide")}
                    style={leftOption === 2 ? clickedColor : {}}
                >
                    <RiBookOpenLine />
                    <p>Guide</p>
                </OptionLeftButtons>
            </Tippy>
        </OptionBarContainer>
    );
};

const OptionBarContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

const OptionLeftButtons = styled.button`
    border-radius: 0.5rem;
    border: 1px solid transparent;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;
    color: #9ca3af;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        background-color: #374151;
        border-radius: 0.5rem;
    }

    & > p {
        margin: 0;
    }

    & > svg {
        width: 1rem;
        height: 1rem;
    }
`;