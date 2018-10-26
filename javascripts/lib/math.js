function convertGTOz(g) {
  return round2Decimal(1.0 * g /  28.34952);
}

function round2Decimal(num) {
  return Math.round(num * 100) / 100;
}
