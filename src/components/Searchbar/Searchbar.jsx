import PropTypes from 'prop-types';
import { ReactComponent as SearchIcon } from 'icons/search.svg';
import { SearchbarStyled, SearchForm } from './Searchbar.styled';
import { useState } from 'react';

export const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleChange = e => {
    const { value } = e.target;
    setQuery(value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (query === '') {
      alert('input query');
      return;
    }
    onSubmit(query);
    setQuery('');
  };

  return (
    <SearchbarStyled>
      <SearchForm onSubmit={handleSubmit}>
        <button type="submit" aria-label="search">
          <SearchIcon width="36" />
        </button>
        <input
          type="text"
          name="search"
          autoComplete="off"
          autoFocus
          placeholder="Image search"
          value={query}
          onChange={handleChange}
        />
      </SearchForm>
    </SearchbarStyled>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
