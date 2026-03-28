import React from 'react';
import { LayerView } from '@/src/llm/LayerView';
import { Header } from '@/src/llm/Header';

export const metadata = {
    title: 'AlphaFold 3 Visualization',
    description: 'A 3D architecture overview of AlphaFold 3.',
};

export default function Page() {
    return <>
        <Header title="AlphaFold 3 Architecture" />
        <LayerView />
        <div id="portal-container"></div>
    </>;
}
