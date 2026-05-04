// Ejemplo: Sistema de Posts con TanStack Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

// ========== API LAYER ==========
export const postsAPI = {
  getPosts: async (page = 1) => {
    const response = await apiClient.get('/posts', { params: { page } })
    return response.data
  },

  getPostDetail: async (id: string) => {
    const response = await apiClient.get(`/posts/${id}`)
    return response.data
  },

  createPost: async (data: { title: string; content: string }) => {
    const response = await apiClient.post('/posts', data)
    return response.data
  },

  updatePost: async (id: string, data: any) => {
    const response = await apiClient.put(`/posts/${id}`, data)
    return response.data
  },

  deletePost: async (id: string) => {
    await apiClient.delete(`/posts/${id}`)
  },
}

// ========== QUERY KEYS ==========
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (page: number) => [...postKeys.lists(), { page }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
}

// ========== QUERIES & MUTATIONS ==========

export function useGetPosts(page = 1) {
  return useQuery({
    queryKey: postKeys.list(page),
    queryFn: () => postsAPI.getPosts(page),
  })
}

export function useGetPostDetail(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsAPI.getPostDetail(id),
  })
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { title: string; content: string }) => postsAPI.createPost(data),
    onSuccess: () => {
      // Invalida la lista de posts para que se recargue
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => postsAPI.updatePost(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postsAPI.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

// ========== COMPONENTES DE EJEMPLO ==========

export function PostsList() {
  const [page, setPage] = useState(1)
  const { data: posts, isLoading } = useGetPosts(page)
  const createMutation = useCreatePostMutation()

  if (isLoading) return <div>Cargando posts...</div>

  return (
    <div>
      <h1>Posts</h1>
      <button
        onClick={() =>
          createMutation.mutate({
            title: 'Nuevo Post',
            content: 'Contenido del post',
          })
        }
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creando...' : 'Crear Post'}
      </button>

      {posts?.map((post: any) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}

      <div>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>
    </div>
  )
}

export function PostDetail({ id }: { id: string }) {
  const { data: post, isLoading } = useGetPostDetail(id)
  const updateMutation = useUpdatePostMutation()
  const deleteMutation = useDeletePostMutation()

  if (isLoading) return <div>Cargando...</div>

  const handleUpdate = (newData: any) => {
    updateMutation.mutate({ id, data: newData })
  }

  const handleDelete = () => {
    if (confirm('¿Eliminar este post?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
      <button onClick={() => handleUpdate({ title: 'Título Actualizado' })}>
        {updateMutation.isPending ? 'Actualizando...' : 'Editar'}
      </button>
      <button onClick={handleDelete} disabled={deleteMutation.isPending}>
        {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  )
}
