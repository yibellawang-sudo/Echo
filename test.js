import React, { useState, useEffect, useRef } from 'react';

const STORY_LINES = [
  "You awaken to static. The Core Node has fractured.",
  "Corrupted data fragments drift through the Grid.",
  "Your beam can capture them - but they'll fight back.",
  "Move. Aim. Click. Survive.",
  "How long can you last?"
];

export default function App() {
  const [screen, setScreen] = useState('story');
  const [storyIndex, setStoryIndex] = useState(0);
  const [fragments, setFragments] = useState(0);
  const [lastRunResult, setLastRunResult] = useState(null);
  const [highScore, setHighScore] = useState(0);

  const onCombatEnd = (result) => {
    const earned = result.fragmentsEarned || 0;
    setFragments(f => f + earned);
    setLastRunResult(result);
    
    if (earned > highScore) {
      setHighScore(earned);
    }
    
    setScreen('base');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-2xl border border-purple-500/30">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Echo//Recompile
              </h1>
              <p className="text-xs text-slate-400 mt-1">Fragment Recovery System</p>
            </div>
            <div className="flex gap-4">
              <StatBadge label="Best Score" value={highScore} color="purple" />
              <StatBadge label="Total Collected" value={fragments} color="pink" />
            </div>
          </div>

          {screen === 'story' && (
            <Story
              index={storyIndex}
              line={STORY_LINES[storyIndex]}
              onAdvance={() => {
                if (storyIndex < STORY_LINES.length - 1) {
                  setStoryIndex(i => i + 1);
                } else {
                  setScreen('base');
                }
              }}
            />
          )}

          {screen === 'base' && (
            <BaseScreen onBegin={() => setScreen('combat')} lastRunResult={lastRunResult} />
          )}

          {screen === 'combat' && (
            <CombatScene onExit={onCombatEnd} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }) {
  const colors = {
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
    pink: 'bg-pink-500/20 border-pink-500/30 text-pink-300'
  };
  
  return (
    <div className={`px-4 py-2 rounded-lg border ${colors[color]}`}>
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function Story({ index, line, onAdvance }) {
  return (
    <div className="py-16 sm:py-24 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/40 border border-purple-500/40 p-8 sm:p-12 rounded-xl shadow-2xl">
          <p className="text-xl leading-relaxed text-slate-100 mb-8">
            {line}
          </p>
          <button
            onClick={onAdvance}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            {index < STORY_LINES.length - 1 ? 'Continue' : 'Start Game'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BaseScreen({ onBegin, lastRunResult }) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="bg-gradient-to-br from-slate-900/60 to-purple-900/30 p-8 rounded-xl border border-purple-500/30">
        <h2 className="text-3xl font-bold mb-4 text-purple-300">Ready to Deploy?</h2>
        
        {lastRunResult && (
          <div className="mb-6 p-4 rounded-lg border border-slate-700 bg-slate-900/50">
            <div className="text-lg font-semibold text-slate-200 mb-2">
              Last Run: {lastRunResult.survived ? '✓ Survived' : '✗ Overwhelmed'}
            </div>
            <div className="text-3xl font-bold text-purple-300 mb-1">
              {lastRunResult.fragmentsEarned} Fragments
            </div>
            <div className="text-sm text-slate-400">
              Time survived: {lastRunResult.timeSurvived}s
            </div>
          </div>
        )}

        <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-purple-300 mb-3">How to Play:</h3>
          <div className="text-left text-slate-300 space-y-2">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <div className="font-semibold">Click and Hold</div>
                <div className="text-sm text-slate-400">Point at fragments and hold mouse to pull them toward you</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <div className="font-semibold">Right Click or Shift</div>
                <div className="text-sm text-slate-400">Dash to dodge enemies and move quickly</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💎</div>
              <div>
                <div className="font-semibold">Collect Fragments</div>
                <div className="text-sm text-slate-400">Touch fragments to capture them. Don't let enemies hit you!</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onBegin}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xl shadow-lg shadow-purple-500/50 transition-all transform hover:scale-105"
        >
          Start Mission →
        </button>
      </div>
    </div>
  );
}

function CombatScene({ onExit }) {
  const canvasRef = useRef(null);
  const [uiState, setUiState] = useState({
    fragments: 0,
    health: 100,
    time: 0,
    dashReady: true
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const state = {
      player: { 
        x: 400, y: 180, 
        vx: 0, vy: 0,
        radius: 15,
        dashCooldown: 0,
        invulnerable: 0
      },
      fragments: [],
      enemies: [],
      particles: [],
      mouse: { x: 400, y: 180, down: false },
      pulling: false,
      health: 100,
      score: 0,
      time: 0,
      spawnTimer: 0,
      enemySpawnTimer: 0,
      shake: 0
    };

    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      state.mouse.x = (e.clientX - r.left) * (800 / r.width);
      state.mouse.y = (e.clientY - r.top) * (360 / r.height);
    };

    const onMouseDown = (e) => {
      e.preventDefault();
      if (e.button === 2) { // Right click
        dash();
      } else {
        state.mouse.down = true;
        state.pulling = true;
      }
    };

    const onMouseUp = (e) => {
      state.mouse.down = false;
      state.pulling = false;
    };

    const onContextMenu = (e) => {
      e.preventDefault();
    };

    const onKeyDown = (e) => {
      if (e.key === 'Shift' || e.key === ' ') {
        e.preventDefault();
        dash();
      }
    };

    function dash() {
      if (state.player.dashCooldown <= 0) {
        const dx = state.mouse.x - state.player.x;
        const dy = state.mouse.y - state.player.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          const dashSpeed = 200;
          state.player.vx = (dx / dist) * dashSpeed;
          state.player.vy = (dy / dist) * dashSpeed;
          state.player.dashCooldown = 1.5;
          state.player.invulnerable = 0.2;
          createParticles(state.player.x, state.player.y, 15, '#a855f7', 4);
        }
      }
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);

    function createParticles(x, y, count, color, speed = 2) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        state.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color
        });
      }
    }

    function spawnFragment() {
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      
      if (edge === 0) { x = Math.random() * 800; y = -20; }
      else if (edge === 1) { x = 820; y = Math.random() * 360; }
      else if (edge === 2) { x = Math.random() * 800; y = 380; }
      else { x = -20; y = Math.random() * 360; }

      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
      
      state.fragments.push({
        x, y,
        vx: 0, vy: 0,
        radius: 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        value: 1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    function spawnEnemy() {
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      
      if (edge === 0) { x = Math.random() * 800; y = -30; }
      else if (edge === 1) { x = 830; y = Math.random() * 360; }
      else if (edge === 2) { x = Math.random() * 800; y = 390; }
      else { x = -30; y = Math.random() * 360; }

      state.enemies.push({
        x, y,
        vx: 0, vy: 0,
        radius: 12,
        speed: 1.2 + Math.random() * 0.8,
        color: '#dc2626',
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Initial spawns
    for (let i = 0; i < 5; i++) spawnFragment();
    for (let i = 0; i < 2; i++) spawnEnemy();

    let last = performance.now();

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      state.time += dt;
      state.player.dashCooldown = Math.max(0, state.player.dashCooldown - dt);
      state.player.invulnerable = Math.max(0, state.player.invulnerable - dt);

      // Player movement (smooth friction)
      state.player.vx *= 0.88;
      state.player.vy *= 0.88;
      state.player.x += state.player.vx * dt;
      state.player.y += state.player.vy * dt;

      // Keep player in bounds
      state.player.x = Math.max(state.player.radius, Math.min(800 - state.player.radius, state.player.x));
      state.player.y = Math.max(state.player.radius, Math.min(360 - state.player.radius, state.player.y));

      // Pull fragments
      if (state.pulling) {
        state.fragments.forEach(frag => {
          const dx = state.mouse.x - frag.x;
          const dy = state.mouse.y - frag.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 150) {
            const pullStrength = Math.max(0, (150 - dist) / 150) * 300;
            frag.vx += (dx / dist) * pullStrength * dt;
            frag.vy += (dy / dist) * pullStrength * dt;
          }
        });
      }

      // Update fragments
      state.fragments.forEach(frag => {
        frag.pulse += dt * 5;
        frag.vx *= 0.95;
        frag.vy *= 0.95;
        frag.x += frag.vx * dt;
        frag.y += frag.vy * dt;

        // Collect fragments
        const dist = Math.hypot(frag.x - state.player.x, frag.y - state.player.y);
        if (dist < state.player.radius + frag.radius) {
          state.score += frag.value;
          createParticles(frag.x, frag.y, 10, frag.color, 3);
          state.fragments = state.fragments.filter(f => f !== frag);
        }
      });

      // Remove off-screen fragments
      state.fragments = state.fragments.filter(f => 
        f.x > -50 && f.x < 850 && f.y > -50 && f.y < 410
      );

      // Update enemies (move toward player)
      state.enemies.forEach(enemy => {
        enemy.pulse += dt * 4;
        const dx = state.player.x - enemy.x;
        const dy = state.player.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 0) {
          enemy.vx += (dx / dist) * enemy.speed;
          enemy.vy += (dy / dist) * enemy.speed;
        }

        enemy.vx *= 0.98;
        enemy.vy *= 0.98;
        enemy.x += enemy.vx * dt;
        enemy.y += enemy.vy * dt;

        // Hit player
        if (state.player.invulnerable <= 0) {
          const playerDist = Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y);
          if (playerDist < state.player.radius + enemy.radius) {
            state.health -= 20;
            state.player.invulnerable = 1;
            createParticles(state.player.x, state.player.y, 20, '#ef4444', 3);
            state.shake = 15;
            
            // Knockback
            const knockbackDist = Math.hypot(dx, dy);
            if (knockbackDist > 0) {
              state.player.vx = -(dx / knockbackDist) * 100;
              state.player.vy = -(dy / knockbackDist) * 100;
            }
          }
        }
      });

      // Particles
      state.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= dt * 2;
      });
      state.particles = state.particles.filter(p => p.life > 0);

      // Spawn fragments
      state.spawnTimer += dt;
      const spawnRate = Math.max(0.8, 2 - state.time * 0.02);
      if (state.spawnTimer > spawnRate) {
        state.spawnTimer = 0;
        spawnFragment();
      }

      // Spawn enemies
      state.enemySpawnTimer += dt;
      const enemySpawnRate = Math.max(2, 5 - state.time * 0.05);
      if (state.enemySpawnTimer > enemySpawnRate) {
        state.enemySpawnTimer = 0;
        if (state.enemies.length < 8) {
          spawnEnemy();
        }
      }

      // Check game over
      if (state.health <= 0) {
        onExit({
          fragmentsEarned: state.score,
          survived: false,
          timeSurvived: Math.floor(state.time)
        });
        return;
      }

      setUiState({
        fragments: state.score,
        health: Math.max(0, Math.round(state.health)),
        time: Math.floor(state.time),
        dashReady: state.player.dashCooldown <= 0
      });

      state.shake *= 0.85;

      drawScene(ctx, state);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onExit]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <UICard label="Score" value={uiState.fragments} color="purple" />
        <UICard label="Health" value={`${uiState.health}%`} color={uiState.health > 50 ? 'green' : 'red'} />
        <UICard label="Time" value={`${uiState.time}s`} color="blue" />
      </div>

      <div className="relative rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={360}
          className="w-full bg-slate-950 cursor-crosshair"
        />
        
        {/* Dash indicator overlay */}
        <div className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg border ${
          uiState.dashReady 
            ? 'bg-purple-500/30 border-purple-400 text-purple-200' 
            : 'bg-slate-800/50 border-slate-600 text-slate-400'
        }`}>
          <div className="text-sm font-bold">
            {uiState.dashReady ? '⚡ DASH READY' : '⏱ Dash Cooldown'}
          </div>
          <div className="text-xs">Right Click / Shift</div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-bold text-purple-300 mb-2">Controls:</div>
            <div className="text-slate-300 space-y-1 text-xs">
              <div>• <span className="text-pink-300">Hold Left Click</span> - Pull fragments</div>
              <div>• <span className="text-purple-300">Right Click / Shift</span> - Dash</div>
              <div>• <span className="text-blue-300">Touch fragments</span> - Collect them</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-pink-300 mb-2">Tips:</div>
            <div className="text-slate-300 space-y-1 text-xs">
              <div>• Pull fragments from far away</div>
              <div>• Dash through enemies to dodge</div>
              <div>• Game gets harder over time!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UICard({ label, value, color }) {
  const colors = {
    purple: 'from-purple-500/20 border-purple-500/50 text-purple-300',
    green: 'from-green-500/20 border-green-500/50 text-green-300',
    red: 'from-red-500/20 border-red-500/50 text-red-300',
    blue: 'from-blue-500/20 border-blue-500/50 text-blue-300'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} to-transparent border rounded-lg p-3`}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function drawScene(ctx, state) {
  ctx.save();
  
  if (state.shake > 0) {
    ctx.translate(
      (Math.random() - 0.5) * state.shake,
      (Math.random() - 0.5) * state.shake
    );
  }

  // Background
  const bgGrad = ctx.createRadialGradient(400, 180, 0, 400, 180, 500);
  bgGrad.addColorStop(0, '#1a0a2e');
  bgGrad.addColorStop(1, '#0a0510');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 360);

  // Grid
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 800; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 360);
    ctx.stroke();
  }
  for (let y = 0; y < 360; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }

  // Particles
  state.particles.forEach(p => {
    const alpha = Math.floor(p.life * 255).toString(16).padStart(2, '0');
    ctx.fillStyle = p.color + alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Pull beam
  if (state.pulling) {
    state.fragments.forEach(frag => {
      const dist = Math.hypot(state.mouse.x - frag.x, state.mouse.y - frag.y);
      if (dist < 150) {
        const alpha = Math.floor((1 - dist / 150) * 100);
        ctx.strokeStyle = `rgba(168, 85, 247, 0.${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(state.mouse.x, state.mouse.y);
        ctx.lineTo(frag.x, frag.y);
        ctx.stroke();
      }
    });

    // Cursor effect
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(state.mouse.x, state.mouse.y, 150, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Fragments
  state.fragments.forEach(frag => {
    const pulse = Math.sin(frag.pulse) * 0.3 + 1;
    
    // Glow
    const glowGrad = ctx.createRadialGradient(frag.x, frag.y, 0, frag.x, frag.y, frag.radius * 3);
    glowGrad.addColorStop(0, frag.color + '80');
    glowGrad.addColorStop(1, frag.color + '00');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(frag.x, frag.y, frag.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = frag.color;
    ctx.beginPath();
    ctx.arc(frag.x, frag.y, frag.radius * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(frag.x - frag.radius * 0.3, frag.y - frag.radius * 0.3, frag.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Enemies
  state.enemies.forEach(enemy => {
    const pulse = Math.sin(enemy.pulse) * 0.2 + 1;
    
    // Glow
    const glowGrad = ctx.createRadialGradient(enemy.x, enemy.y, 0, enemy.x, enemy.y, enemy.radius * 3);
    glowGrad.addColorStop(0, 'rgba(220, 38, 38, 0.6)');
    glowGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Spikes
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + enemy.pulse;
      ctx.beginPath();
      ctx.moveTo(enemy.x, enemy.y);
      ctx.lineTo(
        enemy.x + Math.cos(angle) * enemy.radius * 1.5,
        enemy.y + Math.sin(angle) * enemy.radius * 1.5
      );
      ctx.stroke();
    }
  });

  // Player
  const p = state.player;
  
  // Invulnerability shield
  if (p.invulnerable > 0) {
    const flashAlpha = Math.sin(state.time * 20) * 0.5 + 0.5;
    ctx.strokeStyle = `rgba(168, 85, 247, ${flashAlpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius + 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Player glow
  const playerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
  playerGlow.addColorStop(0, 'rgba(168, 85, 247, 0.6)');
  playerGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
  ctx.fillStyle = playerGlow;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
  ctx.fill();

  // Player body
  ctx.fillStyle = '#e9d5ff';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fill();

  // Player highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Direction to mouse
  const dx = state.mouse.x - p.x;
  const dy = state.mouse.y - p.y;
  const angle = Math.atan2(dy, dx);
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x + Math.cos(angle) * (p.radius + 8), p.y + Math.sin(angle) * (p.radius + 8));
  ctx.stroke();

  ctx.restore();
}