import threeDoor from '@glass/assets/images/window-selection/3DoorHatch/3-Door Hatch 3.png'
import fiveDoor from '@glass/assets/images/window-selection/5DoorHatch/5-Door Hatch 4.png'
import coupe from '@glass/assets/images/window-selection/Coupe/Coupe 3.png'
import estate from '@glass/assets/images/window-selection/Estate/Estate 1.png'
import sedan from '@glass/assets/images/window-selection/Sedan/Sedan 3.png'
import vanBarn from '@glass/assets/images/window-selection/VAN_Barn/VAN Barn door 2.png'
import vanTailgater from '@glass/assets/images/window-selection/VAN_Tailgater/VAN Tailgater 3.png'
import { CarType } from '@glass/enums'

export const CAR_IMAGES: { [key: string]: string } = {
  [CarType.THREE_DOOR]: threeDoor,
  [CarType.FIVE_DOOR]: fiveDoor,
  [CarType.COUPE]: coupe,
  [CarType.ESTATE]: estate,
  [CarType.SEDAN]: sedan,
  [CarType.BARN]: vanBarn,
  [CarType.TAILGATER]: vanTailgater,
}
