import React from 'react';
import { LayerView } from '@/src/llm/LayerView';

export const metadata = {
  title: 'AlphaFold 3 Visualization',
  description: 'A 3D architecture overview of AlphaFold 3.',
};

import { Header } from '@/src/homepage/Header';

export default function Page() {
    return <>
        <Header title="AlphaFold 3 Architecture" />
        <LayerView />
        <div id="portal-container"></div>
    </>;
}
