import max from 'lodash/max';

function minusDMCalculation(currentHigh, previousHigh, currentLow, previousLow) {
  const highDiff = currentHigh - previousHigh;
  const lowDiff = previousLow - currentLow;

  if (lowDiff > highDiff) {
    return max([lowDiff, 0]);
  }
  return 0;
}

export default minusDMCalculation;