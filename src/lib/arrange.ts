import { Point, type Graphics } from "pixi.js";

interface Node {
    g: Graphics;
    offset: Point;
    scale: number;
}

// { g: Graphics; offset: Point; scale: number }

/**
 * Checks if two circular nodes overlap
 * @param node1 First node
 * @param node2 Second node
 * @param padding Additional padding between nodes (default: 2)
 * @returns True if nodes overlap
 */
function nodesOverlap(node1: Node, node2: Node, padding: number = 2): boolean {
    const dx = node1.offset.x - node2.offset.x;
    const dy = node1.offset.y - node2.offset.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = node1.scale + node2.scale + padding;
    return distance < minDistance;
}

/**
 * Finds a position for a node that doesn't overlap with existing nodes
 * @param node Node to place
 * @param placedNodes Already placed nodes
 * @param baseRadius Base radius from center
 * @param centerX Center X coordinate
 * @param centerY Center Y coordinate
 * @param maxAttempts Maximum placement attempts (default: 100)
 * @param padding Padding between nodes (default: 2)
 * @returns Point for node placement
 */
function findNonOverlappingPosition(
    node: Node,
    placedNodes: Node[],
    baseRadius: number,
    centerX: number,
    centerY: number,
    maxAttempts: number = 100,
    padding: number = 2
): Point {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Start with base radius and expand outward if needed
        const radiusMultiplier = 1 + attempt * 0.1; // Expand radius by 10% each attempt
        const currentRadius = baseRadius * radiusMultiplier;

        // Try different angles around the circle
        const angleOffset = (attempt * goldenAngle) % (2 * Math.PI);
        const x = centerX + currentRadius * Math.cos(angleOffset);
        const y = centerY + currentRadius * Math.sin(angleOffset);

        // Create temporary position to test
        const testPosition = new Point(x, y);
        const tempNode = { ...node, offset: testPosition };

        // Check for overlaps with placed nodes
        let hasOverlap = false;
        for (const placedNode of placedNodes) {
            if (nodesOverlap(tempNode, placedNode, padding)) {
                hasOverlap = true;
                break;
            }
        }

        if (!hasOverlap) {
            return testPosition;
        }
    }

    // If no non-overlapping position found, place at expanded radius
    const fallbackRadius = baseRadius * (1 + maxAttempts * 0.1);
    return new Point(
        centerX + fallbackRadius * Math.cos(Math.random() * 2 * Math.PI),
        centerY + fallbackRadius * Math.sin(Math.random() * 2 * Math.PI)
    );
}

/**
 * Arranges nodes in a radial pattern with larger nodes positioned further out
 * Similar to "Scale of the Universe" visualization, with collision detection
 * @param nodes Array of nodes sorted by size (smallest to largest)
 * @param centerX Center X coordinate (default: 0)
 * @param centerY Center Y coordinate (default: 0)
 * @param minRadius Minimum radius from center (default: 50)
 * @param maxRadius Maximum radius from center (default: 2000)
 * @param spiralTightness Controls spiral spacing (default: 0.5)
 * @param padding Additional padding between nodes (default: 2)
 * @returns Array of nodes with updated positions
 */
export function arrangeRadially(
    nodes: Node[],
    centerX: number = 0,
    centerY: number = 0,
    minRadius: number = 50,
    maxRadius: number = 2000,
    padding: number = 2
): Node[] {
    if (nodes.length === 0) return nodes;

    const arrangedNodes = [...nodes];
    const nodeCount = nodes.length;
    const placedNodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
        const node = arrangedNodes[i];

        // Map index to radius using logarithmic scale for better distribution
        // Smaller indices (smaller sizes) get smaller radii
        const normalizedIndex = i / (nodeCount - 1); // 0 to 1
        const logScale = Math.log10(normalizedIndex * 9 + 1); // 0 to 1 logarithmic
        let baseRadius = minRadius + (maxRadius - minRadius) * logScale;

        // Ensure minimum radius accounts for node size
        baseRadius = Math.max(baseRadius, node.scale + padding);

        // Find non-overlapping position
        const position = findNonOverlappingPosition(
            node,
            placedNodes,
            baseRadius,
            centerX,
            centerY,
            100,
            padding
        );

        // Update node position
        node.offset = position;
        placedNodes.push(node);
    }

    return arrangedNodes;
}

/**
 * Alternative arrangement using force-based positioning to prevent overlap
 * Uses simulated annealing approach for better distribution
 * @param nodes Array of nodes sorted by size
 * @param centerX Center X coordinate (default: 0)
 * @param centerY Center Y coordinate (default: 0)
 * @param minRadius Minimum radius from center (default: 50)
 * @param maxRadius Maximum radius from center (default: 2000)
 * @param iterations Number of optimization iterations (default: 500)
 * @param padding Padding between nodes (default: 2)
 * @returns Array of nodes with optimized positions
 */
export function arrangeWithForces(
    nodes: Node[],
    centerX: number = 0,
    centerY: number = 0,
    minRadius: number = 50,
    maxRadius: number = 2000,
    iterations: number = 500,
    padding: number = 2
): Node[] {
    if (nodes.length === 0) return nodes;

    const arrangedNodes = [...nodes];
    const nodeCount = nodes.length;

    // Initial placement using basic radial arrangement
    for (let i = 0; i < nodeCount; i++) {
        const node = arrangedNodes[i];
        const normalizedIndex = i / (nodeCount - 1);
        const logScale = Math.log10(normalizedIndex * 9 + 1);
        const radius = Math.max(
            minRadius + (maxRadius - minRadius) * logScale,
            node.scale + padding
        );

        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const angle = i * goldenAngle;

        node.offset = new Point(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
    }

    // Force-based optimization to resolve overlaps
    for (let iter = 0; iter < iterations; iter++) {
        const forces = arrangedNodes.map(() => new Point(0, 0));

        // Calculate repulsion forces between overlapping nodes
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                const node1 = arrangedNodes[i];
                const node2 = arrangedNodes[j];

                const dx = node1.offset.x - node2.offset.x;
                const dy = node1.offset.y - node2.offset.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = node1.scale + node2.scale + padding;

                if (distance < minDistance && distance > 0) {
                    // Calculate repulsion force
                    const overlap = minDistance - distance;
                    const forceStrength = overlap * 0.5;
                    const fx = (dx / distance) * forceStrength;
                    const fy = (dy / distance) * forceStrength;

                    forces[i].x += fx;
                    forces[i].y += fy;
                    forces[j].x -= fx;
                    forces[j].y -= fy;
                }
            }
        }

        // Apply forces with damping
        const damping = Math.max(0.1, 1 - iter / iterations);
        for (let i = 0; i < nodeCount; i++) {
            const node = arrangedNodes[i];
            node.offset.x += forces[i].x * damping;
            node.offset.y += forces[i].y * damping;

            // Keep nodes within reasonable bounds
            const distanceFromCenter = Math.sqrt(
                (node.offset.x - centerX) ** 2 + (node.offset.y - centerY) ** 2
            );
            if (distanceFromCenter > maxRadius * 1.5) {
                const angle = Math.atan2(node.offset.y - centerY, node.offset.x - centerX);
                node.offset.x = centerX + maxRadius * 1.5 * Math.cos(angle);
                node.offset.y = centerY + maxRadius * 1.5 * Math.sin(angle);
            }
        }
    }

    return arrangedNodes;
}
