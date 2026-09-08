import { useState } from 'react';

// Simple "type + Enter" tag editor used for skillsToTeach, skillsToLearn,
// and skill post tags — anywhere a string array is edited.
const TagInput = ({ tags, onChange, placeholder = 'Type and press Enter...', color = 'brand' }) => {
  const [value, setValue] = useState('');

  const addTag = () => {
    const v = value.trim();
    if (!v || tags.includes(v)) {
      setValue('');
      return;
    }
    onChange([...tags, v]);
    setValue('');
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const badgeClass =
    color === 'accent'
      ? 'bg-accent-500/10 text-accent-600'
      : 'bg-brand-50 text-brand-700';

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag) => (
          <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${badgeClass}`}>
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="opacity-60 hover:opacity-100">
              ×
            </button>
          </span>
        ))}
        {tags.length === 0 && <span className="text-xs text-gray-400">None added yet</span>}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-shadow"
      />
    </div>
  );
};

export default TagInput;
