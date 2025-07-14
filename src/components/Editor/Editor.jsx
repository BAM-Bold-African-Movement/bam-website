import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "tippy.js/dist/tippy.css";
import {
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from "../../firebase";
import { EditorNavbar } from "./EditorNavbar";
import { EditorTitle } from "./EditorTitle";
import { EditorOptionBar } from "./EditorOptionBar";
import BlogService from '../../services/blogService';
import { useDebounce } from "../../hooks/useDebounce";
import { MarkdownPreview } from './MarkdownPreview';
import { Guide } from "./Guide";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Dashboard/Sidebar"

const extraOptions = [
    ["# ", "## ", "### "],
    "****",
    "**",
    "> ",
    " ",
    "[Text](Link) ",
    "%[Link] ",
    "- ",
    "1. ",
];

export const Editor = () => {
    const { user, isSuperAdmin } = useAuth();
    const [leftOption, setLeftOption] = useState(0);
    const [activeSection, setActiveSection] = useState('blog');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [storeData, setStoreData] = useState(""); 
    const [titleData, setTitleData] = useState(""); 
    const [subTitleData, setSubTitleData] = useState(""); 
    const [liveSaving, setLiveSaving] = useState(false);
    const [wordCount, setWordCount] = useState(0); 
    const [readTime, setReadTime] = useState(1); 
    const [paragraphCount, setParagraphCount] = useState(0); 
    const [coverImage, setCoverImage] = useState("");
    const [fileNameAtWrite, setFileNameAtWrite] = useState("");
    const [showTags, setShowTags] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
    
    // Refs for cursor position management
    const textAreaRef = useRef(null);
    const cursorPositionRef = useRef(0);
    
    const navigate = useNavigate();
    const debouncedContent = useDebounce(storeData, 1000);
    const debouncedTitle = useDebounce(titleData, 1000);
    const commonUrl = process.env.REACT_APP_COMMON_URL;

    // Store cursor position whenever it changes
    const handleCursorPosition = () => {
        if (textAreaRef.current) {
            cursorPositionRef.current = textAreaRef.current.selectionStart;
        }
    };

    // Insert text at cursor position
    const insertAtCursor = (textToInsert, moveCaretToEnd = false) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = storeData;
        
        const newText = currentText.substring(0, start) + textToInsert + currentText.substring(end);
        setStoreData(newText);
        
        // Set cursor position after insertion
        setTimeout(() => {
            const newCursorPos = moveCaretToEnd ? start + textToInsert.length : start + textToInsert.length;
            textarea.selectionStart = newCursorPos;
            textarea.selectionEnd = newCursorPos;
            textarea.focus();
        }, 0);
    };

    // Smart list handling
    const handleSmartLists = (text, cursorPos) => {
        const lines = text.split('\n');
        const currentLineIndex = text.substring(0, cursorPos).split('\n').length - 1;
        const currentLine = lines[currentLineIndex];
        
        // Check if we're in a list
        const unorderedListMatch = currentLine.match(/^(\s*)-\s/);
        const orderedListMatch = currentLine.match(/^(\s*)(\d+)\.\s/);
        
        if (unorderedListMatch) {
            const indent = unorderedListMatch[1];
            return `\n${indent}- `;
        } else if (orderedListMatch) {
            const indent = orderedListMatch[1];
            const currentNum = parseInt(orderedListMatch[2]);
            return `\n${indent}${currentNum + 1}. `;
        }
        
        return '\n';
    };

    // Handle keyboard shortcuts and smart formatting
    const handleKeyDown = (e) => {
        const textarea = e.target;
        const cursorPos = textarea.selectionStart;
        const currentText = textarea.value;
        
        // Handle Enter key for smart lists
        if (e.key === 'Enter') {
            const smartListText = handleSmartLists(currentText, cursorPos);
            if (smartListText !== '\n') {
                e.preventDefault();
                insertAtCursor(smartListText);
                return;
            }
        }
        
        // Handle Tab for list indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const lines = currentText.split('\n');
            const currentLineIndex = currentText.substring(0, cursorPos).split('\n').length - 1;
            const currentLine = lines[currentLineIndex];
            
            if (currentLine.match(/^\s*[-\*\+]\s/) || currentLine.match(/^\s*\d+\.\s/)) {
                if (e.shiftKey) {
                    // Unindent
                    const unindentedLine = currentLine.replace(/^    /, '');
                    lines[currentLineIndex] = unindentedLine;
                    setStoreData(lines.join('\n'));
                } else {
                    // Indent
                    const indentedLine = '    ' + currentLine;
                    lines[currentLineIndex] = indentedLine;
                    setStoreData(lines.join('\n'));
                }
            } else {
                insertAtCursor('    ');
            }
            return;
        }
        
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    wrapSelectedText('**', '**');
                    break;
                case 'i':
                    e.preventDefault();
                    wrapSelectedText('*', '*');
                    break;
                case 'k':
                    e.preventDefault();
                    wrapSelectedText('[', '](url)');
                    break;
                case '1':
                    e.preventDefault();
                    insertHeading(1);
                    break;
                case '2':
                    e.preventDefault();
                    insertHeading(2);
                    break;
                case '3':
                    e.preventDefault();
                    insertHeading(3);
                    break;
            }
        }
    };

    // Wrap selected text with markdown syntax
    const wrapSelectedText = (before, after) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = storeData.substring(start, end);
        
        if (selectedText) {
            const wrappedText = before + selectedText + after;
            insertAtCursor(wrappedText);
        } else {
            insertAtCursor(before + after);
            // Move cursor between the wrapper
            setTimeout(() => {
                textarea.selectionStart = start + before.length;
                textarea.selectionEnd = start + before.length;
                textarea.focus();
            }, 0);
        }
    };

    // Insert heading at current line
    const insertHeading = (level) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;
        
        const cursorPos = textarea.selectionStart;
        const lines = storeData.split('\n');
        const currentLineIndex = storeData.substring(0, cursorPos).split('\n').length - 1;
        const currentLine = lines[currentLineIndex];
        
        const headingPrefix = '#'.repeat(level) + ' ';
        
        // Remove existing heading if present
        const cleanLine = currentLine.replace(/^#+\s/, '');
        lines[currentLineIndex] = headingPrefix + cleanLine;
        
        setStoreData(lines.join('\n'));
        
        // Keep cursor at end of line
        setTimeout(() => {
            const newCursorPos = lines.slice(0, currentLineIndex).join('\n').length + 
                                 (currentLineIndex > 0 ? 1 : 0) + lines[currentLineIndex].length;
            textarea.selectionStart = newCursorPos;
            textarea.selectionEnd = newCursorPos;
            textarea.focus();
        }, 0);
    };

    // Improved option handlers that work with cursor position
    const handleOptions = (e, idx1, idx2) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;
        
        if (idx2 !== undefined) {
            // Handle headings
            insertHeading(idx2 + 1);
        } else if (idx1 === 1) {
            // Bold
            wrapSelectedText('**', '**');
        } else if (idx1 === 2) {
            // Italic
            wrapSelectedText('*', '*');
        } else if (idx1 === 3) {
            // Quote
            insertAtCursor('> ');
        } else if (idx1 === 4) {
            // Code block
            insertAtCursor('\n```\n\n```\n');
        } else if (idx1 === 5) {
            // Link
            wrapSelectedText('[', '](url)');
        } else if (idx1 === 6) {
            // Embed
            insertAtCursor('%[](url)');
        } else if (idx1 === 7) {
            // Unordered list
            insertAtCursor('\n- ');
        } else if (idx1 === 8) {
            // Ordered list
            insertAtCursor('\n1. ');
        }
    };

    // Rest of your existing useEffect hooks and functions remain the same...
    useEffect(() => {
        if (debouncedContent || debouncedTitle) {
            setAutoSaveStatus('saving');
            
            const saveData = {
                title: debouncedTitle,
                subTitle: subTitleData,
                body: debouncedContent,
                coverUrl: coverImage,
                imageName: fileNameAtWrite,
                wordCount: wordCount,
                paragraphCount: paragraphCount,
                readTime: readTime,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem("draft", JSON.stringify(saveData));
            setLastSaved(new Date());
            setAutoSaveStatus('saved');
        }
    }, [debouncedContent, debouncedTitle, subTitleData, coverImage, fileNameAtWrite, wordCount, paragraphCount, readTime]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Please login to create a blog post");
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (localStorage.getItem("draft")) {
            let storedDraft = JSON.parse(localStorage.getItem("draft"));
            setTitleData(storedDraft.title || "");
            setSubTitleData(storedDraft.subTitle || "");
            setStoreData(storedDraft.body || "");
            setCoverImage(storedDraft.coverUrl || "");
            setFileNameAtWrite(storedDraft.imageName || "");
            setWordCount(storedDraft.wordCount || 0);
            setParagraphCount(storedDraft.paragraphCount || 0);
            setReadTime(storedDraft.readTime || 1);
        }
    }, []);

    const emptyFields = () => {
        setTitleData("");
        setSubTitleData("");
        setStoreData("");
        setCoverImage("");
        setFileNameAtWrite("");
        setWordCount(0);
        setParagraphCount(0);
        setReadTime(1);
    };

    const publishBlog = async () => {
        let storedDraft = JSON.parse(localStorage.getItem("draft"));
        //let user = user;
        
        if (!storedDraft.tags || storedDraft.tags.length === 0) {
            alert("Please Add tag to post blog");
        } else if (!storedDraft.body || storedDraft.body === "") {
            alert("Please Add something in body to post blog");
        } else if (!storedDraft.title || storedDraft.title === "") {
            alert("Please Add Title to post blog");
        } else {
            try {
                const postData = {
                    title: storedDraft.title,
                    subtitle: storedDraft.subTitle || "",
                    body: storedDraft.body,
                    tags: storedDraft.tags,
                    wordCount: storedDraft.wordCount,
                    paragraphCount: storedDraft.paragraphCount,
                    readTime: storedDraft.readTime,
                    coverImageUrl: coverImage || ""
                };

                const userId = user.uid;
            
                if (!userId) {
                    throw new Error("User ID not found. Please log in again.");
                }
                
                const postedBlog = await BlogService.createPost(postData, null, userId);
                
                localStorage.removeItem("draft");
                alert("Successfully published your blog");
                console.log("postedBlog", postedBlog);
                emptyFields();
                navigate('/');
            } catch (error) {
                console.error("Error publishing blog:", error);
                alert("Error publishing blog. Please try again.");
            }
        }
    };

    const saveDraft = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const draftData = {
                title: titleData,
                subtitle: subTitleData,
                body: storeData,
                tags: JSON.parse(localStorage.getItem("draft"))?.tags || [],
                wordCount: wordCount,
                paragraphCount: paragraphCount,
                readTime: readTime,
                status: 'draft',
                coverImageUrl: coverImage || ""
            };
            
            await BlogService.createPost(draftData, null, user.uid);
            alert("Draft saved successfully");
        } catch (error) {
            console.error("Error saving draft:", error);
        }
    };

    const handleLiveDataCounts = (countNames, counts) => {
        let storedDraft = JSON.parse(localStorage.getItem("draft"));
        localStorage.setItem(
            "draft",
            JSON.stringify({
                ...storedDraft,
                [countNames]: counts,
            })
        );
    };

    const handleLiveData = (e, saveName) => {
        setLiveSaving(true);
        if (saveName === "title") {
            setTitleData(e.target.value);
        } else if (saveName === "subTitle") {
            setSubTitleData(e.target.value);
        }
        let storedDraft = JSON.parse(localStorage.getItem("draft"));
        let email = JSON.parse(localStorage.getItem("email"));

        localStorage.setItem(
            "draft",
            JSON.stringify({
                ...storedDraft,
                [saveName]: e.target.value,
                email: email,
            })
        );
        setTimeout(() => {
            setLiveSaving(false);
        }, 1000);
    };

    const handleRemoveImage = () => {
        if (window.confirm("Are you sure you want to remove the cover image?")) {
            setCoverImage("");
            const storageRef = ref(storage, `cover/${fileNameAtWrite}`);
            deleteObject(storageRef)
                .then(() => {
                    let storedDraft = JSON.parse(localStorage.getItem("draft"));
                    localStorage.setItem(
                        "draft",
                        JSON.stringify({
                            ...storedDraft,
                            coverUrl: "",
                            imageName: "",
                        })
                    );
                })
                .catch((error) => {
                    console.log("error:", error);
                });
        }
    };

    const uploadImage = (e, from) => {
        if (e.target.files[0]) {
            uploadToDB(e.target.files[0], from);
            if (from === "write") setFileNameAtWrite(e.target.files[0].name);
        }
    };

    const uploadToDB = (image, from) => {
        let storageRef;
        if (from === "write") {
            storageRef = ref(storage, `blog-images/${Date.now()}_${image.name}`);
        } else {
            storageRef = ref(storage, `blog-covers/${Date.now()}_${image.name}`);
        }

        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                if (from === "write") {
                    const imageText = `\n![${image.name}](${
                        "Upload is " + progress + "% done"
                    })`;
                    insertAtCursor(imageText);
                }
            },
            (error) => {
                console.log(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    if (from === "write") {
                        const imageText = `\n![${image.name}](${downloadURL})`;
                        insertAtCursor(imageText);
                        setWordCount(wordCount + 1);
                        handleLiveDataCounts("wordCount", wordCount + 1);
                    } else if (from === "cover") {
                        setCoverImage(downloadURL);
                        setLiveSaving(true);
                        let storedDraft = JSON.parse(localStorage.getItem("draft"));
                        localStorage.setItem(
                            "draft",
                            JSON.stringify({
                                ...storedDraft,
                                coverUrl: downloadURL,
                                imageName: image.name,
                            })
                        );
                        setLiveSaving(false);
                    }
                    console.log("File available at", downloadURL);
                });
            }
        );
    };

    const handleChangeData = (e) => {
        setLiveSaving(true);
        let currentStoredDataString = e.target.value;
        setStoreData(currentStoredDataString);

        if (currentStoredDataString.length === 0) {
            setShowTags(false);
        } else {
            setShowTags(true);
        }

        handleLiveData(e, "body");

        // Word Count
        let cur = 0;
        let str = currentStoredDataString.trim();
        if (str === "") {
            cur = 0;
        } else {
            str = str.replace(/\n/gi, " ");
            str = str.replace(/[ ]{2,}/gi, " ");
            cur = str.split(" ").length;
        }
        setWordCount(cur);
        handleLiveDataCounts("wordCount", cur);

        // Read time
        let readingTime = Math.ceil(cur / 150);
        setReadTime(readingTime);
        handleLiveDataCounts("readTime", readingTime);

        // Paragraph count
        let paraCount = currentStoredDataString
            .replace(/\n$/gm, "")
            .split(/\n/).length;
        setParagraphCount(paraCount);
        handleLiveDataCounts("paragraphCount", paraCount);
        
        setTimeout(() => {
            setLiveSaving(false);
        }, 1000);
    };

    return (
        <div>
            <EditorNavbar
                liveSaving={liveSaving}
                publishBlog={publishBlog}
                wordCount={wordCount}
                paragraphCount={paragraphCount}
                readTime={readTime}
                showTags={showTags}
            />
            <BodyDiv>
                <div>
                    <div>
                        <div>
                            <EditorTitle
                                coverImage={coverImage}
                                uploadImage={uploadImage}
                                handleLiveData={handleLiveData}
                                titleData={titleData}
                                subTitleData={subTitleData}
                                handleRemoveImage={handleRemoveImage}
                                setCoverImage={setCoverImage}
                            />
                            {leftOption === 0 && (
                                <EditorOptionBar
                                    handleOptions={handleOptions}
                                    uploadImage={uploadImage}
                                    storeData={storeData}
                                    handleChangeData={handleChangeData}
                                    handleKeyDown={handleKeyDown}
                                    handleCursorPosition={handleCursorPosition}
                                    textAreaRef={textAreaRef}
                                />
                            )}

                            {leftOption === 1 && (
                                <MarkdownPreview content={storeData} />
                            )}

                            {leftOption === 2 && (
                                <Guide />
                            )}
                        </div>
                    </div>
                </div>
            </BodyDiv>
        </div>
    );
};

const BodyDiv = styled.div`
    width: 95%;
    margin: auto;
    padding: 0 0.5rem;
    background-color: #111827;
    min-height: 100vh;

    & > div {
        width: 80%;
        margin: auto;

        & > div {
            width: 100%;
            padding: 1.25rem 1rem;
            background-color: #1f2937;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
    }
`;