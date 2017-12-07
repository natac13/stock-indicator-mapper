import Immutable from 'immutable';

export const timePeriodDefaults = Immutable.Map({
  emaFast: 13,  // weekly
  emaSlow: 26,  // weekly
  slope: 13,  // weekly
  roc: 13,  // weekly
  adx: 13,  // weekly
  adxLine: 23,  // weekly
  atr: 23, // daily indicator
  highChannel: 50,  // daily
});

export const DATE_FORMAT = 'YYYY-MM-DD';
