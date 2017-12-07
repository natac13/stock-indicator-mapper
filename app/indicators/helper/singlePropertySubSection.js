import { List } from 'immutable';

/**
 * Creates an array which is a sub section of the full dataArray used for
 * dailyGrind.
 * @param  {Number} lengthLimit Is usually the time period for the indicator
 * which is using this function. However the limit will just be used to check
 * the sub section array at that length or less.
 * @return {Array}             The sub section array which contains only the
 * closing price as items.
 */
function singlePropertySubSection(lengthLimit, property) {
  if (typeof property !== 'string') {
    return new Error('Provide a string property to function');
  }
  let subSection = List();
  return function genSubSection(weeklyData) {
    // first add the new value
    subSection = subSection.push(weeklyData.get(property));

    if (subSection.size > lengthLimit) {
      // then drop the first value
      subSection = subSection.shift();
    }

    // return the subSection
    return subSection;
  };
}

export default singlePropertySubSection;
