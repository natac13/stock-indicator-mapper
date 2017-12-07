import { fromJS } from 'immutable';
import moment from 'moment';
const DATE_FORMAT = 'YYYY-MM-DD';

const defaultOptions = {
  dataFormat: 'normal',
};

const formats = {
  normal: 'YYYY-MM-DD',
  google: 'DD-MMM-YYYY',
};

// function dataSetup(rawData, options = defaultOptions) {

//   const format = formats[options.dataFormat];

//   return fromJS(rawData.map((daysData) => {
//     const date = moment(daysData.date.slice(0, 10), format).format(DATE_FORMAT);
//     return {
//       date,
//       close: +daysData['adjClose'],
//       high: +daysData['adjHigh'],
//       low: +daysData['adjLow'],
//       volume: +daysData['adjVolume'],
//     };
//   }));
// }

function dataSetup(rawData, options = defaultOptions) {

  const format = formats[options.dataFormat];

  return fromJS(rawData.map((daysData) => (
    {
      date: moment(daysData.Date, format).format(DATE_FORMAT),
      close: +daysData['Adj. Close'],
      high: +daysData['Adj. High'],
      low: +daysData['Adj. Low'],
      volume: +daysData['Adj. Volume'],
    }
  ))).butLast(); // last item from quandl is a blank therefore I remove it here.
}
export default dataSetup;
