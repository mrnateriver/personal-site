import { normalizeColor, type Color, type CssColor } from '../colors';

export interface BoxSurfaceColors {
  top: Color;
  bottom: Color;
  front: Color;
  back: Color;
  left: Color;
  right: Color;
}

export interface BoxDimensions {
  wx: number;
  wy: number;
  wz: number;
}

export interface BoxProps {
  size: number | BoxDimensions;
  surfaceColor: Color | ({ all: Color } & Partial<BoxSurfaceColors>) | BoxSurfaceColors;
}

export function getBoxStyleVars(props: BoxProps): Record<string, string> {
  const { size } = props;

  let wx: number, wy: number, wz: number;
  if (typeof size === 'number') {
    wx = wy = wz = size;
  } else {
    wx = size.wx;
    wy = size.wy;
    wz = size.wz;
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
    '--wx': `${wx}px`,
    '--wy': `${wy}px`,
    '--wz': `${wz}px`,
    ...colorVariables,
  };
}
