import { PixelateFilter } from "pixi-filters";
import {
    Assets,
    Color,
    Container,
    FillGradient,
    Graphics,
    Point,
    Sprite,
    Text,
    TilingSprite,
    type Application
} from "pixi.js";
import dither from "./shaders/dither/dither";
import { arrangeWithForces } from "./arrange";
import renderScale from "$lib/assets/renderscale.webp?url";
import fiveBeam from "$lib/assets/5beam/5beam.webp?url";
import fiveBeamBox from "$lib/assets/5beam/box.webp?url";
import fiveBeamCompanion from "$lib/assets/5beam/companion.webp?url";
import fiveBeamMetal from "$lib/assets/5beam/metal.webp?url";
import fiveBeamParcel from "$lib/assets/5beam/parcel.webp?url";
type Animation = (app: Application, meta?: { dark: boolean }) => void;

function randomColor() {
    return new Color([Math.random(), Math.random(), Math.random()]);
}

function randomGrayscaleColor() {
    const c = Math.random();
    return new Color([c, c, c]);
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(n, max));
}

function randomFrom(from: number, to: number) {
    return Math.random() * (to - from) + from;
}

function pick<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

function pickIndex(array: unknown[]) {
    return Math.floor(Math.random() * array.length);
}

// function randomShape(g: Graphics, size: number) {
//     const shape = Math.random() < 0.5 ? "circle" : "rect";
//     if (shape === "circle") {
//         g.circle(0, 0, size);
//     } else {
//         g.rect(0, 0, size, size);
//     }
// }

export default {
    default: (app: Application) => {
        const fg = new FillGradient({
            type: "linear",
            start: new Point(0, 0),
            end: new Point(1, 0),
            colorStops: [
                {
                    color: randomColor(),
                    offset: 0
                },
                {
                    color: randomColor(),
                    offset: 1
                }
            ]
        });
        const g = new Graphics();
        g.rect(0, 0, app.screen.width, app.screen.height);
        // g.fill({ color: 0x005555 });
        g.fill(fg);

        const questionMark = new Text({
            text: "?",
            style: {
                fontFamily: "Arial",
                fontSize: 48,
                fontWeight: "bold",
                fill: 0xffffff
            }
        });
        questionMark.resolution = 4;
        questionMark.x += 5;
        questionMark.y += 5;

        // questionMark.texture;

        app.stage.addChild(g); //, questionMark);

        let time = 0;
        app.ticker.add((t) => {
            questionMark.x += Math.sin(time) * 5;
            // questionMark.y += Math.cos(time / 20) * 2;
            time += t.deltaTime / 20;
        });

        app.stage.filters = [
            new PixelateFilter(4),
            dither({ intensity: 0.5, levels: 4, matrixSize: 4 })
        ];

        // console.log("rendered scale");
    },
    "[bc]": (app: Application) => {
        const barsContainer = new Container();
        const bars: Graphics[] = [];
        const barsAmount = 7;
        for (let i = 0; i < barsAmount; i++) {
            const bar = new Graphics();
            bar.rect(0, 0, Math.random() * app.screen.width, app.screen.height / barsAmount + 0.8);
            bar.fill({ color: randomColor() });
            bar.y = i * (app.screen.height / barsAmount);
            bars.push(bar);
        }
        barsContainer.addChild(...bars);
        app.stage.addChild(barsContainer);

        let time = 0;
        app.ticker.add((t) => {
            for (let i = 0; i < bars.length; i++) {
                const bar = bars[i];
                bar.width =
                    (Math.sin(time + i * 0.2) * app.screen.width) / 3 + app.screen.width / 2;
            }
            time += t.deltaTime / 100;
        });
    },
    corkboard: (app: Application) => {
        const g = new Graphics();
        g.rect(0, 0, app.screen.width, app.screen.height);
        g.fill({ color: 0xdddddd });
        app.stage.addChild(g);

        const padding = 2;

        const frames: Graphics[] = [];
        for (let i = 0; i < 50; i++) {
            const frame = new Graphics();
            const width = randomFrom(10, 20);
            const height = randomFrom(10, 20);
            frame.rect(0, 0, width, height);
            frame.fill({ color: randomGrayscaleColor() });
            frame.x = randomFrom(padding, app.screen.width - padding - width);
            frame.y = randomFrom(padding, app.screen.height - padding - height);
            frame.alpha = 0.75;
            frames.push(frame);
        }

        app.stage.addChild(...frames);

        let time = 0;
        app.ticker.add((t) => {
            for (let i = 0; i < frames.length; i++) {
                const frame = frames[i];
                frame.alpha = clamp(time - i / 4, 0, 0.75);
            }
            time += t.deltaTime / 100;
        });

        // console.log("rendered corkboard");
    },
    "keymash grader": (app: Application) => {
        const g = new Graphics();
        g.rect(0, 0, app.screen.width, app.screen.height);
        g.fill({ color: 0xfbbb8b });
        app.stage.addChild(g);

        const b = ["j", "k", "h", "s", "v", "f", "g", "n", "m", "d"];

        const texts: Text[] = [];
        for (let i = 0; i < 170; i++) {
            // const text = new BitmapText();
            const text = new Text();
            text.style = {
                fontFamily: "Arial",
                fontSize: 9,
                fill: 0x000000
            };
            texts.push(text);
        }

        const bb = () => {
            let textSpacing = -5;
            let y = -5;
            for (let i = 0; i < texts.length; i++) {
                const text = texts[i];
                let character = b[pickIndex(b)];
                if (character === texts[i - 1]?.text) character = b[0];
                text.text = character;
                text.x = textSpacing;
                text.y = y;
                textSpacing += text.getBounds().width;

                if (textSpacing > app.screen.width) {
                    y += 11;
                    textSpacing = -5;
                }
            }
        };

        bb();

        app.stage.addChild(...texts);

        let time = 0;
        app.ticker.add((t) => {
            const v = Math.abs(Math.sin(time)) * (texts.length + 5);
            for (let i = 0; i < texts.length; i++) {
                const text = texts[i];
                // text.alpha = v > i ? 1 : 0;
                text.alpha = clamp((v - i) / 5, 0, 1); // smooth
            }
            time += t.deltaTime / 200;

            // ew
            if (Math.abs(Math.sin(time)) < 0.015) bb();
        });

        // console.log("rendered keymash grader");
    },
    "Zelocoin Incremental Game": (app: Application, { dark }: { dark: boolean }) => {
        const g = new Graphics();
        g.rect(0, 0, app.screen.width, app.screen.height);
        g.fill({ color: dark ? 0x000000 : 0xffffff });

        const coinsGraphic = new Graphics();
        coinsGraphic.circle(10, 10, 10);
        coinsGraphic.fill({ color: 0x7b00ff });

        const tilingSprite = new TilingSprite({
            texture: app.renderer.generateTexture(coinsGraphic),
            width: app.screen.width,
            height: app.screen.height,
            tileScale: { x: 0.5, y: 0.5 }
        });

        const fadeToBlackGradient = new FillGradient({
            type: "linear",
            colorStops: [
                {
                    color: dark ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)",
                    offset: 0
                },
                {
                    color: dark ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)",
                    offset: 1
                }
            ]
        });
        const fadeToBlack = new Graphics();
        fadeToBlack.rect(0, 0, app.screen.width, app.screen.height);
        fadeToBlack.fill(fadeToBlackGradient);

        app.stage.addChild(g, tilingSprite, fadeToBlack);
    },
    "Scale of the Universe": (app: Application) => {
        const g = new Graphics();
        g.rect(0, 0, app.screen.width, app.screen.height);
        // g.fill({ color: 0xdcdfe2 });
        g.fill({ color: 0xffffff });
        app.stage.addChild(g);

        const nodeContainer = new Container();
        let nodes: { g: Graphics; offset: Point; scale: number }[] = [];

        const center = new Point(app.screen.width / 2, app.screen.height / 2);

        const far = 25;
        let scale = 1e-5;
        for (let i = 0; i < 200; i++) {
            const node = new Graphics();
            // randomShape(node, 10);
            node.circle(0, 0, 10);
            node.fill({ color: randomColor() });
            node.scale = scale;
            nodeContainer.addChild(node);

            const randomAngle = Math.random() * 2 * Math.PI;

            nodes.push({
                g: node,
                offset: new Point(Math.sin(randomAngle) * far, Math.cos(randomAngle) * far),
                scale //: 0.003 // * Math.pow(1000 / 0.001, i / (nodes.length - 1))
            });

            // scale *= randomFrom(1.1, 3.0);
            // scale *= 1.1; //randomFrom(1.01, 1.1);
            scale *= randomFrom(1.0, 1.1);
        }
        app.stage.addChild(nodeContainer);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const debug = (at: number, content: unknown) => {
            if (Math.random() < at) console.log(content);
        };

        // old
        // arrangeRadially(nodes, 0, 0, 30, 30, 0.4);

        // nodes = arrangeRadially(nodes, 0, 0, 30, 40, 2);
        nodes = arrangeWithForces(nodes, 0, 0, 30, 60, 50, 5);

        let time = 0;
        app.ticker.add((t) => {
            // Increase zoom exponentially for a smooth zoom-in effect
            const zoom = Math.exp(Math.sin(time) * 3 + 6);

            for (let i = 0; i < nodes.length; i++) {
                const { g, scale, offset } = nodes[i];
                // Calculate position relative to center, then scale by zoom, then re-center
                g.position.x = center.x + offset.x * scale * zoom;
                g.position.y = center.y + offset.y * scale * zoom;
                g.scale = scale * zoom;

                // fade in and out
                g.alpha = clamp(2.5 - g.scale.x, 0, 1) * clamp(-1 + g.scale.x * 25, 0, 1);
            }

            time += t.deltaTime / 200;
        });
    },
    "zelo's ant": (app: Application) => {
        // Draw a simple ant: three black circles (body, thorax, head) and six legs
        const antColor = 0xff0000;
        const scale = 0.5;
        const tileSize = 50;
        const ant = new Graphics();

        // Body parts
        ant.circle(0, 0, 10); // abdomen
        ant.circle(0, -13, 7); // thorax
        ant.circle(0, -22, 5); // head

        ant.fill({ color: antColor });

        // Legs (three on each side)
        ant.moveTo(-4, -10).lineTo(-18, -8); // left back leg
        ant.moveTo(-5, -13).lineTo(-20, -20); // left middle leg
        ant.moveTo(-3, -16).lineTo(-15, -25); // left front leg

        ant.moveTo(4, -10).lineTo(18, -8); // right back leg
        ant.moveTo(5, -13).lineTo(20, -20); // right middle leg
        ant.moveTo(3, -16).lineTo(15, -25); // right front leg

        ant.stroke({ width: 2, color: antColor });

        // Antennae
        ant.moveTo(-2, -27).lineTo(-8, -35);
        ant.moveTo(2, -27).lineTo(8, -35);
        ant.stroke({ width: 1.5, color: antColor });

        ant.scale.set(scale);
        ant.position.x = app.screen.width / 1.5;
        ant.position.y = app.screen.height / 2;
        ant.pivot.set(0, -ant.height / 2 - 1);
        ant.rotation = Math.PI / 2;

        const gridCell = new Graphics();
        gridCell.rect(0, 0, 1, tileSize);
        gridCell.rect(0, 0, tileSize, 1);
        gridCell.fill({ color: "rgba(0, 0, 0, 1)" });

        // white tile = 90 clockwise
        // black tile = 90 counter-clockwise
        const tileSection = new Graphics();
        tileSection.rect(0, 0, tileSize, tileSize);
        tileSection.fill({ color: 0xffffff });
        tileSection.rect(tileSize, 0, tileSize, tileSize);
        tileSection.fill({ color: 0x000000 });
        tileSection.rect(0, tileSize, tileSize, tileSize);
        tileSection.fill({ color: 0x000000 });
        tileSection.rect(tileSize, tileSize, tileSize, tileSize);
        tileSection.fill({ color: 0xffffff });

        const whiteTileChange = new Graphics();
        for (let i = 0; i < 5; i++) {
            whiteTileChange.rect(-tileSize * i, tileSize * (i + 1), tileSize, tileSize);
        }
        whiteTileChange.fill({ color: 0xffffff });
        whiteTileChange.scale.set(scale);
        whiteTileChange.position.x = ant.position.x - 37;
        whiteTileChange.position.y = ant.position.y - 13;
        // whiteTileChange.alpha = 0.5;

        const blackTileChange = new Graphics();

        for (let i = 0; i < 5; i++) {
            blackTileChange.rect(-tileSize * i, tileSize * (i - 1), tileSize, tileSize);
        }
        blackTileChange.rect(0, -tileSize, tileSize, tileSize);
        blackTileChange.rect(-tileSize, 0, tileSize, tileSize);
        blackTileChange.fill({ color: 0x000000 });
        blackTileChange.scale.set(scale);
        // blackTileChange.position.x = tileSize - 2;
        // blackTileChange.position.y = tileSize - 6;
        blackTileChange.position.x = ant.position.x - 37;
        blackTileChange.position.y = ant.position.y + 12;
        // blackTileChange.alpha = 0.5;

        const gridLines = new TilingSprite({
            texture: app.renderer.generateTexture(gridCell),
            width: app.screen.width,
            height: app.screen.height,
            tilePosition: { x: ant.position.x + 25 * scale, y: ant.position.y + 23 * scale },
            tileScale: { x: scale, y: scale }
        });

        const tiles = new TilingSprite({
            texture: app.renderer.generateTexture(tileSection),
            width: app.screen.width,
            height: app.screen.height,
            tilePosition: { x: ant.position.x - 25 * scale, y: ant.position.y + 23 * scale },
            tileScale: { x: scale, y: scale }
        });

        app.stage.addChild(tiles, whiteTileChange, blackTileChange, gridLines, ant);

        let count = 0;
        const speed = 1;
        const moveInterval = 50; // must be even!
        app.ticker.add(() => {
            ant.position.x -= speed * scale;
            ant.position.y -= -speed * scale;

            gridLines.tilePosition.x -= speed * scale;
            gridLines.tilePosition.y -= -speed * scale;
            tiles.tilePosition.x -= speed * scale;
            tiles.tilePosition.y -= -speed * scale;

            whiteTileChange.position.x -= speed * scale;
            whiteTileChange.position.y -= -speed * scale;
            blackTileChange.position.x -= speed * scale;
            blackTileChange.position.y -= -speed * scale;

            count++;

            if (count % moveInterval === 0) {
                ant.rotation = Math.PI / 2;
                ant.position.x += 50 * scale;
                blackTileChange.position.x += 50 * scale;
                blackTileChange.position.y -= 50 * scale;
            } else if (count % moveInterval === moveInterval / 2) {
                // Make sure its at the same position each time
                // (it is)
                // console.log(ant.position.y);
                ant.rotation = 0;
                ant.position.y -= 50 * scale;
                whiteTileChange.position.x += 50 * scale;
                whiteTileChange.position.y -= 50 * scale;
            }
        });
    },
    RenderScale: async (app: Application) => {
        // load local image
        await Assets.load(renderScale);

        const sprite = Sprite.from(renderScale);
        sprite.width = app.screen.width;
        sprite.height = app.screen.height;

        const spriteMasked = Sprite.from(renderScale);
        spriteMasked.width = app.screen.width;
        spriteMasked.height = app.screen.height;

        // Create a circular mask in the center of the screen
        const fadeToBlackGradient = new FillGradient({
            type: "linear",
            start: new Point(0, 0),
            end: new Point(1, 0),
            colorStops: [
                {
                    color: "rgba(0, 0, 0, 0)",
                    offset: 0
                },
                {
                    color: "rgba(255, 255, 255, 1)",
                    offset: 0.6
                }
            ]
        });
        const fadeToBlack = new Graphics();
        fadeToBlack.rect(0, 0, app.screen.width, app.screen.height);
        fadeToBlack.fill(fadeToBlackGradient);

        const mask = Sprite.from(app.renderer.generateTexture(fadeToBlack));
        spriteMasked.mask = mask;
        spriteMasked.filters = [new PixelateFilter(3)];

        app.stage.addChild(sprite, spriteMasked);
    },
    "5beam": async (app: Application) => {
        await Assets.load(fiveBeam);
        await Assets.load(fiveBeamBox);
        await Assets.load(fiveBeamCompanion);
        await Assets.load(fiveBeamMetal);
        await Assets.load(fiveBeamParcel);

        const sprite = Sprite.from(fiveBeam);
        sprite.width = 1600;
        sprite.height = 900;
        sprite.scale.set(0.125);
        sprite.position.x -= 50;
        sprite.position.y -= 20;

        app.stage.addChild(sprite);

        const icons = [fiveBeamBox, fiveBeamCompanion, fiveBeamMetal, fiveBeamParcel];
        const boxes = new Container();
        const boxSet: Set<Sprite> = new Set();

        const createBox = () => {
            const box = Sprite.from(pick(icons));
            box.width = box.texture.width / 50;
            box.height = box.texture.height / 50;
            box.position.x = randomFrom(0, app.screen.width);
            box.position.y = app.screen.height + 50;
            box.rotation = Math.random() * 2 * Math.PI;

            // This is wrong but it looks cool
            box.pivot.set(1, 1);

            boxSet.add(box);
            boxes.addChild(box);
        };

        app.stage.addChild(boxes);

        // let time = 0;
        let count = 0;
        app.ticker.add(() => {
            if (count % 3 === 0) {
                createBox();
            }

            for (const box of boxSet) {
                box.rotation += 0.1;
                box.position.y -= 2;
                if (box.position.y < -50) {
                    box.destroy();
                    boxSet.delete(box);
                    boxes.removeChild(box);
                }
            }

            count++;
            // time += t.deltaTime / 200;
        });
    }
} as Record<string, Animation>;
