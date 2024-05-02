import { ServiceKey } from '@glass/enums'
import { Service } from '@glass/models'

export const SERVICES: Service[] = [
  {
    key: ServiceKey.WINDSCREEN,
    background: 'service-windshield.png',
    title: 'Windshield replacement',
    description: 'Windshield replacement',
    glass: 'Brand new OEM or OEE glass',
    quality: 'Glass will meet quality standards required by the law',
    time: 'Windscreen is fitted with 60 min crash tested glue',
    detailTitle: 'OEM or OEE windscreen replacement at your place or our workshop.',
    processTitle: 'Windscreen replacement process',
    processDescription: 'You will be shown various processes to get your glass replaced based on your vehicle type.',
  },
  {
    key: ServiceKey.DOOR_GLASS,
    background: 'service-door.png',
    title: 'Door glass replacement',
    description: 'New door glass replacement',
    glass: 'Brand new OEM or OEE glass',
    quality: 'Glass will meet quality standards required by the law',
    time: 'Shattered glass mini valet and safe to drive in 1-2 hours',
    detailTitle: 'OEM or OEE windscreen replacement at your place or our workshop.',
    processTitle: 'Windscreen replacement process',
    processDescription: 'You will be shown various processes to get your glass replaced based on your vehicle type.',
  },
  {
    key: ServiceKey.REAR,
    background: 'service-windshield.png',
    title: 'New heated rear windscreen replacement',
    description: 'Heated rear windscreen replacement',
    glass: 'Brand new OEM or OEE glass',
    quality: 'Glass will meet quality standards required by the law',
    time: 'Shattered glass mini valet and safe to drive in 1-2 hours',
    detailTitle: 'OEM or OEE windscreen replacement at your place or our workshop.',
    processTitle: 'Windscreen replacement process',
    processDescription: 'You will be shown various processes to get your glass replaced based on your vehicle type.',
  },
]
