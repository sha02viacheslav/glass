import { CarType } from '@glass/enums'
import { COUPE_COORDS } from './coupe-coords.constant'
import { ESTATE_COORDS } from './estate-coords.constant'
import { FIVE_DOOR_COORDS } from './five-door-coords.constant'
import { SEDAN_COORDS } from './sedan-coords.constant'
import { THREE_DOOR_COORDS } from './three-door-coords.constant'
import { VANS_COORDS } from './vans-coords.constant'

export const COORDS: { [key: string]: { [key: string]: string } } = {
  [CarType.THREE_DOOR]: THREE_DOOR_COORDS,
  [CarType.FIVE_DOOR]: FIVE_DOOR_COORDS,
  [CarType.COUPE]: COUPE_COORDS,
  [CarType.ESTATE]: ESTATE_COORDS,
  [CarType.SEDAN]: SEDAN_COORDS,
  [CarType.BARN]: VANS_COORDS,
  [CarType.TAILGATER]: VANS_COORDS,
}
