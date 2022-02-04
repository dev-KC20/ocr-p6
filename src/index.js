
class Carousel {
  /** credits to the course given with 'Art' by Jonathan @grafikart.fr */
  constructor(element, options = {}) {
    /** save HTML content to be placed in a 'slidable' container. */
    this.element = element
    /** to generalize & make flexible the parameters of Carousel
    */
    this.options = Object.assign({}, {
      slidesToScroll: 1,
      slidesVisible: 1,
      loop: false
    }, options)
    let children = [].slice.call(element.children)
    this.isMobile = false
    this.currentItem = 0
    this.moveCallBacks = []

    this.root = this.createDivWithClass('carousel')
    this.container = this.createDivWithClass('carousel__container')
    this.root.setAttribute("tabindex", "0")
    this.root.appendChild(this.container)
    this.element.appendChild(this.root)
    this.items = children.map((child) => {
      let item = this.createDivWithClass('carousel__item')
      item.appendChild(child)
      this.container.appendChild(item)
      return item
    })

    this.setStyle()
    this.createNavigation()

    this.moveCallBacks.forEach(cb => cb(0))
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize.bind(this))
    this.root.addEventListener('keyup', e => {
      if (e.key === "ArrowRight" || e.key === "Right") {
        debugger
        this.next()
      } else if (e.key === "ArrowLeft" || e.key === "Left") {
        this.prev()
      }
    })
  }

  setStyle() {
    let ratio = this.items.length / this.slidesVisible
    this.container.style.width = (ratio * 100) + "%"
    this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
  }

  createNavigation() {
    let nextButton = this.createDivWithClass("carousel__next")
    let prevButton = this.createDivWithClass("carousel__prev")
    this.root.parentNode.appendChild(nextButton)
    this.root.parentNode.appendChild(prevButton)
    nextButton.addEventListener("click", this.next.bind(this))
    prevButton.addEventListener("click", this.prev.bind(this))
    if (this.options.loop === true) {
      return
    }
    this.onMove(index => {
      if (index === 0) {
        prevButton.classList.add("carousel__prev--hidden")
      } else {
        prevButton.classList.remove("carousel__prev--hidden")
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add("carousel__next--hidden")
      } else {
        nextButton.classList.remove("carousel__next--hidden")
      }
    })
  }

  next() {
    this.goToItem(this.currentItem + this.slidesToScroll)
  }

  prev() {
    this.goToItem(this.currentItem - this.slidesToScroll)
  }


  goToItem(index) {
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.slidesVisible
      } else {
        return
      }
    } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
      if (this.options.loop) {
        index = 0
      } else {
        return
      }
    }
    let translateX = index * -100 / this.items.length
    this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
    this.currentItem = index
    this.moveCallBacks.forEach(cb => cb(index))

  }

   onMove(cb) {
    this.moveCallBacks.push(cb)
  }

  onWindowResize() {
    let mobile = window.innerWidth < 800
    if (mobile !== this.isMobile) {
      this.isMobile = mobile
      this.setStyle()
    }
    this.moveCallBacks.forEach(cb => cb(this.currentItem))
  }

   createDivWithClass(className) {
    let div = document.createElement("div")
    div.setAttribute("class", className)
    return div
  }


  get slidesToScroll() {
    return this.isMobile ? 1 : this.options.slidesToScroll
  }

  get slidesVisible() {
    return this.isMobile ? 1 : this.options.slidesVisible
  }
}


/**
 * Represents a movie as  described in imdb database and to be shown if requested thru Modal.
 * @constructor
 * @param {number} id - The id of the movie within the API db..
 * @param {uri} url - where the uri of the resource can be found.
 * @param {string} title - The author of the movie.
 * @param {number} imdb_score - The score collected by the site after visitor's votes.
 * @param {uri} image_url - The image from the movie poster.
 * @param {Array} genres - The genres the movie belongs to.
 */

class Movie {

  constructor(id, url, image_url, title, genres, date_published, rated, imdb_score, directors, actors, duration, countries, description, worldwide_gross_income) {
    this.id = id;
    this.url = url;
    this.image_url = image_url;
    this.title = title;
    this.genres = genres;
    this.date_published = date_published;
    this.rated = rated;
    this.imdb_score = imdb_score;
    this.directors = directors;
    this.actors = actors;
    this.duration = duration;
    this.countries = countries;
    this.description = description;
    this.worldwide_gross_income = worldwide_gross_income;
    // this.year = year;
    // this.long_description = long_description;
    // this.avg_vote = avg_vote;
    // this.votes = votes;
    // this.metascore = metascore;
    // this.writers = writers;
    // this.languages = languages;
    // this.company = company;
  }

  async init(url) {
    let responseFactory = await fetch(url);
    if (!responseFactory.ok) { throw new Error('Fetch missed, pls check API server'); }
    let data = await responseFactory.json();
    this.id = data.id;
    this.url = data.url;
    this.image_url = data.image_url;
    this.title = data.title;
    this.genres = data.genres;
    this.date_published = data.date_published;
    this.rated = data.rated;
    this.imdb_score = data.imdb_score;
    this.directors = data.directors;
    this.actors = data.actors;
    this.duration = data.duration;
    this.countries = data.countries;
    this.description = data.description;
    this.worldwide_gross_income = data.worldwide_gross_income;
    // debugger
    return this;
  }
}
/**
 * Represents a light version of a movie to supply carousels.
 * @constructor
 * @param {number} id - The id of the movie within the API db..
 * @param {uri} url - where the uri of the resource can be found.
 * @param {string} title - The author of the movie.
 * @param {number} imdb_score - The score collected by the site after visitor's votes.
 * @param {uri} image_url - The image from the movie poster.
 * @param {Array} genres - The genres the movie belongs to.
 */

class MovieLight {

  constructor(id, url, image_url, title, genres, imdb_score) {
    this.id = id;
    this.url = url;
    this.image_url = image_url;
    this.title = title;
    this.genres = genres;
    this.imdb_score = imdb_score;
  }

}

let createFull = function createMovie(movieUrl) {
  let x = new Movie();
  return x.init(movieUrl);
}



let checkApiServer = async function () {
  try {
    let responseCheck = await fetch(baseUrl);
    if (!responseCheck.ok) { throw new Error('Fetch missed, pls check API server'); }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }

}
let getSortedMovies = async function (sortedMoviePageUrl) {
  const response = await fetch(sortedMoviePageUrl);
  if (!response.ok) { throw new Error('Fetch missed, pls check API server'); }
  const data = await response.json();
  // console.log('data', data);
  return data
}

let buildSortedMoviesList = async function (moviesObject, movieCurrent, category) {
  moviesObject[category].push(
    new MovieLight(movieCurrent.id, movieCurrent.url, movieCurrent.image_url, movieCurrent.title, movieCurrent.genres, movieCurrent.imdb_score))
}
/**
 * @function
 * collects as many as set movies IDs for the listed genres 
 * with async fetch while condition can't depend on promise, therefore:
 * 6 genres + 1 best per 7 
 * the OCMovies-API supplies 5 items per pages
 * at least 2 pages will be loaded
 * loop of parallel getters
 */
let retrieveSortedMovies = async function () {
  for (let categoryCurrent of categorieList) {
    moviesObject[categoryCurrent] = [];
    let categoryLength = 0;
    let searchUrl = baseUrl;
    if (categoryCurrent != bestCategory) { searchUrl += "&genre=" + categoryCurrent; }
    let maxLoop = 3;

    while ((maxLoop > 1) && (searchUrl != null)) {
      await getSortedMovies(searchUrl)
        .then(async (sortedMovieList) => {
          for await (movieCurrent of sortedMovieList.results) {
            let buildSorted = await buildSortedMoviesList(moviesObject, movieCurrent, categoryCurrent);
            // moviesObject[categoryCurrent].push(
            //   new MovieLight(movieCurrent.id, movieCurrent.url, movieCurrent.image_url, movieCurrent.title, movieCurrent.genres, movieCurrent.imdb_score))
            categoryLength++;
          };
          searchUrl = await sortedMovieList.next;
        })
      maxLoop--;
    }
  }
}

let buildCarouselChildren = async (carouselAnchorChild, childrenListElement) => {
  let newEltChild = document.createElement("div");
  newEltChild.setAttribute("class", 'carousel-child');
  newEltChild.setAttribute("id", childrenListElement['id']);
  carouselAnchorChild.appendChild(newEltChild);
  let newEltImg = document.createElement("img");
  newEltImg.src = childrenListElement.image_url;
  newEltImg.setAttribute("id", childrenListElement['id']);
  carouselAnchorChild.appendChild(newEltImg);
}


/**
 * @function
 * collects as many as set movies IDs for the listed genres 
 * with async fetch while condition can't depend on promise, therefore:
 * 6 genres + 1 best per 7 
 * the OCMovies-API supplies 5 items per pages
 * at least 2 pages will be loaded
 * loop of parallel getters
 */
let buildDocumentElements = async () => {
  // const carouselAnchor = document.querySelector(".best-section");
  for (let categoryCurrent of categorieList) {
    // create a div anchor at category level
    let newEltParent = document.createElement("div");
    newEltParent.setAttribute("class", 'carousel-parent');
    newEltParent.setAttribute("id", categoryCurrent);
    newEltParent.textContent =  categoryCurrent;
    carouselAnchor.appendChild(newEltParent);
    let carouselAnchorChild = document.querySelector("#" + categoryCurrent);
    // debugger
    for (let move of moviesObject[categoryCurrent]) {

      const getChild = buildCarouselChildren(carouselAnchorChild, move);
    }
  }
}

const carouselAnchor = document.querySelector(".best-section");
let baseUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
let bestFilmUrl = "http://localhost:8000/api/v1/titles/1508669";
let bestCategory = 'Best'
let categorieList = [bestCategory, 'Fantasy', 'Action', 'Thriller', 'Crime', 'Sci-Fi', 'Western'];
let numberOfMoviesPerCategoryToShow = 7;
/** @type {category:MovieLight[]}  [{'Fantasy': [MovieLight()...]}]*/
let moviesObject = {}



checkApiServer().then((success) => {
  if (success) {
    retrieveSortedMovies().then(() => {
      buildDocumentElements()
        .then(async  () => {
          // anchor is of class 'carousel-parent' and id the 'category' value
          // We loop thru categories to set anchors & build carousel
          for await (let categoryCurrent of categorieList) {
            let bestCategoryAnchor = document.querySelector(".best-section #" + categoryCurrent + ".carousel-parent");
            new Carousel(bestCategoryAnchor, {
              slidesToScroll: 1,
              slidesVisible: 4,
              loop: false
            })
          }
        })
    })
  }
}
)
  // .catch((reject) => {
  //   throw ('The API server is not available, end of the App');
  // }

  // )

