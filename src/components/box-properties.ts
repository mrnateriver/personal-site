import { convertRGBAToHSLA, normalizeColor, type Color, type HSLA } from '../colors';

export interface BoxSurfaceColors {
  top: Color;
  bottom: Color;
  front: Color;
  back: Color;
  left: Color;
  right: Color;
}

export interface BoxProps {
  wx: number;
  wy: number;
  wz: number;
  surfaceColor: Color | ({ all: Color } & Partial<BoxSurfaceColors>) | BoxSurfaceColors;
}

export function getBoxStyleVars(props: BoxProps): Record<string, string> {
  const { wx, wy, wz } = props;

  let surfaceColor = props.surfaceColor ?? { all: 'red' };
  if (typeof surfaceColor === 'number' || typeof surfaceColor === 'string') {
    surfaceColor = { all: surfaceColor };
  }

  const typedColors = surfaceColor as Record<string, Color>;

  const normalizedAll = typedColors.all ? normalizeColor(typedColors.all) : undefined;

  const defaultColor = { r: 0, g: 0, b: 0, a: 1 };
  const surfaceTopColor = convertRGBAToHSLA(normalizeColor(typedColors.top) ?? normalizedAll ?? defaultColor);
  const surfaceBottomColor = convertRGBAToHSLA(normalizeColor(typedColors.bottom) ?? normalizedAll ?? defaultColor);
  const surfaceFrontColor = convertRGBAToHSLA(normalizeColor(typedColors.front) ?? normalizedAll ?? defaultColor);
  const surfaceBackColor = convertRGBAToHSLA(normalizeColor(typedColors.back) ?? normalizedAll ?? defaultColor);
  const surfaceLeftColor = convertRGBAToHSLA(normalizeColor(typedColors.left) ?? normalizedAll ?? defaultColor);
  const surfaceRightColor = convertRGBAToHSLA(normalizeColor(typedColors.right) ?? normalizedAll ?? defaultColor);

  const colors: Record<string, HSLA | string> = {
    surfaceTopColor,
    surfaceBottomColor,
    surfaceFrontColor,
    surfaceBackColor,
    surfaceLeftColor,
    surfaceRightColor,
  };

  for (const key in colors) {
    const { h, s } = colors[key] as HSLA;
    colors[key] = `${h} ${s}%`;
  }

  // There are quite a lot of vars, and they get injected into all children, so to save up space, inject them manually
  // instead of using the `define:vars` prop.
  const typedHslaColors = colors as Record<string, string>;
  return {
    '--wx': `${wx}px`,
    '--wy': `${wy}px`,
    '--wz': `${wz}px`,
    '--st': typedHslaColors.surfaceTopColor,
    '--st-l': `${surfaceTopColor.l}%`,
    '--sb': typedHslaColors.surfaceBottomColor,
    '--sb-l': `${surfaceBottomColor.l}%`,
    '--sf': typedHslaColors.surfaceFrontColor,
    '--sf-l': `${surfaceFrontColor.l}%`,
    '--sbk': typedHslaColors.surfaceBackColor,
    '--sbk-l': `${surfaceBackColor.l}%`,
    '--sl': typedHslaColors.surfaceLeftColor,
    '--sl-l': `${surfaceLeftColor.l}%`,
    '--sr': typedHslaColors.surfaceRightColor,
    '--sr-l': `${surfaceRightColor.l}%`,
  };
}
