import type * as CSS from 'csstype';

import { isCssVariable, type CssVariable } from './styles';

export type CssColor = CssVariable | CSS.DataType.Color;
export type Color = number | CssColor;

interface RGBA {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
  a: number; // 0 - 1
}

interface HSLA {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
  a: number; // 0 - 1
}

export function normalizeColor(color?: Color): CssColor | undefined {
  if (typeof color === 'undefined') {
    return undefined;
  }

  if (typeof color === 'number') {
    return stringifyColor({
      r: (color >> 24) & 0xff,
      g: (color >> 16) & 0xff,
      b: (color >> 8) & 0xff,
      a: (color & 0xff) / 255,
    });
  }

  if (typeof color === 'string') {
    if (color in namedColors) {
      return normalizeColor(namedColors[color]);
    }

    if (isCssVariable(color)) {
      return color;
    }

    if (color.startsWith('#')) {
      // #rgb
      if (color.length === 4) {
        const r = parseInt(color[1], 16);
        const g = parseInt(color[2], 16);
        const b = parseInt(color[3], 16);
        return stringifyColor({ r: r * 17, g: g * 17, b: b * 17, a: 1 });
      }

      // #rrggbb / #rrggbbaa
      if (color.length >= 7) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const a = color.length > 7 ? parseInt(color.slice(7, 9), 16) : 255;
        return stringifyColor({ r, g, b, a: a / 255 });
      }
    } else {
      // rgb(r, g, b) / rgba(r, g, b, a) / rgba(r g b a) / rgb(r g b) / rgba(r g b / a)
      if (color.startsWith('rgb')) {
        const [r, g, b, a] = parseColorParens(color);
        return stringifyColor({ r, g, b, a: a ?? 1 });
      }

      // hsl(h, s, l) / hsla(h, s, l, a) / hsla(h s l a) / hsl(h s l) / hsla(h s l / a)
      if (color.startsWith('hsl')) {
        const [h, s, l, a] = parseColorParens(color);
        return stringifyColor(convertHSLAToRGBA({ h, s, l, a: a ?? 1 }));
      }
    }
  }

  throw new Error(`Unsupported color format: ${color}.`);
}

function parseColorParens(color: string): [number, number, number, number] {
  let alphaCoef = true;
  if (color.includes('/')) {
    color = color.replace('/', ',');
    if (color.includes('%')) {
      alphaCoef = false;
    }
  }

  return color
    .slice(color.indexOf('(') + 1, -1)
    .replaceAll(/\s+/, ',')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .map((x, i) => (i === 3 ? (alphaCoef ? 1 : 0.01) : 1) * parseFloat(x)) as ReturnType<typeof parseColorParens>;
}

function stringifyColor(color: RGBA): string {
  return `#${convertRGBATo32Bit(color).toString(16).padStart(8, '0')}`;
}

function convertRGBATo32Bit(color: RGBA): number {
  const { r, g, b, a } = color;

  return ((r << 24) | (g << 16) | (b << 8) | Math.round(a * 255)) >>> 0;
}

function convertHSLAToRGBA(color: HSLA): RGBA {
  let { h, s, l, a } = color;

  // Must be fractions of 1
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b, a };
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
  cyan: 0x00ffffff,
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
