import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// iTunes Search API returns a different shape than Shazam Core did.
// We normalize it here so the existing components keep working unchanged.
const normalize = (r) => ({
  key: String(r.trackId),
  title: r.trackName,
  subtitle: r.artistName,
  images: {
    coverart: r.artworkUrl100?.replace("100x100", "500x500"),
    background: r.artworkUrl100?.replace("100x100", "500x500"),
  },
  artists: [{ adamid: String(r.artistId) }],
  hub: { actions: [null, { uri: r.previewUrl }] },
  genres: { primary: r.primaryGenreName },
  url: r.trackViewUrl,
});

const normalizeList = (res) =>
  (res?.results || []).filter((r) => r.kind === "song").map(normalize);

export const shazamCoreApi = createApi({
  reducerPath: "shazamCoreApi",
  // '/itunes/' is proxied to https://itunes.apple.com
  //   - dev:  server.proxy in vite.config.js
  //   - prod: [[redirects]] in netlify.toml
  // Direct browser calls to itunes.apple.com get redirected to a musics://
  // URL scheme that browsers can't follow, so the proxy is required.
  baseQuery: fetchBaseQuery({ baseUrl: "/itunes/" }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => "search?term=top+hits&media=music&entity=song&limit=25",
      transformResponse: normalizeList,
    }),

    getSongsByGenre: builder.query({
      query: (genre) =>
        `search?term=${encodeURIComponent(genre || "pop")}&media=music&entity=song&limit=25`,
      transformResponse: normalizeList,
    }),

    getSongsByCountry: builder.query({
      query: (countryCode) =>
        `search?term=music&country=${countryCode || "US"}&media=music&entity=song&limit=25`,
      transformResponse: normalizeList,
    }),

    getSongsBySearch: builder.query({
      query: (searchTerm) =>
        `search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=25`,
      transformResponse: normalizeList,
    }),

    getSongDetails: builder.query({
      query: ({ songid }) => `lookup?id=${songid}`,
      transformResponse: (res) => normalizeList(res)[0] || null,
    }),

    getSongRelated: builder.query({
      query: ({ songid }) => `lookup?id=${songid}&entity=song&limit=15`,
      transformResponse: normalizeList,
    }),

    getArtistDetails: builder.query({
      query: (artistId) => `lookup?id=${artistId}&entity=song&limit=25`,
      transformResponse: (res) => ({
        artist: res?.results?.[0] || null,
        songs: normalizeList(res),
      }),
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
