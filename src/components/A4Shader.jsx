import { GrainGradient } from '@paper-design/shaders-react';
import { useShader } from '../context/ShaderContext';

export default function A4Shader() {
  const { opacity, color1, color2 } = useShader();

  return (
    <>
      {/* Pattern à 100% — l'opacité est gérée par le voile */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -2 }}>
        <GrainGradient
          style={{ width: '100%', height: '100%' }}
          colors={['#000000', color1, color2]}
          colorBack="#000000"
          softness={1}
          intensity={0.4}
          noise={0.5}
          shape="truchet"
          speed={0.3}
          scale={0.16}
          rotation={168}
          offsetX={0.16}
        />
      </div>

      {/* Voile blanc CSS — contrôle l'opacité visible (impression incluse) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: -1, background: `rgba(255,255,255,${1 - opacity})` }}
      />
    </>
  );
}
