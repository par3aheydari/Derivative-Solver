const canvas = document.getElementById('derivativeCanvas');
const ctx = canvas.getContext('2d');

function parsePolynomial(polyStr) {
  const terms = polyStr.split(/(?=[+-])/);
  const poly = [];
  for (let term of terms) {
    term = term.replace(/\s+/g, '');
    const match = term.match(/^([+-]?\d*)\*?x\^?(\d*)$/);
    if (match) {
      let coef = match[1] ? parseFloat(match[1]) : 1;
      let exp = match[2] ? parseInt(match[2]) : 1;
      poly.push({coef, exp});
    } else if (!term.includes('x')) {
      poly.push({coef: parseFloat(term), exp: 0});
    }
  }
  return poly;
}

function derivative(poly) {
  return poly.map(t => ({coef: t.coef * t.exp, exp: t.exp - 1}))
             .filter(t => t.coef !== 0);
}

function polyToString(poly) {
  return poly.map(t => {
    if (t.exp === 0) return t.coef.toString();
    if (t.exp === 1) return `${t.coef}*x`;
    return `${t.coef}*x^${t.exp}`;
  }).join(' + ').replace(/\+\s-/g, '- ');
}

function calculateDerivative() {
  const input = document.getElementById('functionInput').value;
  const poly = parsePolynomial(input);
  const deriv = derivative(poly);
  document.getElementById('derivativeOutput').innerText = polyToString(deriv);
  drawGraph(poly, deriv);
}

function drawGraph(poly, deriv) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;

  // axes
  ctx.beginPath();
  ctx.moveTo(0, canvas.height/2);
  ctx.lineTo(canvas.width, canvas.height/2);
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();

  function evalPoly(poly, x) {
    return poly.reduce((sum, t) => sum + t.coef * Math.pow(x, t.exp), 0);
  }

  function plot(poly, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for(let i=0;i<canvas.width;i++){
      const x = (i - canvas.width/2)/20;
      const y = evalPoly(poly, x);
      const py = canvas.height/2 - y*20;
      if(i===0) ctx.moveTo(i, py);
      else ctx.lineTo(i, py);
    }
    ctx.stroke();
  }

  plot(poly, '#ff8800');  // original function
  plot(deriv, '#44ff44'); // derivative
}
