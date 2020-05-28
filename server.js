require('dotenv').config();
const PORT = 8000;
const MOVIES = require('./moviedex.json');

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req,res,next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  
  if(!authToken || authToken.split(' ')[1] !== apiToken){
    return res
      .status(401)
      .json({ error: 'Unauthorized request' })
  }

  next();
})

function handleGetMovie(req,res){
  let response = MOVIES;

  // filter movie by country 
  if (req.query.country){
    response = response.filter(movie => 
      // case-insensitive searching
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }
  // filter by average vote
  if (req.query.avg_vote){
    response = response.filter(movie => 
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    )
  }
  // filter movie by genre
  if (req.query.genre){
    response = response.filter(movie => 
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }
  // filder by name
  if (req.query.search){
    response = response.filter(movie => 
      movie.film_title.toLowerCase().includes(req.query.search.toLowerCase())
    )
  }

  res.json(response);
}
app.get('/movie', handleGetMovie)


// _______________________
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
})