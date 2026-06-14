
//this file may not be needed

export interface GeneratedPokemon {
    id: number;
    name: string;
    types: string[];
    ability_pool: string[];
    movepool: string[];
}

export async function getPokemon(id: number) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await response.json();
    return {
        id: data.id,
        name: data.name,
        types: data.types.map((type: any) => type.type.name),
        ability_pool: data.abilities.map((ability: any) => ability.ability.name),
        movepool: data.moves.map((move: any) => move.move.name)
    };
}