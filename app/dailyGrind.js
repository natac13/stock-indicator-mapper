import { Map } from 'immutable';
import moment from 'moment';
import round from 'lodash/round';

import atrIndicator from './indicators/atrIndicator.js';
import highChannelIndicator from './indicators/highChannelIndicator.js';
import fullWeekIndicators from './indicators/fullWeekIndicators.js';

import actionPlanLettering from './actionPlan/lettering.js';

import {
  timePeriodDefaults,
  DATE_FORMAT,
} from './constants/';


/**
 * A function to return a mapping function to run over the daily data of a given
 * security. The map function can return at the end of the function for any day
 * of the week other than the last day, or in an if claus for the last day of
 * the week.
 * @param  {Object} timePeriods is an collection of the time periods to use for
 * the indicator functions
 * @return {Function}         To map over the daily data array created by the
 * dataSetup.js function.
 */
function dailyGrind(
  timePeriods = timePeriodDefaults) {
  // have to keep track manually the weekly index. Which begins at week 0.
  let weeklyIndex = 0;
  let weeklyLow = 0;
  let weeklyHigh = 0;
  // let latestActionPlanLetter = undefined;

  // create the mapping function by calling indicator functions with the
  // corresponding time period
  const weeklyIndicatorMapper = fullWeekIndicators(timePeriods);
  const atrMapper = atrIndicator(timePeriods.get('atr'));
  const highChannelMapper = highChannelIndicator(timePeriods.get('highChannel'));

  const actionPlan = actionPlanLettering();  // creates a closure for variables.


/**
 * Mapper to traverse the daily data array.
 * @param  {[type]} dailyData [description]
 * @param  {[type]} index     [description]
 * @param  {[type]} array     [description]
 * @return {[type]}           [description]
 */
  return function dailyGrindMapper(dailyData, index, array) {
    const dailyDataMap = Map.isMap(dailyData) ? dailyData : Map(dailyData);
    const currentDayIndex = index + 1;
    // const { date, high, low, close } = dailyData;
    const close = round(dailyDataMap.get('close'), 2);
    const date = dailyDataMap.get('date');
    const high = dailyDataMap.get('high');
    const low = dailyDataMap.get('low');
    const arrayLength = array.size;  // number
    const lastItemOfArray = currentDayIndex === arrayLength;  // boolean
    const lastDailyDataMap = currentDayIndex === arrayLength - 1;  // boolean
    const firstItemOfArray = index === 0;  // boolean


    // last item in the array is a blank line, therefore use a ending flag.
    // if (lastItemOfArray) { return Map({ end: true }); }


    /*=========================================
    =            Date Manipulation            =
    =========================================*/
    // const DATE_FORMAT = 'MM/DD/YYYY';  // the format dataSetup.js uses.

    // grab the next day's data object to find out what day of the week it is.
    const nextDayData = lastItemOfArray ? Map() : array.get(index + 1);
    const nextDate = lastItemOfArray ?  // needs to be lastDailyDataMap for quandl and uncomment out the above if statement
      moment(date).add(3, 'days') : nextDayData.get('date');  // add 3 days to simulate next date as a Monday
    // as well as get the previous day's data object.
    // on the first item (index = 0) there is no previous day.
    const previousDayData = firstItemOfArray ? Map() : array.get(index - 1);
    const previousDate = previousDayData.get('date');

    // grab the day of week represented by a number; 0 = Sunday, start of week
    const currentDayOfWeek = moment(date, DATE_FORMAT).day();
    const futureDayOfWeek = moment(nextDate, DATE_FORMAT).day();
    const previousDayOfWeek = moment(previousDate, DATE_FORMAT).day();

    /*=====  End of Date Manipulation  ======*/


    /*========================================
    =            Daily Indicators            =
    ========================================*/

    // always run ATR and High Channel.
    const atrDataObject = atrMapper(dailyDataMap, index);
    const highChannelDataObject = highChannelMapper(dailyDataMap);

    // always adjust the weeklyHigh and low values
    weeklyHigh = high > weeklyHigh ? high : weeklyHigh;
    weeklyLow = low < weeklyLow ? low : weeklyLow;

    /*=====  End of Daily Indicators  ======*/

    /*=====================================
    =            Weekly Resets            =
    =====================================*/
    /*
    First day of the week OR the first item of the entire array; therefore set
    the weeklyHigh and weeklyLow values to the high and low of the first day of
    the week and compare sequential days to it before completing the function.
     */
    const firstDayOfWeek = currentDayOfWeek < previousDayOfWeek;  // boolean
    if (firstItemOfArray || firstDayOfWeek) {
      weeklyHigh = high;
      weeklyLow = low;
    }

    /*=====  End of Weekly Resets  ======*/


    /*=========================================
    =            Weekend CheckList            =
    =========================================*/
    const lastDayOfWeek = currentDayOfWeek > futureDayOfWeek;
    if (lastDayOfWeek) {
      const weeklyData = dailyDataMap
        .merge({ high: weeklyHigh, low: weeklyLow });

      const weeklyIndicatorValues = weeklyIndicatorMapper(weeklyData, weeklyIndex);

      const indicatorValues = Map({ date, close }).merge(
        weeklyIndicatorValues,
        atrDataObject,
        highChannelDataObject,
      );

      const emaFast = indicatorValues.get('emaFast');
      const emaSlow = indicatorValues.get('emaSlow');
      const roc = indicatorValues.get('roc');
      const slope = indicatorValues.get('slope');
      const closedBelowEMA = close < emaFast;
      const secondSellCondition = roc <= 0 || slope <= 0;
      const triggeredSecondSell = closedBelowEMA && secondSellCondition;


      /** Add the Action Plan Lettering to the indicator object. */
      const indicatorActionPlan = actionPlan(indicatorValues);
      // latestActionPlanLetter = indicatorActionPlan.get('actionPlanLetter');

      // update weekly index at the end as the if will trigger when previousDayData
      // represents Friday.
      weeklyIndex = weeklyIndex + 1;

      return indicatorActionPlan.merge({ weekly: true });
    }
    /*=====  End of Weekend Checklist  ======*/

    /*
    Normal week day.
     */
    const dailyReturnObject = Map(
      {
        date,
        close,
        // latestActionPlanLetter,
        weekly: false,
      })
      .merge(
        atrDataObject,  // temporary for testing
        highChannelDataObject,
      );

    return dailyReturnObject;
  };
}

export default dailyGrind;
