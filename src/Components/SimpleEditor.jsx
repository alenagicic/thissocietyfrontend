import React, { useRef, useState, useEffect } from 'react';

const SimpleEditor = () => {
    const editorRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState({});
    const [selectedFormat, setSelectedFormat] = useState('4');
    const [activeAlign, setActiveAlign] = useState('justifyLeft');

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
                    setSelectedFormat('4');
                }
                
                if (document.queryCommandState('justifyLeft')) {
                    setActiveAlign('justifyLeft');
                } else if (document.queryCommandState('justifyCenter')) {
                    setActiveAlign('justifyCenter');
                } else if (document.queryCommandState('justifyRight')) {
                    setActiveAlign('justifyRight');
                }
            };

            editor.addEventListener('mouseup', updateToolbar);
            editor.addEventListener('keyup', updateToolbar);
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
                    <select 
                        value={selectedFormat} 
                        onChange={handleFormatChange} 
                        className="font-size-select"
                    >
                        {Object.entries(fontSizeMap).map(([value, text]) => (
                            <option key={value} value={value}>{text}</option>
                        ))}
                    </select>

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
