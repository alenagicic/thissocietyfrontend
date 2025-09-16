import React, { useRef, useState, useEffect } from 'react';

const SimpleEditor = () => {
    const editorRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState({});
    const [selectedFormat, setSelectedFormat] = useState('4');
    const [activeAlign, setActiveAlign] = useState('justifyLeft');

    // Mapping of execCommand fontSize values to pixel values
    const fontSizeMap = {
        '1': '10px',
        '2': '13px',
        '3': '16px',
        '4': '20px',
        '5': '24px',
        '6': '32px',
        '7': '48px',
    };

    useEffect(() => {
        const editor = editorRef.current;
        if (editor) {
            // Function to update the toolbar based on the current selection
            const updateToolbar = () => {
                const formats = {
                    bold: document.queryCommandState('bold'),
                    italic: document.queryCommandState('italic'),
                    underline: document.queryCommandState('underline'),
                };
                setActiveFormats(formats);

                const currentFontSize = document.queryCommandValue('fontSize');
                if (currentFontSize) {
                    setSelectedFormat(currentFontSize);
                } else {
                    setSelectedFormat('4'); // Default back to normal if no font size is found
                }
                
                // Update active alignment state
                if (document.queryCommandState('justifyLeft')) {
                    setActiveAlign('justifyLeft');
                } else if (document.queryCommandState('justifyCenter')) {
                    setActiveAlign('justifyCenter');
                } else if (document.queryCommandState('justifyRight')) {
                    setActiveAlign('justifyRight');
                }
            };

            // Listen for changes in the editor to update the toolbar state
            editor.addEventListener('mouseup', updateToolbar);
            editor.addEventListener('keyup', updateToolbar);
            // Also update on initial mount
            updateToolbar();

            return () => {
                editor.removeEventListener('mouseup', updateToolbar);
                editor.removeEventListener('keyup', updateToolbar);
            };
        }
    }, []);

    const toggleFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        const formats = {
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
        };
        setActiveFormats(formats);
    };
    
    const toggleAlign = (command) => {
        document.execCommand(command);
        setActiveAlign(command);
    };

    const handleFormatChange = (e) => {
        const format = e.target.value;
        setSelectedFormat(format);
        document.execCommand('fontSize', false, format);
    };

    return (
        <div className="editor-container">
            <div className="editor-card">
                <div className="toolbar">
                    {/* Font Size Dropdown in pixels */}
                    <select 
                        value={selectedFormat} 
                        onChange={handleFormatChange} 
                        className="font-size-select"
                    >
                        {Object.entries(fontSizeMap).map(([value, text]) => (
                            <option key={value} value={value}>{text}</option>
                        ))}
                    </select>

                    {/* Formatting Buttons */}
                    <button
                        onMouseDown={(e) => { e.preventDefault(); toggleFormat('bold'); }}
                        className={`toolbar-button ${activeFormats['bold'] ? 'toolbar-button-active' : ''}`}
                    >
                        <span className="font-bold">B</span>
                    </button>
                    <button
                        onMouseDown={(e) => { e.preventDefault(); toggleFormat('italic'); }}
                        className={`toolbar-button ${activeFormats['italic'] ? 'toolbar-button-active' : ''}`}
                    >
                        <span className="italic">I</span>
                    </button>
                    <button
                        onMouseDown={(e) => { e.preventDefault(); toggleFormat('underline'); }}
                        className={`toolbar-button ${activeFormats['underline'] ? 'toolbar-button-active' : ''}`}
                    >
                        <span className="underline">U</span>
                    </button>
                    
                    {/* Alignment Buttons */}
                    <button
                        onMouseDown={(e) => { e.preventDefault(); toggleAlign('justifyLeft'); }}
                        className={`toolbar-button ${activeAlign === 'justifyLeft' ? 'toolbar-button-active' : ''}`}
                    >
                        Left
                    </button>
                    <button
                        onMouseDown={(e) => { e.preventDefault(); toggleAlign('justifyCenter'); }}
                        className={`toolbar-button ${activeAlign === 'justifyCenter' ? 'toolbar-button-active' : ''}`}
                    >
                        Center
                    </button>
                    <button
                        onMouseDown={(e) => { e.preventDefault(); toggleAlign('justifyRight'); }}
                        className={`toolbar-button ${activeAlign === 'justifyRight' ? 'toolbar-button-active' : ''}`}
                    >
                        Right
                    </button>
                </div>

                <div
                    ref={editorRef}
                    contentEditable="true"
                    className="editor-content"
                />
            </div>
        </div>
    );
};

export default SimpleEditor;
