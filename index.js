const main = document.querySelector('main');
const pokedex = document.querySelector('#pokedex');

const numOfPokemon = params.num ? Number(params.num) : 151;

/*
use index.html?num=300 to get the first 300 pokemon
the default is 151
goes all the way up to 898
*/

const baseurl = "https://pokeapi.co/api/v2"
let promises = []

for (let i = 1; i <= numOfPokemon; i++) {
    let url = `${baseurl}/pokemon/${i}`;
    promises.push(fetch(url).then(response => response.json()))
}

Promise.all(promises).then(results => {
    results.forEach(result => {
        renderPokemon(result)
    })
})

function renderPokemon(pokemon) {
    let a = document.createElement('a');
    a.href = `/pokemon.html?id=${pokemon.id}`;
    let li = document.createElement('li');
    li.classList.add('pokemon');
    li.classList.add("card")
    li.innerHTML = pokemonHtml(pokemon);
    a.appendChild(li);
    pokedex.appendChild(a);
}

const pokemonHtml = (pokemon) => `
<img class="card-image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
<p class="card-subtitle">${String(pokemon.id).padStart(3, '0')}</p>
<h2 class="card-title">${pokemon.name}</h2>
<p class="card-subtitle">${pokemon.types.map(x=>x.type.name).join(", ")}</p>
`