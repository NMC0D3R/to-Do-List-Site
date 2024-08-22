import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskApiSlice = createApi({
  reducerPath: "tasks",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/tasks" }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    keepUnusedDataFor: 5,
    getTasksByUser: builder.query({
      query: () => ({
        url: "/getTasksByUser",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Task"],
    }),
    createTask: builder.mutation({
      query: (newTask) => ({
        url: "/createTask",
        method: "POST",
        body: newTask,
        credentials: "include",
      }),
      providesTags: ["Task"],
    }),

    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `/deleteTask/${taskId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
    clearAllTasks: builder.mutation({
      query: () => ({
        url: "/clearAllTasks",
        method: "GET",
        credentials: "include",
      }),
    }),
    handleCompleteToggle: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "PATCH",
        body: { taskIsCompleted: true },
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
    editTask: builder.mutation({
      query: (id, newTitle, newDescription) => ({
        url: `/patchTask/${id}`,
        method: "PATCH",
        body: { title: newTitle, body: newDescription },
        credentials: "include",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksByUserQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useClearAllTasksMutation,
  useHandleCompleteToggleMutation,
  useEditTaskMutation,
} = taskApiSlice;
