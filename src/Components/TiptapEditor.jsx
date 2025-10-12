import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

const TiptapToolbar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="tiptap-toolbar">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            >
                <b>Bold</b>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            >
                <i>Italic</i>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
            >
                <s>Strike</s>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
            >
                H1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            >
                H2
            </button>
        </div>
    );
};

export default function TiptapEditor({ content, onContentChange, nextElementRef }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Let\'s write something inspirational',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onContentChange(html);
        },
    });

    const handleFocus = () => {
        if (editor) {
            editor.commands.focus();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Tab' && !event.shiftKey) {
            event.preventDefault();
            if (nextElementRef?.current) {
                nextElementRef.current.focus();
            }
        }
    };

    return (
        <div className="tiptap-container">
            <TiptapToolbar className="tiptap-bar" editor={editor} />
            <EditorContent 
                tabIndex={4} 
                editor={editor} 
                onFocus={handleFocus}
                onKeyDown={handleKeyDown} 
                style={{height: "20rem"}}
            />
        </div>
    );
}