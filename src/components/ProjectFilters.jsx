import React, { useState } from 'react';
import ShuffleText from '../ShuffleText';

export default function ProjectFilters({
  categories,
  allTags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagsChange,
  isDarkMode,
  textEffectsEnabled,
  filteredCount
}) {
  const [showTags, setShowTags] = useState(false);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearAll = () => {
    onCategoryChange('Tous');
    onTagsChange([]);
  };

  const hasActiveFilters = selectedCategory !== 'Tous' || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`relative text-sm md:text-base tracking-wider transition-all duration-300 group ${
              isDarkMode ? 'hover:text-beige' : 'hover:text-black'
            }`}
            style={{
              color: selectedCategory === category
                ? (isDarkMode ? '#FFFFFF' : '#000000')
                : '#666666'
            }}
          >
            <ShuffleText enabled={textEffectsEnabled}>{category}</ShuffleText>
            {selectedCategory === category && (
              <span className={`absolute -bottom-2 left-0 right-0 h-px transition-all duration-300 ${
                isDarkMode ? 'bg-beige' : 'bg-black'
              }`} />
            )}
          </button>
        ))}
      </div>

      {/* Tag filters toggle */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setShowTags(!showTags)}
          className={`text-xs md:text-sm tracking-wider transition-all duration-300 flex items-center gap-2 ${
            isDarkMode ? 'text-gray-400 hover:text-beige' : 'text-gray-600 hover:text-black'
          }`}
        >
          <span>
            <ShuffleText enabled={textEffectsEnabled}>
              {showTags ? 'MASQUER LES FILTRES' : 'FILTRER PAR OUTIL'}
            </ShuffleText>
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${showTags ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Tag pills */}
        {showTags && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl animate-fade-in">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? isDarkMode
                      ? 'bg-beige text-black'
                      : 'bg-black text-white'
                    : isDarkMode
                    ? 'bg-beige/10 text-beige hover:bg-beige/20'
                    : 'bg-black/10 text-black hover:bg-black/20'
                }`}
              >
                <ShuffleText enabled={textEffectsEnabled}>{tag}</ShuffleText>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 animate-fade-in">
          <span className={`text-xs md:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <ShuffleText enabled={textEffectsEnabled}>
              {filteredCount} {filteredCount === 1 ? 'projet' : 'projets'}
            </ShuffleText>
          </span>

          {selectedTags.length > 0 && (
            <span className={`px-3 py-1 rounded-full text-xs ${
              isDarkMode
                ? 'bg-beige/20 text-beige'
                : 'bg-black/20 text-black'
            }`}>
              {selectedTags.length} {selectedTags.length === 1 ? 'filtre actif' : 'filtres actifs'}
            </span>
          )}

          <button
            onClick={handleClearAll}
            className={`text-xs underline transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-beige'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <ShuffleText enabled={textEffectsEnabled}>Tout effacer</ShuffleText>
          </button>
        </div>
      )}
    </div>
  );
}
