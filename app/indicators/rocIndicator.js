import { Map, List } from 'immutable';
import round from 'lodash/round';

import singlePropertySubSection from './helper/singlePropertySubSection.js';

function rocIndicator(timePeriod) {
  let subSection = List();
  // timePeriod + 1 since the ROC needs to be a difference of timePeriod days.
  // Not have timePeriod values before taking action like the rest.
  const genSubSection = singlePropertySubSection(timePeriod + 1, 'close');

  return function rateOfChangeMapper(weeklyData, index) {
    const weeklyDataMap = Map.isMap(weeklyData) ? weeklyData : Map(weeklyData);
    const currentWeekIndex = index + 1;
    const price = weeklyDataMap.get('close');
    const date = weeklyDataMap.get('date');
    subSection = genSubSection(weeklyDataMap);
    // short circuit the function until index + 1 is greater than
    // the time period
    if (currentWeekIndex <= timePeriod) {
      return Map({ date, roc: undefined });
    }

    // when currentWeekIndex is greater than timePeriod than there is enough in the
    // history of the array to look back 'timePeriod' days.
    if (currentWeekIndex > timePeriod) {
      const closeTimePeriodsAgo = subSection.first();
      const roc = round(
        (((price - closeTimePeriodsAgo) / closeTimePeriodsAgo) * 100),
      2);
      return Map({ date, roc });
    }

    // should return an Error object for default case? on all functions of indicators.
    return Map();
  };
}

export default rocIndicator;
