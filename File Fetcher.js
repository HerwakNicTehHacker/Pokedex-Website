// Create a Map to store cached Pokémon sprites
const spriteCache = new Map();

//Variables for the Urshifu and Nidoran special case
const fSprite = document.getElementById("nidoranFSprite")
const fSpriteShiny = document.getElementById("nidoranFSpriteShiny")
const rapid = document.getElementById("urshifuRapidSprite")
const rapidShiny = document.getElementById("urshifuRapidSpriteShiny")

// Make a list of all the pokemon with multiple forms, then hard code them all, until you find a way to make it dynamic.



//Make a HTML Grid of all the Pokemon with other forms, and what to put to get their stats


//FETCHING THE SPRITES
async function fetchData() {
    try {
        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        let pokemonNameFixed = normaliseName(pokemonName);

/* All the hard coded mons with base forms:
This gives a default for just typing their names, without the forms. 
A later feature will be added of a grid of Pokemon forms to input in the correct manner */

const defaultForms = {
    deoxys: "deoxys-normal",
    wormadam: "wormadam-plant",
    giratina: "giratina-altered",
    shaymin: "shaymin-land",
    basculin: "basculin-red-striped",
    tornadus: "tornadus-incarnate",
    landorus: "landorus-incarnate",
    thundurus: "thundurus-incarnate",
    keldeo: "keldeo-ordinary",
    meloetta: "meloetta-aria",
    meowstic: "meowstic-male",
    aegislash: "aegislash-blade",
    pumpkaboo: "pumpkaboo-average",
    gourgeist: "gourgeist-average",
    oricorio: "oricorio-pom-pom",
    lycanroc: "lycanroc-midday",
    wishiwashi: "wishiwashi-solo",
    minior: "minior-red-meteor",
    mimikyu: "mimikyu-disguised",
    zygarde: "zygarde-complete",
    toxtricity: "toxtricity-amped",
    eiscue: "eiscue-ice",
    indeedee: "indeedee-male",
    morpeko: "morpeko-full-belly",
    oinkologne: "oinkologne-male",
    squawkabilly: "squawkabilly-green-plumage",
    maushold: "maushold-family-of-three",
    dudunsparce: "dudunsparce-two-segment",
    tatsugiri: "tatsugiri-curly",
    "nidoran-female": "nidoran-f",
    "nidoran-male": "nidoran-m",
    "tauros-paldea": "tauros-paldea-combat-breed"
  };

if (defaultForms[pokemonNameFixed]) {
pokemonNameFixed = defaultForms[pokemonNameFixed];}
if (pokemonNameFixed === "urshifu") {
pokemonNameFixed = "urshifu-single-strike"  
rapid.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10191.png";
rapid.style.display = "block";
rapidShiny.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10191.png";
rapidShiny.style.display = "block";}
else {
rapid.style.display = "none";
rapidShiny.style.display = "none";
}
//Nidoran
if (pokemonNameFixed === "nidoran") {
pokemonNameFixed = "nidoran-m"
fSprite.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png";
fSprite.style.display = "block";
fSpriteShiny.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/29.png";
fSpriteShiny.style.display = "block";}
else {
fSprite.style.display = "none";
fSpriteShiny.style.display = "none";
} 


// Check cache first
        if (spriteCache.has(pokemonNameFixed)) {
            console.log("Getting sprite from cache for:", pokemonNameFixed);
            const cachedSprites = spriteCache.get(pokemonNameFixed);
            displaySprites(cachedSprites);
            return;
        }

        // If not in cache, fetch from API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameFixed}`);
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();

        const sprites = {
            default: data.sprites.front_default,
            shiny: data.sprites.front_shiny,
            female: data.sprites.front_female,
            femaleShiny: data.sprites.front_shiny_female
        };

        // Store in cache
        spriteCache.set(pokemonNameFixed, sprites);


        // Save to localStorage to keep sprite on page after refresh. Sprite has to be stringified to be stored
        localStorage.setItem("lastPokemon", pokemonNameFixed);
        localStorage.setItem("lastSprites", JSON.stringify(sprites));


        // Display sprites
        displaySprites(sprites);

    } catch (error) {
        console.error(error);
    }
}

// Search for a Sprite just by clicking Enter, rather than pressing the button every time
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        fetchData();
    }
});

// Function to display sprites and hide missing ones
function displaySprites(sprites) {
    const imgElement = document.getElementById("pokemonSprite");
    const imgElementShiny = document.getElementById("pokemonSpriteShiny");
    const imgElementFemale = document.getElementById("pokemonSpriteFemale");
    const imgElementFemaleShiny = document.getElementById("pokemonSpriteFemaleShiny");

    if (sprites.default) {
        imgElement.src = sprites.default;
        imgElement.style.display = "block";
    } else {
        imgElement.style.display = "none";
    }

    if (sprites.shiny) {
        imgElementShiny.src = sprites.shiny;
        imgElementShiny.style.display = "block";
    } else {
        imgElementShiny.style.display = "none";
    }

    if (sprites.female) {
        imgElementFemale.src = sprites.female;
        imgElementFemale.style.display = "block";
    } else {
        imgElementFemale.style.display = "none";
    }

    if (sprites.femaleShiny) {
        imgElementFemaleShiny.src = sprites.femaleShiny;
        imgElementFemaleShiny.style.display = "block";
    } else {
        imgElementFemaleShiny.style.display = "none";
    }
}




// Normalise Pokémon names for forms
function normaliseName(input) {
    let words = input.toLowerCase().trim().split(/\s+/);

    const formMap = new Map([
        ["mega", "mega"],
        ["gmax", "gmax"],
        ["alolan", "alola"],
        ["alola", "alola"],
        ["galarian", "galar"],
        ["galar", "galar"],
        ["hisuian", "hisui"],
        ["hisui", "hisui"],
        ["paldean", "paldea"],
        ["paldea", "paldea"],
        ["x", "x"],
        ["y", "y"]
    ]);

    let nameWords = [];
    let formWords = [];

    for (let part of words) {
        if (formMap.has(part)) {
            formWords.push(formMap.get(part));
        } else {
            nameWords.push(part);
        }
    }

    if (formWords.includes("mega") && (formWords.includes("x") || formWords.includes("y"))) {
        let xy = formWords.includes("x") ? "x" : "y";
        formWords = ["mega", xy];
    }

    return [...nameWords, ...formWords].join("-");
}

// loads sprite when page refreshes, by gettingSprite, converting it back to an object, and displaying right away
window.addEventListener("load", () => {
    rapid.style.display = "none"
    rapidShiny.style.display = "none"
    fSprite.style.display = "none"
    fSpriteShiny.style.display = "none"
    const savedSprites = localStorage.getItem("lastSprites");
    if (savedSprites) {
        const sprites = JSON.parse(savedSprites);
        displaySprites(sprites);
    }
});

// loads name in the searchbar, by again, getting the name and pasting it straight into the type box
const savedPokemonName = localStorage.getItem("lastPokemon");
if (savedPokemonName) {
    document.getElementById("pokemonName").value = savedPokemonName;
}
