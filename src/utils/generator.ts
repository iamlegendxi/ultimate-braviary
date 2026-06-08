import { Dex } from '@pkmn/dex';
import { Generations } from '@pkmn/data';

const gens = new Generations(Dex);

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    ability: string;
    moves: string[];
    shiny: boolean;
}

export interface GenerationOptions {
    tier: string;
    generation: string;
    includeLegendaries: boolean; //allow legendaries to be included - true by default
    includeNFE: boolean; //allow untiered NFE/LC Pokemon to be included (if LC not selected) - false by default
    forceOneAttackingMove: boolean; //all Pokemon will have at least one attacking move - true by default
}

export function generateTeam(args: GenerationOptions): Pokemon[] {

    let species;

    switch (args.generation) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            species = gens.get(args.generation).species;
            break;
        case 'Nat Dex':
            //figure out wtf to do here
        default:
            return [];
    }

    let banlist: number[] = [];


    //fallthrough in this switch statement is intentional
    switch (args.tier.toUpperCase()) {
        // @ts-ignore
        case 'LC':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'ZU').map(pokemon => pokemon.num)];
        //add additional LC banned Pokemon here
        // @ts-ignore
        case 'ZU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'PU'
                    || pokemon.tier.toUpperCase() === 'ZUBL').map(pokemon => pokemon.num)];
        // @ts-ignore
        case 'PU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'NU'
                    || pokemon.tier.toUpperCase() === 'PUBL').map(pokemon => pokemon.num)];
        // @ts-ignore
        case 'NU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'RU'
                    || pokemon.tier.toUpperCase() === 'NUBL').map(pokemon => pokemon.num)];
        // @ts-ignore
        case 'RU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'UU'
                    || pokemon.tier.toUpperCase() === 'RUBL').map(pokemon => pokemon.num)];
        // @ts-ignore
        case 'UU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'OU'
                    || pokemon.tier.toUpperCase() === 'UUBL').map(pokemon => pokemon.num)];
        // @ts-ignore
        case 'OU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'UBERS').map(pokemon => pokemon.num)];
        // @ts-ignore
        case 'UBERS':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'AG').map(pokemon => pokemon.num)];
        case 'AG':
            break; //no filtering required, AG is everyone
        case '1v1':
            break; //filtering is required but I need to retrieve a banlist first
        default:
            break;

    }

    return [];
}

export function getPokemonByGeneration(generation: number) {
    const species = gens.get(generation).species;
    return [...species].filter(pokemon => pokemon.tier.toUpperCase() === 'OU').map(pokemon => pokemon.name);
}

export function getPokemonTier(generation: number) {
    const species = gens.get(generation).species;
    return species.get('articuno')?.tier;
}