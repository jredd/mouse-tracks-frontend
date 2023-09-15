export enum FormType {
  NOTES = 'note',
  TRAVEL_EVENT = 'travelevent',
  BREAK = 'break',
  MEAL = 'meal',
  EXPERIENCE = 'experience'
}

export const formDimensions = {
  [FormType.NOTES]: '350px',
  [FormType.TRAVEL_EVENT]: '600px',
  [FormType.BREAK]: '350px',
  [FormType.EXPERIENCE]: '400px',
  [FormType.MEAL]: '500px'
}
