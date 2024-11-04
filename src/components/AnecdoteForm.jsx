import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNotification } from './NotificationContext'

const addAnecdote = async (newAnecdote) => {
  const response = await axios.post('http://localhost:3001/anecdotes', newAnecdote)
  return response.data
}

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const { mutate } = useMutation(addAnecdote, {
    onSuccess: (newAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldAnecdotes) => [...oldAnecdotes, newAnecdote])
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Anecdote added successfully!'})
    },
    onError: (error) => {
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Failed to add anecdote. Content must be at least 5 characters long.'})
    }
  })

  const handleAddAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    if (content.length < 5) {
      alert("Anecdote must be at least 5 characters long.")
      return
    }
    mutate({ content, votes: 0 })
    e.target.anecdote.value = ''
  }

  return (
    <form onSubmit={handleAddAnecdote}>
      <input name="anecdote" placeholder='Write an anecdote' />
      <button type="submit">Add Anecdote</button>
    </form>
  )
}

export default AnecdoteForm