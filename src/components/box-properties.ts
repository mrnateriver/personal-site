import { convertRGBAToHSLA, darkenHSLAColor, lightenHSLAColor, normalizeColor, type Color, type HSLA } from '../colors';

export interface BoxProps {
  wx: number;
  wy: number;
  wz: number;
  surfaceColor:
    | Color
    | { all: Color }
    | {
        top: Color;
        bottom: Color;
        front: Color;
        back: Color;
        left: Color;
        right: Color;
      };
}

export function getBoxStyleVars(props: BoxProps): Record<string, string> {
  const { wx, wy, wz } = props;

  let surfaceColor = props.surfaceColor ?? { all: 'red' };
  if (typeof surfaceColor === 'number' || typeof surfaceColor === 'string') {
    surfaceColor = { all: surfaceColor };
  }

  const typedColors = surfaceColor as Record<string, Color>;

  const normalizedAll = typedColors.all ? normalizeColor(typedColors.all) : undefined;

  const surfaceTopColor = convertRGBAToHSLA(normalizedAll ?? normalizeColor(typedColors.top));
  const surfaceBottomColor = convertRGBAToHSLA(normalizedAll ?? normalizeColor(typedColors.bottom));
  const surfaceFrontColor = convertRGBAToHSLA(normalizedAll ?? normalizeColor(typedColors.front));
  const surfaceBackColor = convertRGBAToHSLA(normalizedAll ?? normalizeColor(typedColors.back));
  const surfaceLeftColor = convertRGBAToHSLA(normalizedAll ?? normalizeColor(typedColors.left));
  const surfaceRightColor = convertRGBAToHSLA(normalizedAll ?? normalizeColor(typedColors.right));

  const surfaceTopColorDark = darkenHSLAColor(surfaceTopColor, 15);
  const surfaceTopColorLight = lightenHSLAColor(surfaceTopColor, 10);
  const surfaceBottomColorDark = darkenHSLAColor(surfaceBottomColor, 10);
  const surfaceFrontColorDark = darkenHSLAColor(surfaceFrontColor, 10);
  const surfaceLeftColorDark = darkenHSLAColor(surfaceLeftColor, 15);
  const surfaceLeftColorMedium = darkenHSLAColor(surfaceLeftColor, 10);
  const surfaceRightColorDark = darkenHSLAColor(surfaceRightColor, 15);
  const surfaceRightColorMedium = darkenHSLAColor(surfaceRightColor, 10);

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
