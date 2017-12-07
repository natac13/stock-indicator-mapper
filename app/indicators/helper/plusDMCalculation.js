import max from 'lodash/max';

function plusDMCalculation(currentHigh, previousHigh, currentLow, previousLow) {
  const highDiff = currentHigh - previousHigh;
  const lowDiff = previousLow - currentLow;
  // directional movement is positive when the current high minus the previous
  // high is greater than the previous low minus the current low. The current
  // high minus previous high has to be positive or else is 0
  if (highDiff > lowDiff) {
    return max([highDiff, 0]);
  }
  return 0;
}

export default plusDMCalculation;
