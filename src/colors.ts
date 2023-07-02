import type * as CSS from 'csstype';

export type Color = number | CSS.DataType.Color;

export interface RGBA {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
  a: number; // 0 - 1
}

export interface HSLA {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
  a: number; // 0 - 1
}

export function normalizeColor(color: Color): RGBA {
  if (typeof color === 'number') {
    return {
      r: (color >> 24) & 0xff,
      g: (color >> 16) & 0xff,
      b: (color >> 8) & 0xff,
      a: (color & 0xff) / 255,
    };
  }

  if (typeof color === 'string') {
    if (color.startsWith('#')) {
      // #rgb
      if (color.length === 4) {
        const r = parseInt(color[1], 16);
        const g = parseInt(color[2], 16);
        const b = parseInt(color[3], 16);
        return { r: r * 17, g: g * 17, b: b * 17, a: 1 };
      }

      // #rrggbb / #rrggbbaa
      if (color.length >= 7) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const a = color.length > 7 ? parseInt(color.slice(7, 9), 16) : 255;
        return { r, g, b, a: a / 255 };
      }
    } else {
      // rgb(r, g, b) / rgba(r, g, b, a)
      if (color.startsWith('rgb')) {
        const [r, g, b, a] = color
          .slice(color.indexOf('(') + 1, -1)
          .split(',')
          .map((x) => parseFloat(x.trim()));
        return { r, g, b, a: a ?? 1 };
      }

      // hsl(h, s, l) / hsla(h, s, l, a)
      if (color.startsWith('hsl')) {
        const [h, s, l, a] = color
          .slice(color.indexOf('(') + 1, -1)
          .split(',')
          .map((x) => parseFloat(x.trim()));

        return convertHSLAToRGBA({ h, s, l, a: a ?? 1 });
      }

      if (color in namedColors) {
        return normalizeColor(namedColors[color]);
      }
    }
  }

  throw new Error(`Unsupported color format: ${color}.`);
}

export function convertRGBAToHSLA(color: RGBA): HSLA {
  const { r, g, b, a } = color;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = (max + min) / 2;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100, a };
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export function convertHSLAToRGBA(color: HSLA): RGBA {
  let { h, s, l, a } = color;

  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255, a };
}

export function convertRGBATo32Bit(color: RGBA): number {
  const { r, g, b, a } = color;

  return (
    ((Math.round(r * 255) << 24) | (Math.round(g * 255) << 16) | (Math.round(b * 255) << 8) | Math.round(a * 255)) >>> 0
  );
}

export function lightenHSLAColor(color: HSLA, amount: number): HSLA {
  const newColor = { ...color };
  newColor.l = Math.min(newColor.l + amount, 100);
  return newColor;
}

export function darkenHSLAColor(color: HSLA, amount: number): HSLA {
  const newColor = { ...color };
  newColor.l = Math.max(newColor.l - amount, 0);
  return newColor;
}

const namedColors: Record<string, number> = {
  black: 0x000000ff,
  silver: 0xc0c0c0ff,
  gray: 0x808080ff,
  white: 0xffffffff,
  maroon: 0x800000ff,
  red: 0xff0000ff,
  purple: 0x800080ff,
  fuchsia: 0xff00ffff,
  green: 0x008000ff,
  lime: 0x00ff00ff,
  olive: 0x808000ff,
  yellow: 0xffff00ff,
  navy: 0x000080ff,
  blue: 0x0000ffff,
  teal: 0x008080ff,
  aqua: 0x00fffff,
  aliceblue: 0xf0f8ffff,
  antiquewhite: 0xfaebd7ff,
  aquamarine: 0x7fffd4ff,
  azure: 0xf0ffffff,
  beige: 0xf5f5dcff,
  bisque: 0xffe4c4ff,
  blanchedalmond: 0xffebcdff,
  blueviolet: 0x8a2be2ff,
  brown: 0xa52a2aff,
  burlywood: 0xdeb887ff,
  cadetblue: 0x5f9ea0ff,
  chartreuse: 0x7fff00ff,
  chocolate: 0xd2691eff,
  coral: 0xff7f50ff,
  cornflowerblue: 0x6495edff,
  cornsilk: 0xfff8dcff,
  crimson: 0xdc143cff,
  cyan: 0x00fffff,
  darkblue: 0x00008bff,
  darkcyan: 0x008b8bff,
  darkgoldenrod: 0xb8860bff,
  darkgray: 0xa9a9a9ff,
  darkgreen: 0x006400ff,
  darkgrey: 0xa9a9a9ff,
  darkkhaki: 0xbdb76bff,
  darkmagenta: 0x8b008bff,
  darkolivegreen: 0x556b2fff,
  darkorange: 0xff8c00ff,
  darkorchid: 0x9932ccff,
  darkred: 0x8b0000ff,
  darksalmon: 0xe9967aff,
  darkseagreen: 0x8fbc8fff,
  darkslateblue: 0x483d8bff,
  darkslategray: 0x2f4f4fff,
  darkslategrey: 0x2f4f4fff,
  darkturquoise: 0x00ced1ff,
  darkviolet: 0x9400d3ff,
  deeppink: 0xff1493ff,
  deepskyblue: 0x00bfffff,
  dimgray: 0x696969ff,
  dimgrey: 0x696969ff,
  dodgerblue: 0x1e90ffff,
  firebrick: 0xb22222ff,
  floralwhite: 0xfffaf0ff,
  forestgreen: 0x228b22ff,
  gainsboro: 0xdcdcdcff,
  ghostwhite: 0xf8f8ffff,
  gold: 0xffd700ff,
  goldenrod: 0xdaa520ff,
  greenyellow: 0xadff2fff,
  grey: 0x80808ff,
  honeydew: 0xf0fff0ff,
  hotpink: 0xff69b4ff,
  indianred: 0xcd5c5cff,
  indigo: 0x4b0082ff,
  ivory: 0xfffff0ff,
  khaki: 0xf0e68cff,
  lavender: 0xe6e6faff,
  lavenderblush: 0xfff0f5ff,
  lawngreen: 0x7cfc00ff,
  lemonchiffon: 0xfffacdff,
  lightblue: 0xadd8e6ff,
  lightcoral: 0xf08080ff,
  lightcyan: 0xe0ffffff,
  lightgoldenrodyellow: 0xfafad2ff,
  lightgray: 0xd3d3d3ff,
  lightgreen: 0x90ee90ff,
  lightgrey: 0xd3d3d3ff,
  lightpink: 0xffb6c1ff,
  lightsalmon: 0xffa07aff,
  lightseagreen: 0x20b2aaff,
  lightskyblue: 0x87cefaff,
  lightslategray: 0x778899ff,
  lightslategrey: 0x778899ff,
  lightsteelblue: 0xb0c4deff,
  lightyellow: 0xffffe0ff,
  limegreen: 0x32cd32ff,
  linen: 0xfaf0e6ff,
  magenta: 0xff00fff,
  mediumaquamarine: 0x66cdaaff,
  mediumblue: 0x0000cdff,
  mediumorchid: 0xba55d3ff,
  mediumpurple: 0x9370dbff,
  mediumseagreen: 0x3cb371ff,
  mediumslateblue: 0x7b68eeff,
  mediumspringgreen: 0x00fa9aff,
  mediumturquoise: 0x48d1ccff,
  mediumvioletred: 0xc71585ff,
  midnightblue: 0x191970ff,
  mintcream: 0xf5fffaff,
  mistyrose: 0xffe4e1ff,
  moccasin: 0xffe4b5ff,
  navajowhite: 0xffdeadff,
  oldlace: 0xfdf5e6ff,
  olivedrab: 0x6b8e23ff,
  orange: 0xffa500ff,
  orangered: 0xff4500ff,
  orchid: 0xda70d6ff,
  palegoldenrod: 0xeee8aaff,
  palegreen: 0x98fb98ff,
  paleturquoise: 0xafeeeeff,
  palevioletred: 0xdb7093ff,
  papayawhip: 0xffefd5ff,
  peachpuff: 0xffdab9ff,
  peru: 0xcd853fff,
  pink: 0xffc0cbff,
  plum: 0xdda0ddff,
  powderblue: 0xb0e0e6ff,
  rebeccapurple: 0x663399ff,
  rosybrown: 0xbc8f8fff,
  royalblue: 0x4169e1ff,
  saddlebrown: 0x8b4513ff,
  salmon: 0xfa8072ff,
  sandybrown: 0xf4a460ff,
  seagreen: 0x2e8b57ff,
  seashell: 0xfff5eeff,
  sienna: 0xa0522dff,
  skyblue: 0x87ceebff,
  slateblue: 0x6a5acdff,
  slategray: 0x708090ff,
  slategrey: 0x708090ff,
  snow: 0xfffafaff,
  springgreen: 0x00ff7fff,
  steelblue: 0x4682b4ff,
  tan: 0xd2b48cff,
  thistle: 0xd8bfd8ff,
  tomato: 0xff6347ff,
  turquoise: 0x40e0d0ff,
  violet: 0xee82eeff,
  wheat: 0xf5deb3ff,
  whitesmoke: 0xf5f5f5ff,
  yellowgreen: 0x9acd32ff,
  transparent: 0x00000000,
};
