# Typescript Minesweeper

A super simple console version of Minesweeper I made to practice formy Triplebyte interview. From start to finish it took ~2h 10m.

To play just `npm i` and `ts-node minesweeper.ts`

Sample output:

```
> ts-node minesweeper.ts  
Gameboard dimension: 10 
Number of Mines: 5 
Generating game board... 


A valid move is of the form: <move> <x index> <y index>
Uncover cell (2,3) : u 2 3
Toggle flag on cell (2,3) : ! 2 3


0 1 2 3 4 5 6 7 8 9
---------------------
. . . . . . . . . . | 0
. . . . . . . . . . | 1
. . . . . . . . . . | 2
. . . . . . . . . . | 3
. . . . . . . . . . | 4 
. . . . . . . . . . | 5
. . . . . . . . . . | 6
. . . . . . . . . . | 7
. . . . . . . . . . | 8
. . . . . . . . . . | 9

Next move: u 4 4 

0 1 2 3 4 5 6 7 8 9
---------------------
. . 1 0 0 0 0 0 0 0 | 0
. . 1 0 0 0 0 0 0 0 | 1
1 1 1 0 0 0 0 1 1 1 | 2
0 0 0 0 0 0 0 1 . . | 3
1 1 0 0 0 0 1 . . . | 4
. 1 0 0 0 0 1 . . . | 5 
1 1 0 0 0 0 1 1 . . | 6
0 0 0 0 0 0 0 0 1 . | 7
0 0 0 0 0 0 0 0 1 1 | 8
0 0 0 0 0 0 0 0 0 0 | 9

Next move: ! 7 5 

0 1 2 3 4 5 6 7 8 9
---------------------
. . 1 0 0 0 0 0 0 0 | 0
. . 1 0 0 0 0 0 0 0 | 1
1 1 1 0 0 0 0 1 1 1 | 2
0 0 0 0 0 0 0 1 . . | 3
1 1 0 0 0 0 1 . . . | 4
. 1 0 0 0 0 1 ! . . | 5
1 1 0 0 0 0 1 1 . . | 6 
0 0 0 0 0 0 0 0 1 . | 7
0 0 0 0 0 0 0 0 1 1 | 8
0 0 0 0 0 0 0 0 0 0 | 9

Next move: u 9 7 

0 1 2 3 4 5 6 7 8 9
---------------------
1 1 1 0 0 0 0 0 0 0 | 0
1 @ 1 0 0 0 0 0 0 0 | 1
1 1 1 0 0 0 0 1 1 1 | 2
0 0 0 0 0 0 0 1 @ 1 | 3
1 1 0 0 0 0 1 2 2 1 | 4
@ 1 0 0 0 0 1 @ 1 0 | 5 
1 1 0 0 0 0 1 1 2 1 | 6
0 0 0 0 0 0 0 0 1 @ | 7
0 0 0 0 0 0 0 0 1 1 | 8
0 0 0 0 0 0 0 0 0 0 | 9

Game Over: Cell at ( 9, 7 ) was a mine
```