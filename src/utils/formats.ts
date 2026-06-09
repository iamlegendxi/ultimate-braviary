const TIER_DICT: {
    [key: string]: string[]
} = {
    '1': ['Uber', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '2': ['Uber', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '3': ['Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '4': ['Uber', 'AG', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '5': ['Uber', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '6': ['Uber', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '7': ['Uber', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '8': ['Uber', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    '9': ['Uber', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
    'Nat Dex': ['Uber', 'AG', 'RU', 'OU', 'UU', 'NU', 'PU', 'ZU', 'LC', '1v1'],
}

export function fetchFormats(generation: string): string[] {
    if (TIER_DICT[generation]) {
        return TIER_DICT[generation];
    } else {
        return [];
    }
}