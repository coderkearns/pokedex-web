const main = document.querySelector('main');

/* Some constants */
const baseUrl = 'https://pokeapi.co/api/v2'
const versionPreferance = "platinum"

const pokemonId = params.id ? Number(params.id) : 1;
const pokemonUrl = `${baseUrl}/pokemon/${pokemonId}`
let pokemonMain = undefined


run()

async function run() {
    const pokemon = await getJSON(pokemonUrl)
    pokemonMain = pokemon
    await renderPokemon(pokemon);
}

async function renderPokemon(pokemon) {
    renderTitle(pokemon)
    renderImage(pokemon)
    renderInfo(pokemon)
    renderSpecies(pokemon)
    renderMoves(pokemon)
}

async function getJSON(url) {
    const response = await fetch(url)
    return await response.json()
}


async function renderTitle(pokemon) {
    const nameElement = document.querySelector('#name')
    const idElement = document.querySelector('#id')

    nameElement.innerText = pokemon.name
    idElement.innerText = `#${String(pokemon.id).padStart(3, "0")}`
}

async function renderImage(pokemon) {
    const imageEl = document.querySelector('#image')
    const imageDescEl = document.querySelector('#image-description')
    imageDescEl.innerText = "Front"
    imageEl.alt = pokemon.name + " image"
    imageEl.src = pokemon.sprites.front_default
    setupRotateImage(pokemon, imageEl, imageDescEl)
}

function setupRotateImage(pokemon, imageEl, imageDescEl) {
    const descriptions = ["Front", "Back", "Front Shiny", "Back Shiny"]
    const images = [pokemon.sprites.front_default, pokemon.sprites.back_default, pokemon.sprites.front_shiny, pokemon.sprites.back_shiny]
    let index = 1
    setInterval(() => {
        imageEl.src = images[index]
        imageDescEl.innerText = descriptions[index]
        index = (index + 1) % images.length
    }, 1000)
}

const colors = {
    // green
    hp: "#6bcc5b",
    // red
    attack: "#ed802b",
    // yellow
    defense: "#f6de52",
    // purple
    "special-attack": "#af73f6",
    // pink
    "special-defense": "#e96acd",
    // blue
    speed: "#5bb0ee",
}

async function renderInfo(pokemon) {
    const types = document.querySelector('#types')
    const stats = document.querySelector('#stats')

    types.innerHTML = pokemon.types.map(type => `<span class="type" data-type="${type.type.name}">${type.type.name}</span>`).join('')
    stats.innerHTML = pokemon.stats.map(stat => {
        let percent = Math.round(stat.base_stat / 255 * 100)
        return `
            <tr class="stat">
                <td class="stat-name">${stat.stat.name.replace("-", " ")}</td>
                <td class="stat-bar"><div class="stat-bar-color" style="width: ${percent}%;background-color: ${colors[stat.stat.name]};"></div></td>
                <td class="stat-value">${stat.base_stat}</td>
            </tr>
        `
    }).join('')
}

async function renderMoves(pokemon) {
    const moves = document.querySelector('#moves')
    const moveList = document.querySelector('#move-list')

    pokemon.moves.forEach(move => {
        const moveElement = document.createElement('li')
        moveElement.className = 'move'
        moveElement.innerHTML = `<span class="move-name">${move.move.name.replace("-", " ")}</span>`
        moveList.appendChild(moveElement)
    })
}

async function renderSpecies(pokemon) {
    const species = await getJSON(pokemon.species.url)
    renderSpeciesDescription(pokemon, species)
}

async function renderSpeciesDescription(pokemon, species) {
    const descriptionElement = document.querySelector('#description-text')
    descriptionElement.innerText = species.flavor_text_entries.find(entry => entry.language.name === "en" && entry.version.name === versionPreferance).flavor_text
}
