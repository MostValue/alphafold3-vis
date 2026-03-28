import { ICameraPos } from "../Camera";
import { BlkSpecial, IArchitectureLayout, IBlkDef } from "../GptModelLayout";
import { DimStyle } from "../walkthrough/WalkthroughTools";
import { Vec3 } from "@/src/utils/vector";

export interface IAf3Shape {
    nToken: number;
    nAtom: number;
    nMsa: number;
    nTemplate: number;
    nChain: number;
    nCycle: number;
    nDiffusionStep: number;
    nPairformerBlock: number;
}

export interface IAf3ModelLayout extends IArchitectureLayout {
    kind: 'af3';
    shape: IAf3Shape;
    chapters: string[];
}

export const af3OverviewShape: IAf3Shape = {
    nToken: 384,
    nAtom: 1536,
    nMsa: 16384,
    nTemplate: 4,
    nChain: 3,
    nCycle: 10,
    nDiffusionStep: 200,
    nPairformerBlock: 48,
};

export const af3OverviewCamera: ICameraPos = {
    center: new Vec3(64, 0, -188),
    angle: new Vec3(270, 10, 2.9),
};

export function isAf3ModelLayout(layout: IArchitectureLayout): layout is IAf3ModelLayout {
    return layout.kind === 'af3';
}

function clampDisplaySize(value: number, min: number, max: number) {
    if (!Number.isFinite(value)) {
        return min;
    }
    return Math.max(min, Math.min(max, Math.round(Math.sqrt(value))));
}

export function genAf3Layout(shape: IAf3Shape = af3OverviewShape, offset: Vec3 = new Vec3(0, 0, 0)): IAf3ModelLayout {
    const cell = 2.2;
    const margin = 20;
    const cubes: IBlkDef[] = [];

    function mk(args: {
        name: string;
        subtitle?: string;
        t: 'w' | 'i' | 'a';
        x: number;
        y: number;
        z?: number;
        cx: number;
        cy: number;
        cz?: number;
        dimX: DimStyle;
        dimY: DimStyle;
    }): IBlkDef {
        const cz = args.cz ?? 1;
        const label = args.subtitle ? `${args.name} (${args.subtitle})` : args.name;
        return {
            idx: -1,
            t: args.t,
            x: args.x + offset.x,
            y: args.y + offset.y,
            z: (args.z ?? 0) + offset.z,
            dx: args.cx * cell,
            dy: args.cy * cell,
            dz: cz * cell,
            cx: args.cx,
            cy: args.cy,
            cz,
            dimX: args.dimX,
            dimY: args.dimY,
            name: label,
            small: false,
            highlight: 0,
            opacity: 1,
            special: BlkSpecial.None,
        };
    }

    const tokenWidth = clampDisplaySize(shape.nToken, 10, 26);
    const atomWidth = clampDisplaySize(shape.nAtom, 12, 34);
    const msaHeight = clampDisplaySize(shape.nMsa, 10, 28);
    const pairWidth = clampDisplaySize(shape.nToken, 12, 22);
    const diffusionWidth = clampDisplaySize(shape.nDiffusionStep, 12, 24);

    cubes.push(
        mk({
            name: 'Input Featurization',
            subtitle: `${shape.nToken} tokens`,
            t: 'i',
            x: -pairWidth * cell * 0.8,
            y: 0,
            cx: tokenWidth,
            cy: 10,
            dimX: DimStyle.Token,
            dimY: DimStyle.Features,
        }),
        mk({
            name: 'Pair Representation Init',
            subtitle: `${shape.nToken} x ${shape.nToken}`,
            t: 'a',
            x: -pairWidth * cell,
            y: 38,
            cx: pairWidth,
            cy: pairWidth,
            dimX: DimStyle.Token,
            dimY: DimStyle.Pairs,
        }),
        mk({
            name: 'Atom Attention Encoder',
            subtitle: `${shape.nAtom} atoms`,
            t: 'i',
            x: -92,
            y: 90,
            cx: atomWidth,
            cy: 12,
            dimX: DimStyle.Atoms,
            dimY: DimStyle.Features,
        }),
        mk({
            name: 'MSA Module',
            subtitle: `${shape.nMsa} rows`,
            t: 'i',
            x: 86,
            y: 90,
            cx: tokenWidth,
            cy: msaHeight,
            dimX: DimStyle.Token,
            dimY: DimStyle.MSA,
        }),
        mk({
            name: 'Template Embedder',
            subtitle: `${shape.nTemplate} templates`,
            t: 'i',
            x: 170,
            y: 96,
            cx: 10,
            cy: Math.max(8, shape.nTemplate * 2),
            dimX: DimStyle.Template,
            dimY: DimStyle.Features,
        }),
        mk({
            name: 'Pairformer Stack',
            subtitle: `${shape.nPairformerBlock} blocks`,
            t: 'i',
            x: -pairWidth * cell,
            y: 152,
            cx: pairWidth,
            cy: 20,
            dimX: DimStyle.Token,
            dimY: DimStyle.Pairs,
        }),
        mk({
            name: 'Diffusion Conditioning',
            subtitle: `${shape.nCycle} recycles`,
            t: 'a',
            x: -92,
            y: 226,
            cx: tokenWidth,
            cy: 10,
            dimX: DimStyle.Token,
            dimY: DimStyle.Cycles,
        }),
        mk({
            name: 'Diffusion Module',
            subtitle: `${shape.nDiffusionStep} steps`,
            t: 'i',
            x: -pairWidth * cell,
            y: 272,
            cx: diffusionWidth,
            cy: 16,
            dimX: DimStyle.DiffusionStep,
            dimY: DimStyle.Atoms,
        }),
        mk({
            name: 'Coordinate Samples',
            subtitle: `${shape.nAtom} atoms`,
            t: 'i',
            x: 102,
            y: 282,
            cx: atomWidth,
            cy: 10,
            dimX: DimStyle.Atoms,
            dimY: DimStyle.Chains,
        }),
        mk({
            name: 'Confidence Heads',
            subtitle: 'pLDDT / PAE / PDE / distogram',
            t: 'a',
            x: -pairWidth * cell,
            y: 352,
            cx: pairWidth,
            cy: 12,
            dimX: DimStyle.Token,
            dimY: DimStyle.Features,
        }),
    );

    for (let i = 0; i < cubes.length; i++) {
        cubes[i].idx = i;
    }

    return {
        kind: 'af3',
        title: 'AlphaFold 3 Overview',
        summary: 'Static overview of AF3 modules layered onto the existing tensor-block scene engine.',
        chapters: [
            'Input featurization and pair initialization',
            'Atom attention, MSA, and template conditioning',
            'Pairformer trunk',
            'Diffusion rollout and coordinate samples',
            'Confidence heads',
        ],
        cell,
        margin,
        cubes,
        labels: [],
        height: 420,
        shape,
    };
}
