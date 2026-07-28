import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// iTunes returns a different shape than Shazam Core did.
// We normalize all of its APIs into one shape so components stay unchanged.
//
// Each song carries BOTH shapes the template reads from:
//   - images.coverart / hub.actions[1].uri  -> used on most pages
//   - attributes.artwork.url / attributes.previews[0].url
//       -> SongBar branches to this shape when artistId is present,
//          because Shazam's artist endpoint returned Apple Music objects.

const appleAttrs = (name, artistName, artworkUrl, previewUrl) => ({
  name,
  artistName,
  artwork: { url: artworkUrl },
  previews: [{ url: previewUrl }],
});

// --- Search API (/search, /lookup) ---
const normalize = (r) => {
  const art = r.artworkUrl100?.replace("100x100", "500x500");
  return {
    key: String(r.trackId),
    title: r.trackName,
    subtitle: r.artistName,
    images: { coverart: art, background: art },
    artists: [{ adamid: String(r.artistId) }],
    hub: { actions: [null, { uri: r.previewUrl }] },
    genres: { primary: r.primaryGenreName },
    url: r.trackViewUrl,
    attributes: appleAttrs(r.trackName, r.artistName, art, r.previewUrl),
  };
};

// /search results carry kind: 'song'
const normalizeList = (res) =>
  (res?.results || []).filter((r) => r.kind === "song").map(normalize);

// /lookup results carry wrapperType: 'track'; the artist row has no trackId
const normalizeLookup = (res) =>
  (res?.results || [])
    .filter(
      (r) => (r.wrapperType === "track" || r.kind === "song") && r.trackId,
    )
    .map(normalize);

// --- RSS charts feed (/{country}/rss/topsongs/...) ---
// Completely different shape: feed.entry[] with im:-prefixed keys.
const normalizeRss = (res) =>
  (res?.feed?.entry || []).map((e) => {
    const raw = e["im:image"]?.[e["im:image"].length - 1]?.label;
    const art = raw?.replace(/\d+x\d+bb/, "500x500bb");
    const audio = e.link?.find((l) => l.attributes?.type === "audio/x-m4a");
    const preview = audio?.attributes?.href;
    const artistHref = e["im:artist"]?.attributes?.href || "";
    const artistId = artistHref.match(/\/(\d+)(?:\?|$)/)?.[1] || "";
    const title = e["im:name"]?.label;
    const artist = e["im:artist"]?.label;

    return {
      key: e.id?.attributes?.["im:id"] || "",
      title,
      subtitle: artist,
      images: { coverart: art, background: art },
      artists: [{ adamid: artistId }],
      hub: { actions: [null, { uri: preview }] },
      genres: { primary: e.category?.attributes?.label },
      url: e.id?.label,
      attributes: appleAttrs(title, artist, art, preview),
    };
  });

export const shazamCoreApi = createApi({
  reducerPath: "shazamCoreApi",
  // '/itunes/' is proxied to https://itunes.apple.com
  //   - dev:  server.proxy in vite.config.js
  //   - prod: [[redirects]] in netlify.toml
  // Direct browser calls get redirected to a musics:// URL scheme that
  // browsers can't follow, so the proxy is required in both environments.
  baseQuery: fetchBaseQuery({ baseUrl: "/itunes/" }),
  endpoints: (builder) => ({
    // Real Apple chart data, not a search for the words "top hits"
    getTopCharts: builder.query({
      query: () => "us/rss/topsongs/limit=25/json",
      transformResponse: normalizeRss,
    }),

    // Real per-country charts - what "Around You" was always meant to show
    getSongsByCountry: builder.query({
      query: (countryCode) =>
        `${(countryCode || "US").toLowerCase()}/rss/topsongs/limit=25/json`,
      transformResponse: normalizeRss,
    }),

    getSongsByGenre: builder.query({
      query: (genre) =>
        `search?term=${encodeURIComponent(genre || "pop")}&media=music&entity=song&limit=25`,
      transformResponse: normalizeList,
    }),

    getSongsBySearch: builder.query({
      query: (searchTerm) =>
        `search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=25`,
      transformResponse: normalizeList,
    }),

    getSongDetails: builder.query({
      query: ({ songid }) => `lookup?id=${songid}`,
      transformResponse: (res) => normalizeLookup(res)[0] || null,
    }),

    getSongRelated: builder.query({
      query: ({ songid }) => `lookup?id=${songid}&entity=song&limit=15`,
      transformResponse: normalizeLookup,
    }),

    getArtistDetails: builder.query({
      query: (artistId) => `lookup?id=${artistId}&entity=song&limit=25`,
      transformResponse: (res, meta, artistId) => {
        const rows = res?.results || [];
        const artistRow = rows.find((r) => r.wrapperType === "artist");
        const songs = normalizeLookup(res);
        return {
          // matches the shape DetailsHeader expects:
          // artistData?.artists[artistId]?.attributes
          artists: {
            [artistId]: {
              attributes: {
                name: artistRow?.artistName || songs[0]?.subtitle || "",
                // iTunes has no artist image, so borrow the first cover
                artwork: { url: songs[0]?.images?.coverart || "" },
                genreNames: [artistRow?.primaryGenreName || "Music"],
              },
            },
          },
          songs,
        };
      },
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetArtistDetailsQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
} = shazamCoreApi;
