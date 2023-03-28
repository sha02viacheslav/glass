import { CarType } from '@glass/enums'
import { WindowSelection } from '@glass/models'
import { COUPE_WINDOWS } from './coupe-winddows.constant'
import { ESTATE_WINDOWS } from './estate-winddows.constant'
import { FIVE_DOOR_WINDOWS } from './fivedoor-winddows.constant'
import { SEDAN_WINDOWS } from './sedan-winddows.constant'
import { THREE_DOOR_WINDOWS } from './threedoor-winddows.constant'
import { VANS_WINDOWS } from './vans-winddows.constant'

export const WINDOWS: { [key: string]: WindowSelection[] } = {
  [CarType.THREE_DOOR]: THREE_DOOR_WINDOWS,
  [CarType.FIVE_DOOR]: FIVE_DOOR_WINDOWS,
  [CarType.COUPE]: COUPE_WINDOWS,
  [CarType.ESTATE]: ESTATE_WINDOWS,
  [CarType.SEDAN]: SEDAN_WINDOWS,
  [CarType.BARN]: VANS_WINDOWS,
  [CarType.TAILGATER]: VANS_WINDOWS,
}
