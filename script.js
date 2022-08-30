// API INFO
// https://www.superheroapi.com/
const token = '10223569763528853';
const baseUrl = `https://superheroapi.com/api.php/${token}`;

// VARIABLES
const heroInfoDiv = document.getElementById('heroInfo');

const heroImageDiv = document.getElementById('heroImage');
const heroNameDiv = document.getElementById('heroName');
const heroePowerStatsDiv = document.getElementById('heroePowerStats');
const heroMultipleResultsNotificationDiv = document.getElementById('heroMultipleResultsNotification');
const heroMultipleResultsListDiv = document.getElementById('heroMultipleResultsList');
const heroButtonDiv = document.getElementById('heroButton');

const heroOnDemandDiv = document.querySelectorAll('.superHeroOnDemand');

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

  // console.log(character);
  // console.log(character.name);
  // console.log(character.image.url);

  const name = `<h2>${character.name}</h2>`;
  const image = `<img src="${character.image.url}" alt="">`;
  const stats = Object.keys(character.powerstats).map(stat => {
    return `<p>${statToemoji[stat]} ${stat.toUpperCase()}: ${nullToQuestionMarks(character.powerstats[stat])}</p>`;
  }).join('');

  heroImageDiv.innerHTML = `<img src="${character.image.url}" alt="">`;
  heroNameDiv.innerHTML = `<h2>${character.id}. ${character.name}</h2>`;
};

const superHeroMultipleResultsList = (length, characters) => {
  console.log(characters);
  let list = '';

  for (i = 0; i < length; i++) {
    console.log(characters[i]);
    // list += `<a href="" onclick=superHeroOnDemand()>${i}</a>`;
    list += `<a class="superHeroOnDemand" onclick=superHeroOnDemand()>${i}</a>`;
  }

  return list;
};

const superHeroOnDemand = (character) => {
  console.log(character.name);
  // heroImageDiv.innerHTML = `<img src="${character.image.url}" alt="">`;
  // heroNameDiv.innerHTML = `<h2>${character.name}</h2>`;
};

const setInitialHeroInfo = () => {
  heroNameDiv.innerHTML = `<h2>¿?. ¿ SuperHero?</h2>`;
  heroImageDiv.innerHTML = `<img src="./assets/images/misterX.png" alt="">`;
};

// get the superHero info from the superheros API
// using the randomNumber to get a"random" info
const getSuperHeroes = (randomId, name) => {
  // random superHeroe
  if (name == '') {
    fetchApi(`${baseUrl}/${randomId}`)
      .then(randomSuperHeroe => {
        // console.log(randomSuperHeroe);
        showHeroInfo(randomSuperHeroe);
      });
  }
  else {
    // search superHeroe by name(*)
    // results are "all superHeroes with (*) in the name"
    fetchApi(`${baseUrl}/search/${name}`)
      .then(searchSuperHeroesResponse => {

        // if response is error
        const easterEggs = ['diego', 'Diego', 'Gunter', 'pinguino', 'pingüino'];
        if (easterEggs.includes(name)) {
          heroImageDiv.innerHTML = `<img src="./assets/images/gunter.webp" alt="">`;
          let firstLetterCapitalize = name.charAt(0).toUpperCase() + name.slice(1);
          heroNameDiv.innerHTML = `<h2>XX. ${firstLetterCapitalize}</h2>`;

        } else if (searchSuperHeroesResponse.response == 'error') {
          heroImageDiv.innerHTML = '';
          heroNameDiv.innerHTML = 'There is not a Super Hero withs this name 😫.';
          heroMultipleResultsNotificationDiv.innerHTML = '';
        }
        // if response is success
        else {
          // if response is success and results is 1
          if (searchSuperHeroesResponse.results.length == 1) {
            showHeroInfo(searchSuperHeroesResponse.results[0]);
            // if response is success and results is more than 1
          } else {

            let superHeroMultipleResults = searchSuperHeroesResponse.results;
            // console.log(superHeroMultipleResults);
            let superHeroMultipleResultsLenght = superHeroMultipleResults.length;
            // console.log(superHeroMultipleResultsLenght);

            heroMultipleResultsNotificationDiv.innerHTML = `<p>There are <strong>${superHeroMultipleResultsLenght}</strong> superHeroes which name contains '${name}'.\n Keep on clicking search to randomly show more superHeroes with this name.</p>`;

            let randomSuperHeroMultipleResultsId = randomNumber(superHeroMultipleResultsLenght);
            // console.log(randomSuperHeroMultipleResultsId);

            showHeroInfo(superHeroMultipleResults[randomSuperHeroMultipleResultsId]);
          }
        }

        //   // or click on a number to see one of the results.
        //   // console.log(superHeroMultipleResultsLenght == 1);

        //   showHeroInfo(randomSearchSuperHero);

        //   // heroMultipleResultsListDiv.innerHTML = `${superHeroMultipleResultsLenght}`;
        //   // heroMultipleResultsListDiv.innerHTML = superHeroMultipleResultsList(superHeroMultipleResultsLenght, searchSuperHeroesResponse.results);
      })
  }
}

searchHeroInput.onkeyup = () => {
  if (searchHeroInput.value != '') {
    heroButtonDiv.innerHTML = 'Search Hero';
    setInitialHeroInfo();
  } else {
    heroButtonDiv.innerHTML = 'Random Hero';
    // heroInfoDiv.innerHTML = '';
    heroImageDiv.innerHTML = '';
    heroNameDiv.innerHTML = '';
    heroMultipleResultsNotificationDiv.innerHTML = '';
    setInitialHeroInfo();
  }
}

heroButtonDiv.onclick = () => {
  // console.log('heroButtonDiv.onclick');
  let userInput = searchHeroInput.value;
  getSuperHeroes(randomNumber(maxNumberSuperHeroes), userInput);
};

setInitialHeroInfo();
