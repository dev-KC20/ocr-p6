
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
    // be accessible to keyboard's addicts
    this.root.addEventListener('keyup', e => {
      if (e.key === "ArrowRight" || e.key === "Right") {
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

let buildCarouselChildren = async (carouselAnchorChild, childrenListElement, toHide) => {
  /** in case of the Best Movie, it should get its Modal built but its Carousel elt. should be hidden */
  if (!toHide) {
    let newEltChild = document.createElement("div");
    newEltChild.setAttribute("class", 'carousel-child');
    newEltChild.setAttribute("id", childrenListElement['id']);
    carouselAnchorChild.appendChild(newEltChild);
    /** this img will become clickable to openModal */
    let newEltImg = document.createElement("img");
    newEltImg.src = childrenListElement.image_url;
    newEltImg.setAttribute("id", childrenListElement['id']);
    newEltImg.setAttribute("class", "js-modal");
    carouselAnchorChild.appendChild(newEltImg);

  }
  /** the modal is created with the Child but attached to a global Anchor modal-section */
  await buildMovieModal(modalAnchor, childrenListElement['id']);
}


/** Modal Section */


const openModal = function (e) {
  /* disable the click to operate we only want the ref*/
  e.preventDefault();
  /**  get the related id of the modal 
   * if img of carousel or a element : the id is in attribute id
   * if button : the id is ...
  */

  console.log('target modal0', e.target);
  console.log('target modal1', "#modal" + e.target.getAttribute('id'));
  const target = document.querySelector("#modal" + e.target.getAttribute('id'))
  console.log('target modal2', target);
  // /** the modal doesn't exist the first time it is clicked */
  // buildMovieModal(modalAnchor, e.target.getAttribute('id'))
  /**  remove the previous hidden value of display */
  target.style.display = null;
  /**  to be closed sooner or later */
  currentModal = target;
  currentModal.addEventListener('click', closeModal);
  currentModal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  /** only click out of the wrapper will close the modal */
  currentModal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
  if (currentModal === null) return
  /* disable the click to operate we only want the ref*/
  e.preventDefault();
  /**  remove the previous hidden value of display */
  currentModal.style.display = "none";
  /**  to be closed sooner or later */
  currentModal.removeEventListener('click', closeModal)
  currentModal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  currentModal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
  currentModal = null;
}


const stopPropagation = function (e) {
  e.stopPropagation();
}

/**
 * add text & API retrieved value to the modal 
 *
 * @param {*} movieModalId
 * @param {*} modalAnchor
 * @param {*} texte
 * @param {*} valeur
 * @param {*} type
 */
function addElementToModal(movieModalId, modalAnchor, texte, valeur, type) {
  // @now :TODO

  if (type == 'content') {
    let newModalElement = document.createElement('p');
    newModalElement.textContent = texte;
    modalAnchor.appendChild(newModalElement);
    let newModalElementContent = document.createElement('a');
    newModalElementContent.textContent = valeur;
    modalAnchor.appendChild(newModalElementContent);

  }
  if (type == 'image') {
    let newModalElement = document.createElement('img');
    newModalElement.alt = texte;
    newModalElement.src = valeur;
    modalAnchor.appendChild(newModalElement);

  }
  if (type == 'hidden') {
    let newModalElement = document.createElement('p');
    newModalElement.setAttribute("id", movieModalId);
    newModalElement.hidden = true;
    modalAnchor.appendChild(newModalElement);

  }
}


let buildMovieModal = async (modalAnchor, movieModalId) => {
  const modalMovie = await createFull(titleUrl + movieModalId);

  let newModalClass = document.createElement('aside');
  newModalClass.setAttribute("id", "modal" + movieModalId);
  newModalClass.setAttribute("class", 'modal');
  newModalClass.style.display = 'none';
  modalAnchor.appendChild(newModalClass);
  // container for modal
  let newModalContainer = document.createElement('div');
  newModalContainer.setAttribute("class", 'modal-wrapper js-modal-stop');
  newModalClass.appendChild(newModalContainer);
  // Modal header
  let newModalHeader = document.createElement('div');
  newModalHeader.setAttribute("class", 'modal-header');
  newModalContainer.appendChild(newModalHeader);
  addElementToModal(movieModalId, newModalHeader, '', modalMovie.title, "content");

  // Modal info
  let newModalInfo = document.createElement('div');
  newModalInfo.setAttribute("class", 'modal-info');
  newModalContainer.appendChild(newModalInfo);
  addElementToModal(movieModalId, newModalInfo, 'Poster original:', modalMovie.image_url, "image");
  addElementToModal(movieModalId, newModalInfo, 'Genre: ', modalMovie.genres, "content");
  addElementToModal(movieModalId, newModalInfo, 'Date de sortie: ', modalMovie.date_published, "content");
  addElementToModal(movieModalId, newModalInfo, 'Score imdb: ', modalMovie.imdb_score, "content");
  addElementToModal(movieModalId, newModalInfo, 'Durée (min): ', modalMovie.duration, "content");
  addElementToModal(movieModalId, newModalInfo, 'Pays d\'origine: ', modalMovie.countries, "content");
  addElementToModal(movieModalId, newModalInfo, 'Rated: ', modalMovie.rated, "content");

  // Modal details
  let newModalDetails = document.createElement('div');
  newModalDetails.setAttribute("class", 'modal-details');
  newModalContainer.appendChild(newModalDetails);
  addElementToModal(movieModalId, newModalDetails, 'Réalisateur(.e.s): ', modalMovie.directors, "content");
  addElementToModal(movieModalId, newModalDetails, 'Acteur(.e.s):', modalMovie.actors, "content");
  addElementToModal(movieModalId, newModalDetails, 'Résumé: ', modalMovie.description, "content");
  if (modalMovie.worldwide_gross_income != null) {
    addElementToModal(movieModalId, newModalDetails, 'Résultat Box office: ', modalMovie.worldwide_gross_income, "content");
  }
  // button to close the container 
  let newModalCloseButton = document.createElement('button');
  newModalCloseButton.textContent = "Fermer.";
  newModalCloseButton.setAttribute("class", 'js-modal-close');
  newModalDetails.appendChild(newModalCloseButton);
}

/**
 * @functmodalAnchor, ion
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

    newEltParent.textContent = categoryCurrent;
    carouselAnchor.appendChild(newEltParent);
    let carouselAnchorChild = document.querySelector("#" + categoryCurrent);
    // debugger
    for (let move of moviesObject[categoryCurrent]) {
      let toHide = false;
      if (move == moviesObject[bestCategory][0]) {
        /** Best Movie the Carousel shall be hidden */
        toHide = true;

      }
      const getChild = buildCarouselChildren(carouselAnchorChild, move, toHide);
    }
  }
}
let buildHero = async () => {
  // const carouselAnchor = document.querySelector(".hero-section");
  /** the best ever movie is to be retrieved & removed? from the best list */
  bestMovieId = moviesObject[bestCategory][0].id;
  console.log('bestMovieId buildHero', bestMovieId);
  let newHeroParent = document.createElement("div");
  newHeroParent.setAttribute("class", 'hero-parent');
  newHeroParent.style.display = 'block';
  /** remove the Best #1 from the list of bests & put it here only */
  newHeroParent.setAttribute("id", bestMovieId);
  newHeroParent.textContent = "Film à l'affiche:";
  heroAnchor.appendChild(newHeroParent);
  /** add image Modal */
  // let heroAnchorChild = document.querySelector("#" + bestMovieId);
  let newHeroChild = document.createElement('img');
  newHeroChild.setAttribute("class", 'hero-child');
  newHeroChild.alt = moviesObject[bestCategory][0].title;
  newHeroChild.src = moviesObject[bestCategory][0].image_url;
  /** id is needed in order point to the target of evenlistener */
  newHeroChild.setAttribute("id", bestMovieId);
  newHeroParent.appendChild(newHeroChild);
  /** add button to Modal */
  let newHeroButton = document.createElement('button');
  newHeroButton.textContent = "Plus d'information";
  newHeroButton.setAttribute("class", 'hero-modal');
  /** id is needed in order point to the target of evenlistener */
  newHeroButton.setAttribute("id", bestMovieId);
  newHeroParent.appendChild(newHeroButton);
  newHeroButton.addEventListener('click', openModal);

}





// Main section
const carouselAnchor = document.querySelector(".best-section");
let baseUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
let bestCategory = 'Best'
let categorieList = [bestCategory, 'Fantasy', 'Action', 'Thriller', 'Crime', 'Sci-Fi', 'Western'];
let numberOfMoviesPerCategoryToShow = 7;
/** @type {category:MovieLight[]}  [{'Fantasy': [MovieLight()...]}]*/
let moviesObject = {}
/** Modal information  */
let titleUrl = "http://localhost:8000/api/v1/titles/";
/** section of the document where the modal will be built */
const modalAnchor = document.querySelector(".modal-section");
const heroAnchor = document.querySelector(".hero-section");
let bestMovieId = "";
let bestMovieUrl = "http://localhost:8000/api/v1/titles/1508669";
/** keep track of the reference of currently open modal */
let currentModal = null;

let showCarousel = true;


checkApiServer().then((success) => {
  if (success) {
    if (showCarousel) {
      retrieveSortedMovies().then(() => {
        buildHero();
        buildDocumentElements()
          .then(async () => {
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
      }).then(() => {

        let modalClickElements = document.querySelectorAll(".js-modal");
        console.log('all img to add click event to', document.querySelectorAll(".js-modal"));
        for (modalClick of modalClickElements) {
          modalClick.addEventListener('click', openModal);
          // console.log('lien', modalClick.id);
        }

      })
    }

  }
}
)
  // .catch((reject) => {
  //   throw ('The API server is not available, end of the App');
  // }

  // )

