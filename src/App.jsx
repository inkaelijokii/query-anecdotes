import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { NotificationProvider } from './components/NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const getAnecdotes = async () => {
  const response = await axios.get('http://localhost:3000/anecdotes')
  return response.data
}

const voteAnecdote = async (anecdote) => {
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  const response = await axios.patch(`http://localhost:3000/anecdotes/${anecdote.id}`, updatedAnecdote)
  return response.data
}

const App = () => {
  const queryClient = useQueryClient()

  const { data: anecdotes, error, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  const { mutate: vote } = useMutation(voteAnecdote, {
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldAnecdotes) =>
        oldAnecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a)
      )
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Something went wrong, please try again later.</div>


  return (
    <NotificationProvider>
      <div>
        <h3>Anecdote app</h3>
    
        <Notification />
        <AnecdoteForm />
    
        {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
             {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        )}
      </div>
    </NotificationProvider>
  )
}

export default App
