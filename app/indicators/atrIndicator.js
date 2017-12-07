import { Map } from 'immutable';
import round from 'lodash/round';

import trueRange from './helper/trueRange.js';

// The formula for Average True Range.
function averageTrueRange(priorATR, currentTR, timePeriod) {
  return round(((priorATR * (timePeriod - 1) + currentTR) / timePeriod), 3);
}

/**
 * The process of calculating Average True Range.
 * @param {Number} timePeriod The number of days/weeks/months to calculate ATR.
 */
function atrIndicator(timePeriod) {
  let previousClose = 0;
  let trueRangeSum = 0;
  let currentLow = 0;
  let currentHigh = 0;
  let previousATR = 0;
  let atr = undefined;

  return function ATRMap(dailyData, index) {
    const dailyDataMap = Map.isMap(dailyData) ? dailyData : Map(dailyData);
    const currentDayIndex = index + 1;
    const price = dailyDataMap.get('close');
    const date = dailyDataMap.get('date');
    currentLow = dailyDataMap.get('low');
    currentHigh = dailyDataMap.get('high');

    // On the very first day I can only find the High - Low for the True Range
    // value.
    if (currentDayIndex === 1) {
      trueRangeSum = trueRangeSum + trueRange(currentHigh, currentLow, previousClose);

      // build history of price stored in the previousClose variable.
      previousClose = price;

      return Map({ date, atr });
    }

    // Need to gather enough days to equal the time period.
    if (currentDayIndex < timePeriod) {
      // Find the True Range Value and add it to the sum variable.
      trueRangeSum = trueRangeSum + trueRange(currentHigh, currentLow, previousClose);

      // build history of price stored in the previousClose variable.
      previousClose = price;

      return Map({ date, atr });
    }

    // When the iteration is at the time period I need to find the ATR by a
    // normal averaging of values.
    if (currentDayIndex === timePeriod) {
      // Add last True Range value to the sum before the average is found.
      trueRangeSum = trueRangeSum + trueRange(currentHigh, currentLow, previousClose);
      // Calculate the average ATR by the simple averaging formula.
      atr = round((trueRangeSum / timePeriod), 3);

      // set historical ATR value
      previousATR = atr;
      // build history of price stored in the previousClose variable.
      previousClose = price;

      // something internal is wrong when doing a direct rounding to 2.
      return Map({ date, atr: round(atr, 2) });
    }

    if (currentDayIndex > timePeriod) {
      const currentTrueRange = trueRange(currentHigh, currentLow, previousClose);
      // Use the Real Average True Range formula now that the function is past
      // the time period value.
      atr = averageTrueRange(previousATR, currentTrueRange, timePeriod);

      // set historical ATR value
      previousATR = atr;

      // build history of price stored in the previousClose variable.
      previousClose = price;

      // something internal is wrong when doing a direct rounding to 2.
      return Map({ date, atr: round(atr, 2) });
    }
  };
}

export default atrIndicator;
