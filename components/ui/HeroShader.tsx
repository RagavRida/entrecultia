"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroShader() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Shader uniforms
        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uSpeed: { value: 1.0 },
            uColorBG: { value: new THREE.Color("#050505") }, // Deepest dark
            uColorStudent: { value: new THREE.Color("#e0e7ff") }, // Energetic Silver/Blue-ish White
            uColorInvestor: { value: new THREE.Color("#c9a962") }, // Stable Gold
        };

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                uniform float uSpeed;
                uniform vec3 uColorBG;
                uniform vec3 uColorStudent;
                uniform vec3 uColorInvestor;
                
                varying vec2 vUv;

                // Simplex 2D noise
                vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
                float snoise(vec2 v){
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy) );
                    vec2 x0 = v - i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod(i, 289.0);
                    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m ; m = m*m ;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                float fbm(vec2 st) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    for (int i = 0; i < 3; i++) {
                        value += amplitude * snoise(st);
                        st *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }

                void main() {
                    vec2 uv = vUv;
                    float aspect = uResolution.x / uResolution.y;
                    uv.x *= aspect;

                    float time = uTime * 0.1;

                    // --- Mixing Noise ---
                    // Create an organic separation line that moves slightly
                    float mixNoise = fbm(uv * 2.0 + time * 0.05);
                    float mixFactor = smoothstep(0.35, 0.65, vUv.x + (mixNoise * 0.2 - 0.1));

                    // --- STUDENT FLOW (Left) ---
                    // Energetic, vertical, faster, turbulent
                    vec2 q_s = vec2(0.);
                    q_s.x = fbm(uv + 0.3 * time); 
                    q_s.y = fbm(uv + vec2(1.0));
                    vec2 r_s = vec2(0.);
                    r_s.x = fbm(uv + 1.0 * q_s + vec2(1.7, 9.2) + 0.4 * time); 
                    r_s.y = fbm(uv + 1.0 * q_s + vec2(8.3, 2.8) + 0.35 * time); // High vertical drift
                    float f_s = fbm(uv + r_s * 1.5); // Higher frequency details

                    // --- INVESTOR FLOW (Right) ---
                    // Stable, diagonal/horizontal, slower, smoother
                    vec2 q_i = vec2(0.);
                    q_i.x = fbm(uv + 0.05 * time); 
                    q_i.y = fbm(uv + vec2(4.0));
                    vec2 r_i = vec2(0.);
                    r_i.x = fbm(uv + 1.0 * q_i + vec2(2.5, 3.2) + 0.08 * time); 
                    r_i.y = fbm(uv + 1.0 * q_i + vec2(5.1, 1.4) + 0.05 * time); // Slow drift
                    float f_i = fbm(uv + r_i); // Lower frequency, smoother

                    // --- COMPOSITING ---
                    
                    // Base Background
                    vec3 color = uColorBG;

                    // Student Layer (Silver/White Energy)
                    float s_intensity = pow(f_s * f_s * 3.5, 2.0); // Sharp peaks
                    vec3 s_layer = mix(color, uColorStudent, s_intensity * 0.15); // Subtle but energetic
                    
                    // Investor Layer (Gold Stability)
                    // Increased intensity and sharpness to match silver's visual weight
                    float i_intensity = pow(f_i * f_i * 3.2, 1.8); 
                    vec3 i_layer = mix(color, uColorInvestor, i_intensity * 0.25); // Significantly boosted from 0.12

                    // Blend the two worlds
                    color = mix(s_layer, i_layer, mixFactor);

                    // --- CENTER CONVERGENCE (The "Platform" Effect) ---
                    // Subtle brightness boost where they meet
                    float interaction = 1.0 - abs(mixFactor * 2.0 - 1.0); // 1.0 at center, 0.0 at edges
                    interaction = pow(interaction, 4.0);
                    color += (uColorStudent * 0.3 + uColorInvestor * 0.3) * interaction * 0.05;

                    // Vignette
                    float vignette = 1.0 - smoothstep(0.4, 1.5, length(vUv - 0.5));
                    color *= vignette;

                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        const clock = new THREE.Clock();
        let animationFrameId: number;
        let mountingPhase = true;
        let targetSpeed = 0.5; // Slightly faster baseline for dynamic feel
        uniforms.uSpeed.value = 1.5; // Start fast

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();

            // Dynamic speed adjustment
            if (clock.elapsedTime > 1.5 && mountingPhase) {
                uniforms.uSpeed.value += (targetSpeed - uniforms.uSpeed.value) * 0.05;
                if (Math.abs(uniforms.uSpeed.value - targetSpeed) < 0.01) {
                    mountingPhase = false;
                }
            }

            uniforms.uTime.value += delta * uniforms.uSpeed.value;
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
            container.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
}
