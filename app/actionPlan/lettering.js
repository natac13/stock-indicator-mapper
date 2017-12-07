import { Map } from 'immutable';
/** Sample indicatorValue ***/
// {
//   date: '05/23/2003',
//   emaFast: 44.45,
//   emaSlow: 34.56,
//   slope: -0.11,
//   roc: -2.12,
//   adx: 27.45,
//   atr: 0.8,
//   highChannel: 48.16,
// },

function actionPlanLettering() {
  /** Previous Values */
  let adxPrevious = 0;
  let emaFastPrevious = 0;
  let emaSlowPrevious = 0;
  let rocPrevious = 0;
  let slopePrevious = 0;
  let previousActionPlanLetter = undefined;

  /** Sample return */
  // {
  //    actionPlan: 'b',
  // }
  return function actionPlan(indicatorValues) {
    const indicatorValuesMap = Map.isMap(indicatorValues)
      ? indicatorValues : Map(indicatorValues);
    const emaFast = indicatorValuesMap.get('emaFast');
    const emaSlow = indicatorValuesMap.get('emaSlow');
    const adx = indicatorValuesMap.get('adx');
    const roc = indicatorValuesMap.get('roc');
    const slope = indicatorValuesMap.get('slope');



    /** Set previous values */
    adxPrevious = adx;
    emaFastPrevious = emaFast;
    emaSlowPrevious = emaSlow;
    rocPrevious = roc;
    slopePrevious = slope;
    // previousActionPlanLetter = actionPlanLetter;
    return indicatorValuesMap;
  };
}


export default actionPlanLettering;
