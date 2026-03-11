import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1' }),
  tagTypes: ['User', 'Todo', 'Auth'],
  endpoints: () => ({}),
});

