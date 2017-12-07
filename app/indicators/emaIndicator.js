import { Map } from 'immutable';
import capitalize from 'lodash/capitalize';
import round from 'lodash/round';

import emaCalculation from './helper/emaCalculation.js';


/**
 * Will calculate the Exponential Moving Average by taking in a time period value
 * and return a map function to iterate over a array of object that represent
 * weeks. Each of which contain a date and close property. The map function will
 * return a 0 for the initial weeks up until the time period is reach and then
 * begin the EMA calculation.
 * A 3 step process:
 * First Calculate the Simple moving average.
 * Second Find the multiplier value.
 * Third find the Current EMA value.
 * @param {Number} timePeriod The time period to find the EMA.
 */
function emaIndicator(timePeriod, type = '') {
  const multiplier = (2 / (timePeriod + 1));
  // a Stored value to access each iteration of the array of weeks.
  let previousEMA = 0;
  let initialPeriodSum = 0;

  // if (!type.match(/^Fast|Slow$/i) || type !== '') {
  //   return new Error('Type of EMA not recognized');
  // }

  return function EMAMap(weeklyData, index) {
    const weeklyDataMap = Map.isMap(weeklyData) ? weeklyData : Map(weeklyData);
    const currentDayIndex = index + 1;
    const property = `ema${capitalize(type)}`;
    const price = weeklyDataMap.get('close');
    const date = weeklyDataMap.get('date');

    // The index plus one needs to be at least the timePeriod (23 weeks) in order
    // to start the calculation of the EMA, which begins with a simple moving
    // average calculation.
    if (currentDayIndex < timePeriod) {
      initialPeriodSum = initialPeriodSum + price;

      return Map({ date, [property]: undefined });
    }

    // This is the first week which sets up the EMA calculation with a simple
    // moving average. Therefore: the sum of the values in the timePeriod divided
    // by the timePeriod.
    if (currentDayIndex === timePeriod) {
      initialPeriodSum = initialPeriodSum + price;
      const sma = round(initialPeriodSum / timePeriod, 2);
      // for the first calculation the Exponential Moving Average is
      // equal to the Simple Moving Average
      const currentEMA = sma;

      // set preiousEMA to currentEMA for the next weeks event in the array.
      previousEMA = currentEMA;


      // return the currentEMA to start building the EMA value array.
      return Map({ date, [property]: currentEMA });
    }

    // This is when the iteration is passed the time period value.
    if (currentDayIndex > timePeriod) {
      const currentEMA = emaCalculation(price, previousEMA, multiplier);

      // set preiousEMA to currentEMA for the next weeks event in the array.
      previousEMA = currentEMA;

      // return the currentEMA to start building the EMA value array.
      return Map({ date, [property]: currentEMA });
    }
  };
}

export default emaIndicator;
