import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTagLookup } from '../Hooks/Create/useTagLookup';
import { fetchSuggestions } from '../Utils/api';

export default function Search() {
    const navigate = useNavigate();

    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('author');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [isFocused, setIsFocused] = useState(false);

    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const { tagSuggestions, debouncedLookupTags } = useTagLookup();
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const [authorSuggestions, setAuthorSuggestions] = useState([]);
    const [authorDropdownOpen, setAuthorDropdownOpen] = useState(false);
    const [highlightedAuthorIndex, setHighlightedAuthorIndex] = useState(-1);
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    const debouncedLookupAuthors = useRef(
        (username) => {
            const endpoint = `account/checkusername/${username}/returnid`;
            fetchSuggestions(endpoint)
                .then(data => {
                    setAuthorSuggestions(data.users);
                })
                .catch(error => console.error("Error fetching author suggestions:", error));
        }
    ).current;
    
    useEffect(() => {
        if (showSearch && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearch]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        
        if (filterType === 'author' && selectedAuthor) {
            navigate(`/content/author/${selectedAuthor.userId}`);
        } else if (filterType === 'tag' && tagSuggestions.length > 0 && tagSuggestions.includes(searchQuery)) {
            navigate(`/content/tag/${searchQuery}`);
        }
        
        setAuthorDropdownOpen(false);
        setTagDropdownOpen(false);
        setShowSearch(false);
    };

    const handleOptionClick = (type) => {
        setFilterType(type);
        setDropdownOpen(false);
        setSearchQuery('');
        setTagDropdownOpen(false);
        setAuthorDropdownOpen(false);
        setSelectedAuthor(null);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSelectedAuthor(null);

        if (filterType === 'tag' && value.trim().length > 0) {
            debouncedLookupTags(value);
            setTagDropdownOpen(true);
            setAuthorDropdownOpen(false);
            setHighlightedIndex(-1);
        } else if (filterType === 'author' && value.trim().length > 0) {
            debouncedLookupAuthors(value);
            setAuthorDropdownOpen(true);
            setTagDropdownOpen(false);
            setHighlightedAuthorIndex(-1);
        } else {
            setTagDropdownOpen(false);
            setAuthorDropdownOpen(false);
        }
    };
    
    const handleTagSuggestionClick = (tag) => {
        setSearchQuery(tag);
        setTagDropdownOpen(false);
        setHighlightedIndex(-1);
        navigate(`/content/tag/${tag}`);
        setShowSearch(false);
    };

    const handleAuthorSuggestionClick = (author) => {
        setSearchQuery(author.username);
        setSelectedAuthor(author);
        setAuthorDropdownOpen(false);
        setHighlightedAuthorIndex(-1);
        navigate(`/content/author/${author.userId}`);
        setShowSearch(false);
    };

    const handleKeyDown = (e) => {
        if (filterType === 'tag' && tagDropdownOpen) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    (prevIndex + 1) % tagSuggestions.length
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    (prevIndex - 1 + tagSuggestions.length) % tagSuggestions.length
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex !== -1) {
                    handleTagSuggestionClick(tagSuggestions[highlightedIndex]);
                }
            }
        } else if (filterType === 'author' && authorDropdownOpen) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedAuthorIndex((prevIndex) =>
                    (prevIndex + 1) % authorSuggestions.length
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedAuthorIndex((prevIndex) =>
                    (prevIndex - 1 + authorSuggestions.length) % authorSuggestions.length
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedAuthorIndex !== -1) {
                    handleAuthorSuggestionClick(authorSuggestions[highlightedAuthorIndex]);
                }
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };

        if (showSearch) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSearch]);

    const renderDropdownPanel = (suggestions, highlightedIndex, clickHandler, valueKey) => (
        <div className={`${filterType}-dropdown-panel`}>
            {suggestions.map((item, index) => (
                <div
                    key={item.userId || index}
                    className={`${filterType}-suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                    onClick={() => clickHandler(item)}
                >
                    {item[valueKey]}
                </div>
            ))}
        </div>
    );

    const handleLinkClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className='mainsearchpage-nav'>
            {!showSearch ? (
                <button 
                    className='search-toggle-button' 
                    onClick={() => {
                        setShowSearch(true);
                        handleLinkClick();
                    }}
                    aria-label="Open search bar"
                >
                    <i className="bi-search"></i>
                </button>
            ) : (
                <div ref={searchRef} className='search-container'>
                    <div
                        className='custom-dropdown-container'
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        ref={dropdownRef}
                    >
                        <div className='selected-value'>
                            {filterType === 'author' && <i className="bi bi-person"></i>}
                            {filterType === 'tag' && <i className="bi bi-tag"></i>}
                        </div>
                        {dropdownOpen && (
                            <div className='dropdown-menu'>
                                <div
                                    className='dropdown-option'
                                    onClick={() => handleOptionClick('author')}
                                >
                                    <i className="bi bi-person"></i>
                                </div>
                                <div
                                    className='dropdown-option'
                                    onClick={() => handleOptionClick('tag')}
                                >
                                    <i className="bi bi-tag"></i>
                                </div>
                            </div>
                        )}
                    </div>

                    <form
                        className={`search-form ${isFocused ? 'outline' : ''}`}
                        onSubmit={handleSearchSubmit}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            className='search-input'
                            placeholder={`Search ${filterType}`}
                            value={searchQuery}
                            onChange={handleInputChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => {
                                if (!tagDropdownOpen && !authorDropdownOpen) {
                                    setIsFocused(false);
                                }
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        
                        {filterType === 'tag' && tagDropdownOpen && tagSuggestions.length > 0 && (
                            renderDropdownPanel(
                                tagSuggestions.map(tag => ({ tag: tag })),
                                highlightedIndex,
                                (item) => handleTagSuggestionClick(item.tag),
                                'tag'
                            )
                        )}

                        {filterType === 'author' && authorDropdownOpen && authorSuggestions.length > 0 && (
                            renderDropdownPanel(
                                authorSuggestions,
                                highlightedAuthorIndex,
                                handleAuthorSuggestionClick,
                                'username'
                            )
                        )}
                        
                    </form>
                </div>
            )}
        </div>
    );
}