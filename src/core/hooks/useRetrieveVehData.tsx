import { useEffect } from 'react'
import { CarType } from '@glass/enums'
import { Inquiry } from '@glass/models'
import { getVanBodyType } from '@glass/utils/session/session.util'

const vehTypes = [
  ['CAR DERIVED VAN', 'HATCHBACK', '3 DOOR HATCHBACK'],
  ['5 DOOR HATCHBACK'],
  [
    'ESTATE',
    'LIGHT 4X4 UTILITY',
    'MPV',
    'SUV CONVERTIBLE',
    'SUV COUPE',
    'SUV ESTATE',
    'SUV HATCHBACK',
    'SUV SALOON',
    'TAXI CAB',
    'TOURING',
    'TOWER WAGON',
    'VAN DERIVED CAR',
  ],
  ['COMPETITION', 'SALOON', '4 DOOR SALOON'],
  ['CONVERTIBLE', 'COUPE'],
  [
    'AMBULANCE',
    'BOX VAN',
    'CAR TRANSPORTER',
    'CHASSIS CAB',
    'CHASSIS COWL',
    'INSULATED CAN',
    'LUTON VAN',
    'MINIBUS',
    'MOTOR CARAVAN',
    'PANEL VAN',
    'PICK UP',
    'SPECIALLY FITTED VAN',
    'TIPPER',
    'WINDOW VAN',
    'LCV',
    'VAN - SIDE WINDOWS',
  ],
]

const mapBodyType = [
  CarType.THREE_DOOR,
  CarType.FIVE_DOOR,
  CarType.ESTATE,
  CarType.SEDAN,
  CarType.COUPE,
  CarType.BARN,
  CarType.TAILGATER,
]

export const useRetrieveVehData = (inquiry: Inquiry | undefined, dataToCustomer: (value: CarType) => void) => {
  useEffect(() => {
    if (inquiry) {
      const vehClass = inquiry.DoorPlanLiteral
      let body: CarType | undefined

      for (let i = 0; i < vehTypes.length; i++) {
        const typeArray = vehTypes[i]
        if (typeArray.includes(vehClass)) {
          body = mapBodyType[i]
        }
      }
      if (body) {
        dataToCustomer(body === CarType.BARN ? getVanBodyType() : body)
      }
    }
  }, [inquiry])
}
