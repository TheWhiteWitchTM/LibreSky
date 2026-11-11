import { escapeHtml, messageSender, parseGameMessage } from './util.js';

// Square 0 is a8. Rank 1 sits on index 56. A dark square has an odd file+rank sum.
const FILES = 'abcdefgh';
const RAYS = {
  b: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
  r: [[1, 0], [-1, 0], [0, 1], [0, -1]],
  q: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
  n: [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]],
  k: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
};
const VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
const PST = {
  p: [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -25, -25, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  n: [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 5, 5, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50],
  b: [-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 8, 10, 10, 8, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 10, 0, 0, 0, 0, 10, -10, -20, -10, -10, -10, -10, -10, -10, -20],
  r: [0, 0, 0, 5, 5, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0],
  q: [-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20],
  k: [-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20],
};
const REVERSI_WEIGHT = [
  120, -20, 20, 5, 5, 20, -20, 120,
  -20, -40, -5, -5, -5, -5, -40, -20,
  20, -5, 15, 3, 3, 15, -5, 20,
  5, -5, 3, 3, 3, 3, -5, 5,
  5, -5, 3, 3, 3, 3, -5, 5,
  20, -5, 15, 3, 3, 15, -5, 20,
  -20, -40, -5, -5, -5, -5, -40, -20,
  120, -20, 20, 5, 5, 20, -20, 120,
];
const BOOK = new Map([
  ['', ['e2e4', 'd2d4', 'g1f3', 'c2c4']],
  ['e2e4', ['e7e5', 'c7c5', 'e7e6', 'c7c6']],
  ['d2d4', ['d7d5', 'g8f6', 'e7e6']],
  ['e2e4 e7e5', ['g1f3', 'f1c4']],
  ['e2e4 c7c5', ['g1f3', 'b1c3']],
  ['e2e4 e7e5 g1f3', ['b8c6', 'g8f6']],
  ['e2e4 e7e5 g1f3 b8c6', ['f1b5', 'f1c4']],
  ['d2d4 d7d5', ['c2c4', 'g1f3']],
  ['d2d4 g8f6', ['c2c4', 'g1f3']],
]);
const SAMPLES = {
  chess: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5', 'c2c3', 'g8f6'],
  checkers: ['c3-d4', 'b6-a5', 'e3-f4', 'd6-c5'],
  reversi: ['f5', 'd6', 'c5'],
  fox: ['b8-a7', 'e1-d2', 'd8-c7', 'd2-e3'],
  break: ['e2e3', 'd7d6', 'e3e4', 'd6d5'],
};
const REASON = {
  checkmate: 'Checkmate',
  stalemate: 'Stalemate',
  material: 'Not enough pieces',
  fifty: 'Fifty moves',
  repeat: 'Repeated position',
  count: 'No pieces left',
  blocked: 'No moves left',
  goal: 'Reached the last rank',
  trapped: 'The fox is trapped',
  escape: 'The fox got through',
  full: 'The board is full',
};

export const GAMES = [
  { id: 'chess', name: 'Chess', blurb: 'Checkmate the king. Castling, en passant, and promotion are in.', sides: [['w', 'White'], ['b', 'Black']] },
  { id: 'checkers', name: 'Checkers', blurb: 'English draughts. Jump when you can. A king moves one square.', sides: [['w', 'White'], ['b', 'Black']] },
  { id: 'reversi', name: 'Reversi', blurb: 'Flip a line of discs. Black starts. The higher count wins.', sides: [['b', 'Black'], ['w', 'White']] },
  { id: 'fox', name: 'Fox and hounds', blurb: 'Four hounds trap the fox. The fox wins by reaching the far rank.', sides: [['h', 'Hounds'], ['f', 'Fox']] },
  { id: 'break', name: 'Breakthrough', blurb: 'Race a pawn to the far rank. Capture on the diagonal.', sides: [['w', 'White'], ['b', 'Black']] },
];

export function gameById(id) {
  return GAMES.find((game) => game.id === id) || GAMES[0];
}

export function opposite(game, side) {
  if (game === 'fox') return side === 'h' ? 'f' : 'h';
  return side === 'w' ? 'b' : 'w';
}

export function flipped(game, you) {
  const bottom = { chess: 'w', checkers: 'w', reversi: 'b', fox: 'f', break: 'w' }[game] || 'w';
  return you !== bottom;
}

export function gameLine(rkey, game, kind, data = '') {
  return `!ls game ${rkey} ${game} ${kind}${data ? ` ${data}` : ''}`;
}

function fileOf(index) { return index % 8; }
function rankTop(index) { return Math.floor(index / 8); }
function onBoard(file, rank) { return file >= 0 && file < 8 && rank >= 0 && rank < 8; }
function at(file, rank) { return rank * 8 + file; }

export function sqName(index) {
  return FILES[fileOf(index)] + (8 - rankTop(index));
}

export function nameSq(name) {
  const file = FILES.indexOf(String(name || '').charAt(0));
  const rank = Number(String(name || '').charAt(1));
  if (file < 0 || rank < 1 || rank > 8) return -1;
  return at(file, 8 - rank);
}

function lightPiece(game, piece) {
  if (!piece) return false;
  if (game === 'checkers') return piece === 'w' || piece === 'W';
  if (game === 'reversi') return piece === 'w';
  if (game === 'fox') return piece === 'f';
  return piece === piece.toUpperCase();
}

function isWhiteChar(piece) {
  return piece === piece.toUpperCase();
}

function clock() {
  return (globalThis.performance || Date).now();
}

function emptyBoard() {
  return Array(64).fill('');
}

function baseState(id, board, turn) {
  return {
    id,
    board,
    turn,
    moves: [],
    sans: [],
    marks: [],
    note: '',
    castle: '',
    ep: -1,
    half: 0,
    full: 1,
    seen: null,
  };
}

export function startGame(id) {
  const board = emptyBoard();
  if (id === 'chess') {
    const back = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let file = 0; file < 8; file += 1) {
      board[file] = back[file];
      board[8 + file] = 'p';
      board[48 + file] = 'P';
      board[56 + file] = back[file].toUpperCase();
    }
    const state = baseState('chess', board, 'w');
    state.castle = 'KQkq';
    state.seen = {};
    state.seen[posKey(state)] = 1;
    return state;
  }
  if (id === 'checkers') {
    for (let index = 0; index < 64; index += 1) {
      if ((fileOf(index) + rankTop(index)) % 2 === 0) continue;
      const rank = rankTop(index);
      if (rank <= 2) board[index] = 'b';
      else if (rank >= 5) board[index] = 'w';
    }
    return baseState('checkers', board, 'w');
  }
  if (id === 'reversi') {
    board[nameSq('d5')] = 'b';
    board[nameSq('e5')] = 'w';
    board[nameSq('d4')] = 'w';
    board[nameSq('e4')] = 'b';
    return baseState('reversi', board, 'b');
  }
  if (id === 'fox') {
    ['b8', 'd8', 'f8', 'h8'].forEach((sq) => { board[nameSq(sq)] = 'h'; });
    board[nameSq('e1')] = 'f';
    return baseState('fox', board, 'h');
  }
  for (let file = 0; file < 8; file += 1) {
    board[at(file, 6)] = 'P';
    board[at(file, 7)] = 'P';
    board[at(file, 1)] = 'p';
    board[at(file, 0)] = 'p';
  }
  return baseState('break', board, 'w');
}

export function loadFen(fen) {
  const [boardPart, turn, castle, ep, half, full] = String(fen || '').trim().split(/\s+/);
  const board = emptyBoard();
  let index = 0;
  for (const char of boardPart || '') {
    if (char === '/') continue;
    if (/\d/.test(char)) index += Number(char);
    else if (index < 64) board[index += 1, index - 1] = char;
  }
  const state = baseState('chess', board, turn === 'b' ? 'b' : 'w');
  state.castle = !castle || castle === '-' ? '' : castle;
  state.ep = !ep || ep === '-' ? -1 : nameSq(ep);
  state.half = Number(half) || 0;
  state.full = Number(full) || 1;
  state.seen = { [posKey(state)]: 1 };
  return state;
}

export function boardState(id, cells, turn) {
  const state = startGame(id);
  state.board = emptyBoard();
  cells.forEach(([sq, piece]) => {
    const index = nameSq(sq);
    if (index >= 0) state.board[index] = piece;
  });
  state.turn = turn || state.turn;
  state.moves = [];
  state.sans = [];
  state.marks = [];
  state.note = '';
  if (id === 'chess') state.seen = { [posKey(state)]: 1 };
  return state;
}

function posKey(state) {
  return `${state.board.map((piece) => piece || '.').join('')} ${state.turn} ${state.castle} ${state.ep}`;
}

function attacked(board, index, byWhite) {
  const file = fileOf(index);
  const rank = rankTop(index);
  const pawnDir = byWhite ? 1 : -1;
  for (const df of [-1, 1]) {
    const look = onBoard(file + df, rank + pawnDir) ? board[at(file + df, rank + pawnDir)] : '';
    if (look && isWhiteChar(look) === byWhite && look.toLowerCase() === 'p') return true;
  }
  for (const [df, dr] of RAYS.n) {
    if (!onBoard(file + df, rank + dr)) continue;
    const piece = board[at(file + df, rank + dr)];
    if (piece && isWhiteChar(piece) === byWhite && piece.toLowerCase() === 'n') return true;
  }
  for (const [df, dr] of RAYS.k) {
    if (!onBoard(file + df, rank + dr)) continue;
    const piece = board[at(file + df, rank + dr)];
    if (piece && isWhiteChar(piece) === byWhite && piece.toLowerCase() === 'k') return true;
  }
  for (const [df, dr] of RAYS.q) {
    let f = file + df;
    let r = rank + dr;
    while (onBoard(f, r)) {
      const piece = board[at(f, r)];
      if (piece) {
        if (isWhiteChar(piece) === byWhite) {
          const kind = piece.toLowerCase();
          const diagonal = df !== 0 && dr !== 0;
          if (kind === 'q' || (diagonal && kind === 'b') || (!diagonal && kind === 'r')) return true;
        }
        break;
      }
      f += df;
      r += dr;
    }
  }
  return false;
}

function kingAttacked(state) {
  const white = state.turn === 'w';
  const king = state.board.indexOf(white ? 'K' : 'k');
  if (king < 0) return true;
  return attacked(state.board, king, !white);
}

function uciOf(move) {
  return sqName(move.from) + sqName(move.to) + (move.promo || '');
}

function castleDrop(castle, from, to, piece) {
  let next = castle;
  const rights = { 63: 'K', 56: 'Q', 7: 'k', 0: 'q' };
  if (piece.toLowerCase() === 'k') next = isWhiteChar(piece) ? next.replace(/[KQ]/g, '') : next.replace(/[kq]/g, '');
  if (rights[from]) next = next.replace(rights[from], '');
  if (rights[to]) next = next.replace(rights[to], '');
  return next;
}

function applyChessRaw(state, move) {
  const board = state.board.slice();
  const piece = board[move.from];
  const white = isWhiteChar(piece);
  const captured = board[move.to];
  board[move.from] = '';
  board[move.to] = move.promo ? (white ? move.promo.toUpperCase() : move.promo) : piece;
  if (move.ep) {
    const capRank = rankTop(move.to) + (white ? 1 : -1);
    board[at(fileOf(move.to), capRank)] = '';
  }
  if (piece.toLowerCase() === 'k' && Math.abs(fileOf(move.to) - fileOf(move.from)) === 2) {
    const rank = rankTop(move.from);
    const kingside = fileOf(move.to) === 6;
    const rookFrom = at(kingside ? 7 : 0, rank);
    const rookTo = at(kingside ? 5 : 3, rank);
    board[rookTo] = board[rookFrom];
    board[rookFrom] = '';
  }
  let ep = -1;
  if (piece.toLowerCase() === 'p' && Math.abs(rankTop(move.to) - rankTop(move.from)) === 2) {
    ep = at(fileOf(move.from), (rankTop(move.from) + rankTop(move.to)) / 2);
  }
  const child = {
    ...state,
    board,
    turn: white ? 'b' : 'w',
    castle: castleDrop(state.castle, move.from, move.to, piece),
    ep,
    half: piece.toLowerCase() === 'p' || captured || move.ep ? 0 : state.half + 1,
    full: state.full + (white ? 0 : 1),
    moves: state.moves.concat(uciOf(move)),
    marks: [move.from, move.to],
    note: '',
    sans: state.sans,
  };
  const key = posKey(child);
  child.seen = { ...(state.seen || {}) };
  child.seen[key] = (child.seen[key] || 0) + 1;
  return child;
}

function canCastle(state, white, kingside) {
  const right = white ? (kingside ? 'K' : 'Q') : (kingside ? 'k' : 'q');
  if (!state.castle.includes(right)) return false;
  const rank = white ? 7 : 0;
  const king = at(4, rank);
  if (state.board[king] !== (white ? 'K' : 'k')) return false;
  const rook = at(kingside ? 7 : 0, rank);
  if (state.board[rook] !== (white ? 'R' : 'r')) return false;
  const between = kingside ? [5, 6] : [1, 2, 3];
  if (between.some((file) => state.board[at(file, rank)])) return false;
  const travel = kingside ? [4, 5, 6] : [2, 3, 4];
  return !travel.some((file) => attacked(state.board, at(file, rank), !white));
}

function pushPawn(list, from, to, promoRank) {
  const rank = rankTop(to);
  if (rank !== promoRank) list.push({ from, to, promo: '', ep: false });
  else ['q', 'r', 'b', 'n'].forEach((promo) => list.push({ from, to, promo, ep: false }));
}

function pseudoChess(state) {
  const white = state.turn === 'w';
  const moves = [];
  for (let index = 0; index < 64; index += 1) {
    const piece = state.board[index];
    if (!piece || isWhiteChar(piece) !== white) continue;
    const kind = piece.toLowerCase();
    const file = fileOf(index);
    const rank = rankTop(index);
    if (kind === 'p') {
      const dir = white ? -1 : 1;
      const start = white ? 6 : 1;
      const promoRank = white ? 0 : 7;
      const fwdRank = rank + dir;
      if (onBoard(file, fwdRank) && !state.board[at(file, fwdRank)]) {
        pushPawn(moves, index, at(file, fwdRank), promoRank);
        const jumpRank = rank + dir * 2;
        if (rank === start && !state.board[at(file, jumpRank)]) moves.push({ from: index, to: at(file, jumpRank), promo: '', ep: false });
      }
      for (const df of [-1, 1]) {
        if (!onBoard(file + df, fwdRank)) continue;
        const target = at(file + df, fwdRank);
        const occupant = state.board[target];
        if (occupant && isWhiteChar(occupant) !== white) pushPawn(moves, index, target, promoRank);
        else if (target === state.ep) moves.push({ from: index, to: target, promo: '', ep: true });
      }
      continue;
    }
    if (kind === 'n' || kind === 'k') {
      for (const [df, dr] of RAYS[kind]) {
        if (!onBoard(file + df, rank + dr)) continue;
        const target = at(file + df, rank + dr);
        const occupant = state.board[target];
        if (!occupant || isWhiteChar(occupant) !== white) moves.push({ from: index, to: target, promo: '', ep: false });
      }
      continue;
    }
    for (const [df, dr] of RAYS[kind]) {
      let f = file + df;
      let r = rank + dr;
      while (onBoard(f, r)) {
        const target = at(f, r);
        const occupant = state.board[target];
        if (!occupant) moves.push({ from: index, to: target, promo: '', ep: false });
        else {
          if (isWhiteChar(occupant) !== white) moves.push({ from: index, to: target, promo: '', ep: false });
          break;
        }
        f += df;
        r += dr;
      }
    }
  }
  if (canCastle(state, white, true)) moves.push({ from: at(4, white ? 7 : 0), to: at(6, white ? 7 : 0), promo: '', ep: false });
  if (canCastle(state, white, false)) moves.push({ from: at(4, white ? 7 : 0), to: at(2, white ? 7 : 0), promo: '', ep: false });
  return moves;
}

function sanFor(state, move, candidates, plus) {
  const piece = state.board[move.from];
  const letter = piece.toUpperCase();
  if (letter === 'K' && Math.abs(fileOf(move.to) - fileOf(move.from)) === 2) {
    return (fileOf(move.to) === 6 ? 'O-O' : 'O-O-O') + (plus ? '+' : '');
  }
  const dest = sqName(move.to);
  const capture = Boolean(state.board[move.to]) || move.ep;
  const mark = plus ? '+' : '';
  if (letter === 'P') {
    const promo = move.promo ? `=${move.promo.toUpperCase()}` : '';
    return `${capture ? `${FILES[fileOf(move.from)]}x` : ''}${dest}${promo}${mark}`;
  }
  const others = candidates.filter((item) => item !== move && item.to === move.to && state.board[item.from].toUpperCase() === letter);
  let dis = '';
  if (others.length) {
    const file = fileOf(move.from);
    const rank = rankTop(move.from);
    const fileUnique = others.every((item) => fileOf(item.from) !== file);
    const rankUnique = others.every((item) => rankTop(item.from) !== rank);
    if (fileUnique) dis = FILES[file];
    else if (rankUnique) dis = String(8 - rank);
    else dis = FILES[file] + String(8 - rank);
  }
  return `${letter}${dis}${capture ? 'x' : ''}${dest}${mark}`;
}

function chessEdges(state) {
  const candidates = [];
  pseudoChess(state).forEach((move) => {
    const child = applyChessRaw(state, move);
    if (!attacked(child.board, child.board.indexOf(state.turn === 'w' ? 'K' : 'k'), state.turn !== 'w')) {
      candidates.push({ move, child });
    }
  });
  const raw = candidates.map((item) => item.move);
  return candidates.map((item) => {
    const plus = attacked(item.child.board, item.child.board.indexOf(item.child.turn === 'w' ? 'K' : 'k'), item.child.turn !== 'w');
    const san = sanFor(state, item.move, raw, plus);
    item.child.sans = state.sans.concat(san);
    const capture = Boolean(state.board[item.move.to]) || item.move.ep;
    const rank = (capture ? 10 * (VAL[state.board[item.move.to]?.toLowerCase()] || 1) : 0) + (item.move.promo ? 800 : 0);
    return { move: uciOf(item.move), path: [item.move.from, item.move.to], child: item.child, rank };
  });
}

function checkersJumps(board, index, piece) {
  const white = piece === 'w' || piece === 'W';
  const king = piece === 'W' || piece === 'B';
  const dirs = king ? [[-1, -1], [1, -1], [-1, 1], [1, 1]] : (white ? [[-1, -1], [1, -1]] : [[-1, 1], [1, 1]]);
  const file = fileOf(index);
  const rank = rankTop(index);
  const jumps = [];
  dirs.forEach(([df, dr]) => {
    const midFile = file + df;
    const midRank = rank + dr;
    const toFile = file + df * 2;
    const toRank = rank + dr * 2;
    if (!onBoard(toFile, toRank) || !onBoard(midFile, midRank)) return;
    const mid = at(midFile, midRank);
    const to = at(toFile, toRank);
    const enemy = board[mid];
    if (!enemy || board[to]) return;
    const enemyWhite = enemy === 'w' || enemy === 'W';
    if (enemyWhite === white) return;
    jumps.push({ to, mid });
  });
  return jumps;
}

function capturePaths(board, index, piece) {
  const paths = [];
  checkersJumps(board, index, piece).forEach((jump) => {
    const next = board.slice();
    next[index] = '';
    next[jump.mid] = '';
    let landed = piece;
    const destRank = rankTop(jump.to);
    const promoted = (piece === 'w' && destRank === 0) || (piece === 'b' && destRank === 7);
    if (promoted) landed = piece === 'w' ? 'W' : 'B';
    next[jump.to] = landed;
    if (promoted && (piece === 'w' || piece === 'b')) {
      paths.push([index, jump.to]);
      return;
    }
    const rest = capturePaths(next, jump.to, landed);
    if (!rest.length) paths.push([index, jump.to]);
    else rest.forEach((path) => paths.push([index, ...path]));
  });
  return paths;
}

function applyPath(state, path, sans) {
  const board = state.board.slice();
  let piece = board[path[0]];
  board[path[0]] = '';
  let atSquare = path[0];
  for (let step = 1; step < path.length; step += 1) {
    const to = path[step];
    if (Math.abs(fileOf(atSquare) - fileOf(to)) === 2) {
      board[at((fileOf(atSquare) + fileOf(to)) / 2, (rankTop(atSquare) + rankTop(to)) / 2)] = '';
    }
    const destRank = rankTop(to);
    if (piece === 'w' && destRank === 0) piece = 'W';
    if (piece === 'b' && destRank === 7) piece = 'B';
    if (piece === 'P' || piece === 'p') {
      /* breakthrough keeps the pawn */
    }
    atSquare = to;
  }
  board[atSquare] = piece;
  const white = state.turn === 'w' || state.turn === 'h';
  const nextTurn = state.id === 'fox'
    ? (state.turn === 'h' ? 'f' : 'h')
    : (state.turn === 'w' ? 'b' : 'w');
  return {
    ...state,
    board,
    turn: state.id === 'fox' ? nextTurn : (state.id === 'break' ? (state.turn === 'w' ? 'b' : 'w') : (white && state.id !== 'fox' ? nextTurn : nextTurn)),
    moves: state.moves.concat(path.map(sqName).join(state.id === 'break' ? '' : '-')),
    sans: state.sans.concat(sans),
    marks: path.slice(),
    note: '',
  };
}

function checkersEdges(state) {
  const white = state.turn === 'w';
  const mine = [];
  state.board.forEach((piece, index) => {
    if (!piece) return;
    const pieceWhite = piece === 'w' || piece === 'W';
    if (pieceWhite === white) mine.push(index);
  });
  let paths = [];
  mine.forEach((index) => {
    capturePaths(state.board, index, state.board[index]).forEach((path) => paths.push(path));
  });
  if (!paths.length) {
    mine.forEach((index) => {
      const piece = state.board[index];
      const king = piece === 'W' || piece === 'B';
      const dirs = king ? [[-1, -1], [1, -1], [-1, 1], [1, 1]] : (white ? [[-1, -1], [1, -1]] : [[-1, 1], [1, 1]]);
      dirs.forEach(([df, dr]) => {
        const file = fileOf(index) + df;
        const rank = rankTop(index) + dr;
        if (!onBoard(file, rank) || state.board[at(file, rank)]) return;
        paths.push([index, at(file, rank)]);
      });
    });
  }
  return paths.map((path) => {
    const move = path.map(sqName).join('-');
    const sans = path.map(sqName).join('–');
    const child = applyPath(state, path, sans);
    child.moves = state.moves.concat(move);
    const capture = Math.abs(fileOf(path[0]) - fileOf(path[1])) === 2;
    return { move, path, child, rank: capture ? 100 + path.length : 0 };
  });
}

function reversiFlips(board, index, black) {
  if (board[index]) return [];
  const mine = black ? 'b' : 'w';
  const opp = black ? 'w' : 'b';
  const file = fileOf(index);
  const rank = rankTop(index);
  const got = [];
  RAYS.q.forEach(([df, dr]) => {
    const line = [];
    let f = file + df;
    let r = rank + dr;
    while (onBoard(f, r)) {
      const look = board[at(f, r)];
      if (look === opp) line.push(at(f, r));
      else if (look === mine) {
        if (line.length) got.push(...line);
        break;
      } else break;
      f += df;
      r += dr;
    }
  });
  return got;
}

function reversiPlacements(board, turn) {
  const black = turn === 'b';
  const moves = [];
  for (let index = 0; index < 64; index += 1) {
    const flips = reversiFlips(board, index, black);
    if (flips.length) moves.push({ index, flips });
  }
  return moves;
}

function reversiEdges(state) {
  let turn = state.turn;
  let note = state.note || '';
  const placed = reversiPlacements(state.board, turn);
  return placed.map(({ index, flips }) => {
    const board = state.board.slice();
    const mine = turn === 'b' ? 'b' : 'w';
    board[index] = mine;
    flips.forEach((flip) => { board[flip] = mine; });
    let next = turn === 'b' ? 'w' : 'b';
    let nextNote = '';
    if (!reversiPlacements(board, next).length && reversiPlacements(board, turn).length) {
      nextNote = 'pass';
      next = turn;
    }
    const move = sqName(index);
    const child = {
      ...state,
      board,
      turn: next,
      moves: state.moves.concat(move),
      sans: state.sans.concat(move),
      marks: [index, ...flips],
      note: nextNote,
    };
    return { move, path: [index], child, rank: flips.length + (REVERSI_WEIGHT[index] > 50 ? 20 : 0) };
  });
}

function foxEdges(state) {
  const hound = state.turn === 'h';
  const edges = [];
  state.board.forEach((piece, index) => {
    if (hound && piece !== 'h') return;
    if (!hound && piece !== 'f') return;
    const dirs = hound ? [[-1, 1], [1, 1]] : [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    dirs.forEach(([df, dr]) => {
      const file = fileOf(index) + df;
      const rank = rankTop(index) + dr;
      if (!onBoard(file, rank) || state.board[at(file, rank)]) return;
      const path = [index, at(file, rank)];
      const move = path.map(sqName).join('-');
      const child = applyPath(state, path, path.map(sqName).join('–'));
      child.turn = hound ? 'f' : 'h';
      child.moves = state.moves.concat(move);
      edges.push({ move, path, child, rank: hound ? (7 - rank) : (7 - rankTop(path[1])) });
    });
  });
  return edges;
}

function breakEdges(state) {
  const white = state.turn === 'w';
  const dir = white ? -1 : 1;
  const mine = white ? 'P' : 'p';
  const edges = [];
  state.board.forEach((piece, index) => {
    if (piece !== mine) return;
    const file = fileOf(index);
    const rank = rankTop(index) + dir;
    if (!onBoard(file, rank)) return;
    const straight = at(file, rank);
    if (!state.board[straight]) {
      const path = [index, straight];
      const move = sqName(index) + sqName(straight);
      const child = applyPath(state, path, `${sqName(index)}–${sqName(straight)}`);
      child.moves = state.moves.concat(move);
      edges.push({ move, path, child, rank: (white ? 7 - rank : rank) });
    }
    [-1, 1].forEach((df) => {
      if (!onBoard(file + df, rank)) return;
      const target = at(file + df, rank);
      if (!state.board[target] || state.board[target] === mine) return;
      const path = [index, target];
      const move = sqName(index) + sqName(target);
      const child = applyPath(state, path, `${sqName(index)}×${sqName(target)}`);
      child.moves = state.moves.concat(move);
      edges.push({ move, path, child, rank: 80 + (white ? 7 - rank : rank) });
    });
  });
  return edges;
}

function edgesFor(state) {
  if (!state) return [];
  if (state.id === 'chess') return chessEdges(state);
  if (state.id === 'checkers') return checkersEdges(state);
  if (state.id === 'reversi') return reversiEdges(state);
  if (state.id === 'fox') return foxEdges(state);
  if (state.id === 'break') return breakEdges(state);
  return [];
}

export function legalDetails(state) {
  if (resultOf(state).over) return [];
  return edgesFor(state);
}

export function legalMoves(state) {
  return legalDetails(state).map((edge) => edge.move);
}

export function applyMove(state, move) {
  const found = edgesFor(state).find((edge) => edge.move === move);
  return found ? found.child : null;
}

function insufficient(board) {
  const extras = [];
  board.forEach((piece, index) => {
    if (piece && piece.toLowerCase() !== 'k') extras.push({ piece, index });
  });
  if (!extras.length) return true;
  if (extras.length === 1 && 'bn'.includes(extras[0].piece.toLowerCase())) return true;
  if (extras.length === 2 && extras.every((item) => item.piece.toLowerCase() === 'b')) {
    const color = (index) => (fileOf(index) + rankTop(index)) % 2;
    return color(extras[0].index) === color(extras[1].index);
  }
  return false;
}

export function resultOf(state) {
  if (!state) return { over: true, draw: true, reason: 'broken' };
  if (state.id === 'chess') {
    if ((state.seen?.[posKey(state)] || 0) >= 3) return { over: true, draw: true, reason: 'repeat' };
    if ((state.half || 0) >= 100) return { over: true, draw: true, reason: 'fifty' };
    if (insufficient(state.board)) return { over: true, draw: true, reason: 'material' };
    if (chessEdges(state).length) return { over: false };
    if (kingAttacked(state)) return { over: true, winner: state.turn === 'w' ? 'b' : 'w', reason: 'checkmate' };
    return { over: true, draw: true, reason: 'stalemate' };
  }
  if (state.id === 'checkers') {
    const white = state.turn === 'w';
    let mine = 0;
    let other = 0;
    state.board.forEach((piece) => {
      if (!piece) return;
      const pieceWhite = piece === 'w' || piece === 'W';
      if (pieceWhite === white) mine += 1;
      else other += 1;
    });
    if (!mine) return { over: true, winner: white ? 'b' : 'w', reason: 'count' };
    if (!other) return { over: true, winner: white ? 'w' : 'b', reason: 'count' };
    if (!checkersEdges(state).length) return { over: true, winner: white ? 'b' : 'w', reason: 'blocked' };
    return { over: false };
  }
  if (state.id === 'reversi') {
    const mine = reversiPlacements(state.board, state.turn);
    const otherTurn = state.turn === 'b' ? 'w' : 'b';
    const other = reversiPlacements(state.board, otherTurn);
    if (mine.length || other.length) return { over: false };
    const black = state.board.filter((piece) => piece === 'b').length;
    const white = state.board.filter((piece) => piece === 'w').length;
    if (black === white) return { over: true, draw: true, reason: 'full', black, white };
    return { over: true, winner: black > white ? 'b' : 'w', reason: 'full', black, white };
  }
  if (state.id === 'fox') {
    const fox = state.board.indexOf('f');
    if (fox >= 0 && rankTop(fox) === 0) return { over: true, winner: 'f', reason: 'escape' };
    if (foxEdges(state).length) return { over: false };
    return { over: true, winner: state.turn === 'f' ? 'h' : 'f', reason: state.turn === 'f' ? 'trapped' : 'blocked' };
  }
  if (state.board.some((piece, index) => piece === 'P' && rankTop(index) === 0)) return { over: true, winner: 'w', reason: 'goal' };
  if (state.board.some((piece, index) => piece === 'p' && rankTop(index) === 7)) return { over: true, winner: 'b', reason: 'goal' };
  if (breakEdges(state).length) return { over: false };
  return { over: true, winner: state.turn === 'w' ? 'b' : 'w', reason: 'blocked' };
}

export function perft(state, depth) {
  if (depth <= 0) return 1;
  const edges = state.id === 'chess' ? chessEdges(state) : edgesFor(state);
  if (depth === 1) return edges.length;
  let total = 0;
  edges.forEach((edge) => { total += perft(edge.child, depth - 1); });
  return total;
}

function evaluate(state) {
  if (state.id === 'chess') {
    let score = 0;
    let bishops = 0;
    let blackBishops = 0;
    for (let index = 0; index < 64; index += 1) {
      const piece = state.board[index];
      if (!piece) continue;
      const kind = piece.toLowerCase();
      const white = isWhiteChar(piece);
      const table = PST[kind];
      const add = (VAL[kind] || 0) + (table ? table[white ? index : index ^ 56] : 0);
      score += white ? add : -add;
      if (kind === 'b') {
        if (white) bishops += 1;
        else blackBishops += 1;
      }
    }
    if (bishops >= 2) score += 30;
    if (blackBishops >= 2) score -= 30;
    if (kingAttacked(state)) score += state.turn === 'w' ? -35 : 35;
    return state.turn === 'w' ? score : -score;
  }
  if (state.id === 'checkers') {
    let score = 0;
    state.board.forEach((piece, index) => {
      const rank = rankTop(index);
      if (piece === 'w') score += 100 + (7 - rank) * 6;
      else if (piece === 'W') score += 180;
      else if (piece === 'b') score -= 100 + rank * 6;
      else if (piece === 'B') score -= 180;
    });
    return state.turn === 'w' ? score : -score;
  }
  if (state.id === 'reversi') {
    const empty = state.board.filter((piece) => !piece).length;
    let score = 0;
    let mine = 0;
    let other = 0;
    state.board.forEach((piece, index) => {
      if (!piece) return;
      const black = piece === 'b';
      const weight = empty > 14 ? REVERSI_WEIGHT[index] : (piece ? 8 : 0);
      score += black ? weight : -weight;
      if (black) mine += 1;
      else other += 1;
    });
    const mobility = reversiPlacements(state.board, 'b').length - reversiPlacements(state.board, 'w').length;
    score += mobility * (empty > 14 ? 8 : 2);
    if (empty < 14) score += (mine - other) * 6;
    const side = state.turn === 'b' ? score : -score;
    return side;
  }
  if (state.id === 'fox') {
    const fox = state.board.indexOf('f');
    if (fox < 0) return state.turn === 'h' ? 800 : -800;
    let score = rankTop(fox) * 70;
    const foxFile = fileOf(fox);
    state.board.forEach((piece, index) => {
      if (piece !== 'h') return;
      if (rankTop(index) <= rankTop(fox)) score += 30;
      score -= Math.abs(fileOf(index) - foxFile) * 6;
    });
    return state.turn === 'h' ? score : -score;
  }
  let score = 0;
  state.board.forEach((piece, index) => {
    const rank = rankTop(index);
    if (piece === 'P') score += 100 + (7 - rank) * 16;
    else if (piece === 'p') score -= 100 + rank * 16;
  });
  return state.turn === 'w' ? score : -score;
}

function quickEnd(state) {
  if (state.id === 'chess') {
    if ((state.seen?.[posKey(state)] || 0) >= 3) return { score: 0 };
    if ((state.half || 0) >= 100) return { score: 0 };
    if (insufficient(state.board)) return { score: 0 };
    return null;
  }
  const result = resultOf(state);
  if (!result.over) return null;
  if (result.draw) return { score: 0 };
  return { score: result.winner === state.turn ? 100000 : -100000 };
}

function minimax(state, depth, alpha, beta, deadline, budget) {
  if (budget.n > budget.cap || clock() > deadline) return { score: evaluate(state), stop: true };
  const ended = quickEnd(state);
  if (ended) return ended;
  if (depth === 0) return { score: evaluate(state) };
  const edges = edgesFor(state).sort((a, b) => b.rank - a.rank);
  if (!edges.length) {
    if (state.id === 'chess' && kingAttacked(state)) return { score: -100000 - depth };
    return { score: 0 };
  }
  let best = -Infinity;
  let stop = false;
  for (let i = 0; i < edges.length; i += 1) {
    budget.n += 1;
    const result = minimax(edges[i].child, depth - 1, -beta, -alpha, deadline, budget);
    if (result.stop) stop = true;
    const score = -result.score;
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta || stop) break;
  }
  return { score: best, stop };
}

export function chooseMove(state) {
  if (!state || resultOf(state).over) return '';
  const edges = edgesFor(state).sort((a, b) => b.rank - a.rank);
  if (!edges.length) return '';
  if (state.id === 'chess') {
    const book = BOOK.get(state.moves.join(' '));
    const picks = (book || []).filter((move) => edges.some((edge) => edge.move === move));
    if (picks.length) return picks[Math.floor(Math.random() * picks.length)];
  }
  const caps = { chess: 3, checkers: 6, reversi: 4, fox: 8, break: 4 };
  const budgetCap = state.id === 'chess' ? 25000 : 60000;
  const deadline = clock() + (state.id === 'chess' ? 380 : 260);
  let best = edges[0].move;
  const max = caps[state.id] || 3;
  for (let depth = 1; depth <= max; depth += 1) {
    if (clock() > deadline) break;
    const budget = { n: 0, cap: budgetCap };
    let alpha = -Infinity;
    let top = -Infinity;
    let move = best;
    let stop = false;
    for (let i = 0; i < edges.length; i += 1) {
      if (clock() > deadline || budget.n > budget.cap) {
        stop = true;
        break;
      }
      budget.n += 1;
      const result = minimax(edges[i].child, depth - 1, -Infinity, -alpha, deadline, budget);
      if (result.stop) stop = true;
      const score = -result.score;
      if (score > top) {
        top = score;
        move = edges[i].move;
      }
      if (score > alpha) alpha = score;
      if (stop) break;
    }
    if (stop) break;
    best = move;
  }
  return best;
}

export function replayGame(messages, rkey, mine) {
  const lines = [];
  (messages || []).forEach((message) => {
    const parsed = parseGameMessage(message?.text);
    if (!parsed || parsed.rkey !== rkey) return;
    lines.push({ ...parsed, sender: messageSender(message), sentAt: message?.sentAt || '' });
  });
  lines.sort((a, b) => String(a.sentAt).localeCompare(String(b.sentAt)));
  const invite = lines.find((line) => line.kind === 'invite');
  if (!invite || !GAMES.some((game) => game.id === invite.game)) return null;
  const inviterSide = gameById(invite.game).sides.some(([side]) => side === invite.data) ? invite.data : gameById(invite.game).sides[0][0];
  const you = invite.sender === mine ? inviterSide : opposite(invite.game, inviterSide);
  let accepted = false;
  let declined = false;
  let resigned = '';
  let drawAgreed = false;
  let drawOffer = '';
  let state = startGame(invite.game);
  let broken = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.kind === 'invite') continue;
    if (line.kind === 'decline' && !accepted) {
      declined = true;
      break;
    }
    if (line.kind === 'accept') {
      accepted = true;
      continue;
    }
    if (!accepted) continue;
    if (line.kind === 'resign') {
      resigned = line.sender === mine ? 'you' : 'them';
      break;
    }
    if (line.kind === 'draw') {
      drawOffer = line.sender === mine ? 'you' : 'them';
      continue;
    }
    if (line.kind === 'no') {
      drawOffer = '';
      continue;
    }
    if (line.kind === 'yes' && drawOffer && ((drawOffer === 'you' && line.sender !== mine) || (drawOffer === 'them' && line.sender === mine))) {
      drawAgreed = true;
      break;
    }
    if (line.kind === 'move') {
      drawOffer = '';
      const next = applyMove(state, line.data);
      if (!next) {
        broken = true;
        break;
      }
      state = next;
      if (resultOf(state).over) break;
    }
  }
  return {
    state,
    game: invite.game,
    rkey,
    you,
    inviter: invite.sender,
    accepted,
    declined,
    resigned,
    drawAgreed,
    drawOffer,
    broken,
  };
}

export function activeMatch(messages, mine) {
  let rkey = '';
  (messages || []).forEach((message) => {
    const parsed = parseGameMessage(message?.text);
    if (parsed?.kind === 'invite') rkey = parsed.rkey;
  });
  if (!rkey) return null;
  return replayGame(messages, rkey, mine);
}

export function describe(state, ctx = {}) {
  const opponent = ctx.opponent || 'Opponent';
  if (ctx.declined) return { over: true, line: `${opponent} declined.` };
  if (ctx.waiting) return { over: false, line: `Pushed to ${opponent}. Waiting for them.` };
  if (ctx.resigned === 'you') return { over: true, line: 'You resigned.' };
  if (ctx.resigned === 'them') return { over: true, line: `${opponent} resigned.` };
  if (ctx.drawAgreed) return { over: true, line: 'Draw agreed.' };
  const result = resultOf(state);
  if (result.over) {
    const how = REASON[result.reason] || '';
    if (result.draw) return { over: true, line: how ? `Draw. ${how}.` : 'Draw.' };
    const mine = result.winner && result.winner === ctx.you;
    if (result.black != null && state.id === 'reversi') {
      return { over: true, line: `${mine ? 'You win' : 'You lose'}. ${result.black}–${result.white}.` };
    }
    return { over: true, line: `${mine ? 'You win' : 'You lose'}${how ? `. ${how}.` : '.'}` };
  }
  if (ctx.thinking) return { over: false, line: 'Thinking…' };
  if (ctx.drawFrom === 'them') return { over: false, line: `${opponent} offers a draw.` };
  if (ctx.drawFrom === 'you') return { over: false, line: 'Draw offered.' };
  if (state.note === 'pass' && state.turn === ctx.you) return { over: false, line: 'Your move. They had no move.' };
  if (state.turn === ctx.you) return { over: false, line: 'Your move' };
  return { over: false, line: `${opponent} to move` };
}

export function pickSquare(state, selected, prefix, index) {
  const details = legalDetails(state);
  const chain = prefix || [];
  const idle = { selected: selected ?? -1, prefix: chain, move: null, promos: null };
  if (!details.length) return { ...idle, selected: -1, prefix: [] };
  if (details.every((edge) => edge.path.length === 1)) {
    const hit = details.find((edge) => edge.path[0] === index);
    return hit
      ? { selected: -1, prefix: [], move: hit.move, promos: null }
      : { selected: -1, prefix: [], move: null, promos: null };
  }
  if (!chain.length && details.some((edge) => edge.path[0] === index)) {
    if (selected === index) return { selected: -1, prefix: [], move: null, promos: null };
    return { selected: index, prefix: [], move: null, promos: null };
  }
  const origin = chain.length ? chain[0] : selected;
  if (origin == null || origin < 0) return { selected: -1, prefix: [], move: null, promos: null };
  const soFar = chain.length ? chain : [origin];
  const next = soFar.concat(index);
  const continued = details.filter((edge) => edge.path.length >= next.length && next.every((sq, i) => edge.path[i] === sq));
  if (!continued.length) {
    if (details.some((edge) => edge.path[0] === index)) return { selected: index, prefix: [], move: null, promos: null };
    return idle;
  }
  const finished = continued.filter((edge) => edge.path.length === next.length);
  if (finished.length && finished.length === continued.length) {
    const moves = [...new Set(finished.map((edge) => edge.move))];
    if (moves.length > 1) return { selected: origin, prefix: chain, move: null, promos: moves };
    return { selected: -1, prefix: [], move: moves[0], promos: null };
  }
  return { selected: index, prefix: next, move: null, promos: null };
}

function pieceShape(game, piece) {
  if (game === 'chess') return piece.toLowerCase();
  if (game === 'checkers') return piece === 'W' || piece === 'B' ? 'kingman' : 'man';
  if (game === 'reversi') return 'disc';
  if (game === 'fox') return piece === 'f' ? 'fox' : 'hound';
  return 'p';
}

function pieceLabel(game, piece) {
  const tone = lightPiece(game, piece) ? 'white' : 'black';
  if (game === 'chess') {
    const name = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' }[piece.toLowerCase()];
    return `${tone} ${name}`;
  }
  if (game === 'checkers') return `${tone} ${piece === 'W' || piece === 'B' ? 'king' : 'man'}`;
  if (game === 'reversi') return `${tone} disc`;
  if (game === 'fox') return piece === 'f' ? 'fox' : 'hound';
  return `${tone} pawn`;
}

function outlined(inner, fill, stroke) {
  return `<g fill="${fill}" stroke="${stroke}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" paint-order="fill stroke">${inner}</g>`;
}

function pieceSvg(shape, light) {
  const fill = light ? '#ffffff' : '#000000';
  const stroke = light ? '#000000' : '#ffffff';
  const eye = `<circle cx="26" cy="30" r="2.1" fill="${stroke}" stroke="none"/>`;
  const paths = {
    k: `<path d="M30 4h4v6h6v4h-6v6h-4v-6h-6V10h6z"/><path d="M18 28h28l-4 20H22z"/><path d="M14 50h36v6H14z"/>`,
    q: `<path d="M8 24l8 3 6-14 6 14 6-14 6 14 8-3 4 6H4z"/><path d="M18 32h28l-4 16H22z"/><path d="M14 50h36v6H14z"/>`,
    r: `<path d="M12 8h8v8h6V8h8v8h6V8h8v12H12z"/><path d="M18 20h28v26H18z"/><path d="M12 48h40v7H12z"/>`,
    b: `<path d="M32 5c4 0 7 3.2 7 7 0 2.4-1.2 4.4-3 5.6V20h4l3 4-2 22H23l-2-22 3-4h4v-2.4c-1.8-1.2-3-3.2-3-5.6 0-3.8 3-7 7-7z"/><path d="M31 16h2v9h-2z"/><path d="M14 50h36v6H14z"/>`,
    n: `<path d="M46 56H16v-6h7c-4-4-9-8-9-16 0-7 4-12 9-14-1-7 4-12 11-12 5 0 8 4 7 8 6 1 11 7 10 15 0 7-5 11-9 14h4v11z"/>${eye}`,
    p: `<circle cx="32" cy="16" r="8"/><path d="M26 26h12l5 20H21z"/><path d="M16 48h32v6H16z"/>`,
    man: `<circle cx="32" cy="32" r="18"/>`,
    kingman: `<circle cx="32" cy="32" r="18"/><circle cx="32" cy="32" r="7" fill="none"/>`,
    disc: `<circle cx="32" cy="32" r="18"/><circle cx="32" cy="32" r="6" fill="none"/>`,
    hound: `<circle cx="32" cy="34" r="16"/><path d="M18 30c2-10 8-16 14-16s12 6 14 16"/>`,
    fox: `<path d="M10 32 22 10l8 16L32 8l2 18 8-16 12 22c6 10 2 22-14 24S4 44 10 32z"/>${eye}<circle cx="40" cy="34" r="2.1" fill="${stroke}" stroke="none"/>`,
  };
  return `<svg viewBox="0 0 64 64" width="64" height="64" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${outlined(paths[shape] || paths.p, fill, stroke)}</svg>`;
}

export function boardHtml(state, opts = {}) {
  const flip = Boolean(opts.flip);
  const interactive = Boolean(opts.interactive);
  const targets = new Set(opts.targets || []);
  const captures = new Set(opts.captures || []);
  const marks = new Set(state?.marks || []);
  const selected = opts.selected ?? -1;
  const check = opts.check ?? -1;
  const squares = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const file = flip ? 7 - col : col;
      const rank = flip ? 7 - row : row;
      const index = at(file, rank);
      const light = (file + rank) % 2 === 0;
      const piece = state.board[index];
      const classes = ['sq', light ? 'light' : 'dark'];
      if (marks.has(index)) classes.push('mark');
      if (selected === index) classes.push('selected');
      if (check === index) classes.push('check');
      if (captures.has(index)) classes.push('capture');
      else if (targets.has(index)) classes.push('target');
      const label = `${sqName(index)}${piece ? `, ${pieceLabel(state.id, piece)}` : ''}`;
      const coords = `${col === 0 ? `<span class="coord rank">${8 - rank}</span>` : ''}${row === 7 ? `<span class="coord file">${FILES[file]}</span>` : ''}`;
      const body = `${coords}${piece ? `<span class="piece ${lightPiece(state.id, piece) ? 'light' : 'dark'}">${pieceSvg(pieceShape(state.id, piece), lightPiece(state.id, piece))}</span>` : ''}${(targets.has(index) || captures.has(index)) ? '<i class="dot"></i>' : ''}`;
      if (interactive) squares.push(`<button type="button" class="${classes.join(' ')}" data-act="game-sq" data-sq="${index}" aria-label="${escapeHtml(label)}">${body}</button>`);
      else squares.push(`<div class="${classes.join(' ')}">${body}</div>`);
    }
  }
  const name = gameById(state.id).name;
  return `<div class="marble${opts.quiet ? ' is-mini' : ''}"${opts.quiet ? ' aria-hidden="true"' : ` role="group" aria-label="${escapeHtml(name)} board"`}><div class="marble-frame"><div class="marble-grid">${squares.join('')}</div></div></div>`;
}

export function boardView(state, opts = {}) {
  const you = opts.you;
  const playable = Boolean(opts.interactive) && !opts.locked && state.turn === you && !resultOf(state).over;
  const details = playable ? legalDetails(state) : [];
  const targets = [];
  const captures = [];
  const chain = opts.prefix || [];
  const selected = opts.selected ?? -1;
  if (details.every((edge) => edge.path.length === 1)) {
    details.forEach((edge) => targets.push(edge.path[0]));
  } else if (chain.length || selected >= 0) {
    const soFar = chain.length ? chain : [selected];
    details.forEach((edge) => {
      if (edge.path.length <= soFar.length) return;
      if (!soFar.every((sq, i) => edge.path[i] === sq)) return;
      const next = edge.path[soFar.length];
      const from = soFar[soFar.length - 1];
      const jump = state.id === 'checkers' && Math.abs(fileOf(from) - fileOf(next)) === 2;
      const landed = state.id !== 'checkers' && state.id !== 'fox' && (state.board[next] || (state.id === 'chess' && state.ep === next));
      if (jump || landed) captures.push(next);
      else targets.push(next);
    });
  }
  let check = -1;
  if (state.id === 'chess' && kingAttacked(state)) check = state.board.indexOf(state.turn === 'w' ? 'K' : 'k');
  return boardHtml(state, {
    flip: opts.flip,
    interactive: opts.interactive,
    quiet: opts.quiet,
    selected: playable ? selected : -1,
    targets: playable ? targets : [],
    captures: playable ? captures : [],
    check,
  });
}

export function logHtml(state) {
  const rows = state.sans?.length ? state.sans : (state.moves || []);
  if (!rows.length) return '<p class="dim game-empty">No moves yet.</p>';
  if (state.id === 'chess') {
    const lines = [];
    for (let i = 0; i < rows.length; i += 2) {
      lines.push(`<li><span>${i / 2 + 1}.</span> ${escapeHtml(rows[i] || '')}${rows[i + 1] ? ` ${escapeHtml(rows[i + 1])}` : ''}</li>`);
    }
    return `<ol class="game-log">${lines.join('')}</ol>`;
  }
  return `<ol class="game-log">${rows.map((row) => `<li>${escapeHtml(row)}</li>`).join('')}</ol>`;
}

export function sampleState(id) {
  let state = startGame(id);
  (SAMPLES[id] || []).forEach((move) => {
    const next = applyMove(state, move);
    if (next) state = next;
  });
  return state;
}

export function gamesPageHtml() {
  const cards = GAMES.map((game) => `<article class="game-card"><div class="game-sample">${boardHtml(sampleState(game.id), { quiet: true })}</div><div class="game-copy"><h3>${escapeHtml(game.name)}</h3><p>${escapeHtml(game.blurb)}</p><div class="game-actions"><button type="button" class="primary small" data-act="game-ai" data-game="${game.id}">Play AI</button><button type="button" class="game-alt" data-act="game-person" data-game="${game.id}">LibreSky player</button></div></div></article>`).join('');
  return `<div class="games-page"><div id="game-invites"></div><header class="games-lead"><h2>Games</h2><p>A marble board. Play a simple AI, or push an invite to someone who is available in your chats or calls.</p></header><div class="game-grid">${cards}</div></div>`;
}

export function promoHtml(moves) {
  if (!moves?.length) return '';
  const buttons = moves.map((move) => {
    const promo = move.slice(-1);
    const name = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' }[promo] || 'Piece';
    return `<button type="button" data-act="game-promo" data-move="${escapeHtml(move)}" aria-label="${name}">${pieceSvg(promo, true)}<span>${name}</span></button>`;
  }).join('');
  return `<div class="promo-pop" role="group" aria-label="Promote the pawn">${buttons}</div>`;
}
