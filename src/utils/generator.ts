import { Dex } from '@pkmn/dex';
import { Generations, Specie, type Item, type Move } from '@pkmn/data';
import * as Banlists from './custom-banlists';

const gens = new Generations(Dex);

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    ability: string;
    moves: string[];
    evs: number[];
    heldItem: string;
    shiny: boolean;
}

export interface GenerationOptions {
    tier: string;
    generation: string;
    includeLegendaries: boolean; //allow legendaries to be included - true by default
    includeNFE: boolean; //allow untiered NFE/LC Pokemon to be included (if LC not selected) - false by default
    forceOneAttackingMove: boolean; //all Pokemon will have at least one attacking move - true by default
}

export function generateTeam(args: GenerationOptions): Move[] {

    let whitelist = generatePokemonWhitelist(args);
    let item_whitelist = generateItemWhitelist(args);
    let move_whitelist = generateMoveWhitelist(args);
    let ability_whitelist = generateAbilityWhitelist(args);

    //todo: generate seed

    let seed = 0;

    //todo: generate 6 Pokemon with a held item, ability, 4 moves, and a shiny status

    return move_whitelist;
}

function generatePokemonWhitelist(args: GenerationOptions): Specie[] {
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
        //todo: figure out wtf to do here
        default:
            return [];
    }

    let banlist: Specie[] = [];


    //fallthrough in this switch statement is intentional
    switch (args.tier.toUpperCase()) {
        // @ts-ignore
        case 'LC':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'ZU').map(pokemon => pokemon)];
        //todo: add additional LC banned Pokemon here
        // @ts-ignore
        case 'ZU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'PU'
                || pokemon.tier.toUpperCase() === 'ZUBL').map(pokemon => pokemon)];
        // @ts-ignore
        case 'PU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'NU'
                || pokemon.tier.toUpperCase() === 'PUBL').map(pokemon => pokemon)];
        // @ts-ignore
        case 'NU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'RU'
                || pokemon.tier.toUpperCase() === 'NUBL').map(pokemon => pokemon)];
        // @ts-ignore
        case 'RU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'UU'
                || pokemon.tier.toUpperCase() === 'RUBL').map(pokemon => pokemon)];
        // @ts-ignore
        case 'UU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'OU'
                || pokemon.tier.toUpperCase() === 'UUBL').map(pokemon => pokemon)];
        // @ts-ignore
        case 'OU':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'UBER').map(pokemon => pokemon)];
        // @ts-ignore
        case 'UBER':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'AG').map(pokemon => pokemon)];
        case 'AG':
            break; //no filtering required, AG is everyone
        case '1v1':
            break; //todo: filtering is required but I need to retrieve a banlist first
        default:
            return [];

    }

    //todo: further filter legendaries - check Specie.tags for Legendary, Mythical, Ultra Beast, etc
    //todo: blanket filters like filtering Illegal pokemon and unreleased ones

    let whitelist = [...species].filter(pokemon => !banlist.includes(pokemon));
    return whitelist;
}

function generateItemWhitelist(args: GenerationOptions): Item[] {

    let banlist: string[];
    let fetch_string = args.generation === 'Nat Dex' ? 'natdexitems' : `gen${args.generation}items`;
    let items = args.generation === 'Nat Dex' ? gens.get('9').items : gens.get(args.generation).items;

    switch (args.tier.toUpperCase()) {
        case 'LC':
        case 'ZU':
        case 'PU':
        case 'NU':
        case 'RU':
        case 'UU':
        case 'OU':
            banlist = Banlists.BANLISTS_OU[fetch_string as keyof typeof Banlists.BANLISTS_OU];
            break;
        case 'UBER':
        case 'AG':
            break; //no item bans in this tier
        case '1v1':
            break;
        default:
            break;
    }

    //todo: item clauses
    //todo: filter out unusable items

    let whitelist = [...items].filter(item => !banlist.includes(item.name));
    return whitelist;
}


function generateMoveWhitelist(args: GenerationOptions): Move[] {

    let banlist: string[];
    let fetch_string = args.generation === 'Nat Dex' ? 'natdexitems' : `gen${args.generation}moves`;
    //todo: change nat dex to pull all moves, not just gen 9
    let moves = args.generation === 'Nat Dex' ? gens.get('9').moves : gens.get(args.generation).moves;

    switch (args.tier.toUpperCase()) {
        case 'LC':
        case 'ZU':
        case 'PU':
        case 'NU':
        case 'RU':
        case 'UU':
        case 'OU':
            banlist = Banlists.BANLISTS_OU[fetch_string as keyof typeof Banlists.BANLISTS_OU];
            break;
        case 'UBER':
        case 'AG':
            break; //no item bans in this tier
        case '1v1':
            break;
        default:
            break;
    }

    //todo: move clauses
    //todo: filter out unusable moves

    let whitelist = [...moves].filter(move => !banlist.includes(move.name));
    return whitelist;
}

function generateAbilityWhitelist(args: GenerationOptions): string[] {
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