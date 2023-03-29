import threeDoorTinted from '@glass/assets/images/window-selection/3DoorHatch/3-Door Hatch 1.png'
import fiveDoorTinted from '@glass/assets/images/window-selection/5DoorHatch/5-Door Hatch 2.png'
import coupeTinted from '@glass/assets/images/window-selection/Coupe/Coupe 2.png'
import estateTinted from '@glass/assets/images/window-selection/Estate/Estate 3.png'
import sedanTinted from '@glass/assets/images/window-selection/Sedan/Sedan 1.png'
import vanBarnTinted from '@glass/assets/images/window-selection/VAN_Barn/VAN Barn door 1.png'
import vanTailgaterTinted from '@glass/assets/images/window-selection/VAN_Tailgater/BLAC VAN TAGLIATELE.png'
import { CarType } from '@glass/enums'

export const CAR_TINTED_IMAGES: { [key: string]: string } = {
  [CarType.THREE_DOOR]: threeDoorTinted,
  [CarType.FIVE_DOOR]: fiveDoorTinted,
  [CarType.COUPE]: coupeTinted,
  [CarType.ESTATE]: estateTinted,
  [CarType.SEDAN]: sedanTinted,
  [CarType.BARN]: vanBarnTinted,
  [CarType.TAILGATER]: vanTailgaterTinted,
}
