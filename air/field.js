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

        const createCorner = (x1, y1, x2, y2) => {
            let sum = 0;
            let map = [];
            const sizeX = x2 - x1;
            const sizeY = y2 - y1;

            for (let i = 0; i < this.cornerSteps + 1; i++) {
                sum += i;
                map.push(sum);
            }

            const stepWidth = (index, size) => {
                return (size / map[this.cornerSteps]) * map[index];
            };

            for (let i = 0; i < this.cornerSteps; i++) {
                const currentX = stepWidth(i, sizeX) + x1;
                const currentY = stepWidth(this.cornerSteps - i, sizeY) + y1;
                const nextX = stepWidth(i + 1, sizeX) + x1;
                const nextY = stepWidth(this.cornerSteps - i - 1, sizeY) + y1;
                tableMap.push(this.fromToVec(currentX, currentY, nextX, nextY));
            }
        };
        tableMap.push(this.fromToVec(-(goalWidth / 2), centerY, -(goalWidth / 2) - endLength, centerY));
        tableMap.push(this.fromToVec(goalWidth / 2, centerY, goalWidth / 2 + endLength, centerY));
        tableMap.push(this.fromToVec(-(goalWidth / 2), centerY + goalDepth, goalWidth / 2, centerY + goalDepth));
        tableMap.push(this.fromToVec(-(goalWidth / 2), centerY + goalDepth, -(goalWidth / 2), centerY));
        tableMap.push(this.fromToVec(goalWidth / 2, centerY + goalDepth, goalWidth / 2, centerY));
        tableMap.push(this.fromToVec(centerX, centerY - cornerRadius, centerX, -centerY + cornerRadius));
        tableMap.push(this.fromToVec(-centerX, centerY - cornerRadius, -centerX, -centerY + cornerRadius));
        tableMap.push(this.fromToVec(-(goalWidth / 2), -centerY, -(goalWidth / 2) - endLength, -centerY));
        tableMap.push(this.fromToVec(goalWidth / 2, -centerY, goalWidth / 2 + endLength, -centerY));
        tableMap.push(this.fromToVec(-(goalWidth / 2), -centerY - goalDepth, goalWidth / 2, -centerY - goalDepth));
        tableMap.push(this.fromToVec(-(goalWidth / 2), -centerY - goalDepth, -(goalWidth / 2), -centerY));
        tableMap.push(this.fromToVec(goalWidth / 2, -centerY - goalDepth, goalWidth / 2, -centerY));

        createCorner(centerX, centerY, centerX - cornerRadius, centerY - cornerRadius);
        createCorner(-centerX, centerY, -centerX + cornerRadius, centerY - cornerRadius);
        createCorner(centerX, -centerY, centerX - cornerRadius, -centerY + cornerRadius);
        createCorner(-centerX, -centerY, -centerX + cornerRadius, -centerY + cornerRadius);

        return tableMap;
    }
    fromToVec(x1, y1, x2, y2) {
        return {
            from: {
                x: x1,
                y: y1,
            },
            to: {
                x: x2,
                y: y2,
            },
        };
    }
}

export default new Field();
