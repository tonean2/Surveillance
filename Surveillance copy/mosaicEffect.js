import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class MosaicEffect {
    constructor(container, width, height) {
        // Add error checking
        if (!container) {
            console.error('Container element is required for MosaicEffect');
            return;
        }

        console.log('Initializing MosaicEffect:', { width, height });
        
        this.width = width;
        this.height = height;
        this.tileSize = 8;
        this.initialized = false;
        
        try {
            // Create renderer with error checking
            this.renderer = new THREE.WebGLRenderer({ 
                alpha: true,
                antialias: true
            });
            
            // Check if WebGL is available
            if (!this.renderer.capabilities.isWebGL2) {
                console.warn('WebGL 2 not available, falling back to WebGL 1');
            }
            
            this.renderer.setSize(width, height);
            this.renderer.setClearColor(0x000000, 0);
            
            // Add renderer to container with debug logging
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.top = '0';
            this.renderer.domElement.style.left = '0';
            this.renderer.domElement.style.pointerEvents = 'none';
            this.renderer.domElement.style.zIndex = '2';
            container.appendChild(this.renderer.domElement);
            console.log('Renderer added to container');

            // Setup scene and camera
            this.scene = new THREE.Scene();
            this.camera = new THREE.OrthographicCamera(
                -width / 2, width / 2,
                height / 2, -height / 2,
                0.1, 1000
            );
            this.camera.position.z = 1;

            // Modified shader with debug colors
            this.material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    resolution: { value: new THREE.Vector2(width, height) },
                    tileSize: { value: this.tileSize },
                    centerX: { value: 0.5 },
                    centerY: { value: 0.5 },
                    debugMode: { value: 1.0 } // Add debug uniform
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec2 resolution;
                    uniform float tileSize;
                    uniform float centerX;
                    uniform float centerY;
                    uniform float debugMode;
                    varying vec2 vUv;

                    void main() {
                        // Debug visualization
                        if (debugMode > 0.5) {
                            gl_FragColor = vec4(vUv.x, vUv.y, 0.5, 0.5);
                            return;
                        }

                        vec2 center = vec2(centerX, centerY);
                        vec2 coord = vUv;
                        float dist = distance(coord, center);
                        float wave = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
                        vec2 pixelCoord = floor(coord * resolution / tileSize) * tileSize / resolution;
                        vec2 finalCoord = mix(coord, pixelCoord, wave * 0.8);
                        
                        vec3 color = vec3(
                            step(0.5, fract(finalCoord.x * 10.0)),
                            step(0.5, fract(finalCoord.y * 10.0)),
                            step(0.5, fract((finalCoord.x + finalCoord.y) * 5.0))
                        );
                        
                        color *= 0.8 + 0.2 * sin(time + finalCoord.x * 10.0);
                        float edge = 1.0 - smoothstep(0.3, 0.5, dist);
                        gl_FragColor = vec4(color * edge, edge * 0.6);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            // Create plane with error checking
            this.geometry = new THREE.PlaneGeometry(width, height);
            this.plane = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.plane);

            this.time = 0;
            this.centerX = 0.5;
            this.centerY = 0.5;
            this.targetX = 0.5;
            this.targetY = 0.5;

            // Initial render to ensure everything is working
            this.renderer.render(this.scene, this.camera);
            console.log('Initial render complete');

        } catch (error) {
            console.error('Error initializing MosaicEffect:', error);
        }
    }

    initialize() {
        try {
            this.initialized = true;
            // Force an initial render
            this.renderer.render(this.scene, this.camera);
            console.log('MosaicEffect initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    destroy() {
        this.geometry.dispose();
        this.material.dispose();
        this.renderer.dispose();
    }
}