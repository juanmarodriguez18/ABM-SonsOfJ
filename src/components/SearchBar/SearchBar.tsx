import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <input
      className='form-control'
      type="text"
      placeholder="Buscar por denominación..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default SearchBar;
