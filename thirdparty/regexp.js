define(function(require, exports, module) {
function parse(n) {
  if ("string" != typeof n) {
    var t = new TypeError("The regexp to parse must be represented as a string.");
    throw t;
  }
  index = 1, cgs = {}, result = parser.parse(n);
  for (var l = 0; l < n.length; l++) cgs[l] && (cgs[l].index = index++);
  return result;
}

function Token(n) {
  this.type = n, this.offset = Token.offset(), this.text = Token.text();
}

function Alternate(n, t) {
  Token.call(this, "alternate"), this.left = n, this.right = t;
}

function Match(n) {
  Token.call(this, "match"), this.body = n.filter(Boolean);
}

function Group(n, t) {
  Token.call(this, n), this.body = t;
}

function CaptureGroup(n, t) {
  Group.call(this, "capture-group"), cgs[this.offset] = this, this.body = n, t && (this.name = t[0] + t[1].join(""));
}

function Quantified(n, t) {
  Token.call(this, "quantified"), this.body = n, this.quantifier = t;
}

function Quantifier(n, t) {
  Token.call(this, "quantifier"), this.min = n, this.max = t, this.greedy = !0;
}

function CharSet(n, t) {
  Token.call(this, "charset"), this.invert = n, this.body = t;
}

function CharacterRange(n, t) {
  Token.call(this, "range"), this.start = n, this.end = t;
}

function CharacterClass(n, t) {
  Token.call(this, "charclass"), this.start = n, this.end = t;
}

function Literal(n) {
  Token.call(this, "literal"), this.body = n, this.escaped = this.body != this.text;
}

function Unicode(n) {
  Token.call(this, "unicode"), this.code = n.toUpperCase();
}

function Hex(n) {
  Token.call(this, "hex"), this.code = n.toUpperCase();
}

function Octal(n) {
  Token.call(this, "octal"), this.code = n.toUpperCase();
}

function BackReference(n) {
  Token.call(this, "back-reference"), this.code = n.toUpperCase();
}

function ControlCharacter(n) {
  Token.call(this, "control-character"), this.code = n.toUpperCase();
}

var parser = function() {
  function n(n, t) {
    function l() {
      this.constructor = n;
    }
    l.prototype = t.prototype, n.prototype = new l();
  }
  function t(n, t, l, r, u) {
    function e(n, t) {
      function l(n) {
        function t(n) {
          return n.charCodeAt(0).toString(16).toUpperCase();
        }
        return n.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(n) {
          return "\\x0" + t(n);
        }).replace(/[\x10-\x1F\x80-\xFF]/g, function(n) {
          return "\\x" + t(n);
        }).replace(/[\u0180-\u0FFF]/g, function(n) {
          return "\\u0" + t(n);
        }).replace(/[\u1080-\uFFFF]/g, function(n) {
          return "\\u" + t(n);
        });
      }
      var r, u;
      switch (n.length) {
       case 0:
        r = "end of input";
        break;

       case 1:
        r = n[0];
        break;

       default:
        r = n.slice(0, -1).join(", ") + " or " + n[n.length - 1];
      }
      return u = t ? '"' + l(t) + '"' : "end of input", "Expected " + r + " but " + u + " found.";
    }
    this.expected = n, this.found = t, this.offset = l, this.line = r, this.column = u, 
    this.name = "SyntaxError", this.message = e(n, t);
  }
  function l(n) {
    function l() {
      return n.substring(Vu, Nu);
    }
    function r() {
      return Vu;
    }
    function u(t) {
      function l(t, l, r) {
        var u, e;
        for (u = l; r > u; u++) e = n.charAt(u), "\n" === e ? (t.seenCR || t.line++, t.column = 1, 
        t.seenCR = !1) : "\r" === e || "\u2028" === e || "\u2029" === e ? (t.line++, t.column = 1, 
        t.seenCR = !0) : (t.column++, t.seenCR = !1);
      }
      return Xu !== t && (Xu > t && (Xu = 0, Yu = {
        line: 1,
        column: 1,
        seenCR: !1
      }), l(Yu, Xu, t), Xu = t), Yu;
    }
    function e(n) {
      ne > Nu || (Nu > ne && (ne = Nu, te = []), te.push(n));
    }
    function o(n) {
      var t = 0;
      for (n.sort(); t < n.length; ) n[t - 1] === n[t] ? n.splice(t, 1) : t++;
    }
    function c() {
      var t, l, r, u, o;
      return t = Nu, l = a(), null !== l ? (r = Nu, 124 === n.charCodeAt(Nu) ? (u = At, 
      Nu++) : (u = null, 0 === le && e(yt)), null !== u ? (o = c(), null !== o ? (u = [ u, o ], 
      r = u) : (Nu = r, r = vt)) : (Nu = r, r = vt), null === r && (r = kt), null !== r ? (Vu = t, 
      l = wt(l, r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, t = vt)) : (Nu = t, 
      t = vt), t;
    }
    function a() {
      var n, t, l, r, u;
      if (n = Nu, t = s(), null === t && (t = kt), null !== t) if (l = Nu, le++, r = h(), 
      le--, null === r ? l = kt : (Nu = l, l = vt), null !== l) {
        for (r = [], u = p(), null === u && (u = i()); null !== u; ) r.push(u), u = p(), 
        null === u && (u = i());
        null !== r ? (u = f(), null === u && (u = kt), null !== u ? (Vu = n, t = gt(t, r, u), 
        null === t ? (Nu = n, n = t) : n = t) : (Nu = n, n = vt)) : (Nu = n, n = vt);
      } else Nu = n, n = vt; else Nu = n, n = vt;
      return n;
    }
    function i() {
      var n;
      return n = T(), null === n && (n = S(), null === n && (n = H())), n;
    }
    function s() {
      var t, l;
      return t = Nu, 94 === n.charCodeAt(Nu) ? (l = Tt, Nu++) : (l = null, 0 === le && e(xt)), 
      null !== l && (Vu = t, l = Rt()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function f() {
      var t, l;
      return t = Nu, 36 === n.charCodeAt(Nu) ? (l = mt, Nu++) : (l = null, 0 === le && e(Gt)), 
      null !== l && (Vu = t, l = Ot()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function p() {
      var n, t, l;
      return n = Nu, t = i(), null !== t ? (l = h(), null !== l ? (Vu = n, t = jt(t, l), 
      null === t ? (Nu = n, n = t) : n = t) : (Nu = n, n = vt)) : (Nu = n, n = vt), n;
    }
    function h() {
      var n, t, l;
      return le++, n = Nu, t = d(), null !== t ? (l = w(), null === l && (l = kt), null !== l ? (Vu = n, 
      t = Ft(t, l), null === t ? (Nu = n, n = t) : n = t) : (Nu = n, n = vt)) : (Nu = n, 
      n = vt), le--, null === n && (t = null, 0 === le && e(Qt)), n;
    }
    function d() {
      var n;
      return n = C(), null === n && (n = b(), null === n && (n = v(), null === n && (n = k(), 
      null === n && (n = A(), null === n && (n = y()))))), n;
    }
    function C() {
      var t, l, r, u, o, c;
      return t = Nu, 123 === n.charCodeAt(Nu) ? (l = St, Nu++) : (l = null, 0 === le && e(Ut)), 
      null !== l ? (r = g(), null !== r ? (44 === n.charCodeAt(Nu) ? (u = Bt, Nu++) : (u = null, 
      0 === le && e(Lt)), null !== u ? (o = g(), null !== o ? (125 === n.charCodeAt(Nu) ? (c = Mt, 
      Nu++) : (c = null, 0 === le && e(Et)), null !== c ? (Vu = t, l = Ht(r, o), null === l ? (Nu = t, 
      t = l) : t = l) : (Nu = t, t = vt)) : (Nu = t, t = vt)) : (Nu = t, t = vt)) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt), t;
    }
    function b() {
      var t, l, r, u;
      return t = Nu, 123 === n.charCodeAt(Nu) ? (l = St, Nu++) : (l = null, 0 === le && e(Ut)), 
      null !== l ? (r = g(), null !== r ? (n.substr(Nu, 2) === zt ? (u = zt, Nu += 2) : (u = null, 
      0 === le && e(Zt)), null !== u ? (Vu = t, l = $t(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt)) : (Nu = t, t = vt), t;
    }
    function v() {
      var t, l, r, u;
      return t = Nu, 123 === n.charCodeAt(Nu) ? (l = St, Nu++) : (l = null, 0 === le && e(Ut)), 
      null !== l ? (r = g(), null !== r ? (125 === n.charCodeAt(Nu) ? (u = Mt, Nu++) : (u = null, 
      0 === le && e(Et)), null !== u ? (Vu = t, l = _t(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt)) : (Nu = t, t = vt), t;
    }
    function k() {
      var t, l;
      return t = Nu, 43 === n.charCodeAt(Nu) ? (l = qt, Nu++) : (l = null, 0 === le && e(Dt)), 
      null !== l && (Vu = t, l = Pt()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function A() {
      var t, l;
      return t = Nu, 42 === n.charCodeAt(Nu) ? (l = Wt, Nu++) : (l = null, 0 === le && e(It)), 
      null !== l && (Vu = t, l = Jt()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function y() {
      var t, l;
      return t = Nu, 63 === n.charCodeAt(Nu) ? (l = Kt, Nu++) : (l = null, 0 === le && e(Nt)), 
      null !== l && (Vu = t, l = Vt()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function w() {
      var t;
      return 63 === n.charCodeAt(Nu) ? (t = Kt, Nu++) : (t = null, 0 === le && e(Nt)), 
      t;
    }
    function g() {
      var t, l, r;
      if (t = Nu, l = [], Xt.test(n.charAt(Nu)) ? (r = n.charAt(Nu), Nu++) : (r = null, 
      0 === le && e(Yt)), null !== r) for (;null !== r; ) l.push(r), Xt.test(n.charAt(Nu)) ? (r = n.charAt(Nu), 
      Nu++) : (r = null, 0 === le && e(Yt)); else l = vt;
      return null !== l && (Vu = t, l = nl(l)), null === l ? (Nu = t, t = l) : t = l, 
      t;
    }
    function T() {
      var t, l, r, u;
      return t = Nu, 40 === n.charCodeAt(Nu) ? (l = tl, Nu++) : (l = null, 0 === le && e(ll)), 
      null !== l ? (r = m(), null === r && (r = G(), null === r && (r = O(), null === r && (r = j(), 
      null === r && (r = Q(), null === r && (r = R(), null === r && (r = x())))))), null !== r ? (41 === n.charCodeAt(Nu) ? (u = rl, 
      Nu++) : (u = null, 0 === le && e(ul)), null !== u ? (Vu = t, l = el(r), null === l ? (Nu = t, 
      t = l) : t = l) : (Nu = t, t = vt)) : (Nu = t, t = vt)) : (Nu = t, t = vt), t;
    }
    function x() {
      var n, t;
      return n = Nu, t = c(), null !== t && (Vu = n, t = ol(t)), null === t ? (Nu = n, 
      n = t) : n = t, n;
    }
    function R() {
      var t, l, r;
      return t = Nu, n.substr(Nu, 2) === cl ? (l = cl, Nu += 2) : (l = null, 0 === le && e(al)), 
      null !== l ? (r = c(), null !== r ? (Vu = t, l = il(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt), t;
    }
    function m() {
      var t, l, r;
      return t = Nu, n.substr(Nu, 2) === sl ? (l = sl, Nu += 2) : (l = null, 0 === le && e(fl)), 
      null !== l ? (r = c(), null !== r ? (Vu = t, l = pl(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt), t;
    }
    function G() {
      var t, l, r;
      return t = Nu, n.substr(Nu, 2) === hl ? (l = hl, Nu += 2) : (l = null, 0 === le && e(dl)), 
      null !== l ? (r = c(), null !== r ? (Vu = t, l = Cl(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt), t;
    }
    function O() {
      var t, l, r;
      return t = Nu, n.substr(Nu, 3) === bl ? (l = bl, Nu += 3) : (l = null, 0 === le && e(vl)), 
      null !== l ? (r = c(), null !== r ? (Vu = t, l = kl(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt), t;
    }
    function j() {
      var t, l, r;
      return t = Nu, n.substr(Nu, 3) === Al ? (l = Al, Nu += 3) : (l = null, 0 === le && e(yl)), 
      null !== l ? (r = c(), null !== r ? (Vu = t, l = wl(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt), t;
    }
    function Q() {
      var t, l, r, u, o, a;
      if (t = Nu, l = F(), null !== l) {
        if (r = Nu, gl.test(n.charAt(Nu)) ? (u = n.charAt(Nu), Nu++) : (u = null, 0 === le && e(Tl)), 
        null !== u) {
          for (o = [], xl.test(n.charAt(Nu)) ? (a = n.charAt(Nu), Nu++) : (a = null, 0 === le && e(Rl)); null !== a; ) o.push(a), 
          xl.test(n.charAt(Nu)) ? (a = n.charAt(Nu), Nu++) : (a = null, 0 === le && e(Rl));
          null !== o ? (u = [ u, o ], r = u) : (Nu = r, r = vt);
        } else Nu = r, r = vt;
        null !== r ? (62 === n.charCodeAt(Nu) ? (u = ml, Nu++) : (u = null, 0 === le && e(Gl)), 
        null !== u ? (o = c(), null !== o ? (Vu = t, l = Ol(r, o), null === l ? (Nu = t, 
        t = l) : t = l) : (Nu = t, t = vt)) : (Nu = t, t = vt)) : (Nu = t, t = vt);
      } else Nu = t, t = vt;
      return t;
    }
    function F() {
      var t;
      return n.substr(Nu, 3) === jl ? (t = jl, Nu += 3) : (t = null, 0 === le && e(Ql)), 
      null === t && (n.substr(Nu, 2) === Fl ? (t = Fl, Nu += 2) : (t = null, 0 === le && e(Sl))), 
      t;
    }
    function S() {
      var t, l, r, u, o;
      if (le++, t = Nu, 91 === n.charCodeAt(Nu) ? (l = Bl, Nu++) : (l = null, 0 === le && e(Ll)), 
      null !== l) if (94 === n.charCodeAt(Nu) ? (r = Tt, Nu++) : (r = null, 0 === le && e(xt)), 
      null === r && (r = kt), null !== r) {
        for (u = [], o = B(), null === o && (o = U(), null === o && (o = L())); null !== o; ) u.push(o), 
        o = B(), null === o && (o = U(), null === o && (o = L()));
        null !== u ? (93 === n.charCodeAt(Nu) ? (o = Ml, Nu++) : (o = null, 0 === le && e(El)), 
        null !== o ? (Vu = t, l = Hl(r, u), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
        t = vt)) : (Nu = t, t = vt);
      } else Nu = t, t = vt; else Nu = t, t = vt;
      return le--, null === t && (l = null, 0 === le && e(Ul)), t;
    }
    function U() {
      var t, l, r, u;
      return le++, t = Nu, l = L(), null !== l ? (45 === n.charCodeAt(Nu) ? (r = Zl, Nu++) : (r = null, 
      0 === le && e($l)), null !== r ? (u = L(), null !== u ? (Vu = t, l = _l(l, u), null === l ? (Nu = t, 
      t = l) : t = l) : (Nu = t, t = vt)) : (Nu = t, t = vt)) : (Nu = t, t = vt), le--, 
      null === t && (l = null, 0 === le && e(zl)), t;
    }
    function B() {
      var t, l, r, u;
      return le++, t = Nu, n.substr(Nu, 2) === Dl ? (l = Dl, Nu += 2) : (l = null, 0 === le && e(Pl)), 
      null !== l ? (n.substr(Nu, 5) === Wl ? (r = Wl, Nu += 5) : (r = null, 0 === le && e(Il)), 
      null === r && (n.substr(Nu, 5) === Jl ? (r = Jl, Nu += 5) : (r = null, 0 === le && e(Kl)), 
      null === r && (n.substr(Nu, 5) === Nl ? (r = Nl, Nu += 5) : (r = null, 0 === le && e(Vl)), 
      null === r && (n.substr(Nu, 5) === Xl ? (r = Xl, Nu += 5) : (r = null, 0 === le && e(Yl)), 
      null === r && (n.substr(Nu, 5) === nr ? (r = nr, Nu += 5) : (r = null, 0 === le && e(tr)), 
      null === r && (n.substr(Nu, 5) === lr ? (r = lr, Nu += 5) : (r = null, 0 === le && e(rr)), 
      null === r && (n.substr(Nu, 5) === ur ? (r = ur, Nu += 5) : (r = null, 0 === le && e(er)), 
      null === r && (n.substr(Nu, 5) === or ? (r = or, Nu += 5) : (r = null, 0 === le && e(cr)), 
      null === r && (n.substr(Nu, 5) === ar ? (r = ar, Nu += 5) : (r = null, 0 === le && e(ir)), 
      null === r && (n.substr(Nu, 5) === sr ? (r = sr, Nu += 5) : (r = null, 0 === le && e(fr)), 
      null === r && (n.substr(Nu, 5) === pr ? (r = pr, Nu += 5) : (r = null, 0 === le && e(hr)), 
      null === r && (n.substr(Nu, 6) === dr ? (r = dr, Nu += 6) : (r = null, 0 === le && e(Cr))))))))))))), 
      null !== r ? (n.substr(Nu, 2) === br ? (u = br, Nu += 2) : (u = null, 0 === le && e(vr)), 
      null !== u ? (Vu = t, l = kr(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt)) : (Nu = t, t = vt), le--, null === t && (l = null, 
      0 === le && e(ql)), t;
    }
    function L() {
      var n, t;
      return le++, n = E(), null === n && (n = M()), le--, null === n && (t = null, 0 === le && e(Ar)), 
      n;
    }
    function M() {
      var t, l;
      return t = Nu, yr.test(n.charAt(Nu)) ? (l = n.charAt(Nu), Nu++) : (l = null, 0 === le && e(wr)), 
      null !== l && (Vu = t, l = gr(l)), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function E() {
      var n;
      return n = _(), null === n && (n = ot(), null === n && (n = K(), null === n && (n = N(), 
      null === n && (n = V(), null === n && (n = X(), null === n && (n = Y(), null === n && (n = nt(), 
      null === n && (n = tt(), null === n && (n = lt(), null === n && (n = rt(), null === n && (n = ut(), 
      null === n && (n = et(), null === n && (n = at(), null === n && (n = it(), null === n && (n = st(), 
      null === n && (n = ft(), null === n && (n = pt()))))))))))))))))), n;
    }
    function H() {
      var n;
      return n = z(), null === n && (n = $(), null === n && (n = Z())), n;
    }
    function z() {
      var t, l;
      return t = Nu, 46 === n.charCodeAt(Nu) ? (l = Tr, Nu++) : (l = null, 0 === le && e(xr)), 
      null !== l && (Vu = t, l = Rr()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function Z() {
      var t, l;
      return le++, t = Nu, Gr.test(n.charAt(Nu)) ? (l = n.charAt(Nu), Nu++) : (l = null, 
      0 === le && e(Or)), null !== l && (Vu = t, l = gr(l)), null === l ? (Nu = t, t = l) : t = l, 
      le--, null === t && (l = null, 0 === le && e(mr)), t;
    }
    function $() {
      var n;
      return n = q(), null === n && (n = J(), null === n && (n = D(), null === n && (n = P(), 
      null === n && (n = W(), null === n && (n = I(), null === n && (n = ot(), null === n && (n = K(), 
      null === n && (n = N(), null === n && (n = V(), null === n && (n = X(), null === n && (n = Y(), 
      null === n && (n = nt(), null === n && (n = tt(), null === n && (n = lt(), null === n && (n = rt(), 
      null === n && (n = ut(), null === n && (n = et(), null === n && (n = ct(), null === n && (n = at(), 
      null === n && (n = it(), null === n && (n = st(), null === n && (n = ft(), null === n && (n = pt()))))))))))))))))))))))), 
      n;
    }
    function _() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === jr ? (l = jr, Nu += 2) : (l = null, 0 === le && e(Qr)), 
      null !== l && (Vu = t, l = Fr()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function q() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === jr ? (l = jr, Nu += 2) : (l = null, 0 === le && e(Qr)), 
      null !== l && (Vu = t, l = Sr()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function D() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === Ur ? (l = Ur, Nu += 2) : (l = null, 0 === le && e(Br)), 
      null !== l && (Vu = t, l = Lr()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function P() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === Mr ? (l = Mr, Nu += 2) : (l = null, 0 === le && e(Er)), 
      null !== l && (Vu = t, l = Hr()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function W() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === zr ? (l = zr, Nu += 2) : (l = null, 0 === le && e(Zr)), 
      null !== l && (Vu = t, l = $r()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function I() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === _r ? (l = _r, Nu += 2) : (l = null, 0 === le && e(qr)), 
      null !== l && (Vu = t, l = Dr()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function J() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === Pr ? (l = Pr, Nu += 2) : (l = null, 0 === le && e(Wr)), 
      null !== l && (Vu = t, l = Ir()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function K() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === Jr ? (l = Jr, Nu += 2) : (l = null, 0 === le && e(Kr)), 
      null !== l && (Vu = t, l = Nr()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function N() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === Vr ? (l = Vr, Nu += 2) : (l = null, 0 === le && e(Xr)), 
      null !== l && (Vu = t, l = Yr()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function V() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === nu ? (l = nu, Nu += 2) : (l = null, 0 === le && e(tu)), 
      null !== l && (Vu = t, l = lu()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function X() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === ru ? (l = ru, Nu += 2) : (l = null, 0 === le && e(uu)), 
      null !== l && (Vu = t, l = eu()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function Y() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === ou ? (l = ou, Nu += 2) : (l = null, 0 === le && e(cu)), 
      null !== l && (Vu = t, l = au()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function nt() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === iu ? (l = iu, Nu += 2) : (l = null, 0 === le && e(su)), 
      null !== l && (Vu = t, l = fu()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function tt() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === pu ? (l = pu, Nu += 2) : (l = null, 0 === le && e(hu)), 
      null !== l && (Vu = t, l = du()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function lt() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === Cu ? (l = Cu, Nu += 2) : (l = null, 0 === le && e(bu)), 
      null !== l && (Vu = t, l = vu()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function rt() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === ku ? (l = ku, Nu += 2) : (l = null, 0 === le && e(Au)), 
      null !== l && (Vu = t, l = yu()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function ut() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === wu ? (l = wu, Nu += 2) : (l = null, 0 === le && e(gu)), 
      null !== l && (Vu = t, l = Tu()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function et() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === xu ? (l = xu, Nu += 2) : (l = null, 0 === le && e(Ru)), 
      null !== l && (Vu = t, l = mu()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function ot() {
      var t, l, r;
      return t = Nu, n.substr(Nu, 2) === Gu ? (l = Gu, Nu += 2) : (l = null, 0 === le && e(Ou)), 
      null !== l ? (n.length > Nu ? (r = n.charAt(Nu), Nu++) : (r = null, 0 === le && e(ju)), 
      null !== r ? (Vu = t, l = Qu(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt), t;
    }
    function ct() {
      var t, l, r;
      return t = Nu, 92 === n.charCodeAt(Nu) ? (l = Fu, Nu++) : (l = null, 0 === le && e(Su)), 
      null !== l ? (Uu.test(n.charAt(Nu)) ? (r = n.charAt(Nu), Nu++) : (r = null, 0 === le && e(Bu)), 
      null !== r ? (Vu = t, l = Lu(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt), t;
    }
    function at() {
      var t, l, r, u;
      if (t = Nu, n.substr(Nu, 2) === Mu ? (l = Mu, Nu += 2) : (l = null, 0 === le && e(Eu)), 
      null !== l) {
        if (r = [], Hu.test(n.charAt(Nu)) ? (u = n.charAt(Nu), Nu++) : (u = null, 0 === le && e(zu)), 
        null !== u) for (;null !== u; ) r.push(u), Hu.test(n.charAt(Nu)) ? (u = n.charAt(Nu), 
        Nu++) : (u = null, 0 === le && e(zu)); else r = vt;
        null !== r ? (Vu = t, l = Zu(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
        t = vt);
      } else Nu = t, t = vt;
      return t;
    }
    function it() {
      var t, l, r, u;
      if (t = Nu, n.substr(Nu, 2) === $u ? (l = $u, Nu += 2) : (l = null, 0 === le && e(_u)), 
      null !== l) {
        if (r = [], qu.test(n.charAt(Nu)) ? (u = n.charAt(Nu), Nu++) : (u = null, 0 === le && e(Du)), 
        null !== u) for (;null !== u; ) r.push(u), qu.test(n.charAt(Nu)) ? (u = n.charAt(Nu), 
        Nu++) : (u = null, 0 === le && e(Du)); else r = vt;
        null !== r ? (Vu = t, l = Pu(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
        t = vt);
      } else Nu = t, t = vt;
      return t;
    }
    function st() {
      var t, l, r, u;
      if (t = Nu, n.substr(Nu, 2) === Wu ? (l = Wu, Nu += 2) : (l = null, 0 === le && e(Iu)), 
      null !== l) {
        if (r = [], qu.test(n.charAt(Nu)) ? (u = n.charAt(Nu), Nu++) : (u = null, 0 === le && e(Du)), 
        null !== u) for (;null !== u; ) r.push(u), qu.test(n.charAt(Nu)) ? (u = n.charAt(Nu), 
        Nu++) : (u = null, 0 === le && e(Du)); else r = vt;
        null !== r ? (Vu = t, l = Ju(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
        t = vt);
      } else Nu = t, t = vt;
      return t;
    }
    function ft() {
      var t, l;
      return t = Nu, n.substr(Nu, 2) === Mu ? (l = Mu, Nu += 2) : (l = null, 0 === le && e(Eu)), 
      null !== l && (Vu = t, l = Ku()), null === l ? (Nu = t, t = l) : t = l, t;
    }
    function pt() {
      var t, l, r;
      return t = Nu, 92 === n.charCodeAt(Nu) ? (l = Fu, Nu++) : (l = null, 0 === le && e(Su)), 
      null !== l ? (n.length > Nu ? (r = n.charAt(Nu), Nu++) : (r = null, 0 === le && e(ju)), 
      null !== r ? (Vu = t, l = gr(r), null === l ? (Nu = t, t = l) : t = l) : (Nu = t, 
      t = vt)) : (Nu = t, t = vt), t;
    }
    var ht, dt = arguments.length > 1 ? arguments[1] : {}, Ct = {
      regexp: c
    }, bt = c, vt = null, kt = "", At = "|", yt = '"|"', wt = function(n, t) {
      return t ? new Alternate(n, t[1]) : n;
    }, gt = function(n, t, l) {
      return new Match([ n ].concat(t).concat([ l ]));
    }, Tt = "^", xt = '"^"', Rt = function() {
      return new Token("start");
    }, mt = "$", Gt = '"$"', Ot = function() {
      return new Token("end");
    }, jt = function(n, t) {
      return new Quantified(n, t);
    }, Qt = "Quantifier", Ft = function(n, t) {
      return t && (n.greedy = !1), n;
    }, St = "{", Ut = '"{"', Bt = ",", Lt = '","', Mt = "}", Et = '"}"', Ht = function(n, t) {
      return new Quantifier(n, t);
    }, zt = ",}", Zt = '",}"', $t = function(n) {
      return new Quantifier(n, 1/0);
    }, _t = function(n) {
      return new Quantifier(n, n);
    }, qt = "+", Dt = '"+"', Pt = function() {
      return new Quantifier(1, 1/0);
    }, Wt = "*", It = '"*"', Jt = function() {
      return new Quantifier(0, 1/0);
    }, Kt = "?", Nt = '"?"', Vt = function() {
      return new Quantifier(0, 1);
    }, Xt = /^[0-9]/, Yt = "[0-9]", nl = function(n) {
      return +n.join("");
    }, tl = "(", ll = '"("', rl = ")", ul = '")"', el = function(n) {
      return n;
    }, ol = function(n) {
      return new CaptureGroup(n);
    }, cl = "?:", al = '"?:"', il = function(n) {
      return new Group("non-capture-group", n);
    }, sl = "?=", fl = '"?="', pl = function(n) {
      return new Group("positive-lookahead", n);
    }, hl = "?!", dl = '"?!"', Cl = function(n) {
      return new Group("negative-lookahead", n);
    }, bl = "?<=", vl = '"?<="', kl = function(n) {
      return new Group("positive-lookbehind", n);
    }, Al = "?<!", yl = '"?<!"', wl = function(n) {
      return new Group("negative-lookbehind", n);
    }, gl = /^[A-Za-z_]/, Tl = "[A-Za-z_]", xl = /^[A-Za-z0-9_]/, Rl = "[A-Za-z0-9_]", ml = ">", Gl = '">"', Ol = function(n, t) {
      return new CaptureGroup(t, n);
    }, jl = "?P<", Ql = '"?P<"', Fl = "?<", Sl = '"?<"', Ul = "CharacterSet", Bl = "[", Ll = '"["', Ml = "]", El = '"]"', Hl = function(n, t) {
      return new CharSet(!!n, t);
    }, zl = "CharacterRange", Zl = "-", $l = '"-"', _l = function(n, t) {
      return new CharacterRange(n, t);
    }, ql = "CharacterClass", Dl = "[:", Pl = '"[:"', Wl = "alnum", Il = '"alnum"', Jl = "alpha", Kl = '"alpha"', Nl = "blank", Vl = '"blank"', Xl = "cntrl", Yl = '"cntrl"', nr = "digit", tr = '"digit"', lr = "lower", rr = '"lower"', ur = "upper", er = '"upper"', or = "graph", cr = '"graph"', ar = "print", ir = '"print"', sr = "punct", fr = '"punct"', pr = "space", hr = '"space"', dr = "xdigit", Cr = '"xdigit"', br = ":]", vr = '":]"', kr = function(n) {
      return new CharacterClass(n);
    }, Ar = "Character", yr = /^[^\\\]]/, wr = "[^\\\\\\]]", gr = function(n) {
      return new Literal(n);
    }, Tr = ".", xr = '"."', Rr = function() {
      return new Token("any-character");
    }, mr = "Literal", Gr = /^[^|\\.[()?+*$\^]/, Or = "[^|\\\\.[()?+*$\\^]", jr = "\\b", Qr = '"\\\\b"', Fr = function() {
      return new Token("backspace");
    }, Sr = function() {
      return new Token("word-boundary");
    }, Ur = "\\A", Br = '"\\\\A"', Lr = function() {
      return new Token("begin-of-string");
    }, Mr = "\\Z", Er = '"\\\\Z"', Hr = function() {
      return new Token("end-of-string-before-nl");
    }, zr = "\\z", Zr = '"\\\\z"', $r = function() {
      return new Token("end-of-string");
    }, _r = "\\G", qr = '"\\\\G"', Dr = function() {
      return new Token("match-start-position");
    }, Pr = "\\B", Wr = '"\\\\B"', Ir = function() {
      return new Token("non-word-boundary");
    }, Jr = "\\d", Kr = '"\\\\d"', Nr = function() {
      return new Token("digit");
    }, Vr = "\\D", Xr = '"\\\\D"', Yr = function() {
      return new Token("non-digit");
    }, nu = "\\f", tu = '"\\\\f"', lu = function() {
      return new Token("form-feed");
    }, ru = "\\n", uu = '"\\\\n"', eu = function() {
      return new Token("line-feed");
    }, ou = "\\r", cu = '"\\\\r"', au = function() {
      return new Token("carriage-return");
    }, iu = "\\s", su = '"\\\\s"', fu = function() {
      return new Token("white-space");
    }, pu = "\\S", hu = '"\\\\S"', du = function() {
      return new Token("non-white-space");
    }, Cu = "\\t", bu = '"\\\\t"', vu = function() {
      return new Token("tab");
    }, ku = "\\v", Au = '"\\\\v"', yu = function() {
      return new Token("vertical-tab");
    }, wu = "\\w", gu = '"\\\\w"', Tu = function() {
      return new Token("word");
    }, xu = "\\W", Ru = '"\\\\W"', mu = function() {
      return new Token("non-word");
    }, Gu = "\\c", Ou = '"\\\\c"', ju = "any character", Qu = function(n) {
      return new ControlCharacter(n);
    }, Fu = "\\", Su = '"\\\\"', Uu = /^[1-9]/, Bu = "[1-9]", Lu = function(n) {
      return new BackReference(n);
    }, Mu = "\\0", Eu = '"\\\\0"', Hu = /^[0-7]/, zu = "[0-7]", Zu = function(n) {
      return new Octal(n.join(""));
    }, $u = "\\x", _u = '"\\\\x"', qu = /^[0-9a-fA-F]/, Du = "[0-9a-fA-F]", Pu = function(n) {
      return new Hex(n.join(""));
    }, Wu = "\\u", Iu = '"\\\\u"', Ju = function(n) {
      return new Unicode(n.join(""));
    }, Ku = function() {
      return new Token("null-character");
    }, Nu = 0, Vu = 0, Xu = 0, Yu = {
      line: 1,
      column: 1,
      seenCR: !1
    }, ne = 0, te = [], le = 0;
    if ("startRule" in dt) {
      if (!(dt.startRule in Ct)) throw new Error("Can't start parsing from rule \"" + dt.startRule + '".');
      bt = Ct[dt.startRule];
    }
    if (Token.offset = r, Token.text = l, ht = bt(), null !== ht && Nu === n.length) return ht;
    throw o(te), Vu = Math.max(Nu, ne), new t(te, Vu < n.length ? n.charAt(Vu) : null, Vu, u(Vu).line, u(Vu).column);
  }
  return n(t, Error), {
    SyntaxError: t,
    parse: l
  };
}(), index = 1, cgs = {};

exports = module.exports = parse, exports.Token = Token, exports.Alternate = Alternate, 
Alternate.prototype = Object.create(Token.prototype), Alternate.prototype.constructor = Alternate, 
exports.Match = Match, Match.prototype = Object.create(Token.prototype), Match.prototype.constructor = Match, 
exports.Group = Group, Group.prototype = Object.create(Token.prototype), Group.prototype.constructor = Group, 
exports.CaptureGroup = CaptureGroup, CaptureGroup.prototype = Object.create(Group.prototype), 
CaptureGroup.prototype.constructor = CaptureGroup, exports.Quantified = Quantified, 
Quantified.prototype = Object.create(Token.prototype), Quantified.prototype.constructor = Quantified, 
exports.Quantifier = Quantifier, Quantifier.prototype = Object.create(Token.prototype), 
Quantifier.prototype.constructor = Quantifier, exports.CharSet = CharSet, CharSet.prototype = Object.create(Token.prototype), 
CharSet.prototype.constructor = CharSet, exports.CharacterRange = CharacterRange, 
CharacterRange.prototype = Object.create(Token.prototype), CharacterRange.prototype.constructor = CharacterRange, 
exports.CharacterClass = CharacterClass, CharacterClass.prototype = Object.create(Token.prototype), 
CharacterClass.prototype.constructor = CharacterClass, exports.Literal = Literal, 
Literal.prototype = Object.create(Token.prototype), Literal.prototype.constructor = Literal, 
exports.Unicode = Unicode, Unicode.prototype = Object.create(Token.prototype), Unicode.prototype.constructor = Unicode, 
exports.Hex = Hex, Hex.prototype = Object.create(Token.prototype), Hex.prototype.constructor = Hex, 
exports.Octal = Octal, Octal.prototype = Object.create(Token.prototype), Octal.prototype.constructor = Octal, 
exports.BackReference = BackReference, BackReference.prototype = Object.create(Token.prototype), 
BackReference.prototype.constructor = BackReference, exports.ControlCharacter = ControlCharacter, 
ControlCharacter.prototype = Object.create(Token.prototype), ControlCharacter.prototype.constructor = ControlCharacter;
});
