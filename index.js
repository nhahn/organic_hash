var SHA256 = require("crypto-js/sha256");
var fs = require("fs");
var path = require("path");

var NOUN = fs.readFileSync(path.join(__dirname, 'data', 'noun.dat')).toString().split('\n');
var ADJ = fs.readFileSync(path.join(__dirname, 'data', 'adj.dat')).toString().split('\n');
var ADV = fs.readFileSync(path.join(__dirname, 'data', 'adv.dat')).toString().split('\n');

// Adds two arrays for the given base (10 or 16), returning the result.
// This turns out to be the only "primitive" operation we need.
function add(x, y, base) {
  var z = [];
  var n = Math.max(x.length, y.length);
  var carry = 0;
  var i = 0;
  while (i < n || carry) {
    var xi = i < x.length ? x[i] : 0;
    var yi = i < y.length ? y[i] : 0;
    var zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i++;
  }
  return z;
}

// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
function multiplyByNumber(num, x, base) {
  if (num < 0) return null;
  if (num == 0) return [];

  var result = [];
  var power = x;
  while (true) {
    if (num & 1) {
      result = add(result, power, base);
    }
    num = num >> 1;
    if (num === 0) break;
    power = add(power, power, base);
  }

  return result;
}

function parseToDigitsArray(str, base) {
  var digits = str.split('');
  var ary = [];
  for (var i = digits.length - 1; i >= 0; i--) {
    var n = parseInt(digits[i], base);
    if (isNaN(n)) return null;
    ary.push(n);
  }
  return ary;
}

function convertBase(str, fromBase, toBase) {
  var digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;

  var outArray = [];
  var power = [1];
  for (var i = 0; i < digits.length; i++) {
    // invariant: at this point, fromBase^i = power
    if (digits[i]) {
      outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
    }
    power = multiplyByNumber(fromBase, power, toBase);
  }

  var out = '';
  for (var i = outArray.length - 1; i >= 0; i--) {
    out += outArray[i].toString(toBase);
  }
  return out;
}

function decToHex(decStr) {
  var hex = convertBase(decStr, 10, 16);
  return hex ? '0x' + hex : null;
}

function hexToDec(hexStr) {
  if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2);
  hexStr = hexStr.toLowerCase();
  return convertBase(hexStr, 16, 10);
}

module.exports = function(length, delimiter, hasher, noun, adj, adv) {
  length = typeof length !== 'undefined' ? length : 3; 
  delimiter = typeof delimiter !== 'undefined' ? delimiter : "-";
  hasher = typeof hasher !== 'undefined' ? hasher : SHA256;
  noun = typeof noun !== 'undefined' ? noun : NOUN;
  adj = typeof adj !== 'undefined' ? adj : ADJ;
  adv = typeof adv !== 'undefined' ? adv : ADV;

  var str2indexes = function(hex) {
    var sha1 = hasher(hex).toString();
    console.log(sha1);
    var seg = sha1.length / length;
    var rem = sha1.length % length;

    var retVal = [];
    for (var i = 0; i < length; i++) {
      retVal.push(parseInt(hexToDec(sha1.substring(seg*i, seg*(i+1)))));
    }
    return retVal;
  };

  hash = function(str) {
    var indexes = str2indexes(str);
    var noun_idx = indexes.pop();
    var output = [];
    for (var i = 0; i < indexes.length; i++) {
      if (i % 2 == 0) 
        output.push(adv[indexes[i] % adv.length]);
      else
        output.push(adj[indexes[i] % adj.length]);
    }
    output.push(noun[noun_idx % noun.length]);
    return output.join(delimiter);
  };

  return {
    hash: hash,
    rand: function() {
      var buf = crypto.randomBytes(256);
      return hash(buf.toString());
    }
  };
}
