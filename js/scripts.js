let pokemonList = [
    { name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'] },
    {name: 'Charmander', height: 0.6, types: ['fire']},
    {name: 'Squirtle', height: 0.5, types: ['water']},
];
for (let i = 0; i < pokemonList.length; i++) {
 let pokemon = pokemonList[i];
 document.write('<p>' + pokemon.name + ' (height: ' + pokemon.height + ')');
 if (pokemon.height > 0.6) {
   document.write ('  - Wow, that’s big!');
 }
}
