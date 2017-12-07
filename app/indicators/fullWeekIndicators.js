import { Map } from 'immutable';
import emaIndicator from './emaIndicator.js';
import slopeIndicator from './slopeIndicator.js';
import rocIndicator from './rocIndicator.js';
import adxIndicator from './adxIndicator.js';


const timePeriodDefaults = Map({
  emaFast: 13,  // weekly
  emaSlow: 26,  // weekly
  slope: 13,  // weekly
  roc: 13,  // weekly
  adx: 13,  // weekly
  adxLine: 23,  // weekly
  atr: 23, // daily indicator
  highChannel: 50,  // daily
});

/**
 * A higher order function to map over the array of object that represent days.
 * Which in turn will call pass the price to the EMA and ATR mapper functions.
 * @param  {Array} daysData Contains Object that represent Days with a date and
 *                          close property.
 * @return {Not Sure}
 */
function fullWeekIndicators(options = timePeriodDefaults) {
  const emaFastMapper = emaIndicator(options.get('emaFast'), 'fast');
  const emaSlowMapper = emaIndicator(options.get('emaSlow'), 'slow');
  const slopeMapper = slopeIndicator(options.get('slope'));
  const rocMapper = rocIndicator(options.get('roc'));
  const adxMapper = adxIndicator(options.get('adx'));

  return function fullWeekMapper(weeklyData, index) {
    const emaFastDataObject = emaFastMapper(weeklyData, index);
    const emaSlowDataOject = emaSlowMapper(weeklyData, index);
    const slopeDataObject = slopeMapper(weeklyData, index);
    const rocDataObject = rocMapper(weeklyData, index);
    const adxDataObject = adxMapper(weeklyData, index);

    return Map().merge(
      emaFastDataObject,
      emaSlowDataOject,
      slopeDataObject,
      rocDataObject,
      adxDataObject
    );
  };
}

export default fullWeekIndicators;
