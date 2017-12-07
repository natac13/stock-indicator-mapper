
export default function plusDMSmoothCalculation(plusDMPrevious, timePeriod, plusDM) {
  return plusDMPrevious - (plusDMPrevious / timePeriod) + plusDM;
}
