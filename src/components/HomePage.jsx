import { useState, useEffect, useCallback } from "react";
import GameService from "../services/GameService";
import { Icon } from "@iconify/react/dist/iconify.js";

const HomePage = ({ onGameClick }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    platforms: "",
    genres: "",
    tags: "",
    developers: "",
    dates: "",
  });

  // Filter options state
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [platformsData, genresData, tagsData, developersData] =
          await Promise.all([
            GameService.getPlatforms(),
            GameService.getGenres(),
            GameService.getTags(),
            GameService.getDevelopers(),
          ]);

        setPlatforms(platformsData);
        setGenres(genresData);
        setTags(tagsData);
        setDevelopers(developersData);
      } catch (error) {
        setError("Failed to load filter options");
      }
    };

    fetchFilterOptions();
  }, []);

  const fetchGames = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      const data = await GameService.getGames(currentFilters);
      setGames(data.results);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filters.search) {
      if (searchTimeout) clearTimeout(searchTimeout);
      const timeoutId = setTimeout(() => {
        fetchGames(filters);
      }, 500);
      setSearchTimeout(timeoutId);
    } else {
      fetchGames(filters);
    }

    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [filters, fetchGames, searchTimeout]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchInputChange = useCallback((e) => {
    handleFilterChange("search", e.target.value);
  }, []);

  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (searchTimeout) clearTimeout(searchTimeout);
        fetchGames(filters);
      }
    },
    [fetchGames, filters, searchTimeout],
  );

  const handleSearchButtonClick = useCallback(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    fetchGames(filters);
  }, [fetchGames, filters, searchTimeout]);

  const handleDatesChange = useCallback((e) => {
    handleFilterChange("dates", e.target.value);
  }, []);

  const handlePlatformsChange = useCallback((e) => {
    handleFilterChange("platforms", e.target.value);
  }, []);

  const handleGenresChange = useCallback((e) => {
    handleFilterChange("genres", e.target.value);
  }, []);

  const handleTagsChange = useCallback((e) => {
    handleFilterChange("tags", e.target.value);
  }, []);

  const handleDevelopersChange = useCallback((e) => {
    handleFilterChange("developers", e.target.value);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Video Games</h1>

      {/* Search Bar */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search games..."
          className="w-full rounded border p-2"
          value={filters.search}
          onChange={handleSearchInputChange}
          onKeyDown={handleSearchKeyDown}
        />
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          onClick={handleSearchButtonClick}
        >
          Search
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Year Filter */}
        <select
          className="rounded border p-2"
          value={filters.dates}
          onChange={handleDatesChange}
        >
          <option value="">Select Year</option>
          {Array.from(
            { length: 25 },
            (_, i) => new Date().getFullYear() - i,
          ).map((year) => (
            <option key={year} value={`${year}-01-01,${year}-12-31`}>
              {year}
            </option>
          ))}
        </select>

        {/* Platform Filter */}
        <select
          className="rounded border p-2"
          value={filters.platforms}
          onChange={handlePlatformsChange}
        >
          <option value="">Select Platform</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>

        {/* Genre Filter */}
        <select
          className="rounded border p-2"
          value={filters.genres}
          onChange={handleGenresChange}
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        {/* Tags Filter */}
        <select
          className="rounded border p-2"
          value={filters.tags}
          onChange={handleTagsChange}
        >
          <option value="">Select Tag</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>

        {/* Developer Filter */}
        <select
          className="rounded border p-2"
          value={filters.developers}
          onChange={handleDevelopersChange}
        >
          <option value="">Select Developer</option>
          {developers.map((developer) => (
            <option key={developer.id} value={developer.id}>
              {developer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-8 text-center flex justify-center items-center">
          <Icon icon="svg-spinners:blocks-shuffle-3" width="80" height="80" />
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-600">Error: {error}</div>
      ) : (
        /* Games Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
              onClick={() => onGameClick(game.id)}
            >
              <img
                src={game.background_image}
                alt={game.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{game.name}</h2>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Released: {new Date(game.released).getFullYear()}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    Metacritic: {game.metacritic || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
