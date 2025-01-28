import { VR360Viewer, GaussianSplatBG, DefaultWorld } from '../components/backgrounds';

export function getBackgroundComponent(pathname: string) {
  if (pathname.includes('/projects/human-within')) {
    return <VR360Viewer />;
  }
  
  if (pathname.includes('/projects/gaussian-splat')) {
    return <GaussianSplatBG />;
  }

  return <DefaultWorld />;
}
