import { useState, useEffect } from 'react';
import GameService from '../services/GameService';
import { Icon } from '@iconify/react/dist/iconify.js';

const GameDetail = ({ gameId, onClose }) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const data = await GameService.getGameDetails(gameId);
        setGame(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  if (loading) return (
    <div className="py-8 text-center">
      <Icon icon="svg-spinners:blocks-shuffle-3" width="24" height="24" />
    </div>
  );
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  if (!game) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{game.name}</h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <img
            src={game.background_image}
            alt={game.name}
            className="w-full h-64 object-contain rounded-lg mb-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="font-medium">Release Date</dt>
                  <dd>{new Date(game.released).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="font-medium">Genres</dt>
                  <dd>{game.genres?.map(genre => genre.name).join(', ')}</dd>
                </div>
                <div>
                  <dt className="font-medium">Platforms</dt>
                  <dd>{game.platforms?.map(p => p.platform.name).join(', ')}</dd>
                </div>
                <div>
                  <dt className="font-medium">Developers</dt>
                  <dd>{game.developers?.map(dev => dev.name).join(', ')}</dd>
                </div>
                <div>
                  <dt className="font-medium">Publishers</dt>
                  <dd>{game.publishers?.map(pub => pub.name).join(', ')}</dd>
                </div>
                <div>
                  <dt className="font-medium">Metacritic Score</dt>
                  <dd className="font-bold text-green-600">{game.metacritic || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700">{game.description_raw}</p>
            </div>
          </div>

          {game.trailers?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Trailers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {game.trailers.map(trailer => (
                  <div key={trailer.id} className="aspect-video">
                    <video
                      controls
                      className="w-full h-full rounded"
                      poster={trailer.preview}
                    >
                      <source src={trailer.data.max} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">Rating</h3>
                <p>{game.rating} / 5</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">Website</h3>
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {game.website ? 'Visit Website' : 'N/A'}
                </a>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">ESRB Rating</h3>
                <p>{game.esrb_rating?.name || 'Not rated'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;