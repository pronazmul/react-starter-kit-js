import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['Auth'],
    }),
    register: build.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (response) => response?.data,
    }),
    getUsers: build.query({
      query: (q) => ({ url: `/users`, params: q }),
      transformResponse: (response) => response?.data ?? [],
      providesTags: (result = []) =>
        ['User', ...result.map((u) => ({ type: 'User', id: u.id }))],
    }),
    getUser: build.query({
      query: (id) => `/users/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
    }),
    createUser: build.mutation({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['User'],
    }),
    updateUser: build.mutation({
      query: ({ id, ...patch }) => ({ url: `/users/${id}`, method: 'PUT', body: patch }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: build.mutation({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

