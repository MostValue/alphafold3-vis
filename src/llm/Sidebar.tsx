import s from './Sidebar.module.scss';
import React, { createContext, useContext, useState } from 'react';
import clsx from 'clsx';
import { IPhaseDef } from './walkthrough/WalkthroughTools';
import { PhaseTimeline } from './PhaseTimeline';
import { Commentary } from './Commentary';
import { IProgramState } from './Program';
import { Popup, PopupPos } from '@/src/utils/Portal';
import { useSubscriptions } from '../utils/hooks';
import { isAf3ModelLayout } from './af3/Af3Layout';

export const WalkthroughSidebar: React.FC = () => {
    let progState = useProgramState();
    let [menuVisible, setMenuVisible] = useState(false);
    let [menuButtonEl, setMenuButtonEl] = useState<HTMLElement | null>(null);
    if (progState.architecture === 'af3' && isAf3ModelLayout(progState.layout)) {
        return <Af3Sidebar />;
    }

    let walkthrough = progState.walkthrough;
    let camera = progState.camera;

    function handlePhaseClick(ev: React.MouseEvent, phase: IPhaseDef) {
        if (walkthrough.phase !== phase.id) {
            walkthrough.phase = phase.id;
            walkthrough.time = 0;
            walkthrough.running = false;
            progState.markDirty();
        }
        setMenuVisible(false);
        ev.preventDefault();
    }

    function stepModel() {
        console.log('stepping model');
        progState.stepModel = true;
        progState.markDirty();
    }

    let menu = <>
        <div className={s.topSplit}>
            <div className={s.toc}>
                {walkthrough.phaseList.map((group, i) => {

                    return <div key={group.groupId} className={s.phaseGroup}>
                        <div className={s.phaseGroupTitle}>{group.title}</div>

                        {group.phases.map((phase, j) => {
                            let active = walkthrough.phase === phase.id;

                            return <div key={phase.id} className={clsx(s.phase, active && s.active)} onClick={ev => handlePhaseClick(ev, phase)}>
                                <div className={s.phaseTitle}>{phase.title}</div>
                            </div>;
                        })}
                    </div>;
                })}
            </div>
            {/* <div className={s.helpers}>
                <div className={s.camStats}>
                    (center, center) =
                </div>
                <div className={s.camStats}>
                    new {camera.center.toString(1)}, new {camera.angle.toString(1)}
                </div>
            </div> */}
        </div>
    </>;

    return <div className={s.walkthrough}>
        <div className={s.split}>

            <div className={s.timelineLeft}>
                <PhaseTimeline />
            </div>

            <div className={s.content}>
                {/* <div className={s.menuTopBar}>
                    <div className={s.menu} ref={setMenuButtonEl} onClick={() => setMenuVisible(a => !a)}>Menu &gt;</div>
                    {menuVisible && <Popup targetEl={menuButtonEl} placement={PopupPos.BottomLeft} className={s.mainMenu} closeBackdrop onClose={() => setMenuVisible(false)}>
                        {menu}
                    </Popup>}
                    <div onClick={() => stepModel()}>Step</div>
                </div> */}
                <Commentary />
            </div>

        </div>
    </div>;
};

export let ProgramStateContext = createContext<IProgramState>(null!);

const Af3Sidebar: React.FC = () => {
    let progState = useProgramState();
    let layout = isAf3ModelLayout(progState.layout) ? progState.layout : null;

    return <div className={s.walkthrough}>
        <div className={s.split}>
            <div className={s.content}>
                <div className={s.topSplit}>
                    <div className={s.toc}>
                        <div className={s.phaseGroup}>
                            <div className={s.phaseGroupTitle}>{layout?.title ?? 'AlphaFold 3'}</div>
                            <div className={s.phase}>
                                <div className={s.phaseTitle}>{layout?.summary ?? 'Static overview'}</div>
                            </div>
                        </div>
                        <div className={s.phaseGroup}>
                            <div className={s.phaseGroupTitle}>Key Counts</div>
                            <div className={s.phase}><div className={s.phaseTitle}>Tokens: {layout?.shape.nToken}</div></div>
                            <div className={s.phase}><div className={s.phaseTitle}>Atoms: {layout?.shape.nAtom}</div></div>
                            <div className={s.phase}><div className={s.phaseTitle}>MSA Rows: {layout?.shape.nMsa}</div></div>
                            <div className={s.phase}><div className={s.phaseTitle}>Templates: {layout?.shape.nTemplate}</div></div>
                            <div className={s.phase}><div className={s.phaseTitle}>Pairformer Blocks: {layout?.shape.nPairformerBlock}</div></div>
                            <div className={s.phase}><div className={s.phaseTitle}>Diffusion Steps: {layout?.shape.nDiffusionStep}</div></div>
                        </div>
                        <div className={s.phaseGroup}>
                            <div className={s.phaseGroupTitle}>Modules</div>
                            {layout?.chapters.map((chapter) => <div key={chapter} className={s.phase}>
                                <div className={s.phaseTitle}>{chapter}</div>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};

export function useProgramState() {
    let context = useContext(ProgramStateContext);
    useSubscriptions(context?.htmlSubs);
    return context;
}
