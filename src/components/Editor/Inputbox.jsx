import React, { useEffect, useState } from "react";
import styled from "styled-components";

const skillArray = [
    "Javascript",
    "NodeJs",
    "Reactjs",
    "Java",
    "Express",
    "Typescript",
    "C",
    "C++",
    "Python",
    "Go",
    "Mongoose",
    "Springboot",
    "Git",
    "SQL",
    "MongoDB",
];

export const Inputbox = () => {
    const [skill, setSkill] = useState("");
    const [displaySkill, setDisplaySkill] = useState([]);
    const [savedSkill, setSavedSkill] = useState([]);

    useEffect(() => {
        const draft = localStorage.getItem("draft");
        if (draft) {
            try {
                const storedDraft = JSON.parse(draft);
                setSavedSkill(storedDraft.tags || []);
            } catch (error) {
                console.error("Error parsing draft:", error);
                setSavedSkill([]);
            }
        }
    }, []);

    const updateTagLocally = (countNames, counts) => {
        const draft = localStorage.getItem("draft");
        let storedDraft = {};
        
        if (draft) {
            try {
                storedDraft = JSON.parse(draft);
            } catch (error) {
                console.error("Error parsing draft:", error);
            }
        }
        
        localStorage.setItem(
            "draft",
            JSON.stringify({
                ...storedDraft,
                [countNames]: counts,
            })
        );
    };

    const addToSkill = (skillToAdd) => {
        if (!savedSkill.includes(skillToAdd)) {
            const newSkills = [...savedSkill, skillToAdd];
            setSavedSkill(newSkills);
            updateTagLocally("tags", newSkills);
        }
        setSkill("");
        setDisplaySkill([]);
    };

    const handleRemoveSavedSkill = (indexToRemove) => {
        const updatedSkill = savedSkill.filter((_, idx) => idx !== indexToRemove);
        setSavedSkill(updatedSkill);
        updateTagLocally("tags", updatedSkill);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSkill(value);
        
        if (value === "") {
            setDisplaySkill([]);
            return;
        }
        
        const filteredSkills = skillArray.filter(skill => 
            skill.toLowerCase().includes(value.toLowerCase()) &&
            !savedSkill.includes(skill)
        );
        setDisplaySkill(filteredSkills);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && skill.trim()) {
            addToSkill(skill.trim());
        }
    };

    return (
        <>
            <h3>Select tags</h3>
            <SelectTagInput>
                <div>
                    <input
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        value={skill}
                        placeholder="Type Technologies Here"
                    />
                </div>
                {(skill || displaySkill.length > 0) && (
                    <SuggestionDropdown>
                        {skill && !savedSkill.includes(skill) && (
                            <SuggestionItem onClick={() => addToSkill(skill)}>
                                {skill}
                            </SuggestionItem>
                        )}
                        {displaySkill.map((skillItem, i) => (
                            <SuggestionItem key={i} onClick={() => addToSkill(skillItem)}>
                                {skillItem}
                            </SuggestionItem>
                        ))}
                    </SuggestionDropdown>
                )}
            </SelectTagInput>
            
            <SkillDisplay>
                {savedSkill.map((skillItem, i) => (
                    <SkillTag key={i}>
                        <p>{skillItem}</p>
                        <svg
                            onClick={() => handleRemoveSavedSkill(i)}
                            viewBox="0 0 320 512"
                        >
                            <path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" />
                        </svg>
                    </SkillTag>
                ))}
            </SkillDisplay>
        </>
    );
};

const SelectTagInput = styled.div`
    position: relative;
    
    & > div:first-child {
        margin-bottom: 0.5rem;
        box-sizing: border-box;

        & input {
            width: 100%;
            padding: 0.5rem;
            margin: 0;
            font-size: 1rem;
            color: rgb(31, 41, 55);
            background-color: transparent;
            outline: none;
            border: 1px solid rgb(229, 231, 235);
            border-radius: 0.5rem;
            box-sizing: border-box;
        }
    }
`;

const SuggestionDropdown = styled.div`
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 10;
    position: absolute;
    background: white;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid rgb(229, 231, 235);
`;

const SuggestionItem = styled.div`
    padding: 0.75rem;
    cursor: pointer;
    border-bottom: 1px solid rgb(243, 244, 246);
    
    &:hover {
        background-color: rgb(243, 244, 246);
    }
    
    &:last-child {
        border-bottom: none;
    }
`;

const SkillDisplay = styled.div`
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const SkillTag = styled.div`
    display: flex;
    align-items: center;
    color: #2962ff;
    border: 1px solid #2962ff;
    border-radius: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    gap: 0.5rem;

    & > p {
        margin: 0;
    }

    &:hover {
        background: rgba(41, 98, 255, 0.1);
    }

    & > svg {
        width: 0.75rem;
        height: 0.75rem;
        fill: #2962ff;
        cursor: pointer;
        
        &:hover {
            fill: #1e40af;
        }
    }
`;