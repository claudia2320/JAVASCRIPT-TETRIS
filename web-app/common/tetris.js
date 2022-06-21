
/**
 * @namespace Tetris 
 * @author Claudia Moreno
 * @version 2021/22
 */
const Tetris = Object.create(null);

/**
 * A Board is an rectangular grid that tokens can be placed into one at a time.
 * It is implemented as an array of columns of empty cells or tokens
 * @memberof Tetris
 * @typedef {Tetris.Token_or_empty[][]} Board
 */

/**
 * Create a new empty board.
 * With specified dimensions
 * @memberof Tetris
 * @function
 * @param {number} [width = 10] The width of the new board.
 * @param {number} [height = 20] The height of the new board.
 */
Connect4.empty_board = function (width = 10, height = 20) {
    return R.repeat(R.repeat(0, height), width);
};



