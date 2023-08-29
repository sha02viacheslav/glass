import front from '@glass/assets/images/window-selection/3DoorHatch/front.png'
import l_1 from '@glass/assets/images/window-selection/3DoorHatch/l_1.png'
import l_2 from '@glass/assets/images/window-selection/3DoorHatch/l_2.png'
import l_3 from '@glass/assets/images/window-selection/3DoorHatch/l_3.png'
import l_3_t from '@glass/assets/images/window-selection/3DoorHatch/l_3_t.png'
import r_1 from '@glass/assets/images/window-selection/3DoorHatch/r_1.png'
import r_2 from '@glass/assets/images/window-selection/3DoorHatch/r_2.png'
import r_3 from '@glass/assets/images/window-selection/3DoorHatch/r_3.png'
import r_3_t from '@glass/assets/images/window-selection/3DoorHatch/r_3_t.png'
import rear from '@glass/assets/images/window-selection/3DoorHatch/rear.png'
import rear_t from '@glass/assets/images/window-selection/3DoorHatch/rear_t.png'
import { WinLoc } from '@glass/enums'
import { WindowSelection } from '@glass/models'

export const THREE_DOOR_WINDOWS: WindowSelection[] = [
  { name: 'Windscreen', window: WinLoc.FRONT, broken: false, source: front, hasTinted: false },
  { name: 'Backlight', window: WinLoc.REAR, broken: false, source: rear, hasTinted: true, tintedSource: rear_t },
  { name: 'Left front quarter', window: WinLoc.L1, broken: false, source: l_1, hasTinted: false },
  { name: 'Left front door/drop', window: WinLoc.L2, broken: false, source: l_2, hasTinted: false },
  { name: 'Left rear quarter', window: WinLoc.L3, broken: false, source: l_3, hasTinted: true, tintedSource: l_3_t },
  { name: 'Right front quarter', window: WinLoc.R1, broken: false, source: r_1, hasTinted: false },
  { name: 'Right front door/drop', window: WinLoc.R2, broken: false, source: r_2, hasTinted: false },
  { name: 'Right rear quarter', window: WinLoc.R3, broken: false, source: r_3, hasTinted: true, tintedSource: r_3_t },
]
