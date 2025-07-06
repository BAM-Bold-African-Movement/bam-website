import React, { useState } from "react";
import styled from "styled-components";
import { GrImage, GrClose } from "react-icons/gr";
import { BiText } from "react-icons/bi";
import { GiVerticalFlip } from "react-icons/gi";

export const EditorTitle = ({
    coverImage,
    uploadImage,
    handleLiveData,
    titleData,
    subTitleData,
    handleRemoveImage,
    setCoverImage
}) => {
    const [addSubTitle, setAddSubTitle] = useState(false);
    const [moveCoverImage, setMoveCoverImage] = useState(false);

    return (
        <>
            <AddCoverAndTitleDiv>
                {!coverImage && (
                    <label>
                        <GrImage />
                        <p>Add cover photo</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => uploadImage(e, "cover")}
                        />
                    </label>
                )}

                {!addSubTitle && (
                    <ActionButton
                        onClick={() => setAddSubTitle(true)}
                    >
                        <BiText />
                        <p>Add subtitle</p>
                    </ActionButton>
                )}
            </AddCoverAndTitleDiv>
            
            {coverImage && !moveCoverImage && (
                <CoverImageDiv>
                    <div>
                        <img src={coverImage} alt="Cover" />
                        <ImageAction
                            onClick={() => setMoveCoverImage(true)}
                            title="Move image down"
                        >
                            <GiVerticalFlip />
                        </ImageAction>
                        <ImageAction
                            onClick={handleRemoveImage}
                            title="Remove image"
                        >
                            <GrClose />
                        </ImageAction>
                    </div>
                </CoverImageDiv>
            )}
            
            <TitleDiv>
                <textarea
                    onChange={(e) => handleLiveData(e, "title")}
                    value={titleData}
                    placeholder="Title..."
                    rows="2"
                />
            </TitleDiv>
            
            {addSubTitle && (
                <SubTitleDiv>
                    <textarea
                        onChange={(e) => handleLiveData(e, "subTitle")}
                        value={subTitleData}
                        placeholder="Enter subtitle (Optional)"
                        rows="2"
                    />
                    <CloseButton
                        onClick={() => setAddSubTitle(false)}
                        title="Remove subtitle"
                    >
                        <GrClose />
                    </CloseButton>
                </SubTitleDiv>
            )}
            
            {coverImage && moveCoverImage && (
                <CoverImageDiv>
                    <div>
                        <img src={coverImage} alt="Cover" />
                        <ImageAction
                            onClick={() => setMoveCoverImage(false)}
                            title="Move image up"
                        >
                            <GiVerticalFlip />
                        </ImageAction>
                        <ImageAction
                            onClick={() => setCoverImage("")}
                            title="Remove image"
                        >
                            <GrClose />
                        </ImageAction>
                    </div>
                </CoverImageDiv>
            )}
        </>
    );
};

const AddCoverAndTitleDiv = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    
    & > label, & > button {
        opacity: 0.8;
        border-radius: 0.5rem;
        border: 1px solid #374151;
        padding: 0.5rem 0.75rem;
        font-size: 1rem;
        font-weight: 500;
        color: #f9fafb; // Light text
        background-color: #1f2937; // Dark background
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:hover {
            opacity: 1;
            background-color: #374151; // Darker hover
            border-color: #fbbf24; // Yellow border on hover
        }

        & > input {
            display: none;
        }
        
        & > p {
            margin: 0;
        }
    }
`;

const ActionButton = styled.button`
    opacity: 0.8;
    border-radius: 0.5rem;
    border: 1px solid #374151;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    font-weight: 500;
    color: #f9fafb; // Light text
    background-color: #1f2937; // Dark background
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        opacity: 1;
        background-color: #374151; // Darker hover
        border-color: #fbbf24; // Yellow border on hover
    }
    
    & > p {
        margin: 0;
    }
`;

const ImageAction = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    border: 1px solid #374151;
    padding: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    color: #f9fafb; // Light text
    background-color: #1f2937; // Dark background
    border-radius: 0.25rem;
    opacity: 0.8;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 1;
        background-color: #374151; // Darker hover
        border-color: #fbbf24; // Yellow border on hover
    }

    &:nth-child(2) {
        right: 70px;
    }
`;

const TitleDiv = styled.div`
    margin-bottom: 1rem;
    
    & > textarea {
        width: 100%;
        min-height: 80px;
        outline: none;
        border: none;
        font-weight: 700;
        font-size: 2rem;
        line-height: 1.2;
        color: #f9fafb; // Light text
        background-color: transparent;
        resize: vertical;
        padding: 0.5rem;
        box-sizing: border-box;
        font-family: inherit;

        &::placeholder {
            color: #9ca3af; // Gray placeholder
        }
        
        &:focus {
            outline: 2px solid #fbbf24; // Yellow focus outline
            outline-offset: 2px;
            border-radius: 0.25rem;
        }
    }
`;

const SubTitleDiv = styled.div`
    display: flex;
    margin-bottom: 1rem;
    position: relative;
    
    & > textarea {
        width: 100%;
        min-height: 60px;
        outline: none;
        border: none;
        font-weight: 500;
        font-size: 1.5rem;
        line-height: 1.3;
        color: #d1d5db; // Lighter gray text
        background-color: transparent;
        resize: vertical;
        padding: 0.5rem;
        padding-right: 3rem;
        box-sizing: border-box;
        font-family: inherit;

        &::placeholder {
            color: #9ca3af; // Gray placeholder
        }
        
        &:focus {
            outline: 2px solid #fbbf24; // Yellow focus outline
            outline-offset: 2px;
            border-radius: 0.25rem;
        }
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    color: #f9fafb; // Light text
    
    &:hover {
        background-color: #374151; // Dark hover
    }
`;

const CoverImageDiv = styled.div`
    margin-bottom: 1.25rem;

    & > div {
        position: relative;
        display: inline-block;
        width: 100%;

        & > img {
            width: 100%;
            border-radius: 0.5rem;
            display: block;
        }
    }
`;