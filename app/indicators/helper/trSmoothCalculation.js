export default function trSmoothCalculation(trPrevious, timePeriod, tr) {
  return trPrevious - (trPrevious / timePeriod) + tr;
}
