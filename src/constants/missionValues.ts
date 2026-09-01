export interface MissionValueItem {
  title: string
  description: string
  icon: string
}

/**
 * Shown on Home and About when the clinic has not filled in its own values.
 *
 * Every line has to be true of a clinic that has written nothing, so they are
 * about how care is run rather than what it achieves. The previous set came
 * from a stock-trading template and promised "years of trading expertise" on
 * every clinic site that left this unset.
 */
export const defaultMissionValues: MissionValueItem[] = [
  {
    title: 'Time to be heard',
    description: 'Appointments long enough to cover the history, not only the symptom.',
    icon: 'heart',
  },
  {
    title: 'One plan, written down',
    description: 'You leave with the next steps in your hands, not in a folder somewhere.',
    icon: 'check',
  },
  {
    title: 'The same people each visit',
    description: 'Continuity, so you are not starting the story again every time.',
    icon: 'support',
  },
  {
    title: 'Progress you can see',
    description: 'What gets measured is shown back to you, in plain language.',
    icon: 'activity',
  },
]
