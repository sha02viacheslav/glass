import front from '@glass/assets/images/window-selection/Estate/front.png'
import l_1 from '@glass/assets/images/window-selection/Estate/l_1.png'
import l_2 from '@glass/assets/images/window-selection/Estate/l_2.png'
import l_3 from '@glass/assets/images/window-selection/Estate/l_3.png'
import l_3_t from '@glass/assets/images/window-selection/Estate/l_3_t.png'
import l_4 from '@glass/assets/images/window-selection/Estate/l_4.png'
import l_4_t from '@glass/assets/images/window-selection/Estate/l_4_t.png'
import l_5 from '@glass/assets/images/window-selection/Estate/l_5.png'
import l_5_t from '@glass/assets/images/window-selection/Estate/l_5_t.png'
import r_1 from '@glass/assets/images/window-selection/Estate/r_1.png'
import r_2 from '@glass/assets/images/window-selection/Estate/r_2.png'
import r_3 from '@glass/assets/images/window-selection/Estate/r_3.png'
import r_3_t from '@glass/assets/images/window-selection/Estate/r_3_t.png'
import r_4 from '@glass/assets/images/window-selection/Estate/r_4.png'
import r_4_t from '@glass/assets/images/window-selection/Estate/r_4_t.png'
import r_5 from '@glass/assets/images/window-selection/Estate/r_5.png'
import r_5_t from '@glass/assets/images/window-selection/Estate/r_5_t.png'
import rear from '@glass/assets/images/window-selection/Estate/rear.png'
import rear_t from '@glass/assets/images/window-selection/Estate/rear_t.png'
import { WinLoc } from '@glass/enums'
import { WindowSelection } from '@glass/models'

export const ESTATE_WINDOWS: WindowSelection[] = [
  { name: 'Windscreen', window: WinLoc.FRONT, broken: false, source: front, hasTinted: false },
  { name: 'Backlight', window: WinLoc.REAR, broken: false, source: rear, hasTinted: true, tintedSource: rear_t },
  { name: 'Left front quarter', window: WinLoc.L1, broken: false, source: l_1, hasTinted: false },
  { name: 'Left front drop', window: WinLoc.L2, broken: false, source: l_2, hasTinted: false },
  { name: 'Left rear drop', window: WinLoc.L3, broken: false, source: l_3, hasTinted: true, tintedSource: l_3_t },
  { name: 'Left rear vent', window: WinLoc.L4, broken: false, source: l_4, hasTinted: true, tintedSource: l_4_t },
  { name: 'Left rear quarter', window: WinLoc.L5, broken: false, source: l_5, hasTinted: true, tintedSource: l_5_t },
  { name: 'Right front quarter', window: WinLoc.R1, broken: false, source: r_1, hasTinted: false },
  { name: 'Right front drop', window: WinLoc.R2, broken: false, source: r_2, hasTinted: false },
  { name: 'Right rear drop', window: WinLoc.R3, broken: false, source: r_3, hasTinted: true, tintedSource: r_3_t },
  { name: 'Right rear vent', window: WinLoc.R4, broken: false, source: r_4, hasTinted: true, tintedSource: r_4_t },
  { name: 'Right rear quarter', window: WinLoc.R5, broken: false, source: r_5, hasTinted: true, tintedSource: r_5_t },
]
