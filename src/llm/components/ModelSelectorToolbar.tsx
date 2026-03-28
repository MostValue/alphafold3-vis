import React from 'react';
import { useProgramState } from '../Sidebar';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { af3OverviewCamera } from '../af3/Af3Layout';

export const ModelSelectorToolbar: React.FC<{
}> = () => {
    let progState = useProgramState();

    function onExpandClick() {
        progState.camera.desiredCamera = af3OverviewCamera;
        progState.markDirty();
    }

    function onMagnifyClick() {
        progState.camera.desiredCamera = af3OverviewCamera;
        progState.markDirty();
    }

    return <div className='absolute top-0 left-0 flex flex-col'>
        <div className='mt-2 ml-2 flex flex-row'>
            <div className={clsx('m-2 p-2 rounded shadow bg-blue-200')}>
                AlphaFold 3
            </div>
        </div>
        <div className='ml-2 flex flex-row'>
            <div className={clsx('m-2 p-2 bg-white min-w-[2rem] flex justify-center rounded shadow cursor-pointer hover:bg-blue-300')} onClick={onExpandClick}>
                <FontAwesomeIcon icon={faExpand} />
            </div>
            <div className={clsx('m-2 p-2 bg-white min-w-[2rem] flex justify-center rounded shadow cursor-pointer hover:bg-blue-300')} onClick={onMagnifyClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
        </div>
    </div>;

};
