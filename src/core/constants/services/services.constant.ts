import { BeforeAfterType } from '@glass/enums'
import { Service } from '@glass/models'

export const SERVICES: Service[] = [
  {
    key: 'new-windscreen-replacement',
    title: 'New Windscreen Replacement',
    desp: 'We can source the new glass from the biggest suppliers and new windscreen will meet all quality standards. All different sensors and heating versions. Whole process 1-2 hours and vehicle is safe to drive.',
    beforeAfterType: BeforeAfterType.FRONT_WINDSCREEN,
  },
  {
    key: 'new-door-glass-replacement',
    title: 'New Door Glass Replacement',
    desp: 'We can source the new glass from the biggest suppliers and new, either tempered or laminated door glass will meet all quality standards. Rear doors have privacy glasses available. Shattered glass can be vacuumed. Whole process 1-2 hours.',
    beforeAfterType: BeforeAfterType.DOOR_GLASS_SIDE_GLASS,
  },
  {
    key: 'new-heated-rear-windscreen-replacement',
    title: 'New Heated Rear Windscreen Replacement',
    desp: 'We can source the new glass from the biggest suppliers and new, either tempered or laminated rear windscreen will meet all quality standards. Shattered glass can be vacuumed. Privacy glasses available. Whole process 1-2 hours.',
    beforeAfterType: BeforeAfterType.REAR_WINDSCREEN_BACKLIGHT,
  },
]
