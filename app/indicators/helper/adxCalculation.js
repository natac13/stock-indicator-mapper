
export default function adxCalculation(adxPrevious, timePeriod, dx) {
  return ((adxPrevious * (timePeriod - 1)) + dx) / timePeriod;
}
