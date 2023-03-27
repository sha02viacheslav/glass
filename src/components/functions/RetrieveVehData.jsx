import { useEffect } from 'react'

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

const mapBodyType = ['3door', '5door', 'estate', 'sedan', 'coupe', 'van']

export default function RetrieveVehData({ vehData, dataToCustomer }) {
  useEffect(() => {
    const vehClass = vehData.DoorPlanLiteral
    let body = ''

    for (let i = 0; i < vehTypes.length; i++) {
      const typeArray = vehTypes[i]
      if (typeArray.includes(vehClass)) {
        body = mapBodyType[i]
      }
    }
    dataToCustomer(body)
  }, [vehData])
}
