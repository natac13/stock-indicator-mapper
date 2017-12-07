import { List } from 'immutable';

/**
 * Sets up a closure array variable to store the last time period values of DX
 * to sum.
 * @param  {Number} timePeriod Time Period to calculate ADX with. This value is
 * used here to keep the array at a length equal to the time period.
 * @return {Number}            The summation of the last time period DX values.
 */
function dxSumCalculation(timePeriod) {
  let dxArray = List();
  return function dxTimePeriodSum(dxValue) {
    // first add the new value
    dxArray = dxArray.push(dxValue);

    if (dxArray.size > timePeriod) {
      // then drop the first value
      dxArray = dxArray.shift();
    }

    // return the sum of the dxArray
    return dxArray.reduce((acc, value) => acc + value, 0);
  };
}

export default dxSumCalculation;
