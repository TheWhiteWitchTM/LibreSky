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

export function arcadeCardsHtml() {
  return ARCADE.map((game) => `<article class="game-card arcade-card"><div class="arcade-sample" data-game="${game.id}"></div><div class="game-copy"><h3>${escapeHtml(game.name)}</h3><p>${escapeHtml(game.blurb)}</p><div class="game-actions"><button type="button" class="primary small" data-act="game-ai" data-game="${game.id}">Play AI</button><button type="button" class="game-alt" data-act="game-person" data-game="${game.id}">LibreSky player</button></div></div></article>`).join('');
}

export function arcadeJoinHtml() {
  return '<form class="arcade-join" id="arcade-join"><input id="arcade-code" placeholder="Room code" autocomplete="off" spellcheck="false" maxlength="24" aria-label="Room code"><button type="button" class="primary small" data-act="arcade-join">Join</button></form>';
}
