var WHITE_COLOR = "#ffffff";
var CAFE_COLOR = "#DABC99";
var STRONG_CAFE_COLOR = "#C48C40";

var BLACK_COLOR = "#000000";
var RED_COLOR = "#ff0000";

var squareEdge = 45;
var chartPaddingTop = 100;
var chartPaddingBottom = 150;
var chartPaddingLeft = 200;
var chartPaddingRight = 100;

var xPointMin = 14;
var xPointMax = 26;
var xPointUnit = 1;
var xPointRange = {'min': 18, 'max': 22};
var xTitles = [
  {'text': 'EXTRACTION | Solubles Yield - percent', 'color': BLACK_COLOR},
  {'text': '1粒のコーヒー豆からの抽出した成分量', 'color': RED_COLOR},
  {'text': '（苦味・酸味の評価）', 'color': RED_COLOR}
];

var yPointMin = 0.8;
var yPointMax = 1.7;
var yPointUnit = 0.05;
var yPointRange = {'min': 1.15, 'max': 1.35};
var yTitles = [
  {'text': 'STRENGTH | Solubles Concentration - percent', 'color': BLACK_COLOR},
  {'text': '出来上がったコーヒーの単位体積当たりの成分量', 'color': RED_COLOR},
  {'text': '（濃さの評価）', 'color': RED_COLOR}
];

var squareTexts = [
  {'text': '濃い酸味',
    'xPointMin': xPointMin, 'xPointMax': xPointRange['min'],
    'yPointMin': yPointRange['max'], 'yPointMax': yPointMax
  },
  {'text': '濃い',
    'xPointMin': xPointRange['min'], 'xPointMax': xPointRange['max'],
    'yPointMin': yPointRange['max'], 'yPointMax': yPointMax
  },
  {'text': '濃い苦い',
    'xPointMin': xPointRange['max'], 'xPointMax': xPointMax,
    'yPointMin': yPointRange['max'], 'yPointMax': yPointMax
  },
  {'text': '酸味',
   'xPointMin': xPointMin, 'xPointMax': xPointRange['min'],
   'yPointMin': yPointRange['min'], 'yPointMax': yPointRange['max']
  },
  {'text': '理想的',
   'xPointMin': xPointRange['min'], 'xPointMax': xPointRange['max'],
   'yPointMin': yPointRange['min'], 'yPointMax': yPointRange['max']
  },
  {'text': '苦い',
   'xPointMin': xPointRange['max'], 'xPointMax': xPointMax,
   'yPointMin': yPointRange['min'], 'yPointMax': yPointRange['max']
  },
  {'text': '薄い酸味',
    'xPointMin': xPointMin, 'xPointMax': xPointRange['min'],
    'yPointMin': yPointMin, 'yPointMax': yPointRange['min']
  },
  {'text': '薄い',
    'xPointMin': xPointRange['min'], 'xPointMax': xPointRange['max'],
    'yPointMin': yPointMin, 'yPointMax': yPointRange['min']
  },
  {'text': '薄い苦い',
    'xPointMin': xPointRange['max'], 'xPointMax': xPointMax,
    'yPointMin': yPointMin, 'yPointMax': yPointRange['min']
  }
];

// formula: y = ax + b
var formulas = [
  {'water': 1900, 'cafe': 135},
  {'water': 1900, 'cafe': 128},
  {'water': 1900, 'cafe': 121},
  {'water': 1900, 'cafe': 113},
  {'water': 1900, 'cafe': 105},
  {'water': 1900, 'cafe': 99},
  {'water': 1900, 'cafe': 92},
  {'water': 1900, 'cafe': 85},
  {'water': 1900, 'cafe': 78}
];

var xPointCount = (xPointMax - xPointMin) / xPointUnit + 1;

var xPointWidth = squareEdge * xPointCount + (chartPaddingLeft + chartPaddingRight);
xPointWidth = round2Decimal(xPointWidth);

var yPointCount = (yPointMax - yPointMin) / yPointUnit + 1;
var yPointHeight = squareEdge * yPointCount + (chartPaddingTop + chartPaddingBottom);
yPointHeight = round2Decimal(yPointHeight);

function drawCanvasChart(canvasId, formula, xPoint, yPoint) {
  var canvas = document.getElementById(canvasId);

  canvas.setAttribute('width', xPointWidth);
  canvas.setAttribute('height', yPointHeight);

  var context = canvas.getContext('2d');

  drawXLines(context);
  drawYLines(context);

  drawXPoints(context);
  drawYPoint(context);

  for (var i = 0; i < xTitles.length; i++) {
    drawXTitle(context, xTitles[i].text, xTitles[i].color, i);
  }

  for (var i = 0; i < yTitles.length; i++) {
    drawYTitle(context, yTitles[i].text, yTitles[i].color, i);
  }

  fillColorSquares(context);
  fillTextSquares(context);
  
  for (var i = 0; i < formulas.length; i++) {
    drawFormula(context, formulas[i]);
  }

  drawFormula(context, formula);

  drawPoint(context, xPoint, yPoint);
}


function drawFormula(context, formula) {
  var xPoint1 = getFormulaMinX(formula, xPointMin, yPointMin);
  var yPoint1 = getFormulaYByX(formula, xPoint1);

  var xPoint2 = getFormulaMaxX(formula, xPointMax, yPointMax);
  var yPoint2 = getFormulaYByX(formula, xPoint2);

  drawLine(context, xPoint1, yPoint1, xPoint2, yPoint2, RED_COLOR);

  var cafe = getFormulaCafe(formula, xPoint2, yPoint2);
  var oz = convertGTOz(cafe);

  var xCoorMax = getXCoorByXPoint(xPointMax);
  var xCoor = getXCoorByXPoint(xPoint2);
  var yCoor = getYCoorByYPoint(yPoint2);


  if (xCoor < xCoorMax) {
    xCoor = xCoor - 20;
    yCoor = yCoor - 40;
  } else {
    xCoor = xCoor + 10;
    yCoor = yCoor - 20;
  }

  context.font = "18px Arial";
  context.fillStyle = BLACK_COLOR;
  context.fillText(cafe + 'g', xCoor, yCoor);
  context.fillText(oz + 'oz', xCoor, yCoor + 25);
}

function drawPoint(context, xPoint, yPoint) {
  var pointSize = 10;
  var xCoor = getXCoorByXPoint(xPoint);
  var yCoor = getYCoorByYPoint(yPoint);

  context.beginPath();
  context.fillStyle = RED_COLOR;
  context.arc(xCoor, yCoor, pointSize, 0, Math.PI * 2, true);
  context.fill();
}

function drawLine(context, xPoint1, yPoint1, xPoint2, yPoint2, color) {
  var xCoor1 = getXCoorByXPoint(xPoint1);
  var yCoor1 = getYCoorByYPoint(yPoint1);

  var xCoor2 = getXCoorByXPoint(xPoint2);
  var yCoor2 = getYCoorByYPoint(yPoint2);

  context.beginPath();
  context.strokeStyle = color;
  context.moveTo(xCoor1, yCoor1);
  context.lineTo(xCoor2, yCoor2);
  context.stroke();
}

function drawXLines(context) {
  for (var yPoint = yPointMin; yPoint <= yPointMax; yPoint = round2Decimal(yPoint + yPointUnit)) {
    drawLine(context, xPointMin, yPoint, xPointMax, yPoint, BLACK_COLOR);
  }
}

function drawYLines(context) {
  for (var xPoint = xPointMin; xPoint <= xPointMax; xPoint = xPoint + xPointUnit) {
    drawLine(context, xPoint, yPointMin, xPoint, yPointMax, BLACK_COLOR);
  }
}

function drawXPoints(context) {
  for (var i = 0; i < (xPointCount); i++) {
    var xCoor = chartPaddingLeft + i * squareEdge;
    var yCoor = chartPaddingTop + squareEdge * (yPointCount - 1);
    var xPoint = xPointMin + i * xPointUnit;

    context.moveTo(xCoor, yCoor);
    context.lineTo(xCoor, yCoor + 10);
    context.stroke();

    context.font = "30px Arial";
    context.fillText(xPoint, xCoor - 20, yCoor + 60);
  }
}

function drawYPoint(context) {
  for (var i = 0; i < (yPointCount); i++) {
    var xCoor = chartPaddingLeft;
    var yCoor = chartPaddingTop + squareEdge * i;
    var yPoint = yPointMax - i * yPointUnit;
    yPoint = round2Decimal(yPoint);

    context.moveTo(xCoor, yCoor);
    context.lineTo(xCoor - 10, yCoor);
    context.stroke();

    context.font = "30px Arial";
    context.fillText(yPoint, xCoor - 70, yCoor + 10);
  }
}

function drawXTitle(context, text, color, index) {
  var xCoor = chartPaddingLeft;
  var yCoor = chartPaddingTop + yPointCount * squareEdge;
  var titleXWith = context.measureText(text).width;

  context.font = "30px Arial";
  context.fillStyle = color;
  context.fillText(text, xCoor + (squareEdge * xPointCount - titleXWith) / 2, yCoor + 100 + 35 * (index - 1));
}

function drawYTitle(context, text, color, index) {
  var width = context.measureText(text).width;
  var height = 30;

  var xCoor = chartPaddingLeft - 130 - 35 * (index - 1);
  var yCoor = chartPaddingTop + (squareEdge * yPointCount + width) / 2;

  context.save();
  context.translate(xCoor, yCoor);
  context.rotate(-Math.PI/2);
  context.font = "30px Arial";
  context.fillStyle = color;
  context.fillText(text, 0, 0);
  context.restore();
}

function fillColorSquares(context) {
  for (var xPointIndex = 0; xPointIndex < xPointCount - 1; xPointIndex++) {
    for (var yPointIndex = 0; yPointIndex < yPointCount - 1; yPointIndex++) {
      var xCoor = getXCoorByXIndex(xPointIndex);
      var yCoor = getYCoorByYIndex(yPointIndex);
      var color = getColor(xCoor, yCoor);

      context.fillStyle = color;
      context.fillRect(xCoor + 2, yCoor + 2, squareEdge - 4, squareEdge - 4);
    }
  }
}

function fillTextSquares(context) {
  for (var i = 0; i < squareTexts.length; i ++) {
    fillTextSquare(context, squareTexts[i]);
  }
}

function fillTextSquare(context, squareText) {
  var text = squareText['text'];
  var xPointMin = squareText['xPointMin'];
  var xPointMax = squareText['xPointMax'];
  var yPointMin = squareText['yPointMin'];
  var yPointMax = squareText['yPointMax'];

  var xCoorMin = getXCoorByXPoint(xPointMin);
  var xCoorMax = getXCoorByXPoint(xPointMax);
  var yCoorMin = getYCoorByYPoint(yPointMin);
  var yCoorMax = getYCoorByYPoint(yPointMax);

  context.font = "30px Arial";
  context.fillStyle = BLACK_COLOR;

  var width = context.measureText(text).width;
  var height = 15;

  var xCoor = (xCoorMin + xCoorMax - width) / 2;
  var yCoor = (yCoorMin + yCoorMax + height) / 2;

  console.log('nDEBUG');
  console.log('yCoorMin: ', yCoorMin);
  console.log('yCoorMax: ', yCoorMax);
  console.log('yCoor: ', yCoor);

  context.fillText(text, xCoor, yCoor);
}

function getColor(xCoor, yCoor) {
  var xPointRangeMinCoor = getXCoorByXPoint(xPointRange['min']);
  var xPointRangeMaxCoor = getXCoorByXPoint(xPointRange['max']);

  var yPointRangeMinCoor = getYCoorByYPoint(yPointRange['min']);
  var yPointRangeMaxCoor = getYCoorByYPoint(yPointRange['max']);

  if ((xCoor >= xPointRangeMinCoor && xCoor < xPointRangeMaxCoor) && (yCoor >= yPointRangeMaxCoor && yCoor < yPointRangeMinCoor)) {
    return STRONG_CAFE_COLOR;
  }

  if ((xCoor >= xPointRangeMinCoor && xCoor < xPointRangeMaxCoor) || (yCoor >= yPointRangeMaxCoor && yCoor < yPointRangeMinCoor)) {
    return CAFE_COLOR;
  }

  return WHITE_COLOR;
}

function getXCoorByXPoint(xPoint) {
  var xIndex = getXIndexByXPoint(xPoint);
  var xCoor = getXCoorByXIndex(xIndex);

  return xCoor
}

function getYCoorByYPoint(yPoint) {
  var yIndex = getYIndexByYPoint(yPoint);
  var yCoor = getYCoorByYIndex(yIndex);

  return yCoor;
}

function getXIndexByXPoint(xPoint) {
  return (xPoint - xPointMin) / xPointUnit;
}

function getYIndexByYPoint(yPoint) {
  return (yPointMax - yPoint) / yPointUnit;
}

function getXCoorByXIndex(xIndex) {
  return chartPaddingLeft + xIndex * squareEdge;
}

function getYCoorByYIndex(yIndex) {
  return chartPaddingTop + yIndex * squareEdge;
}
