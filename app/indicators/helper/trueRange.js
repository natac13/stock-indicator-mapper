function trueRange(high, low, previousClose) {
  const range1 = high - low;
  const range2 = Math.abs(high - previousClose);
  const range3 = Math.abs(low - previousClose);

  if (previousClose === 0) {
    return range1;
  }

  return Math.max(range1, range2, range3);
}

export default trueRange;
