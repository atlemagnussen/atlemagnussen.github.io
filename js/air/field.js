class Field {
    constructor() {
        this.cornerSteps = 5;
    }
    buildTableMap() {
        let tableMap = [];
        const tableHeight = 42;
        const tableWidth = 24;
        const goalWidth = 8;
        const goalDepth = 3;
        const cornerRadius = 3;
        const endLength = (tableWidth - goalWidth - cornerRadius * 2) / 2;
        // const sideLength = (tableHeight - cornerRadius * 2) / 2;
        const centerX = tableWidth / 2;
        const centerY = tableHeight / 2;

        const createCorner = (start, end) => {
            let sum = 0;
            let map = [];
            const sizeX = end.x - start.x;
            const sizeY = end.y - start.y;

            for (let i = 0; i < this.cornerSteps + 1; i++) {
                sum += i;
                map.push(sum);
            }

            const stepWidth = (index, size) => {
                return (size / map[this.cornerSteps]) * map[index];
            };

            for (let i = 0; i < this.cornerSteps; i++) {
                const currentX = stepWidth(i, sizeX) + start.x;
                const currentY =
                    stepWidth(this.cornerSteps - i, sizeY) + start.y;
                const nextX = stepWidth(i + 1, sizeX) + start.x;
                const nextY =
                    stepWidth(this.cornerSteps - i - 1, sizeY) + start.y;
                tableMap.push([
                    { x: currentX, y: currentY },
                    { x: nextX, y: nextY },
                ]);
            }
        };
        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: centerY,
            },
            {
                x: -(goalWidth / 2) - endLength,
                y: centerY,
            },
        ]);

        tableMap.push([
            {
                x: goalWidth / 2,
                y: centerY,
            },
            {
                x: goalWidth / 2 + endLength,
                y: centerY,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: centerY + goalDepth,
            },
            {
                x: goalWidth / 2,
                y: centerY + goalDepth,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: centerY + goalDepth,
            },
            {
                x: -(goalWidth / 2),
                y: centerY,
            },
        ]);

        tableMap.push([
            {
                x: goalWidth / 2,
                y: centerY + goalDepth,
            },
            {
                x: goalWidth / 2,
                y: centerY,
            },
        ]);

        tableMap.push([
            {
                x: centerX,
                y: centerY - cornerRadius,
            },
            {
                x: centerX,
                y: -centerY + cornerRadius,
            },
        ]);

        tableMap.push([
            {
                x: -centerX,
                y: centerY - cornerRadius,
            },
            {
                x: -centerX,
                y: -centerY + cornerRadius,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: -centerY,
            },
            {
                x: -(goalWidth / 2) - endLength,
                y: -centerY,
            },
        ]);

        tableMap.push([
            {
                x: goalWidth / 2,
                y: -centerY,
            },
            {
                x: goalWidth / 2 + endLength,
                y: -centerY,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: -centerY - goalDepth,
            },
            {
                x: goalWidth / 2,
                y: -centerY - goalDepth,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: -centerY - goalDepth,
            },
            {
                x: -(goalWidth / 2),
                y: -centerY,
            },
        ]);

        tableMap.push([
            {
                x: goalWidth / 2,
                y: -centerY - goalDepth,
            },
            {
                x: goalWidth / 2,
                y: -centerY,
            },
        ]);

        createCorner(
            {
                x: centerX,
                y: centerY,
            },
            {
                x: centerX - cornerRadius,
                y: centerY - cornerRadius,
            }
        );

        createCorner(
            {
                x: -centerX,
                y: centerY,
            },
            {
                x: -centerX + cornerRadius,
                y: centerY - cornerRadius,
            }
        );

        createCorner(
            {
                x: centerX,
                y: -centerY,
            },
            {
                x: centerX - cornerRadius,
                y: -centerY + cornerRadius,
            }
        );

        createCorner(
            {
                x: -centerX,
                y: -centerY,
            },
            {
                x: -centerX + cornerRadius,
                y: -centerY + cornerRadius,
            }
        );

        return tableMap;
    }
}

export default new Field();
