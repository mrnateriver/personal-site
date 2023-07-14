import { auditTime } from '../streams';

const main = document.querySelector('#image-kangaroo-container') as HTMLElement;
const image = main.querySelector('.image-kangaroo') as HTMLElement;

if (main && image) {
  const xRange = [-24, 24] as const;
  const yRange = [0, 64] as const;

  function setRotation(x: number, y: number): void {
    main.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(0deg)`;
  }

  function onMainRotationEnd(): void {
    main.removeEventListener('animationend', onMainRotationEnd);
    main.style.animation = 'none';
    setRotation(-16, 32);

    const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
    let { left: mainX, top: mainY, width: mainWidth, height: mainHeight } = image.getBoundingClientRect();
    mainHeight /= 2;
    mainWidth /= 2;

    const auditedMouseMove = auditTime<[number, number]>((next) => {
      function updateKangarooRotation(event: MouseEvent): void {
        const { clientX, clientY } = event;

        let x: number;
        if (clientX < mainX + mainWidth) {
          x = -Math.abs(yRange[0]) * ((mainX + mainWidth - clientX) / (mainX + mainWidth));
        } else {
          x = ((clientX - mainWidth - mainX) / (viewportWidth - mainWidth - mainX)) * yRange[1];
        }

        let y: number;
        if (clientY < mainY + mainHeight) {
          y = -Math.abs(xRange[0]) * ((mainY + mainHeight - clientY) / (mainY + mainHeight));
        } else {
          y = ((clientY - mainHeight - mainY) / (viewportHeight - mainHeight - mainY)) * xRange[1];
        }

        next([-y, x]);
      }

      document.addEventListener('mousemove', updateKangarooRotation, { passive: true });
    }, 1000);

    auditedMouseMove((args) => {
      setRotation(...args);
    });
  }
  main.addEventListener('animationend', onMainRotationEnd);
}
