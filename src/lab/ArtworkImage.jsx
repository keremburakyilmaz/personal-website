import { useEffect, useState } from 'react';

export default function ArtworkImage({ artwork, alt }) {
  const [source, setSource] = useState(artwork.imageUrl);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSource(artwork.imageUrl);
    setFailed(false);
  }, [artwork.id, artwork.imageUrl]);

  const handleError = () => {
    if (artwork.imageFallbackUrl && source !== artwork.imageFallbackUrl) {
      setSource(artwork.imageFallbackUrl);
      return;
    }
    setFailed(true);
  };

  if (failed) {
    return (
      <div className="archive-image-error" role="img" aria-label={alt}>
        <span>IMAGE TEMPORARILY WITHHELD</span>
        <small>The record is present. The object is elsewhere.</small>
      </div>
    );
  }

  return <img src={source} alt={alt} onError={handleError} />;
}
