export type ArchitectureKind = 'gpt' | 'af3';

export const architectureTitles: Record<ArchitectureKind, string> = {
    gpt: 'GPT',
    af3: 'AlphaFold 3',
};
