import { escapeHtml } from './util.js';

const PONG_W = 640;
const PONG_H = 360;
const PAD_H = 64;
const PAD_W = 10;
const PAD_X = 24;
const DIRS = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

export const ARCADE = [
  { id: 'pong', name: 'Pong', blurb: 'First to five. The paddle only moves so fast, so the ball can get past.' },
  { id: 'snakes', name: 'Snakes', blurb: 'Two snakes, one piece of food. A wall or another snake ends that snake.' },
];

export function isArcade(id) {
  return id === 'pong' || id === 'snakes';
}

export function arcadeTitle(id) {
  return ARCADE.find((game) => game.id === id)?.name || 'Game';
}

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

function nextSeed(state) {
  state.seed = (Math.imul(state.seed >>> 0, 1664525) + 1013904223) >>> 0;
  return state.seed;
}

export function startPong(seed = 1) {
  return {
    id: 'pong',
    w: PONG_W,
    h: PONG_H,
    ball: { x: PONG_W / 2, y: PONG_H / 2, vx: 4.4, vy: 2.1 },
    left: PONG_H / 2,
    right: PONG_H / 2,
    score: [0, 0],
    over: false,
    winner: '',
    seed: seed >>> 0,
    tick: 0,
    ai: false,
    held: { left: 0, right: 0 },
  };
}

export function startSnakes(seed = 1) {
  const state = {
    id: 'snakes',
    cols: 21,
    rows: 21,
    w: 21 * 16,
    h: 21 * 16,
    seed: seed >>> 0,
    snakes: [
      { body: [{ x: 4, y: 10 }, { x: 3, y: 10 }, { x: 2, y: 10 }], dir: 1, queued: 1, alive: true },
      { body: [{ x: 16, y: 10 }, { x: 17, y: 10 }, { x: 18, y: 10 }], dir: 3, queued: 3, alive: true },
    ],
    food: { x: 10, y: 5 },
    over: false,
    winner: '',
    tick: 0,
  };
  placeFood(state);
  return state;
}

export function queuePong(state, side, dir) {
  if (!state || (side !== 'left' && side !== 'right')) return state;
  const value = dir < 0 ? -1 : dir > 0 ? 1 : 0;
  state.held = state.held || { left: 0, right: 0 };
  state.held[side] = value;
  return state;
}

function resetBall(state, direction) {
  state.ball.x = state.w / 2;
  state.ball.y = state.h / 2;
  state.ball.vx = 4.4 * (direction < 0 ? -1 : 1);
  state.ball.vy = 2.1 * ((nextSeed(state) & 1) ? 1 : -1);
}

function hitPaddle(ball, paddleY) {
  return Math.abs(ball.y - paddleY) <= PAD_H / 2 + 6;
}

export function stepPong(state) {
  if (!state || state.over) return state;
  const speed = 7;
  const leftDir = state.held?.left || 0;
  state.left = clamp(state.left + leftDir * speed, PAD_H / 2, state.h - PAD_H / 2);
  if (state.ai) {
    const aim = clamp(state.ball.y - state.right, -4, 4);
    state.right = clamp(state.right + aim, PAD_H / 2, state.h - PAD_H / 2);
  } else {
    const rightDir = state.held?.right || 0;
    state.right = clamp(state.right + rightDir * speed, PAD_H / 2, state.h - PAD_H / 2);
  }
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;
  if (state.ball.y <= 8 || state.ball.y >= state.h - 8) state.ball.vy *= -1;
  state.ball.y = clamp(state.ball.y, 8, state.h - 8);
  if (state.ball.vx < 0 && state.ball.x <= PAD_X + PAD_W && hitPaddle(state.ball, state.left)) {
    state.ball.x = PAD_X + PAD_W + 1;
    state.ball.vx = Math.min(11, Math.abs(state.ball.vx) + 0.15);
    state.ball.vy += (state.ball.y - state.left) * 0.06;
  }
  if (state.ball.vx > 0 && state.ball.x >= state.w - PAD_X - PAD_W && hitPaddle(state.ball, state.right)) {
    state.ball.x = state.w - PAD_X - PAD_W - 1;
    state.ball.vx = -Math.min(11, Math.abs(state.ball.vx) + 0.15);
    state.ball.vy += (state.ball.y - state.right) * 0.06;
  }
  if (state.ball.x < 0) {
    state.score[1] += 1;
    resetBall(state, 1);
  } else if (state.ball.x > state.w) {
    state.score[0] += 1;
    resetBall(state, -1);
  }
  if (state.score[0] >= 5 || state.score[1] >= 5) {
    state.over = true;
    state.winner = state.score[0] >= state.score[1] ? 'left' : 'right';
  }
  state.tick += 1;
  return state;
}

export function queueDir(snake, dir) {
  const next = Number(dir);
  if (!snake || !Number.isInteger(next) || next < 0 || next > 3) return false;
  if ((snake.dir + 2) % 4 === next) return false;
  snake.queued = next;
  return true;
}

function occupied(state, x, y, ignoreTail) {
  return state.snakes.some((snake) => snake.body.some((part, index) => {
    if (!snake.alive && ignoreTail !== snake) return false;
    if (ignoreTail === snake && index === snake.body.length - 1) return false;
    return part.x === x && part.y === y;
  }));
}

function placeFood(state) {
  const taken = new Set();
  state.snakes.forEach((snake) => snake.body.forEach((part) => taken.add(`${part.x},${part.y}`)));
  for (let i = 0; i < 60; i += 1) {
    const n = nextSeed(state);
    const x = n % state.cols;
    const y = (n >>> 8) % state.rows;
    if (!taken.has(`${x},${y}`)) {
      state.food = { x, y };
      return;
    }
  }
}

export function snakeAi(state, index) {
  const snake = state?.snakes?.[index];
  if (!snake?.alive) return snake?.dir ?? 1;
  const head = snake.body[0];
  let best = snake.dir;
  let bestScore = Infinity;
  for (let dir = 0; dir < 4; dir += 1) {
    if ((snake.dir + 2) % 4 === dir) continue;
    const step = DIRS[dir];
    const x = head.x + step.x;
    const y = head.y + step.y;
    if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) continue;
    if (occupied(state, x, y, snake)) continue;
    const dist = Math.abs(x - state.food.x) + Math.abs(y - state.food.y);
    if (dist < bestScore) {
      bestScore = dist;
      best = dir;
    }
  }
  return best;
}

export function stepSnakes(state, { ai = false } = {}) {
  if (!state || state.over) return state;
  if (ai && state.snakes[1]?.alive) queueDir(state.snakes[1], snakeAi(state, 1));
  const heads = state.snakes.map((snake) => {
    if (!snake.alive) return null;
    snake.dir = snake.queued;
    const step = DIRS[snake.dir] || DIRS[1];
    return { x: snake.body[0].x + step.x, y: snake.body[0].y + step.y };
  });
  state.snakes.forEach((snake, index) => {
    if (!snake.alive) return;
    const head = heads[index];
    const wall = head.x < 0 || head.y < 0 || head.x >= state.cols || head.y >= state.rows;
    const self = snake.body.some((part, partIndex) => partIndex !== snake.body.length - 1 && part.x === head.x && part.y === head.y);
    const other = state.snakes.some((rival, rivalIndex) => {
      if (rivalIndex === index || !rival.alive) return false;
      return rival.body.some((part) => part.x === head.x && part.y === head.y);
    });
    const clash = heads.some((rival, rivalIndex) => rivalIndex !== index && rival && rival.x === head.x && rival.y === head.y);
    if (wall || self || other || clash) {
      snake.alive = false;
      return;
    }
    snake.body.unshift(head);
    if (head.x === state.food.x && head.y === state.food.y) placeFood(state);
    else snake.body.pop();
  });
  const living = state.snakes.filter((snake) => snake.alive);
  if (living.length <= 1) {
    state.over = true;
    if (!living.length) state.winner = 'draw';
    else state.winner = state.snakes[0].alive ? 'left' : 'right';
  }
  state.tick += 1;
  return state;
}

function snakeLength(snake) {
  if (!snake) return 0;
  if (Array.isArray(snake.body)) return snake.body.length;
  return Number(snake.length) || 0;
}

function signFlip(before, after) {
  const left = Number(before);
  const right = Number(after);
  return left && right && Math.sign(left) !== Math.sign(right);
}

function wallBounce(prev, next) {
  const before = Number(prev.ball?.vy);
  const after = Number(next.ball?.vy);
  if (!before || !after || Math.sign(before) === Math.sign(after)) return false;
  const y = Number(next.ball?.y);
  const prevY = Number(prev.ball?.y);
  if (!Number.isFinite(y) || !Number.isFinite(prevY)) return false;
  const top = 8;
  const bottom = (Number(next.h) || Number(prev.h) || PONG_H) - 8;
  if (y <= top && after > 0 && prevY > top) return true;
  if (y >= bottom && after < 0 && prevY < bottom) return true;
  return false;
}

export function arcadeCues(prev, next, role = 'host') {
  if (!prev || !next || prev.over) return [];
  if (next.over) {
    const mine = role === 'guest' ? 'right' : 'left';
    if (next.winner === 'draw') return ['draw'];
    return [next.winner === mine ? 'win' : 'lose'];
  }
  if ((next.id || prev.id) === 'snakes' || next.snakes) {
    const died = (prev.snakes || []).some((snake, index) => snake?.alive && next.snakes?.[index] && !next.snakes[index].alive);
    const grew = (next.snakes || []).some((snake, index) => snakeLength(snake) > snakeLength(prev.snakes?.[index]));
    if (died) return ['die'];
    if (grew) return ['eat'];
    if (prev.tick !== next.tick) return ['tick'];
    return [];
  }
  const scored = (prev.score?.[0] || 0) !== (next.score?.[0] || 0) || (prev.score?.[1] || 0) !== (next.score?.[1] || 0);
  if (scored) return ['score'];
  if (signFlip(prev.ball?.vx, next.ball?.vx)) return ['hit'];
  if (wallBounce(prev, next)) return ['wall'];
  return [];
}

export function drawArcade(state, ctx) {
  if (!ctx || !state) return;
  if (state.id === 'snakes') drawSnakes(state, ctx);
  else drawPong(state, ctx);
}

function drawPong(state, ctx) {
  ctx.fillStyle = '#102033';
  ctx.fillRect(0, 0, state.w, state.h);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(state.w / 2, 12);
  ctx.lineTo(state.w / 2, state.h - 12);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f4f7fb';
  ctx.fillRect(PAD_X, state.left - PAD_H / 2, PAD_W, PAD_H);
  ctx.fillRect(state.w - PAD_X - PAD_W, state.right - PAD_H / 2, PAD_W, PAD_H);
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, 7, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnakes(state, ctx) {
  const cell = 16;
  ctx.fillStyle = '#102033';
  ctx.fillRect(0, 0, state.w, state.h);
  ctx.fillStyle = '#f0c14a';
  ctx.fillRect(state.food.x * cell + 3, state.food.y * cell + 3, cell - 6, cell - 6);
  const colors = ['#f4f7fb', '#3dde7a'];
  state.snakes.forEach((snake, index) => {
    ctx.fillStyle = snake.alive ? colors[index] : '#6d7a88';
    snake.body.forEach((part) => ctx.fillRect(part.x * cell + 1, part.y * cell + 1, cell - 2, cell - 2));
  });
}

function pongShot() {
  return '<svg viewBox="0 0 640 360" role="img" aria-label="Pong"><rect width="640" height="360" fill="#102033"/><line x1="320" y1="18" x2="320" y2="342" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="8 8"/><text x="248" y="72" fill="#f4f7fb" font-size="48" font-family="sans-serif" text-anchor="end">3</text><text x="392" y="72" fill="#f4f7fb" font-size="48" font-family="sans-serif">1</text><rect x="24" y="214" width="10" height="64" rx="2" fill="#f4f7fb"/><rect x="606" y="92" width="10" height="64" rx="2" fill="#f4f7fb"/><circle cx="548" cy="132" r="8" fill="#f4f7fb"/></svg>';
}

function snakesShot() {
  const cell = (x, y, color) => `<rect x="${x * 16 + 1}" y="${y * 16 + 1}" width="14" height="14" rx="2" fill="${color}"/>`;
  const left = [[6, 12], [5, 12], [4, 12], [4, 11], [4, 10], [4, 9], [5, 9], [6, 9]].map(([x, y]) => cell(x, y, '#f4f7fb')).join('');
  const right = [[14, 8], [15, 8], [16, 8], [16, 9], [16, 10], [16, 11], [15, 11], [14, 11], [13, 11]].map(([x, y]) => cell(x, y, '#3dde7a')).join('');
  const food = '<rect x="163" y="83" width="10" height="10" rx="2" fill="#f0c14a"/>';
  return `<svg viewBox="0 0 336 336" role="img" aria-label="Snakes"><rect width="336" height="336" fill="#102033"/>${food}${left}${right}</svg>`;
}

function arcadeShot(id) {
  return id === 'snakes' ? snakesShot() : pongShot();
}

export function arcadeCardsHtml() {
  return ARCADE.map((game) => `<article class="game-card arcade-card"><div class="arcade-sample" data-game="${game.id}">${arcadeShot(game.id)}</div><div class="game-copy"><h3>${escapeHtml(game.name)}</h3><p>${escapeHtml(game.blurb)}</p><div class="game-actions"><button type="button" class="primary small" data-act="game-ai" data-game="${game.id}">Play AI</button><button type="button" class="game-alt" data-act="game-person" data-game="${game.id}">LibreSky player</button></div></div></article>`).join('');
}

export function arcadeJoinHtml() {
  return '<form class="arcade-join" id="arcade-join"><input id="arcade-code" placeholder="Room code" autocomplete="off" spellcheck="false" maxlength="24" aria-label="Room code"><button type="button" class="primary small" data-act="arcade-join">Join</button></form>';
}
