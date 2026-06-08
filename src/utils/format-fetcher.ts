const TIER_DICT: {
    [key: string]: string[]
} = {
    '1': ['Ubers', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '2': ['Ubers', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '3': ['Ubers', 'OU', 'UU', 'RU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '4': ['Ubers', 'AG', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '5': ['Ubers', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '6': ['Ubers', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '7': ['Ubers', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '8': ['Ubers', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '9': ['Ubers', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    'Nat Dex': ['Ubers', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
}

export function fetchFormats(generation: string): string[] {
    if (TIER_DICT[generation]) {
        return TIER_DICT[generation];
    } else {
        return [];
    }
}