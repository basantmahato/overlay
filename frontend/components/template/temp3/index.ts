// Temp3 - Basketball Scoreboard Template
// This template demonstrates how to create a new template following the registry pattern

import { Temp3Dashboard, Temp3DashboardProps } from './dashboard';
import { Temp3Overlay, Temp3OverlayProps } from './overlay';

export const Temp3Meta = {
  id: 'basketball-pro-id',
  name: 'Basketball Pro',
  description: 'Professional basketball scoreboard with quarters, shot clock, and possession indicator.',
  sport: 'basketball',
};

export { Temp3Dashboard, Temp3Overlay };
export type { Temp3DashboardProps, Temp3OverlayProps };
