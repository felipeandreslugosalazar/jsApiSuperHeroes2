// API INFO
// https://www.superheroapi.com/
const token = '10223569763528853';
const baseUrl = `https://superheroapi.com/api.php/${token}`;

// VARIABLES
const heroInfoDiv = document.getElementById('heroInfo');

const heroImageDiv = document.getElementById('heroImage');
const heroNameDiv = document.getElementById('heroName');
const heroePowerStatsDiv = document.getElementById('heroePowerStats');
const heroButtonDiv = document.getElementById('heroButton');

const searchHeroInput = document.getElementById('searchHero');
// maxNumberSuperHeroes +1 to fecth from 1 to 371
const maxNumberSuperHeroes = 731 + 1;

// HELPER FUNCTIONS
// number of SuperHeroes in API db 731
// function to get a random number from 0 to 731
let randomNumber = (maxNumber) => {
  // attention!
  // this algorithm returns a number
  // between 0 and maxNumber not including maxNumber
  return Math.floor(Math.random() * maxNumber);
  // Math.floor(Math.random() * 2) + 1;
}

// CORE FUNCTION
async function fetchApi(superHeroApiUrl) {
  try {
    const response = await fetch(superHeroApiUrl, {});
    const json = await response.json();
    // return promise
    return json;
  }
  catch (error) {
    console.log('There has been a problem with your fetch operation:', error);
  };
};

const statToemoji = {
  combat: '🤜',
  durability: '🏋️',
  intelligence: '🧠',
  power: '📊',
  speed: '⚡',
  strength: '💪',
};

const nullToQuestionMarks = (stat) => {
  return stat == 'null' ? '¿?' : stat;
};

const showHeroInfo = (character) => {
  const name = `<h2>${character.name}</h2>`;
  const image = `<img src="${character.image.url}" alt="">`;
  const stats = Object.keys(character.powerstats).map(stat => {
    return `<p>${statToemoji[stat]} ${stat.toUpperCase()}: ${nullToQuestionMarks(character.powerstats[stat])}</p>`;
  }).join('');

  heroImageDiv.innerHTML = `<img src="${character.image.url}" alt="">`;
  heroNameDiv.innerHTML = `<h2>${character.name}</h2>`;
};

const setInitialHeroInfo = () => {
  heroImageDiv.innerHTML = '';
  heroNameDiv.innerHTML = '';
};

// get the superHero info from the superheros API
// using the randomNumber to get a"random" info
const getSuperHeroes = (randomId, name) => {
  // random superHeroe
  if (name == '') {
    fetchApi(`${baseUrl}/${randomId}`)
      .then(randomSuperHeroe => {
        showHeroInfo(randomSuperHeroe);
      });
  }
  // search superHeroe by name(*)
  // results are "all superHeroes with (*) in the name"
  else {
    fetchApi(`${baseUrl}/search/${name}`)
      .then(searchSuperHeroesResponse => {
        if (searchSuperHeroesResponse.response == 'success') {
          let superHero = searchSuperHeroesResponse.results[0];
          showHeroInfo(superHero);
        } else {
          heroInfoDiv.innerHTML = 'There is not a Super Hero withs this name 😫.';
        }
      });
  };
}

searchHeroInput.onkeyup = () => {
  if (searchHeroInput.value != '') {
    heroButtonDiv.innerHTML = 'Search Hero';
  } else {
    heroButtonDiv.innerHTML = 'Random Hero';
  }
}

heroButtonDiv.onclick = () => {
  let userInput = searchHeroInput.value;
  getSuperHeroes(randomNumber(maxNumberSuperHeroes), userInput);
};

setInitialHeroInfo();