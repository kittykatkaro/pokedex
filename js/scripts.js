let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    if (typeof pokemon === 'object' &&
      typeof pokemon.name === 'string' &&
      typeof pokemon.detailsUrl === 'string') {
      pokemonList.push(pokemon);
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let $listOfPokemons = $('.pokemon-list');
    let $listItem = $('<li>', { class: 'list-group-item col-12 col-sm-6 col-md-4 col-lg-3 mb-4' });
    let $button = $('<button>', {
      text: pokemon.name,
      class: 'btn btn-outline-dark',
      'data-bs-toggle': 'modal',
      'data-bs-target': '#pokemonModal'
    });

    $listItem.append($button);
    $listOfPokemons.append($listItem);

    $button.on('click', function () {
      showDetails(pokemon);
    });
  }

  function loadList() {
    return fetch(apiUrl)
      .then(response => response.json())
      .then(json => {
        json.results.forEach(item => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
          loadDetails(pokemon);
        });
      })
      .catch(() => console.log('error'));
  }

  function loadDetails(item) {
    return fetch(item.detailsUrl)
      .then(response => response.json())
      .then(details => {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height / 10;
        item.types = details.types;
        item.weight = details.weight / 10;
      })
      .catch(() => console.log('error'));
  }

  function showDetails(item) {
    loadDetails(item).then(() => {
      showModal(item);
    });
  }

  function showModal(item) {
    $('#pokemonModalLabel').text(item.name);
    $('.modal-body').html(`
      <img src="${item.imageUrl}" class="img-fluid" alt="${item.name}" style="width: 40%">
      <p>Height: ${item.height} m</p>
      <p>Weight: ${item.weight} kg</p>
      <p>Type: ${item.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
    `);
  }

  return {
    getAll,
    add,
    addListItem,
    showDetails,
    loadList,
    loadDetails,
    showModal,
  };
})();

pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach(pokemon => {
    pokemonRepository.addListItem(pokemon);
  });
});

// Add an event listener to the navigation menu items
$('.nav-link').on('click', function (event) {
  let typeInfo = $(event.target).data('type');
  filterPokemonByType(typeInfo);
});

// Function to filter Pokémon by type
function filterPokemonByType(type) {
  let pokemonList = pokemonRepository.getAll();
  let filteredPokemon = pokemonList.filter(pokemon => {
    if (type === 'all') return true;
    if (!pokemon.types) return false;
    return pokemon.types.some(typeInfo => typeInfo.type.name === type);
  });

  // Update the Pokémon list with the filtered data
  $('.pokemon-list').empty();
  filteredPokemon.forEach(pokemon => {
    pokemonRepository.addListItem(pokemon);
  });
}