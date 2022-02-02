class Movie {
  constructor(id, url, title, original_title, year, date_published, duration, description, long_description,
    avg_vote, imdb_score, votes, metascore, image_url, actors, directors, writers, genres, countries, languages, rated, company) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.original_title = original_title;
    this.year = year;
    this.date_published = date_published;
    this.duration = duration;
    this.description = description;
    this.long_description = long_description;
    this.avg_vote = avg_vote;
    this.imdb_score = imdb_score;
    this.votes = votes;
    this.metascore = metascore;
    this.image_url = image_url;
    this.actors = actors;
    this.directors = directors;
    this.writers = writers;
    this.genres = genres;
    this.countries = countries;
    this.languages = languages;
    this.rated = rated;
    this.company = company;
  }

  async init(url) {
    let response = await fetch(url);
    if (!response.ok) { throw new Error('Fetch missed, pls check API server'); }
    let data = await response.json();
    this.id = data.id;
    this.url = data.url;
    this.title = data.title;
    this.original_title = data.original_title;
    this.year = data.year;
    this.date_published = data.date_published;
    this.duration = data.duration;
    this.description = data.description;
    this.long_description = data.long_description;
    this.avg_vote = data.avg_vote;
    this.imdb_score = data.imdb_score;
    this.votes = data.votes;
    this.metascore = data.metascore;
    this.image_url = data.image_url;
    this.actors = data.actors;
    this.directors = data.directors;
    this.writers = data.writers;
    this.genres = data.genres;
    this.countries = data.countries;
    this.languages = data.languages;
    this.rated = data.rated;
    this.company = data.company;
    debugger
    return this;
  }
}

function createMovie(movieUrl) {
  let x = new Movie();
  return x.init(movieUrl);
}

let bestFilmUrl = "http://localhost:8000/api/v1/titles/1508669";

createMovie(bestFilmUrl).then(function (movie) { console.log(movie) })

