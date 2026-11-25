export const statusCodes =
{
  pending: { name: `Függőben`, fontColor: `warn`, backgroundColor: `warn-soft` },
  approved: { name: `Jóváhagyva`, fontColor: `info`, backgroundColor: `info-soft` },
  progress: { name: `Folyamatban`, fontColor: `accent`, backgroundColor: `accent-soft` },
  done: { name: `Elkészült`, fontColor: `ok`, backgroundColor: `ok-soft` },
  rejected: { name: `Elutasítva`, fontColor: `danger`, backgroundColor: `danger-soft` }
};

export const statusSteps = [`pending`, `approved`, `progress`, `done`];
