import type { Pokemon, GenerationOptions } from "./generator";
import { Dex } from '@pkmn/dex';
import { Generations } from "@pkmn/data";
import baseX from 'base-x';

let gens = new Generations(Dex);
const BASE62 = baseX('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')

//enum for serialization
const SerializedMon = {

    ID: 0,
    NAME: 1,
    ABILITY: 2,
    MOVES: 3,
    EVS: 4,
    HELD_ITEM: 5,
    SHINY: 6,
    GENERATION: 7,
}

export function generateSeed(args: GenerationOptions, mons: Pokemon[], timestamp: number): any {

    let serializedTeam = [];
    for (let i: number = 0; i < mons.length; i++) {
        const m = serializeMon(mons[i], args);
        serializedTeam.push(m);
    }

    const b62_string = BASE62.encode(new TextEncoder().encode(serializedTeam.join('#')));

    return b62_string;
}

export function generateTeam(seed: string) {

}

function serializeMon(mon: Pokemon, args: GenerationOptions) {
    const p = [
        mon.id,
        mon.name,
        mon.ability,
        mon.moves.join(','),
        mon.evs.join(','),
        mon.heldItem,
        mon.shiny ? 1 : 0,
        args.generation,
    ]
    //infer types and image from name

    return p.join('|')
}

function deserializeMon(serial: string): Pokemon {
    const p = serial.split('|');
    return {
        id: parseInt(p[SerializedMon.ID]),
        name: p[SerializedMon.NAME],
        types: gens.get(p[SerializedMon.GENERATION]).species.get(p[SerializedMon.NAME])?.types || [],
        ability: p[SerializedMon.ABILITY],
        moves: p[SerializedMon.MOVES].split(','),
        evs: p[SerializedMon.EVS].split(',').map(ev => parseInt(ev)),
        heldItem: p[SerializedMon.HELD_ITEM],
        shiny: p[SerializedMon.SHINY] === '1',
        image: `https://www.smogon.com/dex/media/sprites/xy/${p[SerializedMon.NAME].toLowerCase()}.gif`

    }
}