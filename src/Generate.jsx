const GenSameBoundary = (prevTriangles) => {
    // Shape definitions:
    // 0 = 1, 1 = 11, 2 = V, 3 = O
    let shapes = [0, 1, 2, 3];
    let matches = {
        0: 2,
        1: 3,
        2: 0,
        3: 1
    };

    let boundary = 1;

    let rowsData = [
        { len: 2, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 4, face: -1 },
        { len: 4, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 2, face: -1 },
    ];

    let solution = Array.from({ length: rowsData.length }, (_, i) =>
        Array(rowsData[i].len).fill(null)
    );
    let prevData = []
    prevTriangles.map((row) => {
        row.map((item) => {
            prevData.push(`${item}`)
        })
    })
    let isBoundary = (i, j, inx) => {
        let mid = Math.floor(rowsData.length / 2);
        if ((i === 0 && inx === 0) || (i === rowsData.length - 1 && inx === 0)) return true;
        if (i < mid && rowsData[i].face === -1) {
            return (j === 0 && inx === 1) || (j === rowsData[i].len - 1 && inx === 2);
        }
        if (i >= mid && rowsData[i].face === 1) {
            return (j === 0 && inx === 2) || (j === rowsData[i].len - 1 && inx === 1);
        }
        return false;
    };

    function getAllCombinationsRecursive(a) {
        if (a.length === 0) return [[]];
        if (a.length === 1) return a[0].map(x => [x]);

        const first = a[0];
        const rest = getAllCombinationsRecursive(a.slice(1));
        const result = [];
        for (const item of first) {
            for (const combo of rest) {
                result.push([item, ...combo]);
            }
        }
        return result;
    }

    let getMatchSymbols = (i, j) => {
        let symbols = [[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]];
        if (i > 0) {
            let mid = Math.floor(rowsData.length / 2);
            if (!isBoundary(i, j, 0)) {
                if (rowsData[i].face == 1) {
                    let above = solution[i - 1][j];
                    if (above) symbols[0] = [above[0], matches[above[0]]];
                }
            } else {
                symbols[0] = [boundary]
            }
            if (!isBoundary(i, j, 1)) {
                if (i < mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j - 1];
                    if (left) symbols[1] = [left[1], matches[left[1]]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j];
                    if (left) symbols[1] = [left[1], matches[left[1]]];
                }

            } else {
                symbols[1] = [boundary]
            }

            if (!isBoundary(i, j, 2)) {
                if (i < mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j];
                    if (right) symbols[2] = [right[2], matches[right[2]]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j + 1];
                    if (right) symbols[2] = [right[2], matches[right[2]]];
                }
            } else {
                symbols[2] = [boundary]
            }
        } else {
            symbols[0] = [boundary]
        }
        return symbols;
    };
    let num = 0

    let backtracking = (i, j, currentPrevData) => {
        if (i >= rowsData.length) return true;
        num += 1
        let nextI = i, nextJ = j + 1;
        if (nextJ >= rowsData[i].len) {
            nextI += 1;
            nextJ = 0;
        }
        let matchSymbols = getMatchSymbols(i, j);
        let possibles = getAllCombinationsRecursive(matchSymbols);
        for (let triangle of possibles) {
            let tempData = []
            let data = triangle
            for (let k = 0; k < 3; k += 1) {
                tempData.push(data)
                data = [data[2], data[0], data[1]]
            }
            for (let data of tempData) {
                let key = String(`${data}`)
                let foundIndex = currentPrevData.indexOf(key)
                if (foundIndex !== -1) {
                    let tempPrevData = currentPrevData.filter((item, inx) => inx !== foundIndex)
                    solution[i][j] = triangle;
                    if (backtracking(nextI, nextJ, tempPrevData)) return true;
                    solution[i][j] = null;
                    break
                }
            }
        }

        return false;
    };
    if (backtracking(0, 0, prevData)) {
        return solution
    }
    return null
}


const removeSymbol = (remI = 0, remJ = 0, prevTriangles) => {
    // Shape definitions:
    // 0 = 1, 1 = 11, 2 = V, 3 = O
    let shapes = [0, 1, 2, 3];
    let matches = {
        0: [0, 2],
        1: [1, 3],
        2: [0, 2],
        3: [1, 3]
    };
    if (matches[remI].indexOf(remJ) != -1) {
        matches[remI] = matches[remI].filter((item) => item != remJ)
    }
    if (matches[remJ].indexOf(remI) != -1) {
        matches[remJ] = matches[remJ].filter((item) => item != remI)
    }

    let rowsData = [
        { len: 2, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 4, face: -1 },
        { len: 4, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 2, face: -1 },
    ];

    let solution = Array.from({ length: rowsData.length }, (_, i) =>
        Array(rowsData[i].len).fill(null)
    );
    let prevData = []
    prevTriangles.map((row) => {
        row.map((item) => {
            prevData.push(`${item}`)
        })
    })

    let isBoundary = (i, j, inx) => {
        let mid = Math.floor(rowsData.length / 2);
        if ((i === 0 && inx === 0) || (i === rowsData.length - 1 && inx === 0)) return true;
        if (i < mid && rowsData[i].face === -1) {
            return (j === 0 && inx === 1) || (j === rowsData[i].len - 1 && inx === 2);
        }
        if (i >= mid && rowsData[i].face === 1) {
            return (j === 0 && inx === 2) || (j === rowsData[i].len - 1 && inx === 1);
        }
        return false;
    };

    function getAllCombinationsRecursive(a) {
        if (a.length === 0) return [[]];
        if (a.length === 1) return a[0].map(x => [x]);

        const first = a[0];
        const rest = getAllCombinationsRecursive(a.slice(1));
        const result = [];
        for (const item of first) {
            for (const combo of rest) {
                result.push([item, ...combo]);
            }
        }
        return result;
    }

    let getMatchSymbols = (i, j) => {
        let symbols = [[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]];
        if (i > 0) {
            let mid = Math.floor(rowsData.length / 2);
            if (!isBoundary(i, j, 0)) {
                if (rowsData[i].face == 1) {
                    let above = solution[i - 1][j];
                    if (above) symbols[0] = matches[above[0]];
                }
            }
            if (!isBoundary(i, j, 1)) {
                if (i < mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j - 1];
                    if (left) symbols[1] = matches[left[1]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j];
                    if (left) symbols[1] = matches[left[1]];
                }

            }
            if (!isBoundary(i, j, 2)) {
                if (i < mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j];
                    if (right) symbols[2] = matches[right[2]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j + 1];
                    if (right) symbols[2] = matches[right[2]];
                }
            }
        }
        return symbols;
    };
    let num = 0

    let backtracking = (i, j, currentPrevData) => {
        if (i >= rowsData.length) return true;
        num += 1
        let nextI = i, nextJ = j + 1;
        if (nextJ >= rowsData[i].len) {
            nextI += 1;
            nextJ = 0;
        }
        let matchSymbols = getMatchSymbols(i, j);
        let possibles = getAllCombinationsRecursive(matchSymbols);
        for (let triangle of possibles) {
            let tempData = []
            let data = triangle
            for (let k = 0; k < 3; k += 1) {
                tempData.push(data)
                data = [data[2], data[0], data[1]]
            }
            for (let data of tempData) {
                let key = String(`${data}`)
                let foundIndex = currentPrevData.indexOf(key)
                if (foundIndex !== -1) {
                    let tempPrevData = currentPrevData.filter((item, inx) => inx !== foundIndex)
                    solution[i][j] = triangle;
                    if (backtracking(nextI, nextJ, tempPrevData)) return true;
                    solution[i][j] = null;
                    break
                }
            }
        }
        return false;
    };
    if (backtracking(0, 0, prevData)) {
        return solution
    }
    return null

}


const withoutX = (prevTriangles) => {
    // Shape definitions:
    // 0 = 1, 1 = 11, 2 = V, 3 = O
    let shapes = [0, 1, 2, 3];
    let matches = {
        0: [0, 2],
        1: [1, 3],
        2: [0, 2],
        3: [1]
    };
    let rowsData = [
        { len: 2, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 4, face: -1 },
        { len: 4, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 2, face: -1 },
    ];

    let solution = Array.from({ length: rowsData.length }, (_, i) =>
        Array(rowsData[i].len).fill(null)
    );
    let replaceData = {
        0: 1,
        1: 0,
        2: 3,
        3: 2
    }
    let prevData = []
    prevTriangles.map((row) => {
        row.map((item) => {
            prevData.push(`${[replaceData[item[0]], replaceData[item[1]], replaceData[item[2]]]}`)
        })
    })

    let isBoundary = (i, j, inx) => {
        let mid = Math.floor(rowsData.length / 2);
        if ((i === 0 && inx === 0) || (i === rowsData.length - 1 && inx === 0)) return true;
        if (i < mid && rowsData[i].face === -1) {
            return (j === 0 && inx === 1) || (j === rowsData[i].len - 1 && inx === 2);
        }
        if (i >= mid && rowsData[i].face === 1) {
            return (j === 0 && inx === 2) || (j === rowsData[i].len - 1 && inx === 1);
        }
        return false;
    };

    function getAllCombinationsRecursive(a) {
        if (a.length === 0) return [[]];
        if (a.length === 1) return a[0].map(x => [x]);

        const first = a[0];
        const rest = getAllCombinationsRecursive(a.slice(1));
        const result = [];
        for (const item of first) {
            for (const combo of rest) {
                result.push([item, ...combo]);
            }
        }
        return result;
    }

    let getMatchSymbols = (i, j) => {
        let symbols = [[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]];
        if (i > 0) {
            let mid = Math.floor(rowsData.length / 2);
            if (!isBoundary(i, j, 0)) {
                if (rowsData[i].face == 1) {
                    let above = solution[i - 1][j];
                    if (above) symbols[0] = matches[above[0]];
                }
            }
            if (!isBoundary(i, j, 1)) {
                if (i < mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j - 1];
                    if (left) symbols[1] = matches[left[1]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j];
                    if (left) symbols[1] = matches[left[1]];
                }

            }
            if (!isBoundary(i, j, 2)) {
                if (i < mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j];
                    if (right) symbols[2] = matches[right[2]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j + 1];
                    if (right) symbols[2] = matches[right[2]];
                }
            }
        }
        return symbols;
    };
    let num = 0
    let backtracking = (i, j, currentPrevData) => {
        if (i >= rowsData.length) return true;
        let nextI = i, nextJ = j + 1;
        if (nextJ >= rowsData[i].len) {
            nextI += 1;
            nextJ = 0;
        }
        let matchSymbols = getMatchSymbols(i, j);
        let possibles = getAllCombinationsRecursive(matchSymbols);
        for (let triangle of possibles) {
            let tempData = []
            let data = triangle
            for (let k = 0; k < 3; k += 1) {
                tempData.push(data)
                data = [data[2], data[0], data[1]]
            }
            for (let data of tempData) {
                let key = String(`${data}`)
                let foundIndex = currentPrevData.indexOf(key)
                if (foundIndex !== -1) {
                    let tempPrevData = currentPrevData.filter((item, inx) => inx !== foundIndex)
                    solution[i][j] = triangle;
                    if (backtracking(nextI, nextJ, tempPrevData)) return true;
                    solution[i][j] = null;
                    break
                }
            }
        }

        return false;
    };
    if (backtracking(0, 0, prevData)) {
        for (let i = 0; i < solution.length; i += 1) {
            for (let j = 0; j < solution[i].length; j += 1) {
                solution[i][j] = [replaceData[solution[i][j][0]], replaceData[solution[i][j][1]], replaceData[solution[i][j][2]]]
            }
        }
        return solution
    }
    return null

}


const OnlycertainSymbols = (prevTriangles) => {
    // Shape definitions:
    // 0 = 1, 1 = 11, 2 = V, 3 = O
    let shapes = [0, 1, 2, 3];
    let matches = {
        0: [2],
        1: [3],
        2: [0],
        3: [1, 3]
    };
    let rowsData = [
        { len: 2, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 4, face: -1 },
        { len: 4, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 2, face: -1 },
    ];

    let solution = Array.from({ length: rowsData.length }, (_, i) =>
        Array(rowsData[i].len).fill(null)
    );
    let prevData = []
    prevTriangles.map((row) => {
        row.map((item) => {
            prevData.push(`${item}`)
        })
    })

    let isBoundary = (i, j, inx) => {
        let mid = Math.floor(rowsData.length / 2);
        if ((i === 0 && inx === 0) || (i === rowsData.length - 1 && inx === 0)) return true;
        if (i < mid && rowsData[i].face === -1) {
            return (j === 0 && inx === 1) || (j === rowsData[i].len - 1 && inx === 2);
        }
        if (i >= mid && rowsData[i].face === 1) {
            return (j === 0 && inx === 2) || (j === rowsData[i].len - 1 && inx === 1);
        }
        return false;
    };

    function getAllCombinationsRecursive(a) {
        if (a.length === 0) return [[]];
        if (a.length === 1) return a[0].map(x => [x]);

        const first = a[0];
        const rest = getAllCombinationsRecursive(a.slice(1));
        const result = [];
        for (const item of first) {
            for (const combo of rest) {
                result.push([item, ...combo]);
            }
        }
        return result;
    }

    let getMatchSymbols = (i, j) => {
        let symbols = [[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]];
        if (i > 0) {
            let mid = Math.floor(rowsData.length / 2);
            if (!isBoundary(i, j, 0)) {
                if (rowsData[i].face == 1) {
                    let above = solution[i - 1][j];
                    if (above) symbols[0] = matches[above[0]];
                }
            }
            if (!isBoundary(i, j, 1)) {
                if (i < mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j - 1];
                    if (left) symbols[1] = matches[left[1]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j];
                    if (left) symbols[1] = matches[left[1]];
                }

            }
            if (!isBoundary(i, j, 2)) {
                if (i < mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j];
                    if (right) symbols[2] = matches[right[2]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j + 1];
                    if (right) symbols[2] = matches[right[2]];
                }
            }
        }
        return symbols;
    };
    let num = 0

    let backtracking = (i, j, currentPrevData) => {
        if (i >= rowsData.length) return true;
        num += 1
        let nextI = i, nextJ = j + 1;
        if (nextJ >= rowsData[i].len) {
            nextI += 1;
            nextJ = 0;
        }
        let matchSymbols = getMatchSymbols(i, j);
        let possibles = getAllCombinationsRecursive(matchSymbols);
        for (let triangle of possibles) {
            let tempData = []
            let data = triangle
            for (let k = 0; k < 3; k += 1) {
                tempData.push(data)
                data = [data[2], data[0], data[1]]
            }
            for (let data of tempData) {
                let key = String(`${data}`)
                let foundIndex = currentPrevData.indexOf(key)
                if (foundIndex !== -1) {
                    let tempPrevData = currentPrevData.filter((item, inx) => inx !== foundIndex)
                    solution[i][j] = triangle;
                    if (backtracking(nextI, nextJ, tempPrevData)) return true;
                    solution[i][j] = null;
                    break
                }
            }
        }

        return false;
    };
    if (backtracking(0, 0, prevData)) {
        return solution
    }
    return null

}

const GenSolution = () => {
    // Shape definitions:
    // 0 = 1, 1 = 11, 2 = V, 3 = O
    let shapes = [0, 1, 2, 3];
    let AllSolution = {}
    let matches = {
        0: [0, 2],
        1: [1, 3],
        2: [0, 2],
        3: [1, 3]
    };
    let rowsData = [
        { len: 2, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 4, face: -1 },
        { len: 4, face: 1 },
        { len: 3, face: -1 },
        { len: 3, face: 1 },
        { len: 2, face: -1 },
    ];

    let solution = Array.from({ length: rowsData.length }, (_, i) =>
        Array(rowsData[i].len).fill(null)
    );

    let isPlaced = (data) => {
        let tempData = []
        for (let i = 0; i < 3; i += 1) {
            tempData.push([...data])
            data = [data[2], data[0], data[1]]
        }
        for (let row of solution) {
            for (let cell of row) {
                for (let testData of tempData) {
                    if (cell && cell[0] === testData[0] && cell[1] === testData[1] && cell[2] === testData[2]) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    let isBoundary = (i, j, inx) => {
        let mid = Math.floor(rowsData.length / 2);
        if ((i === 0 && inx === 0) || (i === rowsData.length - 1 && inx === 0)) return true;
        if (i < mid && rowsData[i].face === -1) {
            return (j === 0 && inx === 1) || (j === rowsData[i].len - 1 && inx === 2);
        }
        if (i >= mid && rowsData[i].face === 1) {
            return (j === 0 && inx === 2) || (j === rowsData[i].len - 1 && inx === 1);
        }
        return false;
    };

    function getAllCombinationsRecursive(a) {
        if (a.length === 0) return [[]];
        if (a.length === 1) return a[0].map(x => [x]);
        const first = a[0];
        const rest = getAllCombinationsRecursive(a.slice(1));
        const result = [];
        for (const item of first) {
            for (const combo of rest) {
                result.push([item, ...combo]);
            }
        }
        return result;
    }

    let getMatchSymbols = (i, j) => {
        let symbols = [[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]];
        if (i > 0) {
            let mid = Math.floor(rowsData.length / 2);
            if (!isBoundary(i, j, 0)) {
                if (rowsData[i].face == 1) {
                    let above = solution[i - 1][j];
                    if (above) symbols[0] = matches[above[0]];
                }
            }
            if (!isBoundary(i, j, 1)) {
                if (i < mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j - 1];
                    if (left) symbols[1] = matches[left[1]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let left = solution[i - 1][j];
                    if (left) symbols[1] = matches[left[1]];
                }

            }
            if (!isBoundary(i, j, 2)) {
                if (i < mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j];
                    if (right) symbols[2] = matches[right[2]];
                }
                if (i >= mid && rowsData[i].face == -1) {
                    let right = solution[i - 1][j + 1];
                    if (right) symbols[2] = matches[right[2]];
                }
            }
        }
        return symbols;
    };
    let num = 0
    let removeElements = [[0, 0], [1, 1], [3, 3], [0, 2], [1, 3]]
    let backtracking = (i, j) => {
        if (i >= rowsData.length) {
            let sameBoundSolution = GenSameBoundary(JSON.parse(JSON.stringify(solution)))
            let solutions = []
            let withoutXSolution = withoutX(JSON.parse(JSON.stringify(solution)))
            if (sameBoundSolution) {
                if (withoutXSolution) {
                    let k = 0
                    while (k < removeElements.length) {
                        let removedSolution = removeSymbol(removeElements[k][0], removeElements[k][1], JSON.parse(JSON.stringify(solution)))
                        if (removedSolution) {
                            solutions.push(removedSolution)
                            k += 1
                        } else {
                            break
                        }
                    }
                    if (k == removeElements.length) {
                        let certainSolution = OnlycertainSymbols(JSON.parse(JSON.stringify(solution)))
                        if (certainSolution) {
                            AllSolution["normal"] = solution
                            AllSolution["same"] = sameBoundSolution
                            for (let m = 0; m < solutions.length; m += 1) {
                                AllSolution[`${removeElements[m]}`] = solutions[m];
                            }
                            AllSolution["2,2"] = withoutXSolution
                            AllSolution["you"] = certainSolution
                            return true
                        }

                    }
                }

            }
            return false
        };
        num += 1
        let nextI = i, nextJ = j + 1;
        if (nextJ >= rowsData[i].len) {
            nextI += 1;
            nextJ = 0;
        }
        let matchSymbols = getMatchSymbols(i, j);
        let possibles = getAllCombinationsRecursive(matchSymbols);
        for (let triangle of possibles) {
            if (!isPlaced(triangle)) {
                solution[i][j] = triangle;
                if (backtracking(nextI, nextJ)) return true;
                solution[i][j] = null;
            }
        }

        return false;
    };

    backtracking(0, 0);
    return AllSolution

}
export { GenSolution }