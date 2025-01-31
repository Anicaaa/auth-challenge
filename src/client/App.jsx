import { useEffect, useState } from 'react';
import './App.css';
import MovieForm from './components/MovieForm';
import UserForm from './components/UserForm';

const apiUrl = 'http://localhost:4000';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then(res => res.json())
      .then(res => setMovies(res.data));
  }, []);

  const handleRegister = async ({ username, password }) => {
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username, password}),
    };
    console.log(opts)
    await fetch(`${apiUrl}/user/register`, opts)
      .then((res) => res.json())
      .then((createdUser) => console.log("USER CREATED", createdUser));
  };

  const handleLogin = async ({ username, password }) => {
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username, password}),
    };
    await fetch(`${apiUrl}/user/login`, opts)
      .then((res) => res.json())
      .then((token) => {
        localStorage.setItem("token", token.data)
        console.log(`token for ${username} is ${token.data}`)
      });
  };
  
  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    const userToken = localStorage.getItem("token");
    console.log(`This is userToken ${userToken}`)

    const opts = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
   },
      body: JSON.stringify({title, description, runtimeMins}),
    };
    console.log(opts)
    await fetch(`${apiUrl}/movie`, opts)
      .then((res) => res.json())
      .then((createMovie) => setMovies([...movies, createMovie.data]));
  }

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map(movie => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;