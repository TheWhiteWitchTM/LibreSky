import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyMove,
  boardHtml,
  boardState,
  chooseMove,
  gameLine,
  gamesPageHtml,
  legalMoves,
  loadFen,
  perft,
  replayGame,
  resultOf,
  sampleState,
  startGame,
} from './games.js';
import { parseGameMessage } from './util.js';

function play(id, moves) {
  let state = startGame(id);
  moves.forEach((move) => {
    const next = applyMove(state, move);
    assert.ok(next, `${id} rejected ${move} after ${state.moves.join(' ')}`);
    state = next;
  });
  return state;
}

test('chess counts the opening tree', () => {
  const start = startGame('chess');
  assert.equal(legalMoves(start).length, 20);
  assert.equal(perft(start, 1), 20);
  assert.equal(perft(start, 2), 400);
  assert.equal(perft(start, 3), 8902);
});

test('chess mates, castle, en passant, and a pin', () => {
  const mate = play('chess', ['f2f3', 'e7e5', 'g2g4', 'd8h4']);
  assert.equal(resultOf(mate).reason, 'checkmate');
  assert.equal(resultOf(mate).winner, 'b');

  const scholar = play('chess', ['e2e4', 'e7e5', 'd1h5', 'b8c6', 'f1c4', 'g8f6', 'h5f7']);
  assert.equal(resultOf(scholar).reason, 'checkmate');
  assert.equal(resultOf(scholar).winner, 'w');

  const ep = play('chess', ['e2e4', 'a7a6', 'e4e5', 'd7d5']);
  assert.ok(legalMoves(ep).includes('e5d6'));
  const taken = applyMove(ep, 'e5d6');
  assert.equal(taken.board[name('d5')], '');
  assert.equal(taken.board[name('d6')], 'P');

  const castle = loadFen('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq -');
  assert.ok(legalMoves(castle).includes('e1g1'));
  assert.ok(legalMoves(castle).includes('e1c1'));
  const castled = applyMove(castle, 'e1g1');
  assert.equal(castled.board[name('g1')], 'K');
  assert.equal(castled.board[name('f1')], 'R');
  assert.equal(castled.castle.includes('K'), false);

  const through = loadFen('5r2/8/8/8/8/8/8/4K2R w K -');
  assert.equal(legalMoves(through).includes('e1g1'), false);

  const pinned = loadFen('4r3/8/8/8/8/8/4N3/4K3 w - -');
  assert.equal(legalMoves(pinned).includes('e2d4'), false);
  assert.equal(legalMoves(pinned).includes('e2c3'), false);

  const promo = loadFen('8/P7/8/8/8/8/8/4K2k w - -');
  assert.ok(legalMoves(promo).includes('a7a8q'));
  assert.equal(applyMove(promo, 'a7a8q').board[name('a8')], 'Q');
});

test('kiwipete agrees on the first two plies', () => {
  const kiwi = loadFen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -');
  assert.equal(perft(kiwi, 1), 48);
  assert.equal(perft(kiwi, 2), 2039);
});

test('checkers forces the jump and crowns a man', () => {
  const start = startGame('checkers');
  assert.equal(legalMoves(start).some((move) => move === 'c3-d4'), true);
  const jump = boardState('checkers', [
    ['c3', 'w'],
    ['d4', 'b'],
    ['a3', 'w'],
    ['h8', 'b'],
  ], 'w');
  const moves = legalMoves(jump);
  assert.ok(moves.includes('c3-e5'));
  assert.equal(moves.includes('a3-b4'), false);
  const after = applyMove(jump, 'c3-e5');
  assert.equal(after.board[name('d4')], '');
  assert.equal(after.board[name('e5')], 'w');

  const chain = boardState('checkers', [
    ['d4', 'w'],
    ['e5', 'b'],
    ['e7', 'b'],
    ['c7', 'b'],
  ], 'w');
  assert.deepEqual(legalMoves(chain), ['d4-f6-d8']);
  const crowned = applyMove(chain, 'd4-f6-d8');
  assert.equal(crowned.board[name('d8')], 'W');
  assert.equal(crowned.board[name('c7')], 'b');
  assert.equal(crowned.turn, 'b');

  const king = boardState('checkers', [['d4', 'W'], ['a1', 'b']], 'w');
  assert.ok(legalMoves(king).includes('d4-c3'));
  assert.ok(legalMoves(king).includes('d4-e5'));
  const kingJump = boardState('checkers', [['d4', 'W'], ['e5', 'b'], ['a1', 'b']], 'w');
  assert.ok(legalMoves(kingJump).includes('d4-f6'));
  assert.equal(legalMoves(kingJump).includes('d4-c3'), false);
});

test('reversi flips a line and passes', () => {
  const start = startGame('reversi');
  assert.equal(start.turn, 'b');
  assert.ok(legalMoves(start).includes('f5'));
  const next = applyMove(start, 'f5');
  assert.equal(next.board[name('e5')], 'b');
  assert.equal(next.board[name('f5')], 'b');
  const stuck = boardState('reversi', [
    ['a1', 'b'],
    ['h8', 'w'],
  ], 'b');
  assert.equal(resultOf(stuck).over, true);
  assert.equal(resultOf(stuck).draw, true);
});

test('fox and hounds keep their directions', () => {
  const start = startGame('fox');
  assert.equal(start.turn, 'h');
  assert.ok(legalMoves(start).includes('b8-a7'));
  assert.equal(legalMoves(start).some((move) => move.startsWith('e1')), false);
  const foxTurn = applyMove(start, 'b8-a7');
  assert.equal(foxTurn.turn, 'f');
  assert.ok(legalMoves(foxTurn).includes('e1-d2'));
  const back = boardState('fox', [['a2', 'h'], ['b1', 'f']], 'h');
  assert.equal(legalMoves(back).some((move) => move === 'a2-b1'), false);
  const home = boardState('fox', [['b8', 'f'], ['a1', 'h']], 'h');
  assert.equal(resultOf(home).winner, 'f');
  assert.equal(resultOf(home).reason, 'escape');
});

test('breakthrough captures on the diagonal and races', () => {
  const start = startGame('break');
  assert.ok(legalMoves(start).includes('e2e3'));
  assert.equal(legalMoves(start).includes('e2d3'), false);
  const hit = boardState('break', [['e4', 'P'], ['d5', 'p'], ['a1', 'P'], ['h8', 'p']], 'w');
  assert.ok(legalMoves(hit).includes('e4d5'));
  assert.equal(legalMoves(hit).includes('e4e5'), true);
  const won = applyMove(boardState('break', [['e7', 'P'], ['a8', 'p']], 'w'), 'e7e8');
  assert.equal(resultOf(won).winner, 'w');
  assert.equal(resultOf(won).reason, 'goal');
});

test('each simple AI returns a legal move', () => {
  ['chess', 'checkers', 'reversi', 'fox', 'break'].forEach((id) => {
    const state = startGame(id);
    const move = chooseMove(state);
    assert.ok(legalMoves(state).includes(move), `${id} ai played ${move}`);
  });
});

test('a pushed invite replays for the other player', () => {
  const rkey = '3k2j4h5g6f7ab';
  const messages = [
    { sender: { did: 'did:me' }, sentAt: '2026-11-11T00:00:00.000Z', text: gameLine(rkey, 'chess', 'invite', 'w') },
    { sender: { did: 'did:them' }, sentAt: '2026-11-11T00:00:01.000Z', text: gameLine(rkey, 'chess', 'accept') },
    { sender: { did: 'did:me' }, sentAt: '2026-11-11T00:00:02.000Z', text: gameLine(rkey, 'chess', 'move', 'e2e4') },
  ];
  const mine = replayGame(messages, rkey, 'did:me');
  assert.equal(mine.you, 'w');
  assert.equal(mine.accepted, true);
  assert.equal(mine.state.moves.at(-1), 'e2e4');
  const theirs = replayGame(messages, rkey, 'did:them');
  assert.equal(theirs.you, 'b');
  assert.equal(theirs.state.turn, 'b');
  assert.equal(parseGameMessage(messages[0].text).kind, 'invite');
});

test('the games page shows a sample board for every game', () => {
  const html = gamesPageHtml();
  ['Chess', 'Checkers', 'Reversi', 'Fox and hounds', 'Breakthrough'].forEach((name) => {
    assert.ok(html.includes(name));
  });
  assert.ok(html.includes('Play AI'));
  assert.ok(html.includes('LibreSky player'));
  assert.ok(html.includes('marble'));
  ['chess', 'checkers', 'reversi', 'fox', 'break'].forEach((id) => {
    const sample = sampleState(id);
    assert.ok(sample.moves.length > 0, `${id} sample did not play`);
    assert.ok(boardHtml(sample, { quiet: true }).includes('marble-frame'));
  });
});

function name(sq) {
  const file = 'abcdefgh'.indexOf(sq[0]);
  const rank = Number(sq[1]);
  return (8 - rank) * 8 + file;
}
