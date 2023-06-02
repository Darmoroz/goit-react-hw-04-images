import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { useState } from 'react';

export const App = () => {
  const [query, setQuery] = useState('');

  return (
    <>
      <Searchbar onSubmit={setQuery} />
      {query && <ImageGallery query={query.trim()} />}
    </>
  );
};
