
export default function minusDMSmoothCalculation(minusDMPrevious, timePeriod, minusDM) {
  return minusDMPrevious - (minusDMPrevious / timePeriod) + minusDM;
}
