const express = require('express');
const movies =  require('./movies.json');
const crypto = require('crypto');
const {validateMovie, validatePartialMovie} = require("./schemas/movies.schemas");
const app = express();
app.use(express.json());
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;

app.get('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const {gen} =  req.query;
   if(gen) {
       const moviesFilter = movies.filter((movie) => movie.genre.includes(gen))
       res.json(moviesFilter);
   }else{
       res.json(movies);
   }
})

app.post('/movies', (req, res) => {
     const result =  validateMovie(req.body);
     if(result.error){
         return res.status(400).json({error:result.error});
     }
     const id =  crypto.randomUUID();
     const newMovie = {...result.data,id}
     movies.push(newMovie);
     res.status(201).json(movies);
})

app.get('/movies/:id', (req, res) => {
    const {id} = req.params;
    const movie = movies.find(movie => movie.id === id);
     return  (movie) ? res.json(movie) : res.status(404).json({"error": "Not Found"});
})

app.patch('/movies/:id', (req, res) => {

    const result =  validatePartialMovie(req.body);
    const {id} = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);
    if(result.error){
        return res.status(400).json({error:result.error});
    }
    if(movieIndex === -1){
        res.status(404).json({"error": "Not Found"});
    }
    const newMovie = {...movies[movieIndex],...result.data}
        movies[movieIndex] = newMovie;
    return   res.json(newMovie)
})


app.delete('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);
    if(movieIndex === -1){
        res.status(404).json({"error": "Not Found"});
    }
    movies.splice(movieIndex, 1);
   return  res.json({ success: true,  message: 'movie deleted successfully'});
})

app.options('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.send(200)
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})