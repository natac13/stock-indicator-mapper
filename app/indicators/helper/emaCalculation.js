import round from 'lodash/round';

/**
 * Will calculate the current EMA. This is the third set is calculating the
 * Exponential Moving Average
 * @param  {Number} price       Week's Closing Price
 * @param  {Number} previousEMA Previous week's EMA value
 * @param  {Number} multiplier  The multiplier value; this is the second set
 * @return {Number}             The Current EMA value.
 */
function emaCalculation(price, previousEMA, multiplier) {
  const value = multiplier * (price - previousEMA) + previousEMA;
  return round(value, 2);
}

export default emaCalculation;
