// shazamCore.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shazamCoreApi = createApi({
  reducerPath: 'shazamCoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://shazam-core.p.rapidapi.com/v1',
    prepareHeaders: (headers) => {
      headers.set('X-RapidAPI-Key', process.env.REACT_APP_RAPID_API_KEY || 'YOUR_API_KEY');
      headers.set('X-RapidAPI-Host', 'shazam-core.p.rapidapi.com');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 1. Track Recognition (POST – uses FormData)
    recognizeTrack: builder.mutation({
      query: (audioFile) => {
        const formData = new FormData();
        formData.append('file', audioFile);
        return {
          url: '/tracks/recognize',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // 2. Multi Search (GET)
    multiSearch: builder.query({
      query: ({ search_type = 'SONGS', query, offset = 0 }) =>
        `/search/multi?search_type=${search_type}&query=${encodeURIComponent(query)}&offset=${offset}`,
    }),

    // 3. Track Details v1 (GET)
    getTrackDetailsV1: builder.query({
      query: ({ track_id }) => `/tracks/details?track_id=${track_id}`,
    }),

    // 4. Track Details v2 (GET)
    getTrackDetailsV2: builder.query({
      query: ({ track_id }) => `/v2/tracks/details?track_id=${track_id}`,
    }),

    // 5. Related Tracks (GET)
    getRelatedTracks: builder.query({
      query: ({ track_id, offset = 0 }) =>
        `/tracks/related?track_id=${track_id}&offset=${offset}`,
    }),

    // 6. Similar Tracks (GET)
    getSimilarTracks: builder.query({
      query: ({ track_id }) => `/tracks/similarities?track_id=${track_id}`,
    }),

    // 7. Total Shazams (GET)
    getTotalShazams: builder.query({
      query: ({ track_id }) => `/tracks/total-shazams?track_id=${track_id}`,
    }),

    // 8. YouTube Video (GET)
    getYoutubeVideo: builder.query({
      query: ({ track_id, name }) =>
        `/tracks/youtube-video?track_id=${track_id}&name=${encodeURIComponent(name)}`,
    }),
  }),
});

export const {
  useRecognizeTrackMutation,
  useMultiSearchQuery,
  useGetTrackDetailsV1Query,
  useGetTrackDetailsV2Query,
  useGetRelatedTracksQuery,
  useGetSimilarTracksQuery,
  useGetTotalShazamsQuery,
  useGetYoutubeVideoQuery,
} = shazamCoreApi;