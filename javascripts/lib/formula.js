function getFormulaMinX(formula, xPointMin, yPointMin) {
  var y = getFormulaYByX(formula, xPointMin);

  if (y >= yPointMin) {
    return xPointMin;
  }

  return getFormulaXByY(formula, yPointMin);
}

function getFormulaMaxX(formula, xPointMax, yPointMax) {
  var y = getFormulaYByX(formula, xPointMax);

  if (y <= yPointMax) {
    return xPointMax
  }

  return getFormulaXByY(formula, yPointMax);
}

function getFormulaYByX(formula, x) {
  var a = getFormulaAParams(formula);
  var b = getFormulaBParams(formula);
  var y = a * x + b;

  return y;
}

function getFormulaXByY(formula, y) {
  var a = getFormulaAParams(formula);
  var b = getFormulaBParams(formula);
  var x = (y - b) / a;

  return x;
}

function getFormulaAParams(formula) {
  var water = formula['water'];
  var cafe =  formula['cafe'];
  var a = 1.0 * cafe / (water - cafe * 2);

  return a;
}

function getFormulaBParams(formula) {
  return 0;
}

function getFormulaCafe(formula, x, y) {
  var water = 1900;
  var cafe = 1.0 * water * y / (2 * y + x);

  return round2Decimal(cafe);
}
