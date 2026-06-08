export interface GenerationOptions {
    tier: string;
    generation: number;
    includeLegendaries: boolean; //allow legendaries to be included - true by default
    includeNFE: boolean; //allow untiered NFE/LC Pokemon to be included (if LC not selected) - false by default
    forceOneAttackingMove: boolean; //all Pokemon will have at least one attacking move - true by default
    
}

export function generateTeam(args: GenerationOptions) {
    // Placeholder implementation - replace with actual logic
}