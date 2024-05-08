import { WorkingPlace } from '@glass/enums'

export const workingPlaceLabel = (workingPlace: WorkingPlace): string => {
  switch (workingPlace) {
    case WorkingPlace.WORKSHOP:
      return 'Workshop service'
    case WorkingPlace.MOBILE:
      return 'Mobile service'
    default:
      return ''
  }
}
