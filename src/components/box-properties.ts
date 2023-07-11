import { convertRGBAToHSLA, darkenHSLAColor, lightenHSLAColor, normalizeColor, type Color, type HSLA } from '../colors';

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

  const surfaceTopColorDark =
    typeof typedColors.top === 'undefined' ? darkenHSLAColor(surfaceTopColor, 15) : surfaceTopColor;
  const surfaceTopColorLight =
    typeof typedColors.top === 'undefined' ? lightenHSLAColor(surfaceTopColor, 10) : surfaceTopColor;
  const surfaceBottomColorDark =
    typeof typedColors.bottom === 'undefined' ? darkenHSLAColor(surfaceBottomColor, 10) : surfaceBottomColor;
  const surfaceFrontColorDark =
    typeof typedColors.front === 'undefined' ? darkenHSLAColor(surfaceFrontColor, 10) : surfaceFrontColor;
  const surfaceLeftColorDark =
    typeof typedColors.left === 'undefined' ? darkenHSLAColor(surfaceLeftColor, 15) : surfaceLeftColor;
  const surfaceLeftColorMedium =
    typeof typedColors.left === 'undefined' ? darkenHSLAColor(surfaceLeftColor, 10) : surfaceLeftColor;
  const surfaceRightColorDark =
    typeof typedColors.right === 'undefined' ? darkenHSLAColor(surfaceRightColor, 15) : surfaceRightColor;
  const surfaceRightColorMedium =
    typeof typedColors.right === 'undefined' ? darkenHSLAColor(surfaceRightColor, 10) : surfaceRightColor;

  const colors: Record<string, HSLA | string> = {
    surfaceTopColor,
    surfaceTopColorDark,
    surfaceTopColorLight,
    surfaceBottomColorDark,
    surfaceFrontColor,
    surfaceFrontColorDark,
    surfaceBackColor,
    surfaceLeftColor,
    surfaceLeftColorDark,
    surfaceLeftColorMedium,
    surfaceRightColor,
    surfaceRightColorDark,
    surfaceRightColorMedium,
  };

  for (const key in colors) {
    const { h, s, l, a } = colors[key] as HSLA;
    colors[key] = `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  // There are quite a lot of vars, and they get injected into all children, so to save up space, inject them manually
  // instead of using the `define:vars` prop.
  const typedHslaColors = colors as Record<string, string>;
  return {
    '--wx': `${wx}px`,
    '--wy': `${wy}px`,
    '--wz': `${wz}px`,
    '--surface-top-color': typedHslaColors.surfaceTopColor,
    '--surface-top-color-dark': typedHslaColors.surfaceTopColorDark,
    '--surface-top-color-light': typedHslaColors.surfaceTopColorLight,
    '--surface-bottom-color-dark': typedHslaColors.surfaceBottomColorDark,
    '--surface-front-color': typedHslaColors.surfaceFrontColor,
    '--surface-front-color-dark': typedHslaColors.surfaceFrontColorDark,
    '--surface-back-color': typedHslaColors.surfaceBackColor,
    '--surface-left-color': typedHslaColors.surfaceLeftColor,
    '--surface-left-color-dark': typedHslaColors.surfaceLeftColorDark,
    '--surface-left-color-medium': typedHslaColors.surfaceLeftColorMedium,
    '--surface-right-color': typedHslaColors.surfaceRightColor,
    '--surface-right-color-dark': typedHslaColors.surfaceRightColorDark,
    '--surface-right-color-medium': typedHslaColors.surfaceRightColorMedium,
  };
}
