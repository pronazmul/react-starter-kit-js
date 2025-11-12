import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // mocked by MSW
  tagTypes: ['User', 'Auth'],
  endpoints: () => ({}),
});

