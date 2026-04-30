'use client';

import Temp2OverlayComponent from '@/components/template/temp2/overlay';
import { MatchState } from '@/types';

interface Props {
  state: MatchState;
  bumpA?: boolean;
  bumpB?: boolean;
}

export const Temp2Overlay: React.FC<Props> = ({ state, bumpA, bumpB }) => {
  return <Temp2OverlayComponent state={state} bumpA={bumpA} bumpB={bumpB} />;
};

export default Temp2Overlay;
