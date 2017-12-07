import { Map, List } from 'immutable';
import times from 'lodash/times';
import round from 'lodash/round';

import regression from 'regression';

import singlePropertySubSection from './helper/singlePropertySubSection.js';

function slopeIndicator(timePeriod) {
  // weeksArray is an array of values from 1 to the timePeriod.
  const weeksArray = List(times(timePeriod, x => x + 1));
  // zipped with above array to feed into the linear regression function.
  let subSection = List();
  // create a closure of a subSection array, of only price values.
  const genSubSection = singlePropertySubSection(timePeriod, 'close');

  return function slopeMapper(weeklyData, index) {
    const weeklyDataMap = Map.isMap(weeklyData) ? weeklyData : Map(weeklyData);
    const currentWeekIndex = index + 1;
    const date = weeklyDataMap.get('date');
    // short circuit and return 0 when not enough data points.
    if (currentWeekIndex < timePeriod) {
      subSection = genSubSection(weeklyDataMap);
      return Map({ date, slope: undefined });
    }

    if (currentWeekIndex >= timePeriod) {
      subSection = genSubSection(weeklyDataMap);
      // create the [x, y] data points in an array of arrays to give to the
      // regression function.
      const dataPoints = weeksArray.zip(subSection).toArray();
      const regressionResult = regression.linear(dataPoints);
      const slopeValue = round(regressionResult.equation[0], 2);
      return Map({ date, slope: slopeValue });
    }

    return new Error('Something wrong with timePeriod for slope mapper');
  };
}

export default slopeIndicator;
