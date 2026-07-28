import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// iTunes returns a different shape than Shazam Core did.
// We normalize both of its APIs into one shape so components stay unchanged.

// --- Search API (/search, /lookup) ---
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

// --- RSS charts feed (/{country}/rss/topsongs/...) ---
// Completely different shape: feed.entry[] with im:-prefixed keys.
const normalizeRss = (res) =>
  (res?.feed?.entry || []).map((e) => {
    const img = e["im:image"]?.[e["im:image"].length - 1]?.label;
    const audio = e.link?.find((l) => l.attributes?.type === "audio/x-m4a");
    const artistHref = e["im:artist"]?.attributes?.href || "";
    const artistId = artistHref.match(/id(\d+)/)?.[1] || "";

    return {
      key: e.id?.attributes?.["im:id"] || "",
      title: e["im:name"]?.label,
      subtitle: e["im:artist"]?.label,
      images: {
        coverart: img?.replace(/\d+x\d+bb/, "500x500bb"),
        background: img?.replace(/\d+x\d+bb/, "500x500bb"),
      },
      artists: [{ adamid: artistId }],
      hub: { actions: [null, { uri: audio?.attributes?.href }] },
      genres: { primary: e.category?.attributes?.label },
      url: e.id?.label,
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
