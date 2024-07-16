let pokemonRepository = (function () {

  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

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
    let listOfPokemons = document.querySelector('.pokemon-list');

    listItem = document.createElement('li');
    listItem.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4'); // Responsive column classes and margin-bottom

    let button = document.createElement('button');
    button.innerHTML = `${pokemon.name}`;
    button.classList.add('btn', 'btn-outline-dark');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#pokemonModal');

    listItem.appendChild(button);
    listOfPokemons.appendChild(listItem);

    button.addEventListener('click', function () {
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
        add(pokemon);
        loadDetails(pokemon); //loads Details for each pokemon
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
    }).catch(function () {
      console.log('error');
    });
  }

  function showDetails(item) {
    loadDetails(item).then(function () {
      showModal(item);
    });
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

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

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