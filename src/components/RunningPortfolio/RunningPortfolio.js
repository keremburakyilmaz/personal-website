import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Pause,
  Play,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { education, experience, projects, skills } from '../../data/constants';
import './RunningPortfolio.css';

const SECTION_LINKS = [
  { id: 'systems', label: 'Systems' },
  { id: 'orchestration', label: 'Live note' },
  { id: 'record', label: 'Record' },
  { id: 'contact', label: 'Contact' },
];

const HEADER_LINKS = [
  { id: 'top', label: 'Home', href: '#top' },
  { id: 'systems', label: 'Systems', href: '#systems' },
  { id: 'record', label: 'Record', href: '#record' },
  { id: 'contact', label: 'Contact', href: '#contact' },
  { label: 'QuantFusion', to: '/quantfusion' },
  { label: 'Spotify', to: '/spotify-brain' },
  { label: 'Radar', to: '/market-radar' },
  { label: 'Palimpsest', to: '/palimpsest' },
  { label: 'System', to: '/system' },
];

const LIVE_SURFACES = [
  {
    index: '01',
    name: 'QUANTFUSION',
    description: 'Risk, optimization, and regime intelligence',
    to: '/quantfusion',
  },
  {
    index: '02',
    name: 'SPOTIFY BRAIN',
    description: 'Predictions and pipeline history',
    to: '/spotify-brain',
  },
  {
    index: '03',
    name: 'PALIMPSEST',
    description: 'Interactive narrative state machine',
    to: '/palimpsest',
  },
  {
    index: '04',
    name: 'SYSTEM',
    description: 'Live client-side process simulation',
    to: '/system',
  },
];

const QUANTFUSION_API = 'https://quantfusion-q2as.onrender.com';
const SPOTIFY_BRAIN_FEED = 'https://raw.githubusercontent.com/keremburakyilmaz/spotify-brain/main/export/dashboard_data.json';

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function useLiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

function useSessionUptime() {
  const startedAt = useRef(Date.now());
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return formatDuration(seconds);
}

function useNetworkStatus() {
  const [online, setOnline] = useState(() => (
    typeof navigator === 'undefined' ? true : navigator.onLine
  ));

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}

function parseMachineTime(value) {
  if (!value) return null;
  const trimmed = String(value).trim().replace(/(\.\d{3})\d+/, '$1');
  const timestamp = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed) ? trimmed : `${trimmed}Z`;
  const parsed = new Date(timestamp);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatSourceTime(value) {
  const parsed = value instanceof Date ? value : parseMachineTime(value);
  if (!parsed) return 'AWAITING SOURCE';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(parsed).replace(',', '');
}

function formatDataAge(value, now = new Date()) {
  const parsed = value instanceof Date ? value : parseMachineTime(value);
  if (!parsed) return 'NO SIGNAL';
  const seconds = Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / 1000));
  if (seconds < 60) return `${seconds}S AGO`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}H ${minutes % 60}M AGO`;
  return `${Math.floor(hours / 24)}D AGO`;
}

function asPercent(value, digits = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? `${(number * 100).toFixed(digits)}%` : '—';
}

function useLiveSurfaceTelemetry() {
  const [refreshSequence, setRefreshSequence] = useState(0);
  const [quantfusion, setQuantfusion] = useState({
    status: 'checking',
    health: null,
    regime: null,
    latency: null,
    lastChecked: null,
    error: null,
  });
  const [spotify, setSpotify] = useState({
    status: 'checking',
    data: null,
    latency: null,
    lastChecked: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchJson = async (url) => {
      const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.json();
    };

    const loadQuantfusion = async () => {
      const startedAt = performance.now();
      setQuantfusion((current) => ({
        ...current,
        status: current.lastChecked ? 'refreshing' : 'checking',
        error: null,
      }));

      const [healthResult, regimeResult] = await Promise.allSettled([
        fetchJson(`${QUANTFUSION_API}/api/health`),
        fetchJson(`${QUANTFUSION_API}/api/regime/current`),
      ]);
      if (cancelled) return;

      const health = healthResult.status === 'fulfilled' ? healthResult.value : null;
      const regime = regimeResult.status === 'fulfilled' ? regimeResult.value : null;
      const healthy = health?.status === 'ok';
      setQuantfusion((current) => ({
        status: healthy ? (regime ? 'operational' : 'degraded') : 'unreachable',
        health,
        regime: regime || current.regime,
        latency: Math.max(1, Math.round(performance.now() - startedAt)),
        lastChecked: new Date(),
        error: healthy
          ? (regime ? null : 'REGIME FEED UNAVAILABLE')
          : 'HEALTH ENDPOINT UNREACHABLE',
      }));
    };

    const loadSpotify = async () => {
      const startedAt = performance.now();
      setSpotify((current) => ({
        ...current,
        status: current.lastChecked ? 'refreshing' : 'checking',
        error: null,
      }));

      try {
        const minuteKey = Math.floor(Date.now() / 60000);
        const data = await fetchJson(`${SPOTIFY_BRAIN_FEED}?v=${minuteKey}`);
        if (cancelled) return;
        setSpotify({
          status: 'published',
          data,
          latency: Math.max(1, Math.round(performance.now() - startedAt)),
          lastChecked: new Date(),
          error: null,
        });
      } catch (error) {
        if (cancelled || error.name === 'AbortError') return;
        setSpotify((current) => ({
          ...current,
          status: 'unreachable',
          latency: Math.max(1, Math.round(performance.now() - startedAt)),
          lastChecked: new Date(),
          error: 'PUBLISHED FEED UNREACHABLE',
        }));
      }
    };

    const refresh = () => {
      loadQuantfusion();
      loadSpotify();
    };

    refresh();
    const interval = window.setInterval(refresh, 60000);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(interval);
    };
  }, [refreshSequence]);

  return {
    quantfusion,
    spotify,
    refresh: () => setRefreshSequence((sequence) => sequence + 1),
  };
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState('systems');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;

    const sections = SECTION_LINKS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeSection;
}

function SignalNumber({ value, label }) {
  return (
    <span className="rp-signal-number" aria-label={label || value}>
      {String(value).split('').map((character, index) => (
        <span
          className={character === ':' ? 'rp-signal-number__separator' : 'rp-signal-number__digit'}
          key={`${index}-${character}`}
          aria-hidden="true"
        >
          {character}
        </span>
      ))}
    </span>
  );
}

function LivingSignalField() {
  const canvasRef = useRef(null);
  const scoreRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.getContext !== 'function') return undefined;

    let context;
    try {
      context = canvas.getContext('2d');
    } catch (error) {
      return undefined;
    }
    if (!context) return undefined;

    const motionQuery = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const columns = 28;
    const rows = 20;
    const fixedLength = 9;
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    const sameCell = (first, second) => first.x === second.x && first.y === second.y;
    const makeInitialSnake = () => Array.from({ length: 9 }, (_, index) => ({
      x: 9 + index,
      y: 10,
    }));

    let width = 1;
    let height = 1;
    let frameId = null;
    let lastDraw = 0;
    let lastStep = 0;
    let snake = makeInitialSnake();
    let direction = { x: 1, y: 0 };
    let score = 0;
    let target = { x: 22, y: 6 };

    const randomEmptyCell = () => {
      for (let attempt = 0; attempt < 200; attempt += 1) {
        const candidate = {
          x: Math.floor(Math.random() * columns),
          y: Math.floor(Math.random() * rows),
        };
        if (!snake.some((segment) => sameCell(segment, candidate))) return candidate;
      }
      return { x: 2, y: 2 };
    };

    const resetSnake = () => {
      snake = makeInitialSnake();
      direction = { x: 1, y: 0 };
      target = randomEmptyCell();
    };

    const cellKey = (cell) => `${cell.x}:${cell.y}`;

    const hasEscapeSpace = (candidate) => {
      const simulatedSnake = [...snake.slice(1), candidate];
      const blocked = new Set(simulatedSnake.slice(0, -1).map(cellKey));
      const visited = new Set([cellKey(candidate)]);
      const queue = [candidate];
      const minimumOpenCells = fixedLength * 3;

      while (queue.length > 0 && visited.size < minimumOpenCells) {
        const current = queue.shift();
        directions.forEach((nextDirection) => {
          const next = {
            x: current.x + nextDirection.x,
            y: current.y + nextDirection.y,
          };
          const key = cellKey(next);
          if (
            next.x < 0
            || next.x >= columns
            || next.y < 0
            || next.y >= rows
            || blocked.has(key)
            || visited.has(key)
          ) return;
          visited.add(key);
          queue.push(next);
        });
      }

      return visited.size >= minimumOpenCells;
    };

    const boardMetrics = () => {
      const gutter = Math.min(48, Math.max(22, width * 0.06));
      const cell = Math.max(5, Math.floor(Math.min(
        (width - gutter * 2) / columns,
        (height - gutter * 2) / rows,
      )));
      const boardWidth = cell * columns;
      const boardHeight = cell * rows;
      return {
        cell,
        boardWidth,
        boardHeight,
        left: (width - boardWidth) / 2,
        top: (height - boardHeight) / 2,
      };
    };

    const advance = () => {
      const head = snake[snake.length - 1];
      const bodyAfterTailMoves = snake.slice(1);
      const validMoves = directions
        .map((nextDirection) => ({
          direction: nextDirection,
          point: {
            x: head.x + nextDirection.x,
            y: head.y + nextDirection.y,
          },
        }))
        .filter(({ point }) => (
          point.x >= 0
          && point.x < columns
          && point.y >= 0
          && point.y < rows
          && !bodyAfterTailMoves.some((segment) => sameCell(segment, point))
        ));

      const safeMoves = validMoves.filter(({ point }) => hasEscapeSpace(point));
      if (safeMoves.length === 0) {
        resetSnake();
        return;
      }

      const currentDistance = Math.abs(head.x - target.x) + Math.abs(head.y - target.y);
      const weightedMoves = safeMoves.map((move) => {
        const nextDistance = Math.abs(move.point.x - target.x) + Math.abs(move.point.y - target.y);
        const weight = nextDistance < currentDistance ? 2.5 : 1;
        return { ...move, weight };
      });
      const totalWeight = weightedMoves.reduce((sum, move) => sum + move.weight, 0);
      let selection = Math.random() * totalWeight;
      let chosenMove = weightedMoves[weightedMoves.length - 1];
      for (const move of weightedMoves) {
        selection -= move.weight;
        if (selection <= 0) {
          chosenMove = move;
          break;
        }
      }

      direction = chosenMove.direction;
      snake.push(chosenMove.point);

      if (sameCell(chosenMove.point, target)) {
        score += 1;
        target = randomEmptyCell();
        if (scoreRef.current) {
          scoreRef.current.textContent = `TARGETS ${pad(score)} / ${columns}×${rows} GRID`;
        }
      }

      while (snake.length > fixedLength) snake.shift();
    };

    const draw = (timestamp = 0, still = false) => {
      if (!still && timestamp - lastDraw < 1000 / 24) {
        frameId = window.requestAnimationFrame(draw);
        return;
      }
      lastDraw = timestamp;

      if (!still && timestamp - lastStep >= 165) {
        advance();
        lastStep = timestamp;
      }

      context.clearRect(0, 0, width, height);
      const board = boardMetrics();
      const cellCenter = (point) => ({
        x: board.left + point.x * board.cell + board.cell / 2,
        y: board.top + point.y * board.cell + board.cell / 2,
      });

      context.strokeStyle = 'rgba(237, 237, 237, 0.11)';
      context.lineWidth = 1;
      context.strokeRect(
        board.left - 0.5,
        board.top - 0.5,
        board.boardWidth + 1,
        board.boardHeight + 1,
      );

      const body = snake.map(cellCenter);

      context.beginPath();
      body.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.strokeStyle = 'rgba(237, 237, 237, 0.18)';
      context.lineWidth = Math.max(1, board.cell * 0.13);
      context.lineJoin = 'miter';
      context.stroke();

      body.forEach((point, index) => {
        const progress = (index + 1) / body.length;
        const size = board.cell * (0.24 + progress * 0.27);
        context.fillStyle = `rgba(237, 237, 237, ${0.12 + progress * 0.6})`;
        context.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      });

      const head = body[body.length - 1];
      const headSize = board.cell * 0.58;
      context.fillStyle = '#ededed';
      context.fillRect(
        head.x - headSize / 2,
        head.y - headSize / 2,
        headSize,
        headSize,
      );
      context.fillStyle = '#0a0a0a';
      const directionMark = Math.max(2, board.cell * 0.16);
      context.fillRect(
        head.x + direction.x * board.cell * 0.17 - directionMark / 2,
        head.y + direction.y * board.cell * 0.17 - directionMark / 2,
        directionMark,
        directionMark,
      );

      const targetPoint = cellCenter(target);
      const pulse = board.cell * 0.58 + Math.sin(timestamp * 0.004) * 1.2;
      context.strokeStyle = 'rgba(215, 25, 33, 0.48)';
      context.lineWidth = 1;
      context.strokeRect(
        targetPoint.x - pulse / 2,
        targetPoint.y - pulse / 2,
        pulse,
        pulse,
      );
      const targetSize = Math.max(3, board.cell * 0.22);
      context.fillStyle = '#d71921';
      context.fillRect(
        targetPoint.x - targetSize / 2,
        targetPoint.y - targetSize / 2,
        targetSize,
        targetSize,
      );

      if (!still) frameId = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(0, true);
    };

    const start = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = motionQuery?.matches ? null : window.requestAnimationFrame(draw);
      if (motionQuery?.matches) draw(0, true);
    };

    const relocateTarget = (event) => {
      const bounds = canvas.getBoundingClientRect();
      const board = boardMetrics();
      const x = Math.floor((event.clientX - bounds.left - board.left) / board.cell);
      const y = Math.floor((event.clientY - bounds.top - board.top) / board.cell);
      if (x < 0 || x >= columns || y < 0 || y >= rows) return;

      const requestedTarget = { x, y };
      target = snake.some((segment) => sameCell(segment, requestedTarget))
        ? randomEmptyCell()
        : requestedTarget;
      if (motionQuery?.matches) draw(0, true);
    };

    const handleMotionPreference = () => start();
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(resize);

    resizeObserver?.observe(canvas);
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointerdown', relocateTarget);
    motionQuery?.addEventListener?.('change', handleMotionPreference);

    resize();
    start();

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', relocateTarget);
      motionQuery?.removeEventListener?.('change', handleMotionPreference);
    };
  }, []);

  return (
    <div className="rp-signal-field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="rp-signal-field__status">
        <span><i />AUTONOMOUS SNAKE / 09 SEGMENTS</span>
        <span ref={scoreRef}>TARGETS 00 / 28×20 GRID</span>
      </div>
      <span className="rp-signal-field__hint">FOOD-BIASED RANDOM WALK / CLICK TO MOVE TARGET</span>
    </div>
  );
}

function SectionIndex({ number, name, meta, headingId }) {
  return (
    <div className="rp-section-index">
      <div className="rp-section-index__title">
        <span>{number}</span>
        <h2 id={headingId}>{name}</h2>
      </div>
      <span className="rp-section-index__meta">{meta}</span>
    </div>
  );
}

function projectState(project) {
  const links = project.links || [];
  if (links.some((link) => link.type === 'internal')) {
    return { glyph: '●', label: 'LIVE SURFACE', signal: true };
  }
  if (links.some((link) => link.type === 'external')) {
    return { glyph: '◐', label: 'EXTERNAL' };
  }
  if (links.some((link) => link.type === 'github')) {
    return { glyph: '◐', label: 'SOURCE' };
  }
  return { glyph: '○', label: 'DOCUMENTED' };
}

function processName(title) {
  return title.split(' - ')[0].toUpperCase();
}

function ProjectLink({ link }) {
  const content = (
    <>
      <span>{link.label}</span>
      <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.7} />
    </>
  );

  if (link.type === 'internal') {
    return <Link className="rp-text-link" to={link.url}>{content}</Link>;
  }

  return (
    <a className="rp-text-link" href={link.url} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}

function LiveSurfaceLauncher() {
  return (
    <aside className="rp-live-launcher" aria-label="Live dashboards">
      <div className="rp-live-launcher__header">
        <span><i aria-hidden="true" />LIVE SURFACES</span>
        <span>{pad(LIVE_SURFACES.length)} ACTIVE</span>
      </div>
      {LIVE_SURFACES.map((surface) => (
        <Link className="rp-live-launcher__row" to={surface.to} key={surface.to}>
          <span className="rp-live-launcher__index">{surface.index}</span>
          <span className="rp-live-launcher__identity">
            <strong>{surface.name}</strong>
            <small>{surface.description}</small>
          </span>
          <span className="rp-live-launcher__action">
            <span>OPEN DASHBOARD</span>
            <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.7} />
          </span>
        </Link>
      ))}
    </aside>
  );
}

function SignalFieldView({ quantfusion, spotifyData, quantfusionLive, spotifyPublished }) {
  const canvasRef = useRef(null);
  const confidence = Number(quantfusion.regime?.confidence) || 0.35;
  const regime = String(quantfusion.regime?.regime || 'sideways').toLowerCase();
  const centroid = spotifyData.next_prediction?.cluster_centroid || {};
  const energy = Number(centroid.energy) || 0.35;
  const valence = Number(centroid.valence) || 0.35;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const particles = Array.from({ length: 42 }, (_, index) => ({
      x: ((index * 37) % 100) / 100,
      y: ((index * 61) % 100) / 100,
      phase: index * 0.71,
    }));
    let width = 1;
    let height = 1;
    let frame = null;
    let lastFrame = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const direction = regime === 'bull' ? 1 : regime === 'bear' ? -1 : 0.35;
    const speed = quantfusionLive || spotifyPublished ? 0.000018 + energy * 0.000018 : 0;

    const draw = (timestamp = 0) => {
      if (timestamp - lastFrame < 1000 / 24 && !reducedMotion) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;
      context.clearRect(0, 0, width, height);

      context.fillStyle = 'rgba(237, 237, 237, 0.07)';
      for (let x = 20; x < width; x += 28) {
        for (let y = 20; y < height; y += 28) context.fillRect(x, y, 1, 1);
      }

      const points = particles.map((particle) => {
        const travel = reducedMotion ? 0 : timestamp * speed * direction;
        const normalizedX = (particle.x + travel + 2) % 1;
        const wave = Math.sin(normalizedX * Math.PI * 4 + particle.phase + timestamp * speed * 3);
        const normalizedY = Math.max(0.04, Math.min(0.96, particle.y + wave * (0.015 + energy * 0.035)));
        return { x: normalizedX * width, y: normalizedY * height };
      });

      points.forEach((point, index) => {
        for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
          const next = points[nextIndex];
          const distance = Math.hypot(point.x - next.x, point.y - next.y);
          const threshold = 42 + confidence * 46;
          if (distance > threshold) continue;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(next.x, next.y);
          context.strokeStyle = `rgba(237, 237, 237, ${(1 - distance / threshold) * (0.055 + valence * 0.08)})`;
          context.lineWidth = 1;
          context.stroke();
        }
      });

      points.forEach((point, index) => {
        const size = index % 7 === 0 ? 3 : 1.5;
        context.fillStyle = index % 13 === 0 ? '#d71921' : 'rgba(237, 237, 237, 0.58)';
        context.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      });

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(canvas);
    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [confidence, energy, quantfusionLive, regime, spotifyPublished, valence]);

  return (
    <div className="rp-signal-view">
      <canvas ref={canvasRef} aria-hidden="true" />
      <Link className="rp-signal-view__source rp-signal-view__source--qf" to="/quantfusion">
        <span>QUANTFUSION</span>
        <strong>{quantfusion.regime?.regime?.toUpperCase() || 'AWAITING'}</strong>
        <small>REGIME / {asPercent(quantfusion.regime?.confidence)}</small>
      </Link>
      <Link className="rp-signal-view__source rp-signal-view__source--spotify" to="/spotify-brain">
        <span>SPOTIFY BRAIN</span>
        <strong>{spotifyData.next_prediction?.mood_label?.toUpperCase() || 'AWAITING'}</strong>
        <small>ENERGY / {asPercent(energy)}</small>
      </Link>
      <span className="rp-signal-view__caption">TWO INPUTS / ONE LIVING FIELD</span>
    </div>
  );
}

function LiveWindowsView({ quantfusion, spotifyData, now, statusLabel, statusTone }) {
  const prediction = spotifyData.next_prediction || {};
  const probabilities = quantfusion.regime?.probabilities || {};
  return (
    <div className="rp-live-windows">
      <Link className="rp-live-window" data-tone={statusTone('quantfusion')} to="/quantfusion">
        <div><span>01 / QUANTFUSION</span><small><i />{statusLabel('quantfusion')}</small></div>
        <strong>{quantfusion.regime?.regime?.toUpperCase() || 'AWAITING'}</strong>
        <div className="rp-live-window__bars" aria-hidden="true">
          {['bull', 'sideways', 'bear'].map((label) => (
            <i style={{ height: `${Math.max(3, (probabilities[label] || 0) * 100)}%` }} key={label} />
          ))}
        </div>
        <p>REGIME SNAPSHOT / {formatDataAge(quantfusion.regime?.ts, now)}</p>
        <span className="rp-live-window__open">OPEN FULL SURFACE <ArrowUpRight size={12} /></span>
      </Link>
      <Link className="rp-live-window" data-tone={statusTone('spotify')} to="/spotify-brain">
        <div><span>02 / SPOTIFY BRAIN</span><small><i />{statusLabel('spotify')}</small></div>
        <strong>{prediction.mood_label?.toUpperCase() || 'AWAITING'}</strong>
        <div className="rp-live-window__wave" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <i style={{ height: `${12 + Math.abs(Math.sin(index * 1.7)) * ((prediction.confidence || 0.25) * 75)}%` }} key={index} />
          ))}
        </div>
        <p>PIPELINE EXPORT / {formatDataAge(spotifyData.generated_at, now)}</p>
        <span className="rp-live-window__open">OPEN FULL SURFACE <ArrowUpRight size={12} /></span>
      </Link>
    </div>
  );
}

function SystemMapView({ quantfusion, spotifyData, statusLabel, statusTone }) {
  return (
    <div className="rp-system-map-view">
      <Link className="rp-system-map-view__node rp-system-map-view__node--qf" data-tone={statusTone('quantfusion')} to="/quantfusion">
        <span>01 / API</span><strong>QUANTFUSION</strong><small><i />{statusLabel('quantfusion')}</small>
      </Link>
      <span className="rp-system-map-view__route rp-system-map-view__route--qf" aria-hidden="true"><i /></span>
      <div className="rp-system-map-view__hub">
        <span>PORTFOLIO NODE</span><strong>LIVE / 02</strong><small>KEREMBURAKYILMAZ.COM</small>
      </div>
      <span className="rp-system-map-view__route rp-system-map-view__route--spotify" aria-hidden="true"><i /></span>
      <Link className="rp-system-map-view__node rp-system-map-view__node--spotify" data-tone={statusTone('spotify')} to="/spotify-brain">
        <span>02 / EXPORT</span><strong>SPOTIFY BRAIN</strong><small><i />{statusLabel('spotify')}</small>
      </Link>
      <p>REAL RESPONSES MOVE TOWARD THIS SITE. SELECT A SOURCE TO FOLLOW THE ROUTE.</p>
    </div>
  );
}

function MachineNoteView({ quantfusion, spotifyData, now, currentSources }) {
  const regime = quantfusion.regime?.regime;
  const mood = spotifyData.next_prediction?.mood_label;
  return (
    <div className="rp-machine-note">
      <span className="rp-machine-note__label">LATEST OUTPUTS / AUTO-GENERATED</span>
      <p>
        QuantFusion reports{' '}
        <Link to="/quantfusion">{regime ? `${regime} (${asPercent(quantfusion.regime?.confidence)})` : 'no current regime'}</Link>.
        {' '}Spotify Brain predicts{' '}
        <Link to="/spotify-brain">{mood ? `${mood.toLowerCase()} (${asPercent(spotifyData.next_prediction?.confidence)})` : 'no current mood'}</Link>.
        {' '}{currentSources === 2 ? 'Both sources are available.' : `${currentSources} of 2 sources is available.`}
      </p>
      <div>
        <span>QF / {formatDataAge(quantfusion.regime?.ts, now)}</span>
        <span>SB / {formatDataAge(spotifyData.generated_at, now)}</span>
        <span>GENERATED / {formatSourceTime(now)}</span>
      </div>
    </div>
  );
}

function LiveCarouselView({ quantfusion, spotifyData, now, statusLabel }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActiveSlide((slide) => (slide + 1) % 2), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const slides = [
    {
      name: 'QUANTFUSION',
      eyebrow: `01 / ${statusLabel('quantfusion')}`,
      value: quantfusion.regime?.regime?.toUpperCase() || 'AWAITING',
      detail: `${asPercent(quantfusion.regime?.confidence)} CONFIDENCE / ${formatDataAge(quantfusion.regime?.ts, now)}`,
      to: '/quantfusion',
    },
    {
      name: 'SPOTIFY BRAIN',
      eyebrow: `02 / ${statusLabel('spotify')}`,
      value: spotifyData.next_prediction?.mood_label?.toUpperCase() || 'AWAITING',
      detail: `${asPercent(spotifyData.next_prediction?.confidence)} CONFIDENCE / ${formatDataAge(spotifyData.generated_at, now)}`,
      to: '/spotify-brain',
    },
  ];
  const slide = slides[activeSlide];

  return (
    <div className="rp-live-carousel">
      <div className="rp-live-carousel__topline">
        <span>AUTO ROTATION / 06.5S</span>
        <button type="button" onClick={() => setPaused((value) => !value)}>
          {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
          {paused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>
      <Link className="rp-live-carousel__slide" to={slide.to} key={slide.name}>
        <span>{slide.eyebrow}</span>
        <h4>{slide.name}</h4>
        <strong>{slide.value}</strong>
        <small>{slide.detail}</small>
        <em>OPEN FULL SURFACE <ArrowUpRight size={13} aria-hidden="true" /></em>
      </Link>
      <div className="rp-live-carousel__nav" role="tablist" aria-label="Choose live dashboard preview">
        {slides.map((item, index) => (
          <button className={activeSlide === index ? 'active' : ''} type="button" onClick={() => setActiveSlide(index)} key={item.name}>
            <span>0{index + 1}</span>{item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function LiveRailView({ quantfusion, spotifyData, statusLabel }) {
  return (
    <div className="rp-live-rail-stage">
      <div className="rp-live-rail-stage__page" aria-hidden="true">
        <span /><span /><span /><span /><span />
        <strong>PORTFOLIO CONTENT</strong>
      </div>
      <aside className="rp-live-rail-preview" aria-label="Persistent live rail preview">
        <div><i />LIVE / 02</div>
        <Link to="/quantfusion">
          <span>01</span><strong>QF</strong><small>{quantfusion.regime?.regime?.toUpperCase() || statusLabel('quantfusion')}</small>
        </Link>
        <Link to="/spotify-brain">
          <span>02</span><strong>SB</strong><small>{spotifyData.next_prediction?.mood_label?.toUpperCase() || statusLabel('spotify')}</small>
        </Link>
        <p>ALWAYS AVAILABLE<br />FROM PAGE EDGE</p>
      </aside>
    </div>
  );
}

function SessionDeltaView({ baseline, quantfusion, spotifyData, now }) {
  const qfCurrent = quantfusion.regime
    ? `${quantfusion.regime.ts}|${quantfusion.regime.regime}|${quantfusion.regime.confidence}`
    : null;
  const spotifyCurrent = spotifyData.generated_at
    ? `${spotifyData.generated_at}|${spotifyData.next_prediction?.mood_label}|${spotifyData.next_prediction?.confidence}`
    : null;
  const qfChanged = Boolean(baseline.qf && qfCurrent && baseline.qf !== qfCurrent);
  const spotifyChanged = Boolean(baseline.spotify && spotifyCurrent && baseline.spotify !== spotifyCurrent);
  const changes = Number(qfChanged) + Number(spotifyChanged);

  return (
    <div className="rp-session-delta">
      <div className="rp-session-delta__summary">
        <span>SINCE {baseline.capturedAt ? formatSourceTime(baseline.capturedAt) : 'SESSION START'}</span>
        <strong>{pad(changes)}</strong>
        <p>{changes === 0 ? 'NO SOURCE CHANGES THIS SESSION.' : `${changes} SOURCE CHANGE${changes === 1 ? '' : 'S'} DETECTED.`}</p>
      </div>
      <div className="rp-session-delta__rows">
        <article data-changed={qfChanged}>
          <span>01 / QUANTFUSION</span><strong>{qfChanged ? 'CHANGED' : 'UNCHANGED'}</strong>
          <p>{quantfusion.regime?.regime?.toUpperCase() || 'AWAITING'} / {asPercent(quantfusion.regime?.confidence)}</p>
          <small>LAST SOURCE OUTPUT {formatDataAge(quantfusion.regime?.ts, now)}</small>
        </article>
        <article data-changed={spotifyChanged}>
          <span>02 / SPOTIFY BRAIN</span><strong>{spotifyChanged ? 'CHANGED' : 'UNCHANGED'}</strong>
          <p>{spotifyData.next_prediction?.mood_label?.toUpperCase() || 'AWAITING'}</p>
          <small>LAST SOURCE OUTPUT {formatDataAge(spotifyData.generated_at, now)}</small>
        </article>
      </div>
    </div>
  );
}

function LiveOperations({ now }) {
  const activeMode = 'note';
  const [sessionBaseline, setSessionBaseline] = useState({
    capturedAt: null,
    qf: null,
    spotify: null,
  });
  const { quantfusion, spotify, refresh } = useLiveSurfaceTelemetry();
  const spotifyData = spotify.data || {};
  const quantfusionLive = ['operational', 'degraded', 'refreshing'].includes(quantfusion.status)
    && Boolean(quantfusion.lastChecked);
  const spotifyPublished = ['published', 'refreshing'].includes(spotify.status)
    && Boolean(spotify.data);
  const currentSources = Number(quantfusionLive) + Number(spotifyPublished);

  const spotifyGeneratedAt = parseMachineTime(spotifyData.generated_at);
  const spotifyAgeHours = spotifyGeneratedAt
    ? Math.max(0, (now.getTime() - spotifyGeneratedAt.getTime()) / 3600000)
    : Infinity;
  const spotifyFreshness = spotifyPublished
    ? (spotifyAgeHours <= 1 ? 50 : spotifyAgeHours <= 24 ? 42 : spotifyAgeHours <= 72 ? 28 : 12)
    : 0;
  const freshness = Math.round((quantfusionLive ? 50 : 0) + spotifyFreshness);

  const qfBaselineKey = quantfusion.regime
    ? `${quantfusion.regime.ts}|${quantfusion.regime.regime}|${quantfusion.regime.confidence}`
    : null;
  const spotifyBaselineKey = spotifyData.generated_at
    ? `${spotifyData.generated_at}|${spotifyData.next_prediction?.mood_label}|${spotifyData.next_prediction?.confidence}`
    : null;

  useEffect(() => {
    if (!qfBaselineKey && !spotifyBaselineKey) return;

    setSessionBaseline((baseline) => {
      if ((baseline.qf || !qfBaselineKey) && (baseline.spotify || !spotifyBaselineKey)) return baseline;
      return {
        capturedAt: baseline.capturedAt || new Date(),
        qf: baseline.qf || qfBaselineKey,
        spotify: baseline.spotify || spotifyBaselineKey,
      };
    });
  }, [qfBaselineKey, spotifyBaselineKey]);

  const statusLabel = (surface) => {
    if (surface === 'quantfusion') {
      if (quantfusion.status === 'operational') return 'OPERATIONAL';
      if (quantfusion.status === 'degraded') return 'PARTIAL SIGNAL';
      if (quantfusion.status === 'refreshing') return 'REFRESHING';
      if (quantfusion.status === 'unreachable') return 'UNREACHABLE';
      return 'CHECKING';
    }
    if (spotify.status === 'published') return 'PUBLISHED';
    if (spotify.status === 'refreshing') return 'REFRESHING';
    if (spotify.status === 'unreachable') return 'UNREACHABLE';
    return 'CHECKING';
  };

  const statusTone = (surface) => {
    const status = surface === 'quantfusion' ? quantfusion.status : spotify.status;
    if (['operational', 'published', 'refreshing'].includes(status)) return 'live';
    if (status === 'checking') return 'idle';
    return 'warn';
  };

  return (
    <section className="rp-orchestration" id="orchestration" aria-labelledby="orchestration-heading">
      <SectionIndex
        headingId="orchestration-heading"
        number="02"
        name="Live note"
        meta={`AUTO-ASSEMBLED / SOURCES ${pad(currentSources)} OF ${pad(LIVE_SURFACES.length)}`}
      />

      <div className="rp-live-operations__grid">
        <div className="rp-live-operations__copy">
          <span className="rp-micro-label">LIVE DATA / 02 SOURCES</span>
          <h3>Latest readings.</h3>
          <p>
            Latest public outputs from QuantFusion and Spotify Brain. Updated every 60 seconds.
          </p>

          <div className="rp-live-operations__controls">
            <button type="button" onClick={refresh}>
              <RefreshCw size={13} aria-hidden="true" />REFRESH DATA
            </button>
            <Link to="/quantfusion">QUANTFUSION <ArrowUpRight size={12} aria-hidden="true" /></Link>
            <Link to="/spotify-brain">SPOTIFY BRAIN <ArrowUpRight size={12} aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="rp-live-console">
          <div className="rp-live-console__header">
            <span><Radio size={12} aria-hidden="true" />LIVE SURFACES / MACHINE NOTE</span>
            <span>POLL / 60S</span>
          </div>

          <div
            className={`rp-live-console__body rp-live-console__body--${activeMode}`}
            id="live-machine-note"
            role="region"
            aria-label="Live machine note"
          >
            {activeMode === 'field' && (
              <SignalFieldView
                quantfusion={quantfusion}
                spotifyData={spotifyData}
                quantfusionLive={quantfusionLive}
                spotifyPublished={spotifyPublished}
              />
            )}

            {activeMode === 'windows' && (
              <LiveWindowsView
                quantfusion={quantfusion}
                spotifyData={spotifyData}
                now={now}
                statusLabel={statusLabel}
                statusTone={statusTone}
              />
            )}

            {activeMode === 'map' && (
              <SystemMapView
                quantfusion={quantfusion}
                spotifyData={spotifyData}
                statusLabel={statusLabel}
                statusTone={statusTone}
              />
            )}

            {activeMode === 'note' && (
              <MachineNoteView
                quantfusion={quantfusion}
                spotifyData={spotifyData}
                now={now}
                currentSources={currentSources}
              />
            )}

            {activeMode === 'carousel' && (
              <LiveCarouselView
                quantfusion={quantfusion}
                spotifyData={spotifyData}
                now={now}
                statusLabel={statusLabel}
              />
            )}

            {activeMode === 'rail' && (
              <LiveRailView
                quantfusion={quantfusion}
                spotifyData={spotifyData}
                statusLabel={statusLabel}
              />
            )}

            {activeMode === 'delta' && (
              <SessionDeltaView
                baseline={sessionBaseline}
                quantfusion={quantfusion}
                spotifyData={spotifyData}
                now={now}
              />
            )}
          </div>

          <div className="rp-live-freshness">
            <div>
              <span>DATA FRESHNESS</span>
              <span>{pad(freshness)}%</span>
            </div>
            <div className="rp-live-freshness__bar" aria-hidden="true">
              {Array.from({ length: 20 }, (_, index) => (
                <i className={index < Math.round(freshness / 5) ? 'active' : ''} key={index} />
              ))}
            </div>
            <p>
              SOURCES CURRENT: {pad(currentSources)} / {pad(LIVE_SURFACES.length)}
              <span>QF {quantfusion.error || 'SIGNAL RECEIVED'} / SB {spotify.error || 'SIGNAL RECEIVED'}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessRow({ project, index, expanded, onToggle }) {
  const state = projectState(project);
  const projectId = `process-${index}`;
  const liveLink = (project.links || []).find((link) => link.type === 'internal');

  return (
    <article className={`rp-process ${expanded ? 'rp-process--open' : ''}`}>
      <div className="rp-process__summary">
        <button
          className="rp-process__expand-hit"
          type="button"
          aria-expanded={expanded}
          aria-controls={projectId}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${project.title}`}
          onClick={onToggle}
        />
        <span className="rp-process__pid">{pad(index + 1)}</span>
        <span className="rp-process__identity">
          <strong>{processName(project.title)}</strong>
          <span>{project.title.includes(' - ') ? project.title.split(' - ').slice(1).join(' - ') : 'SYSTEM RECORD'}</span>
        </span>
        {liveLink ? (
          <Link
            className="rp-process__state rp-process__state--signal rp-process__state--link"
            to={liveLink.url}
            aria-label={`Open ${processName(project.title)} live dashboard`}
          >
            <span aria-hidden="true">●</span>
            <span>OPEN LIVE</span>
            <ArrowUpRight aria-hidden="true" size={11} strokeWidth={1.7} />
          </Link>
        ) : (
          <span className={`rp-process__state ${state.signal ? 'rp-process__state--signal' : ''}`}>
            <span aria-hidden="true">{state.glyph}</span>
            {state.label}
          </span>
        )}
        <span className="rp-process__output">{project.description[0]}</span>
        <span className="rp-process__stack">
          {project.tags.slice(0, 2).join(' / ')}
          {project.tags.length > 2 ? ` +${project.tags.length - 2}` : ''}
        </span>
        <span className="rp-process__toggle" aria-hidden="true">
          <ChevronDown size={17} strokeWidth={1.5} />
        </span>
      </div>

      <div className="rp-process__detail" id={projectId} hidden={!expanded}>
        <div className="rp-process__statements">
          <span className="rp-micro-label">PROCESS OUTPUT / {pad(project.description.length)} RECORDS</span>
          <ul>
            {project.description.map((point, pointIndex) => (
              <li key={`${project.title}-${pointIndex}`}>
                <span className="rp-list-index">{pad(pointIndex + 1)}</span>
                <p>{point}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rp-process__map" aria-label={`${project.title} capability map`}>
          <span className="rp-micro-label">CAPABILITY MAP</span>
          <div className="rp-capability-map">
            {project.tags.map((tag, tagIndex) => (
              <span key={tag} className="rp-capability-node">
                <i aria-hidden="true">{pad(tagIndex + 1)}</i>
                {tag}
              </span>
            ))}
          </div>

          <dl className="rp-process__facts">
            <div><dt>STATEMENTS</dt><dd>{pad(project.description.length)}</dd></div>
            <div><dt>CAPABILITIES</dt><dd>{pad(project.tags.length)}</dd></div>
            <div><dt>LINKED SURFACES</dt><dd>{pad((project.links || []).length)}</dd></div>
          </dl>

          {project.links && (
            <div className="rp-process__links">
              {project.links.map((link) => <ProjectLink link={link} key={link.url} />)}
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

function ExperienceDescription({ point }) {
  if (typeof point === 'string') return <>{point}</>;

  return (
    <>
      {point.text}
      <a href={point.link.url} target="_blank" rel="noreferrer">{point.link.text}</a>
      {point.suffix}
    </>
  );
}

function RecordEntry({ job, index }) {
  return (
    <details className="rp-record-entry" open={index === 0}>
      <summary>
        <span className="rp-record-entry__index">{pad(index + 1)}</span>
        <span className="rp-record-entry__company">
          <strong>{job.company}</strong>
          <span>{job.position}</span>
        </span>
        <span className="rp-record-entry__period">{job.period}</span>
        <ChevronDown aria-hidden="true" size={16} strokeWidth={1.5} />
      </summary>
      <div className="rp-record-entry__body">
        <ul>
          {job.description.map((point, pointIndex) => (
            <li key={`${job.company}-${pointIndex}`}>
              <ExperienceDescription point={point} />
            </li>
          ))}
        </ul>
        {job.companyUrl && (
          <a className="rp-text-link" href={job.companyUrl} target="_blank" rel="noreferrer">
            COMPANY SIGNAL <ArrowUpRight aria-hidden="true" size={13} />
          </a>
        )}
      </div>
    </details>
  );
}

function ContactConsole() {
  const [formStatus, setFormStatus] = useState('idle');

  const submitMessage = async (event) => {
    event.preventDefault();
    setFormStatus('sending');
    const form = event.currentTarget;

    try {
      await fetch('https://formsubmit.co/kyilmaz22@ku.edu.tr', {
        method: 'POST',
        body: new FormData(form),
      });
      form.reset();
      setFormStatus('sent');
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="rp-contact-grid">
      <div className="rp-contact-copy">
        <p className="rp-contact-copy__lead">Send a brief. Get a human response.</p>
        <p>
          Open to AI engineering, ML systems, product infrastructure, and
          technically ambitious collaborations.
        </p>
        <div className="rp-contact-links">
          <a href="mailto:kyilmaz22@ku.edu.tr"><Mail size={15} aria-hidden="true" />kyilmaz22@ku.edu.tr</a>
          <a href="tel:+905313792891"><span className="rp-contact-links__glyph">TEL</span>+90 (531) 379 28 91</a>
          <span><MapPin size={15} aria-hidden="true" />Istanbul, Turkey</span>
          <a href="https://github.com/keremburakyilmaz" target="_blank" rel="noreferrer"><Github size={15} aria-hidden="true" />GitHub</a>
          <a href="https://linkedin.com/in/keremburakyilmaz" target="_blank" rel="noreferrer"><Linkedin size={15} aria-hidden="true" />LinkedIn</a>
        </div>
      </div>

      <form className="rp-contact-form" onSubmit={submitMessage}>
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_subject" value="New Portfolio Message" />

        <label>
          <span>01 / NAME</span>
          <input name="name" type="text" placeholder="Your name" required />
        </label>
        <label>
          <span>02 / RETURN ADDRESS</span>
          <input name="email" type="email" placeholder="you@company.com" required />
        </label>
        <label>
          <span>03 / MESSAGE</span>
          <textarea name="message" rows="5" placeholder="What are we building?" required />
        </label>

        <button type="submit" disabled={formStatus === 'sending'}>
          <span>
            {formStatus === 'sending' ? 'TRANSMITTING' : 'TRANSMIT MESSAGE'}
          </span>
          <ArrowUpRight aria-hidden="true" size={16} />
        </button>
        <p className={`rp-form-status rp-form-status--${formStatus}`} aria-live="polite">
          {formStatus === 'sent' && <><Check size={14} aria-hidden="true" /> SIGNAL RECEIVED. I WILL REPLY BY EMAIL.</>}
          {formStatus === 'error' && 'TRANSMISSION FAILED. USE THE EMAIL LINK INSTEAD.'}
        </p>
      </form>
    </div>
  );
}

export default function RunningPortfolio() {
  const now = useLiveClock();
  const sessionUptime = useSessionUptime();
  const online = useNetworkStatus();
  const activeSection = useActiveSection();
  const [openProcess, setOpenProcess] = useState(0);

  const istanbulTime = useMemo(() => new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now), [now]);

  const dateStamp = useMemo(() => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now), [now]);

  return (
    <div className="rp-portfolio" id="top">
      <a className="rp-skip-link" href="#systems">Skip to systems</a>

      <header className="rp-header">
        <a className="rp-wordmark" href="#top" aria-label="Kerem Burak Yılmaz, back to top">
          <span>KBY</span>
          <i>/</i>
          <small>SYS.IST</small>
        </a>

        <div className="rp-header__telemetry">
          <span>ISTANBUL / UTC+3</span>
          <SignalNumber value={istanbulTime} label={`Istanbul time ${istanbulTime}`} />
          <span className={`rp-live-state ${online ? '' : 'rp-live-state--offline'}`}>
            <i aria-hidden="true" />{online ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>

        <nav className="rp-header__nav" aria-label="Primary navigation">
          {HEADER_LINKS.map((link, index) => {
            const content = <><span>{pad(index + 1)}</span>{link.label}</>;

            return link.to ? (
              <Link to={link.to} key={link.to}>{content}</Link>
            ) : (
              <a
                className={activeSection === link.id ? 'active' : ''}
                href={link.href}
                key={link.id}
              >
                {content}
              </a>
            );
          })}
        </nav>
      </header>

      <main className="rp-main">
        <section className="rp-hero" aria-labelledby="rp-title">
          <div className="rp-hero__copy">
            <div className="rp-kicker">
              <span>PORTFOLIO NODE / IST-01</span>
              <span>AI + SYSTEMS ENGINEERING</span>
            </div>
            <h1 id="rp-title">Systems that<br />keep running.</h1>
            <p className="rp-hero__statement">
              I build systems that keep running after I close the laptop.
            </p>
            <p className="rp-hero__support">
              Production AI, ML pipelines, financial intelligence backends, and
              product infrastructure. Claims are replaced by operating records.
            </p>
            <div className="rp-hero__actions">
              <a href="#systems">INSPECT SYSTEMS <ArrowDown size={14} aria-hidden="true" /></a>
              <a href="/resume.pdf" target="_blank" rel="noreferrer">READ CV <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
            <LiveSurfaceLauncher />
          </div>

          <div className="rp-hero__instrument" aria-label="Live portfolio session instrument">
            <div className="rp-instrument__topline">
              <span>NODE / KEREM BURAK YILMAZ</span>
              <span className="rp-live-state"><i aria-hidden="true" />SESSION ACTIVE</span>
            </div>
            <div className="rp-dot-field" aria-hidden="true">
              <span className="rp-dot-field__axis rp-dot-field__axis--x" />
              <span className="rp-dot-field__axis rp-dot-field__axis--y" />
              <LivingSignalField />
              <small>41.0082° N / 28.9784° E</small>
            </div>
            <div className="rp-instrument__readout">
              <div>
                <span>SESSION UPTIME</span>
                <SignalNumber value={sessionUptime} label={`Session uptime ${sessionUptime}`} />
              </div>
              <div>
                <span>LOCAL DATE</span>
                <SignalNumber value={dateStamp.replaceAll('/', '.')} label={`Date ${dateStamp}`} />
              </div>
            </div>
          </div>

          <div className="rp-proof-strip" aria-label="Portfolio record totals">
            <div><SignalNumber value={pad(projects.length)} label={`${projects.length} systems`} /><span>SYSTEMS INDEXED</span></div>
            <div><SignalNumber value={pad(experience.length)} label={`${experience.length} roles`} /><span>OPERATING ROLES</span></div>
            <div><SignalNumber value={pad(education.length)} label={`${education.length} education records`} /><span>EDUCATION RECORDS</span></div>
            <div><SignalNumber value={pad(skills.length)} label={`${skills.length} capabilities`} /><span>CAPABILITIES LOGGED</span></div>
          </div>
        </section>

        <section className="rp-systems" id="systems" aria-labelledby="systems-heading">
          <SectionIndex headingId="systems-heading" number="01" name="Systems" meta={`${pad(projects.length)} PROCESSES / SELECT A ROW`} />
          <p className="rp-section-intro">
            Deployed surfaces, source records, and documented builds. Status labels
            describe what can be inspected from this site; they do not simulate uptime.
          </p>

          <div className="rp-process-table">
            <div className="rp-process-table__header" aria-hidden="true">
              <span>PID</span><span>PROCESS</span><span>STATE</span><span>OUTPUT</span><span>STACK</span><span />
            </div>
            {projects.map((project, index) => (
              <ProcessRow
                project={project}
                index={index}
                expanded={openProcess === index}
                onToggle={() => setOpenProcess(openProcess === index ? null : index)}
                key={project.title}
              />
            ))}
          </div>
        </section>

        <LiveOperations now={now} />

        <section className="rp-record" id="record" aria-labelledby="record-heading">
          <SectionIndex headingId="record-heading" number="03" name="Operating record" meta={`${pad(experience.length)} ROLES / ${pad(education.length)} EDUCATION`} />
          <div className="rp-record__layout">
            <div className="rp-record__timeline">
              <p className="rp-section-intro">
                Work history as an append-only log. Open any row for the underlying record.
              </p>
              {experience.map((job, index) => (
                <RecordEntry job={job} index={index} key={`${job.company}-${job.period}`} />
              ))}
            </div>

            <aside className="rp-credentials">
              <div className="rp-credentials__block">
                <span className="rp-micro-label">EDUCATION / VERIFIED RECORD</span>
                {education.map((item, index) => (
                  <article key={`${item.institution}-${item.degree}`}>
                    <span>{pad(index + 1)}</span>
                    <div>
                      <strong>{item.degree}</strong>
                      <p>{item.institution}</p>
                      <small>{item.period}</small>
                      {item.description && <em>{item.description}</em>}
                    </div>
                  </article>
                ))}
              </div>

              <div className="rp-credentials__block rp-credentials__block--skills">
                <span className="rp-micro-label">CAPABILITY INDEX / {pad(skills.length)}</span>
                <div>
                  {skills.map((skill, index) => <span key={skill}>{pad(index + 1)} {skill}</span>)}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="rp-contact" id="contact" aria-labelledby="contact-heading">
          <SectionIndex headingId="contact-heading" number="04" name="Open a channel" meta="RESPONSE MODE / HUMAN" />
          <ContactConsole />
        </section>
      </main>

      <footer className="rp-footer">
        <div>
          <span>KEREM BURAK YILMAZ</span>
          <span>ISTANBUL / TURKEY</span>
        </div>
        <div>
          <span>BUILD / REACT 19</span>
          <span>DELIVERY / STATIC</span>
          <span>DATA / LOCAL RECORDS</span>
        </div>
        <a href="#top">RETURN TO TOP <ArrowUpRight size={13} aria-hidden="true" /></a>
      </footer>
    </div>
  );
}
