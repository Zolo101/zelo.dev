import { Filter, GlProgram, GpuProgram } from "pixi.js";
import fragment from "./dither.frag?raw";
import source from "./dither.wgsl?raw";
import vertex from "../defaults/default.vert?raw";
import wgslVertex from "../defaults/default.wgsl?raw";

export interface DitherOptions {
    /** Dithering intensity (0.0 = no dithering, 1.0 = full dithering) */
    intensity?: number;
    /** Color levels per channel (e.g., 16.0 for 4-bit per channel) */
    levels?: number;
    /** Dither matrix size (4 for 4x4, 8 for 8x8) */
    matrixSize?: 4 | 8;
}

export default (options: DitherOptions = {}) => {
    const { intensity = 1.0, levels = 16.0, matrixSize = 4 } = options;

    return new Filter({
        gpuProgram: GpuProgram.from({
            name: "dither",
            vertex: {
                source: wgslVertex,
                entryPoint: "mainVertex"
            },
            fragment: {
                source,
                entryPoint: "mainFragment"
            }
        }),
        glProgram: GlProgram.from({
            name: "dither",
            fragment,
            vertex
        }),
        resources: {
            ditherUniforms: {
                uIntensity: {
                    type: "f32",
                    value: intensity
                },
                uLevels: {
                    type: "f32",
                    value: levels
                },
                uMatrixSize: {
                    type: "f32",
                    value: matrixSize
                }
            }
        }
    });
};
