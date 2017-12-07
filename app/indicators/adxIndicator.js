import { Map } from 'immutable';
import round from 'lodash/round';
import trueRange from './helper/trueRange.js';
import plusDICalculation from './helper/plusDICalculation.js';
import minusDICalculation from './helper/minusDICalculation.js';
import dxCalculation from './helper/dxCalculation.js';
import trSmoothCalculation from './helper/trSmoothCalculation.js';
import plusDMSmoothCalculation from './helper/plusDMSmoothCalculation.js';
import minusDMSmoothCalculation from './helper/minusDMSmoothCalculation.js';
import adxCalculation from './helper/adxCalculation.js';
import plusDMCalculation from './helper/plusDMCalculation.js';
import minusDMCalculation from './helper/minusDMCalculation.js';
import dxSumCalculation from './helper/dxSumCalculation.js';


function adxIndicator(timePeriod, adxLine) {
  let previousClose = 0;
  let previousHigh = 0;
  let previousLow = 0;
  let tr = 0;
  let trSum = 0;
  let plusDM = 0;
  let plusDMSum = 0;
  let minusDM = 0;
  let minusDMSum = 0;
  let trSmooth = 0;
  let trSmoothPrevious = 0;
  let plusDMSmooth = 0;
  let plusDMSmoothPrevious = 0;
  let minusDMSmooth = 0;
  let minusDMSmoothPrevious = 0;
  let plusDI = 0;
  let minusDI = 0;
  let diffDI = 0;
  let sumDI = 0;
  let dx = 0;
  let dxSum = 0;
  let adx = 0;
  let adxPrevious = 0;
  // call dxSumCalculation with the time period to set up a closure array variable
  // to store the last time period values of DX to sum.
  const dxTimePeriodSum = dxSumCalculation(timePeriod);


  return function adxMapper(weeklyData, index) {
    const weeklyDataMap = Map.isMap(weeklyData) ? weeklyData : Map(weeklyData);
    const currentWeekIndex = index + 1; // as the array starts at index 0
    // pull out the values that I need to calculate ADX
    const high = weeklyDataMap.get('high');
    const low = weeklyDataMap.get('low');
    const price = weeklyDataMap.get('close');
    const date = weeklyDataMap.get('date');

    // Find out why commenting this out changes ADX outcome values
    // if (currentWeekIndex === 1) {
    //   previousClose = price;
    //   previousHigh = high;
    //   previousLow = low;
    //   return { adx };
    // }


    if (currentWeekIndex >= 2) {
      // 2nd week forward
      tr = trueRange(high, low, previousClose);
      trSum = trSum + tr;

      plusDM = plusDMCalculation(high, previousHigh, low, previousLow);
      minusDM = minusDMCalculation(high, previousHigh, low, previousLow);
      plusDMSum = plusDMSum + plusDM;
      minusDMSum = minusDMSum + minusDM;
    }

    if (currentWeekIndex === timePeriod + 1) {
      // first week of smoothing is just a sum to the TR, plusDM, and minusDM
      trSmooth = trSum;
      plusDMSmooth = plusDMSum;
      minusDMSmooth = minusDMSum;
    }

    // must come before the DI calculation or they are done with previous values
    if (currentWeekIndex >= timePeriod + 2) {
      // when to calculate TRSmooth, plusDMSmooth, minusDMSmooth
      trSmooth = trSmoothCalculation(trSmoothPrevious, timePeriod, tr);
      plusDMSmooth = plusDMSmoothCalculation(plusDMSmoothPrevious, timePeriod, plusDM);
      minusDMSmooth = minusDMSmoothCalculation(minusDMSmoothPrevious, timePeriod, minusDM);
    }

    if (currentWeekIndex >= timePeriod + 1) {
      // these are the same from the week after the time period and on.
      plusDI = plusDICalculation(plusDMSmooth, trSmooth);
      minusDI = minusDICalculation(minusDMSmooth, trSmooth);
      diffDI = Math.abs(plusDI - minusDI);
      sumDI = plusDI + minusDI;
      dx = dxCalculation(diffDI, sumDI);

      dxSum = dxTimePeriodSum(dx);
    }

    if (currentWeekIndex === timePeriod * 2) {
      adx = dxSum / timePeriod;
    }

    if (currentWeekIndex > timePeriod * 2) {
      // where to start calculating ADX as I have timePeriod days of TR, +DM and
      // -DM values and well as timePeriod days of the smoothed versions, diff
      // & sum of DI and DX; which is used to find ADX.
      adx = adxCalculation(adxPrevious, timePeriod, dx);
    }

    // where to insert the console.log statements for testing specific days

    // Set current high and low values of to closure variables for storage.
    previousClose = price;
    previousHigh = high;
    previousLow = low;
    trSmoothPrevious = trSmooth;
    plusDMSmoothPrevious = plusDMSmooth;
    minusDMSmoothPrevious = minusDMSmooth;
    adxPrevious = adx;

    return Map({ date, adx: round(adx, 2) });  // removed adxLine
  };
}

export default adxIndicator;

// if (currentWeekIndex === 508) {
//   console.log('price', price);
//   console.log('previousClose', previousClose);
//   console.log('previousHigh', previousHigh);
//   console.log('previousLow', previousLow);
//   console.log('tr', tr);
//   console.log('trSum', trSum);
//   console.log('plusDM', plusDM);
//   console.log('plusDMSum', plusDMSum);
//   console.log('minusDM', minusDM);
//   console.log('minusDMSum', minusDMSum);
//   console.log('trSmooth', trSmooth);
//   console.log('trSmoothPrevious', trSmoothPrevious);
//   console.log('plusDMSmooth', plusDMSmooth);
//   console.log('plusDMSmoothPrevious', plusDMSmoothPrevious);
//   console.log('minusDMSmooth', minusDMSmooth);
//   console.log('minusDMSmoothPrevious', minusDMSmoothPrevious);
//   console.log('plusDI', plusDI);
//   console.log('minusDI', minusDI);
//   console.log('diffDI', diffDI);
//   console.log('sumDI', sumDI);
//   console.log('dx', dx);
//   console.log('dxSum', dxSum);
//   console.log('adx', adx);
//   console.log('adxPrevious', adxPrevious);
// }
//
// function plusDICalculation(plusDMSmooth, trSmooth) {
//   return round((100 * (plusDMSmooth / trSmooth)), 2);
// }

// function minusDICalculation(minusDMSmooth, trSmooth) {
//   return round((100 * (minusDMSmooth / trSmooth)), 2);
// }

// function dxCalculation(diffDI, sumDI) {
//   return round((100 * (diffDI / sumDI)), 2);
// }

// function trSmoothCalculation(trPrevious, timePeriod, tr) {
//   return round(trPrevious - (trPrevious / timePeriod) + tr, 2);
// }
// function plusDMSmoothCalculation(plusDMPrevious, timePeriod, plusDM) {
//   return round(plusDMPrevious - (plusDMPrevious / timePeriod) + plusDM, 2);
// }
// function minusDMSmoothCalculation(minusDMPrevious, timePeriod, minusDM) {
//   return round(minusDMPrevious - (minusDMPrevious / timePeriod) + minusDM, 2);
// }
// function adxCalculation(adxPrevious, timePeriod, dx) {
//   return round(((adxPrevious * (timePeriod - 1)) + dx) / timePeriod, 2);
// }
