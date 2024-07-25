let pokemonRepository = (function () {

  const pokemonList = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) { //only adds pokemon to pokemonList if it is and object and has the correct object keys
    if (typeof pokemon === 'object') {
      if (typeof pokemon.name === 'string' && typeof pokemon.detailsUrl === 'string') {
        pokemonList.push(pokemon);
      }
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    console.log("Poke add list", pokemon)
    let listOfPokemons = document.querySelector('.pokemon-list');
    listItem = document.createElement('li');
    listItem.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4'); // Responsive column classes and margin-bottom

    // create card element
    let card = document.createElement('div');
    card.classList.add('card');

    // create card image
    let cardImg = document.createElement('img');
    cardImg.src = pokemon.imageUrl;
    cardImg.classList.add('card-img-top');
    cardImg.alt = pokemon.name;

    // create card body
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // create card title
    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');

    // create card button
    let cardButton = document.createElement('button');
    cardButton.innerText = `${pokemon.name}`;
    cardButton.classList.add('btn', 'btn-outline-dark');
    cardButton.setAttribute('data-bs-toggle', 'modal');
    cardButton.setAttribute('data-bs-target', '#pokemonModal');

    // Append elements to card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardButton);

    // Append image and body to card
    card.appendChild(cardImg);
    card.appendChild(cardBody);

    // Append card to list item
    listItem.appendChild(card);

    // Append list item to list of Pokémons
    listOfPokemons.appendChild(listItem);

    cardButton.addEventListener('click', function () {
      showDetails(pokemon);
    });
  }

  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        loadDetails(pokemon).then(poke => {
          add(poke);
          addListItem(poke)
        }) //loads Details for each pokemon

      });
    }).catch(function () {
      console.log('error');
    });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height / 10;
      item.types = details.types;
      item.weight = details.weight / 10;

      return item;
    }).catch(function () {
      console.log('error');
    });
  }

  function showDetails(item) {
    showModal(item);
  }


  function showModal(item) {
    let modalTitle = document.querySelector('#pokemonModalLabel');
    let modalBody = document.querySelector('.modal-body');

    modalTitle.innerText = item.name;

    modalBody.innerHTML = `
      <img src="${item.imageUrl}" class="img-fluid" alt="${item.name}" style="width: 40%">
      <p>Height: ${item.height} m</p>
      <p>Weight: ${item.weight} kg</p>
      <p>Type: ${item.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
    `;
  }

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
  };
})();

pokemonRepository.loadList();

// Add an event listener to the navigation menu items
document.querySelectorAll('.nav-link').forEach((item) => {
  item.addEventListener('click', (event) => {
    let typeInfo = event.target.getAttribute('data-type');
    filterPokemonByType(typeInfo);
  });
});

// Function to filter Pokémon by type
function filterPokemonByType(type) {
  let pokemonList = pokemonRepository.getAll();
  let filteredPokemon = pokemonList.filter((pokemon) => {
    if (type === 'all') return true;
    if (!pokemon.types) return false; // Add this check
    return pokemon.types.some(typeInfo => typeInfo.type.name === type);
  });
  // Update the Pokémon list with the filtered data
  let pokemonListElement = document.querySelector('.pokemon-list');
  pokemonListElement.innerHTML = '';
  filteredPokemon.forEach((pokemon) => {
    pokemonRepository.addListItem(pokemon);
  });
}