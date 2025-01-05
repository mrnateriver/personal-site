import { normalizeColor, type Color, type CssColor } from './colors';
import { normalizeCssValue } from './styles';

export interface BoxSurfaceColors {
  top: Color;
  bottom: Color;
  front: Color;
  back: Color;
  left: Color;
  right: Color;
}

export interface BoxDimensions {
  wx: string | number;
  wy: string | number;
  wz: string | number;
}

export interface BoxProps {
  size: string | number | BoxDimensions;
  surfaceColor?: Color | ({ all: Color } & Partial<BoxSurfaceColors>) | BoxSurfaceColors;
}

export function getBoxStyleVars(props: BoxProps): Record<string, string> {
  const { size } = props;

  let wx: string, wy: string, wz: string;
  if (typeof size === 'number' || typeof size === 'string') {
    wx = wy = wz = normalizeCssValue(size, 'px');
  } else {
    wx = normalizeCssValue(size.wx, 'px');
    wy = normalizeCssValue(size.wy, 'px');
    wz = normalizeCssValue(size.wz, 'px');
  }

  let surfaceColor = props.surfaceColor ?? { all: 'red' };
  if (typeof surfaceColor === 'number' || typeof surfaceColor === 'string') {
    surfaceColor = { all: surfaceColor };
  }

  const typedColors = surfaceColor as Record<string, Color>;
  const colorVariables: Record<string, CssColor> = {};

  const setColor = (key: keyof typeof typedColors, varSuffix: string): void => {
    const color = normalizeColor(typedColors[key]);
    if (color) {
      colorVariables[`--s${varSuffix}`] = color;
    }
  };

  setColor('all', 'a');
  setColor('top', 't');
  setColor('bottom', 'b');
  setColor('front', 'f');
  setColor('back', 'bk');
  setColor('left', 'l');
  setColor('right', 'r');

  if (Object.keys(colorVariables).length === 0) {
    colorVariables['--sa'] = 'black';
  }

  return {
    '--wx': wx,
    '--wy': wy,
    '--wz': wz,
    ...colorVariables,
  };
}
