import { Map, List } from 'immutable';
import { expect } from 'chai';
import Baby from 'babyparse';
import round from 'lodash/round';

import dataSetup from '../../app/utils/dataSetup.js';
import emaCalculation from '../../app/utils/indicators/emaIndicator.js';
import atrCaluclation from '../../app/utils/indicators/atrIndicator.js';
import slopeCaluclation from '../../app/utils/indicators/slopeIndicator.js';
import rocCaluclation from '../../app/utils/indicators/rocIndicator.js';
import adxIndicator from '../../app/utils/indicators/adxIndicator.js';
import highChannelIndicator from '../../app/utils/indicators/highChannelIndicator.js';
import fullWeekIndicators from '../../app/utils/indicators/fullWeekIndicators.js';
import dailyGrind from '../../app/utils/dailyGrind.js';

const parseConfig = {
  header: true,
};

const parsed = Baby.parseFiles('./data/MMM-daily-2006-2009.csv', parseConfig);
const rawData = parsed.data;
const dailyData = dataSetup(rawData);

const parsed2 = Baby.parseFiles('./data/MMM-daily-2003-2009.csv', parseConfig);
const rawData2 = parsed2.data;
const dailyData2 = dataSetup(rawData2);

const weeklyParsed = Baby.parseFiles('./data/MMM-weekly-2000-2009.csv', parseConfig);
const weeklyRawData = weeklyParsed.data;
const weeklyData = dataSetup(weeklyRawData);

const weeklyParsed2 = Baby.parseFiles('./data/AAPL-weekly-2000-2009.csv', parseConfig);
const weeklyRawData2 = weeklyParsed2.data;
const weeklyData2 = dataSetup(weeklyRawData2);

describe('EMACalculation function.', () => {
  it('Should return an array of EMA values', () => {
    const mapperFunction = emaCalculation(13, 'Fast');
    const actual = weeklyData.map(mapperFunction);
    // console.log(actual);
    expect(actual).to.be.an.instanceof(List);
    expect(actual.first()).to.be.an.instanceof(Map);
    expect(actual.first()).to.include.keys('emaFast', 'date');
    // Testing against EMA-Spreadsheet-MMM-weekly-2000-2009-EMA13.xls
    const week13 = actual.get(12);  // 29.61
    const week21 = actual.get(20);  // 28.93
    const week132 = actual.get(131);  // 43.04
    const week455 = actual.get(454);  // 56.92
    expect(week13.get('emaFast')).to.equal(29.61);
    expect(week21.get('emaFast')).to.equal(28.93);
    expect(week132.get('emaFast')).to.equal(43.04);
    expect(week455.get('emaFast')).to.equal(56.92);
    // console.log(actual[389]);
  });
});

describe('ATR function', () => {
  it('Should return an array of ATR values', () => {
    const mapperFunction = atrCaluclation(23);
    const actual = dailyData.map(mapperFunction);
    // console.log(actual);
    expect(actual).to.be.an.instanceof(List);
    expect(actual.first()).to.be.an.instanceof(Map);
    expect(actual.first()).to.include.keys('atr', 'date');
    // testing against MMM-daily-2006-2009.xls
    const day23 = actual.get(22);  // 0.924
    const day136 = actual.get(135);  // 1.122
    const day281 = actual.get(280);  // 0.81
    const day802 = actual.get(801);  // 1.69
    const day1000 = actual.get(999); // 1.14
    const last = actual.get(1006); // 1.05

    expect(day23.get('atr')).to.equal(0.92);
    expect(day136.get('atr')).to.equal(1.12);
    expect(day281.get('atr')).to.equal(0.81);
    expect(day802.get('atr')).to.equal(1.69);
    expect(day1000.get('atr')).to.equal(1.14);
    expect(last.get('atr')).to.equal(1.05);
  });
});

describe('Slope function', () => {
  it('Should return an array of values which are the slope of the linear regression for the time period', () => {
    const mapperFunction = slopeCaluclation(13);
    const actual = weeklyData.map(mapperFunction);
    // console.log(actual);
    expect(actual).to.be.an.instanceof(List);
    expect(actual.first()).to.be.an.instanceof(Map);
    // expect(actual.first()).to.have.ownProperty('date');
    expect(actual.first()).to.include.keys('slope', 'date');
  });
});

describe('Rate of Change function', () => {
  it('Should return an array of values which are the rate of change for the given time period', () => {
    const mapperFunction = rocCaluclation(13);
    const actual = weeklyData.map(mapperFunction);
    // console.log(actual);
    expect(actual).to.be.an.instanceof(List);
    expect(actual.first()).to.be.an.instanceof(Map);
    expect(actual.first()).to.include.keys('roc', 'date');
    // Testing against ROC-Spreadsheet.xls
    const week14 = actual.get(13);  // -10.25
    const week142 = actual.get(141);  // -3.2
    const week323 = actual.get(322);  // -6.53
    const week500 = actual.get(499);  // 22.9
    expect(round(week14.get('roc'), 1)).to.equal(-10.2);
    expect(round(week142.get('roc'), 1)).to.equal(-3.2);
    expect(round(week323.get('roc'), 1)).to.equal(-6.5);
    expect(round(week500.get('roc'), 1)).to.equal(22.9);
    // console.log(actual[390]);
  });
});

describe('ADX-13 indicator', () => {
  it('Should return an array of objects with properties: date, and adx', () => {
    const mapperFunction = adxIndicator(13);
    const actual = weeklyData.map(mapperFunction);
    // console.log(actual);
    expect(actual).to.be.an.instanceof(List);
    expect(actual.first()).to.be.an.instanceof(Map);
    expect(actual.first()).to.include.keys('adx', 'date');
    // Testing against ADX-Spredsheet_MMM-weekly-2000-2009-data.xls
    const week26 = actual.get(25);  // 8.92
    const week33 = actual.get(32);  // 14.76
    const week347 = actual.get(346);  // 28.24
    const week508 = actual.get(507);  // 30.65
    expect(week26.get('adx')).to.equal(8.92);
    expect(week33.get('adx')).to.equal(14.76);
    expect(week347.get('adx')).to.equal(28.24);
    expect(week508.get('adx')).to.equal(30.65);
    // console.log(actual[388]);
    // console.log(actual[389]);
    // console.log(actual[390]);
  });
});

// with ADX 14 on APPL data
describe('ADX-14 indicator', () => {
  it('Should return an array of objects with properties: date, and adx', () => {
    const mapperFunction = adxIndicator(14);
    const actual = weeklyData2.map(mapperFunction);
    // console.log(actual);
    expect(actual).to.be.an.instanceof(List);
    expect(actual.first()).to.be.an.instanceof(Map);
    expect(actual.first()).to.include.keys('adx', 'date');
    // Testing against ADX14-Spredsheet_AAPL-weekly-2000-2009-data.xls
    const week107 = actual.get(106);  // 18.57
    const week254 = actual.get(253);  // 60.28
    const week404 = actual.get(403);  // 42.32
    const week445 = actual.get(444);  // 18
    expect(week107.get('adx')).to.equal(18.57);
    expect(week254.get('adx')).to.equal(60.28);
    expect(week404.get('adx')).to.equal(42.32);
    expect(week445.get('adx')).to.equal(18);
  });
});

describe('HighChannel indicator', () => {
  it('Shouuld return a List of Maps with properties: data, and highChannel', () => {
    const mapperFunction = highChannelIndicator(50);
    const actual = dailyData.map(mapperFunction);
    expect(actual).to.be.an.instanceof(List);
    expect(actual.first()).to.be.an.instanceof(Map);
    expect(actual.first()).to.include.keys('highChannel', 'date');
    expect(actual.first().get('highChannel')).to.equal(58.98);
    expect(actual.getIn([1, 'highChannel'])).to.equal(59.08);
    // console.log(actual.get(1));
    // console.log(dailyData.get(0))
    // console.log(dailyData.get(1))
  });
});


// Full Indicator Test
describe('Full Day of indicator calculations', () => {
  it('Should return an array of object to represent each of the indicator calculations.', () => {
    const mapperFunction = fullWeekIndicators();
    const actual = weeklyData.map(mapperFunction);
    // console.log(actual);
    expect(actual).to.be.an.instanceof(List);
    // expect(actual.first()).to.be.a('object');
    // console.log(actual[50]);
  });
});

// DailyGrind
//
describe('dailyGrind Function', () => {
  it('Should work', () => {
    const mapperFunction = dailyGrind();
    const actual = dailyData2.map(mapperFunction);
    // console.log(actual.slice(150, 165));
    // console.log(actual.slice(190, 250));
    expect(actual).to.be.an.instanceof(List);
    expect(actual.first()).to.be.a('object');
    // console.log(actual.get(5))

    // console.log(actual.get(1114));
    // console.log(actual.get(1115));
    // console.log(actual.get(1116));
    // console.log(actual.get(1120));
    // console.log(actual.get(1125));
    console.log(actual.get(actual.size - 10));
    console.log(actual.get(actual.size - 6));
    console.log(actual.get(actual.size - 5));
    console.log(actual.get(actual.size - 4));
    console.log(actual.get(actual.size - 3));
    console.log(actual.get(actual.size - 2));
    console.log(actual.get(actual.size - 1));
    console.log(actual.get(actual.size));
    // console.log(actual.get(778));
    // console.log(actual.get(788));
    // console.log(actual.get(391));
    // console.log(actual.get(498));
  });
});

