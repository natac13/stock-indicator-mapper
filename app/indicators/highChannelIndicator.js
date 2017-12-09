import { Map, List } from 'immutable';

import _ from 'lodash';

/**
 * Daily indicator
 * @param  {Number} timePeriod The historical prices to check for a max value.
 * @return {Object}            with property of highChannel.
 */
function highChannelIndicator(timePeriod) {
  let channelRange = List();
  return function highChannelMapper(dailyData) {
    const dailyDataMap = Map.isMap(dailyData) ? dailyData : Map(dailyData);
    const high = dailyDataMap.get('high');
    const date = dailyDataMap.get('date');
    // first add the new price to the channel range
    channelRange = channelRange.push(high);

    if (channelRange.size > timePeriod) {
      // then drop the oldest price
      channelRange = channelRange.shift();
    }
    const highChannel = _.round(channelRange.max(), 2);

    // return the highest value
    return Map({ date, highChannel });
  };
}

export default highChannelIndicator;
