import { Dex } from '@pkmn/dex';
import { Generations, Specie, type Ability, type Item, type Move } from '@pkmn/data';
import * as Banlists from './custom-banlists';
import { generateSeed } from './seed-generation';

const gens = new Generations(Dex);

interface MoveMethodObject {
    move: Move | undefined;
    method: string[];
}

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    ability: string;
    moves: string[];
    evs: number[];
    heldItem: string;
    shiny: boolean;
    image: string;
}

export interface Team {
    mons: Pokemon[];
    seed: number;
    timestamp: number;
    user: number;
}

export interface GenerationOptions {
    user: number;
    tier: string;
    generation: string;
    includeLegendaries: boolean; //allow legendaries to be included - true by default
    includeNFE: boolean; //allow untiered NFE/LC Pokemon to be included (if LC not selected) - false by default
    forceOneAttackingMove: boolean; //all Pokemon will have at least one attacking move - true by default
}

export async function generateTeam(args: GenerationOptions): Promise<any> {

    const whitelist = generatePokemonWhitelist(args);
    const item_whitelist = generateItemWhitelist(args);
    const move_whitelist = generateMoveWhitelist(args);
    const ability_whitelist = generateAbilityWhitelist(args);

    //todo: generate 6 Pokemon with a held item, ability, 4 moves, and a shiny status

    const pokemon_generated = args.tier.toUpperCase() === '1V1' ? 1 : 6;
    let mons: Pokemon[] = [];

    for (let i: number = 0; i < pokemon_generated; i++) {
        const index = Math.floor(Math.random() * whitelist.length)
        const pickedMon = whitelist[index];
        const movepool = await getPokemonMovepool(pickedMon, args, move_whitelist);
        const ability = getPokemonAbility(pickedMon, args, ability_whitelist);
        const held_item = getHeldItem(args, item_whitelist);
        const ev_spread = getEvSpread(args);
        const shiny = doShinyChance();
        const img_url = `https://www.smogon.com/dex/media/sprites/xy/${pickedMon.name.toLowerCase()}.gif`



        //now that everything generated, build the pokemon and add it to team
        const mon: Pokemon = {
            id: pickedMon.num,
            name: pickedMon.name,
            types: pickedMon.types,
            ability: ability,
            moves: movepool,
            evs: ev_spread,
            heldItem: held_item,
            shiny: shiny,
            image: img_url
        }

        mons.push(mon);

    }

    const seed = generateSeed(args, mons, Date.now());
    console.log(seed);

    //todo: build team from pokemon

    return mons;
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

    if (!args.includeNFE) banlist =
        [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'LC'
            || pokemon.tier.toUpperCase() == 'NFE').map(pokemon => pokemon)];
    
    //fallthrough in this switch statement is intentional
    switch (args.tier.toUpperCase()) {
        // @ts-ignore
        case 'LC':
            banlist = [...banlist, ...[...species].filter(pokemon => pokemon.tier.toUpperCase() === 'ZU').map(pokemon => pokemon)];
        //todo: add additional LC banned Pokemon here ?
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
        case '1V1':
            break; //todo: filtering is required but I need to retrieve a banlist first
        default:
            return [];

    }

    //todo: further filter legendaries - check Specie.tags for Legendary, Mythical, Ultra Beast, etc
    //todo: filter out pokemon who arent fully evolved - check evos.length
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
        case '1V1':
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
    let fetch_string = args.generation === 'Nat Dex' ? 'natdexmoves' : `gen${args.generation}moves`;
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
        case '1V1':
            break;
        default:
            break;
    }

    //todo: move clauses
    //todo: filter out unusable moves

    let whitelist = [...moves].filter(move => !banlist.includes(move.name));
    return whitelist;
}

function generateAbilityWhitelist(args: GenerationOptions): Ability[] {
    let banlist: string[];
    let fetch_string = args.generation === 'Nat Dex' ? 'natdexabilities' : `gen${args.generation}abilities`;
    //todo: change nat dex to pull all abilities, not just gen 9
    let abilities = args.generation === 'Nat Dex' ? gens.get('9').abilities : gens.get(args.generation).abilities;

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
        case '1V1':
            break;
        default:
            break;
    }

    //todo: ability clauses

    let whitelist = [...abilities].filter(ability => !banlist.includes(ability.name));
    return whitelist;
}

async function getPokemonMovepool(pokemon: Specie, args: GenerationOptions, whitelist: Move[]): Promise<string[]> {
    let learnset; let movepool;
    let enforceStrictLearnset: boolean; //forces all moves to be learnable in the currently selected generation
    let moves: string[] = [];
    const base_mon = pokemon.baseSpecies ?? pokemon.name

    switch (args.generation) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        // @ts-ignore
        case '7':
            enforceStrictLearnset = false;
        case '8':
        case '9':
            enforceStrictLearnset = true;
            if (base_mon !== pokemon.name) {
                //merge base form's moveset with form's moveset
                const [form_set, base_set] = await Promise.all([
                    gens.get(args.generation).learnsets.get(pokemon.name),
                    gens.get(args.generation).learnsets.get(base_mon)
                ]);
                if (!form_set && !base_set) return [];
                const mergedLearnset = {
                    ...base_set?.learnset,
                    ...form_set?.learnset
                }

                movepool = Object.entries(mergedLearnset)
                    .map(([name, methods]) => ({
                        move: gens.get(args.generation).moves.get(name),
                        method: methods
                    }))
                    .filter(item => item.move !== undefined)
            }
            else {
                learnset = await gens.get(args.generation).learnsets.get(pokemon.name);
                if (!learnset) return [];
                movepool = Object.entries(learnset.learnset!)
                    .map(([name, methods]) => ({ move: gens.get(args.generation).moves.get(name), method: methods }))
                    .filter(item => item.move != undefined);
            }
            let moves_learned = Math.min(4, movepool.length);
            let loopbreaker = 0;
            for (let i: number = 0; i < moves_learned; i++) {
                let picked = pickMove(movepool, moves, args, whitelist, enforceStrictLearnset);
                if (picked === "") { i--; loopbreaker++ }
                else moves.push(picked);
                if (loopbreaker > 200) break; //escape loop if it fails to generate a move enough times
            }
            break;
        case 'Nat Dex':
        //todo: figure out wtf to do here. will need to somehow check for move conflicts
        default:
            return [];
    }

    return moves;
}

function getPokemonAbility(pokemon: Specie, args: GenerationOptions, whitelist: Ability[]): string {
    //todo: change nat dex to pull all abilities
    let abilities;

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
            abilities = Object.values(pokemon.abilities).map(name => gens.get(args.generation).abilities.get(name))
                .filter(ability => ability !== undefined);
            if (!abilities) return "";
            return pickAbility(abilities, whitelist);
        case 'Nat Dex':
        default:
            return "";

    }
}

function getHeldItem(args: GenerationOptions, whitelist: Item[]): string {
    //todo: item generation rules
    return pickItem(whitelist);
}

function getEvSpread(args: GenerationOptions): number[] {
    //todo: ev spread options on frontend
    const MAX_EVS = 508; //change once hackmons is added
    const MAX_EVS_STAT = 252;
    return pickEvs(args, MAX_EVS, MAX_EVS_STAT);
}

function doShinyChance(): boolean {
    //currently 50% shiny odds
    //todo: change based on user feedback
    return Math.floor(Math.random()) === 1;
}

//pick a move, non-natdex edition
function pickMove(movepool: MoveMethodObject[], learnedMoves: string[], args: GenerationOptions,
    whitelist: Move[], enforceStrictLearnset: boolean): string {
    try {

        const index = Math.floor(Math.random() * movepool.length)

        //failed check: the move is null
        if (!movepool[index] || !movepool[index].move) return "";

        //failed check: the move is not whitelisted
        if (!whitelist.includes(movepool[index].move)) return "";

        //strips methods down to their base generations, keeping whether or not it was learned by event, egg or tutor
        const gens_learned = movepool[index].method.map(m => m.includes('S') || m.includes('E')
            || m.includes('T') ? m : m.slice(0, 1));

        //failed check: the move cannot be learned in this generation and strict learnset is enforced
        if (enforceStrictLearnset && !gens_learned.includes(args.generation)) return "";

        //failed check: two event moves that are from different events
        const incompatible_learned_event_moves = learnedMoves.map((move) => ({
            move: move,
            method: movepool.filter(o => o.move && o.move.name === move && o.method.every(m => m.includes('S')))
                .flatMap(o => o.method)
        })).filter(o => o.method.length > 0).filter(o => o.method.some(m => !gens_learned.includes(m)));
        if (gens_learned.every(m => m.includes('S'))
            && incompatible_learned_event_moves.length > 0)
            return "";

        const move_name = movepool[index].move.name;

        //failed check: learning an egg move combined with other gen egg move or earlier gen tutor move
        const latest_learned_egg_gen = gens_learned.filter(m => m.includes('E'))
            .map(m => parseInt(m.replace('E', ''))).sort((a, b) => b - a)[0];
        if (latest_learned_egg_gen) {
            const incompatible_with_egg_move = learnedMoves.map((move) => ({
                move: move,
                method: movepool.filter(o => o.move && o.move.name === move && o.method.every(m => m.includes('E') ||
                    (m.includes('T') && parseInt(m.replace('T', '')) < latest_learned_egg_gen)))
                    .flatMap(o => o.method)
            })).filter(o => o.method.length > 0).filter(o => o.method.some(m => !gens_learned.includes(m)));
            if (gens_learned.every(m => m.includes('E'))
                && incompatible_with_egg_move.length > 0)
                return "";
        }

        //failed check: learning a tutor move combined with later gen egg move
        const latest_learned_tutor_gen = gens_learned.filter(m => m.includes('T'))
            .map(m => parseInt(m.replace('T', ''))).sort((a, b) => b - a)[0];
        if (latest_learned_tutor_gen) {
            const incompatible_with_tutor_move = learnedMoves.map((move) => ({
                move: move,
                method: movepool.filter(o => o.move && o.move!.name === move &&
                    o.method.every(m => (m.includes('E') && parseInt(m.replace('E', '')) > latest_learned_tutor_gen)))
                    .flatMap(o => o.method)
            })).filter(o => o.method.length > 0).filter(o => o.method.some(m => !gens_learned.includes(m)));
            if (gens_learned.every(m => m.includes('T'))
                && incompatible_with_tutor_move.length > 0)
                return "";
        }

        //failed check: forceAttackingMove is on and the pokemon can learn non-status moves (but hasn't yet)
        const has_non_status_moves = movepool.some(m => m.move && m.move.category !== "Status");
        if ((args.forceOneAttackingMove && has_non_status_moves) && learnedMoves.length === 0
            && movepool[index].move?.category === "Status") return "";

        //failed check: move already exists in movepool
        if (!learnedMoves.includes(move_name)) return move_name;
        else return "";

    } catch (error) {
        //failed check: some weird error occurred
        console.log('An error occurred while picking a move. The generation handled' +
            'this error gracefully, but you should report this error to the site administrator.');
        console.log(error);
        return "";
    }
}

//pick a move, natdex edition
function pickNatdexMove(movepool: MoveMethodObject[], learnedMoves: string[], args: GenerationOptions,
    whitelist: Move[], enforceStrictLearnset: boolean) {
    //do later
}

function pickAbility(abilities: Ability[], whitelist: Ability[]): string {

    try {
        //failed check, viable ability pool is empty. also the base case for the recursive call
        if (abilities.length === 0) return "";

        const index = Math.floor(Math.random() * abilities.length);
        const available = [...abilities.slice(0, index), ...abilities.slice(index)];
        const candidate = abilities[index];

        if (!whitelist.includes(candidate)) return pickAbility(available, whitelist);

        else return candidate.name;
    } catch (error) {
        //failed check: some weird error occurred
        console.log('An error occurred while picking an ability.');
        console.log(error);
        return "";
    }
}

function pickItem(whitelist: Item[]): string {
    try {
        if (whitelist.length === 0) return "";

        const index = Math.floor(Math.random() * whitelist.length);

        return whitelist[index].name ?? "";

    } catch (error) {
        console.log("An error occurred while trying to pick an item. The pokemon will not be given a held item.");
        console.log(error);
        return "";
    }
}

function pickEvs(args: GenerationOptions, MAX_EVS: number, MAX_EVS_STAT: number): number[] {

    try {
        // 0: "HP",
        // 1: "ATK",
        // 2: "DEF",
        // 3: "SPA",
        // 4: "SPD",
        // 5: "SPE"

        let ev_spread = [0, 0, 0, 0, 0, 0];
        let available_indeces = [0, 1, 2, 3, 4, 5];
        let pool = MAX_EVS / 4;


        //complete random
        while (pool > 0) {
            let value = Math.floor(Math.random() * (MAX_EVS_STAT / 4));
            const index = Math.floor(Math.random() * available_indeces.length);
            const chosen_stat = available_indeces[index];
            value = Math.min(value, pool);
            //todo: if use all evs enabled and available indeces length = 1 value = pool;

            ev_spread[chosen_stat] = value;
            available_indeces = [...available_indeces.slice(0, chosen_stat),
            ...(chosen_stat === 5 ? [] : available_indeces.slice(chosen_stat + 1))];
            pool -= value;
        }

        return ev_spread;
    } catch (error) {
        console.log("An error occurred while generating your EVs. By default, EVs will not be generated.");
        console.log(error);
        return [0, 0, 0, 0, 0, 0];
    }
}