import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Modal } from 'components/Modal/Modal';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { ImageGalleryGrid } from './ImageGallery.styled';

import { fetchImages } from 'services/api';

import { PER_PAGE } from 'services/api';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const ImageGallery = ({ query }) => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(Status.IDLE);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    setSearch(query);
    setImages([]);
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (page === 0) {
      return;
    }
    setStatus(Status.PENDING);
    fetchImages(search, page)
      .then(({ hits, totalHits }) => {
        if (!hits.length) {
          alert('We have nothing for this query');
          throw new Error('We have nothing for this query');
        }
        const newImages = hits.map(
          ({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            tags,
            webformatURL,
            largeImageURL,
          })
        );
        setImages(images => {
          return [...images, ...newImages];
        });
        setTotalPage(Math.ceil(totalHits / PER_PAGE));
        setStatus(Status.RESOLVED);
      })
      .catch(error => {
        console.log(error);
        setStatus(Status.REJECTED);
      });
  }, [search, page]);

  const handleClickImg = e => {
    const { nodeName, attributes } = e.target;
    if (nodeName === 'IMG') {
      setShowModal(true);
      setLargeImageURL(attributes['data-large-image'].value);
      setTags(attributes.alt.value);
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <img src={largeImageURL} alt={tags} width={1280} />
        </Modal>
      )}
      <ImageGalleryGrid onClick={handleClickImg}>
        {images.map(({ id, webformatURL, largeImageURL, tags }) => {
          return (
            <li key={id}>
              <ImageGalleryItem
                id={id}
                webformatURL={webformatURL}
                largeImageURL={largeImageURL}
                tags={tags}
              />
            </li>
          );
        })}
      </ImageGalleryGrid>
      {status === Status.PENDING && <Loader />}
      {page < totalPage && status === Status.RESOLVED && (
        <Button
          loadMore={() => {
            setStatus(Status.PENDING);
            setPage(page => page + 1);
          }}
        />
      )}
    </>
  );
};

ImageGallery.propTypes = {
  query: PropTypes.string,
};
