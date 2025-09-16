import { useEffect } from 'react';

export const useQuillFocus = (quillRef) => {
    useEffect(() => {
        const handleFocusIn = () => {
            if (quillRef.current) {
                const quillContainer = quillRef.current.getEditor().container;
                if (quillContainer.contains(document.activeElement)) {
                    quillContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        };

        document.addEventListener('focusin', handleFocusIn);

        return () => {
            document.removeEventListener('focusin', handleFocusIn);
        };
    }, [quillRef]);
};
