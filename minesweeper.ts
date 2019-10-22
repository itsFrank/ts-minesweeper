import * as rl from 'readline-sync'

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

enum MoveType {
    UNCOVER,
    FLAG,
    INVALID
}

class PlayerMove {
    move : MoveType = undefined
    x : number
    y : number
}

function printMoveHelp() {
    console.log("A valid move is of the form: <move> <x index> <y index>")
    console.log("Uncover cell (2,3) : u 2 3")
    console.log("Toggle flag on cell (2,3) : ! 2 3")
}

// prompt playe for their next move (format: <move> <x index> <y index>)
function promptPlayerMove(board : Board) : PlayerMove {
    let playerMove = new PlayerMove
    let moveValid : boolean = false

    while (!moveValid) {
        let answer : string = rl.question("Next move: ")
        let splitAnswer : string[] = answer.split(" ")

        // Validate move string has correct number of parameters
        if (splitAnswer.length != 3) {
            printMoveHelp()
            continue
        }

        let parsedX : number = Math.floor(parseInt(splitAnswer[1]))
        let parsedY : number = Math.floor(parseInt(splitAnswer[2]))
        // Validate x and y are integers and within the gameboard
        if (isNaN(parsedX) || isNaN(parsedY) || !board.withinBoard(parsedX, parsedY)) {
            printMoveHelp()
            continue
        }
        
        // Assign move parameters
        playerMove.x = parsedX
        playerMove.y = parsedY

        switch (splitAnswer[0].toLowerCase()) {
            case "u":
                playerMove.move = MoveType.UNCOVER
                break
            case "!":
                playerMove.move = MoveType.FLAG
                break
            default:
                playerMove.move = MoveType.INVALID
        }

        // Validate move character is valid
        if (playerMove.move == MoveType.INVALID) {
            printMoveHelp()
            continue
        }

        moveValid = true
    }
    
    return playerMove;
}

// Basic cell class
class Cell {

    public isMine : boolean
    public hidden : boolean
    public isFlagged : boolean
    public value : number

    constructor() {
        this.isMine = false
        this.hidden = true
        this.isFlagged = false    
        this.value = 0
    }
}

// Game board class
class Board {
    private dimension : number
    private cells : Cell[]

    constructor(dimension : number, numMines : number) {
        this.dimension = dimension
        this.cells = []
        let possibleMines : number[] = [] // Use this to efficiently generate mines
        
        // Generate empty gameboard
        for (let i = 0; i < dimension * dimension; i++) {
            this.cells.push(new Cell())
            possibleMines[i] = i
        }

        for (let i = 0; i < numMines; i++) {
            let possibilityIndex = randomInt(0, possibleMines.length)
            let cellIndex = possibleMines[possibilityIndex]
            possibleMines.splice(possibilityIndex, 1)

            if (this.cells[cellIndex].isMine) throw new Error(`Mine double assigned at index ${cellIndex}`)
            this.cells[cellIndex].isMine = true
        }
        
        // Assign neighboring mines values to all cells
        for (let x = 0; x < dimension; x++) {
            for (let y = 0; y < dimension; y++) {
                let index = (y* this.dimension) + x
                
                let mineCount : number = 0
                for (let i = Math.max(0, x-1); i < Math.min(dimension, x+2); i++) {
                    for (let j = Math.max(0, y-1); j < Math.min(dimension, y+2); j++) {
                        if (i == x && j == y) continue
                        if (this.getCell(i, j).isMine) mineCount++
                    }
                }

                this.cells[index].value = mineCount
            }
        }
    }

    public getCell(x : number, y : number) : Cell {
        let index = (y* this.dimension) + x
        return this.cells[index]
    }

    // Check if all cells are either uncovered or mines
    public isGameWon() : boolean {
        for (let i = 0; i < this.dimension * this.dimension; i++) {
            if (this.cells[i].isMine) continue
            if (this.cells[i].hidden) return false
        }
        return true
    }

    // Generate console string for a single row
    private constructRowString(startIndex : number) : string {
        let rowString : string = ""
        for (let i = startIndex; i < startIndex + this.dimension; i++) {
            if (!this.cells[i].hidden) {
                if (this.cells[i].isMine) rowString += "@ "     
                else {
                    rowString += `${this.cells[i].value} `      
                }            
            } else {
                if (this.cells[i].isFlagged) rowString += "! "
                else rowString += ". "
            }  
        }
        return rowString
    }

    // Print board to console
    public print() {
        let currentRowStart : number = 0
        
        // Print row header & separator
        let headerString : string = ""
        let separatorString : string = ""
        for (let i = 0; i < this.dimension; i++) {
            headerString += `${i} `
            separatorString += "--"
        }  
        separatorString += "-"
        console.log(headerString)
        console.log(separatorString)
        
        // Print each row
        for (let i = 0; i < this.dimension; i++) {
            console.log(this.constructRowString(currentRowStart) + `| ${i}`) // row string plus row number
            currentRowStart += this.dimension
        }
    }

    public withinBoard(x : number, y: number) : boolean {
        if (x < 0 || y < 0) return false
        if (x >= this.dimension || y >= this.dimension) return false
        return true
    } 

    public toggleFlag(x : number, y: number) {
        let index = (y* this.dimension) + x
        this.cells[index].isFlagged = !this.cells[index].isFlagged
    }
    
    // used by recursizeUncoverZero
    private uncoverSimple(x : number, y: number) { 
        let index = (y* this.dimension) + x
        this.cells[index].hidden = false
    }
    
    // recursive function to uncover connected components of cells wiht a value of 0
    private recursizeUncoverZero(x : number, y: number) {
        let offsets : number[][] = [[-1, 0], [1,  0], [0, -1], [0,  1]]

        for (let k = 0; k < offsets.length; k++) {
            let pair : number[] = offsets[k]

            let i = Math.max(0, Math.min(x + pair[0], this.dimension-1))
            let j = Math.max(0, Math.min(y + pair[1], this.dimension-1))

            if (this.getCell(i, j).value == 0 && this.getCell(i, j).hidden) {
                this.uncoverSimple(i, j)
                this.recursizeUncoverZero(i, j)
            } else {
                this.uncoverSimple(i, j)
            }
        };
    }

    // Return value - true : safe move, false, it was a mine
    public uncoverCell(x : number, y: number) : boolean {
        let index = (y* this.dimension) + x
        if (this.cells[index].isMine) return false
        
        this.uncoverSimple(x, y)
        if (this.cells[index].value == 0) this.recursizeUncoverZero(x, y)

        return true
    }

    public uncoverAllCells() {
        for (let i = 0; i < this.dimension * this.dimension; i++) {
            this.cells[i].hidden = false
            this.cells[i].isFlagged = false
        }
    }
}

let board : Board

// Get gameboard size from user
let boardDimension = -1
let numMines = -1

// Get board dimension from user
while (boardDimension == -1) {
    let answer : string = rl.question("Gameboard dimension: ")
    let parsedAnswer : number = Math.floor(parseInt(answer))
    if (isNaN(parsedAnswer) || parsedAnswer < 1) {
        console.log("Please enter a valid gameboard size (number > 0)")
    } else {
        boardDimension = parsedAnswer
    }
}

// Get num mines from user
while (numMines == -1) {
    let answer : string = rl.question("Number of Mines: ")
    let parsedAnswer : number = Math.floor(parseInt(answer))
    if (isNaN(parsedAnswer) || parsedAnswer < 0 || parsedAnswer >= (boardDimension * boardDimension)) {
        console.log("Please enter a valid mine count (#mines >= 0 and #mines < #cells)")
    } else {
        numMines = parsedAnswer
    }
}

// Generate board
console.log("Generating game board...")
board = new Board(boardDimension, numMines)


// Initial console output
console.log("\n")
printMoveHelp() // print move help once at the start of every new game
console.log("")


// Main game loop
let gameEnd : boolean = false
let playerMove : PlayerMove
let hitMine : boolean
while (!gameEnd) {
    // Print current board state
    console.log("")
    board.print()
    
    console.log("")
    playerMove = promptPlayerMove(board) 
    
    hitMine = false;
    if (playerMove.move == MoveType.FLAG) board.toggleFlag(playerMove.x, playerMove.y)  
    else if (playerMove.move == MoveType.UNCOVER) hitMine = !board.uncoverCell(playerMove.x, playerMove.y) 

    gameEnd = hitMine || board.isGameWon()
}

board.uncoverAllCells()
console.log("")
board.print()
console.log("")

if (hitMine) console.log(`Game Over: Cell at ( ${playerMove.x}, ${playerMove.y} ) was a mine`)
else console.log("You Win!")
