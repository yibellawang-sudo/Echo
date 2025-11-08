import React, { useState, useEffect, useRef } from 'react';

const STORY_CHAPTERS = [
  {
    title:"System Failure",
    text:"The Grid has collapsed. You are a Recovery AI, designed to rebuild the Core Node by collecting scattered data fragments.",
    instruction:"Your mission: Restore 100 fragments to stabilize the system.",
  },
  {
    title:"Corruption Detected",
    text:"Warning: Hostile entities detected. These are corrupted processes trying to prevent recovery.",
    instruction:"Avoid corruption at all costs. Three hits and you'll need to restart.",
  },
  {
    title:"Begin Recovery",
    text:"The Grid is counting on you. Every fragment brings us closer to restoration.",
    instruction:"Move with WASD/arrows. Collect fragments. Survive.",
  }
]

//missions
const MISSIONS = [
  { id: 1, name: "First Recovery", goal: 50, unlocked: true, completed: false, reward: "Mission Complete!" },
  { id: 2, name: "Deep Scan", goal: 100, unlocked: false, completed: false, reward: "System Stabilized!" },
  { id: 3, name: "Core Rebuild", goal: 200, unlocked: false, completed: false, reward: "Core Online!" },
  { id: 4, name: "Final Restoration", goal: 300, unlocked: false, completed: false, reward: "Grid Restored!" }
];

export default function App() {
  const [screen, setScreen] = useState('story');
  const [storyIndex, setStoryIndex] = useState(0);
  //const [fragments, setFragments] = useState(0);
  const [lastRunResult, setLastRunResult] = useState(null);
  //const [highScore, setHighScore] = useState(0);
  const [missions, setMissions] = useState(MISSIONS);
  const [currentMission, setCurrentMission] = useState(null);
  const [totalFragments, setTotalFragments] = useState(0);

  const onCombatEnd = (result) => {
    setTotalFragments(prev => prev + result.fragmentsCollected);
    setLastRunResult(result);

    //add: check mission completion
    if (currentMission && result.fragmentsCollected >= currentMission.goal) {
      setMissions(prev => prev.map(m => {
        if (m.id === currentMission.id) {
          return { ...m, completed: true };
        }
        if (m.id === currentMission.id + 1) {
          return { ...m, unlocked: true };
        }
        return m;
      }));
    }

    setScreen("missionSelect");
  };

  const startMission = (mission) => {
    setCurrentMission(mission);
    setScreen('game');
  };
//change color scheme to indigo/purple/cyan/blue(obvi)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 flex items-center justify-center">
      <div className="max-w-5xl w-full">
        <div className="bg-black/50 backdrop-blur-lg rounded-3xl p-8 border-2 border-cyan-500/30 shadow-2xl">
          {/*header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
                Echo
            </h1>
            <div className="flex gap-6 justify-center mt-4">
              <div className="bg-cyan-900/30 border border-cyan-500/50 rounded-xl px-6 py-2">
                <div className="text-cyan-300 text-xs">Total Fragments Recovered</div>
                <div className="text-3xl font-bold text-white">{totalFragments}</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-xl px-6 py-2">
                <div className="text-purple-300 text-xs">Missions Completed</div>
                <div className="text-3xl font-bold text-white">{missions.filter(m => m.completed).length}/{missions.length}</div>
              </div>
            </div>
          </div>
          {/*story screen*/}
          {screen === 'story' && (
            <Story
              chapter={STORY_CHAPTERS[storyIndex]}
              onAdvance={() => {
                if (storyIndex < STORY_CHAPTERS.length-1) {
                  setStoryIndex(prev => prev + 1);
                } else {
                  setScreen('missionSelect');
                }
              }}
            />
          )}
          {/*misison select*/}
          {screen === "missionSelect" && (
            <MissionSelectScreen
              missions={missions}
              onSelectMission={startMission}
              lastRunResult={lastRunResult}
            />
          )}

          {/*game*/}
          {screen === 'game' && currentMission && (
            <GameScreen
              mission={currentMission}
              onGameEnd={onCombatEnd}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, color}) {
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

//update into chapter form
function Story({ chapter, onAdvance }) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
      <div className="space-y-4">
        <div className="text-cyan-400 text-sm font-mono uppercase tracking-wider">
          [System Message]
        </div>
        <h2 className="text-4xl font-bold text-white">{chapter.title}</h2>
      </div>

      <div className='bg-slate-900/50 border border-slate-700 rounded-2xl p-8'>
        <p className="text-xl text-slate-300 leading-relaxed mb-6">
          {chapter.text}
        </p>
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
          <p className="text-cyan-300 font-semibold">{chapter.instruction}</p>
        </div>
      </div>

      <button
        onClick={onAdvance}
        className="px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white font-bold text-xl shadow-lg shadow-cyan-500/50 transition-all transform hover:scale-105"
      >
        Continue
      </button>
    </div>
  );
}

//add function for missionSelectScreen, takes parameters for missions, onSelectMission & lastRunResult
function MissionSelectScreen({ missions, onSelectMission, lastRunResult }) {
  return (
    <div className="space-y-8">
      {lastRunResult && (
        <div className={`border-2 rounded-2xl p-6 ${
          lastRunResult.success
            ? 'bg-green-900/30 border-green-500/50'
            : 'bg-red-900/30 border-red-500/50'
        }`}>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              lastRunResult.success ? 'text-green-300' : 'text-red-300'
            }`}>
              {lastRunResult.success ? 'Mission Complete!' : 'Mission Failed'}
            </div>
            <div className="text-2xl text-white mb-4">
              {lastRunResult.fragmentsCollected} / {lastRunResult.goal} Fragments Recovered
            </div>
            {lastRunResult.success && (
              <div className="text-lg text-green-300 font-semibold">
                {lastRunResult.reward}
              </div>
            )}
            {!lastRunResult.success && (
              <div className="text-slate-300">
                You were overwhelmed by corruption. Try Again!
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Select Mission</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onSelect={() => onSelectMission(mission)}
            />
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-cyan-300 mb-3">How to Play</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <div className="text-2xl">keyboard art</div>
            <div>
              <div className="font-semibold text-white">WASD / Arrows</div>
              <div className="text-slate-400">Move yourself</div> 
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="text-2xl">frag art</div>
            <div>
              <div className="font-semibold text-white">Blue Fragments</div>
              <div className="text-slate-400">Collect to reach goal</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="text-2xl">warning art</div>
            <div>
              <div className="font-semibold text-white">Red Corruption</div>
              <div className="text-slate-400">Avoid at all costs (3 hits = fail)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//add function for mission card
function MissionCard({ mission, onSelect }) {
  const canPlay = mission.unlocked && !mission.completed;

  return (
    <div className={`border-2 rounded-xl p-6 transition-all ${
      mission.completed
        ? 'bg-green-900/20 border-green-500/50'
        : mission.unlocked
          ? 'bg-blue-900/20 border-blue-500/50 hover:bg-blue-900/30 cursor-pointer'
          : 'bg-slate-900/20 border-slate-700 opacity-50'
    }`}
    onClick={() => canPlay && onSelect()}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{mission.name}</h3>
          <div className="text-2xl font-bold text-cyan-300">
            Goal: {mission.goal} Fragments
          </div>
        </div>
        <div className="text-3xl">
          {mission.completed ? '√' : mission.unlocked ? '▶' : '🔒'}
        </div>
      </div>
      <div className='space-y-2'>
        {mission.completed && (
          <div className="text-green-400 font-semibold">
            √ {mission.reward}
          </div>
        )}
        {!mission.completed && mission.unlocked && (
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-colors">
            Start Mission
          </button>
        )}
        {!mission.unlocked && (
          <div className="text-slate-500 text-sm">
            Complete previous mission to unlock
          </div>
        )}
      </div>
    </div>
  );
}

//update for key-based gameplay, no more mouse-based stuff (too hard to operate)
function GameScreen({ mission, onGameEnd }) {
  const canvasRef = useRef(null);
  const [uiState, setUiState] = useState({
    collected: 0,
    goal: mission.goal,
    health: 3,
    time: 0,
    progress: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const state = {
      player: {
        x: 400, y:300,
        size: 20,
        speed: 5,
        health: 3,
        invulnerable: 0
      },
      fragments: [],
      enemies: [],
      particles: [],
      keys: {},
      collected: 0,
      goal: mission.goal,
      time: 0,
      spawnTimer: 0,
      enemySpawnTimer: 0,
      gameOver: false
    };

    const onKeyDown = (e) => {
      state.keys[e.key.toLowerCase()] = true;
    };

    const onKeyUp = (e) => {
      state.keys[e.key.toLowerCase()] = false; 
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    function createParticles(x, y, count, color) {
      for (let i=0; i < count; i++) {
        const angle = (Math.PI*2*i)/count;
        state.particles.push({
          x, y,
          vx: Math.cos(angle)*3,
          vy: Math.sin(angle)*3,
          life: 1,
          color
        });
      }
    }
    function spawnFragment() {
      const x = Math.random() * 760 + 20;
      const y = Math.random() * 560 + 20;

      state.fragments.push({
        x, y,
        size: 12,
        pulse: Math.random() * Math.PI* 2
      });
    }
    function spawnEnemy() {
      const edge = Math.floor(Math.random() * 4);
      let x, y;

      switch(edge) {
        case 0: x = Math.random()*800; y = -20; break;
        case 1: x = 820; y = Math.random() * 600; break;
        case 2: x = Math.random()*800; y = 620; break;
        default: x = -20; y = Math.random()* 600; 
      }

      state.enemies.push({
        x, y,
        size: 15,
        speed: 1 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2
      });
    }

    //initial spawn
    for (let i = 0; i < 10; i++) spawnFragment();
    for (let i = 0; i < 3; i++) spawnEnemy();

    let last = performance.now();

    const loop = (now) => {
      if (state.gameOver) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      state.time += dt;
      state.player.invulnerable = Math.max(0, state.player.invulnerable - dt);

      //player movement
      const p = state.player;
      let dx = 0;
      let dy = 0;

      if (state.keys['w'] || state.keys['arrowup']) dy -= 1;
      if (state.keys['s'] || state.keys['arrowdown']) dy += 1;
      if (state.keys['a'] || state.keys['arrowleft']) dx -= 1;
      if (state.keys['d'] || state.keys['arrowright']) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }

      p.x += dx * p.speed;
      p.y += dy * p.speed;
      p.x = Math.max(p.size, Math.min(800 - p.size, p.x));
      p.y = Math.max(p.size, Math.min(600 - p.size, p.y));

      //update frags  
      state.fragments.forEach(frag => {
        frag.pulse += dt * 5;
        
        const dist = Math.hypot(frag.x - p.x, frag.y - p.y);
        if (dist < p.size + frag.size) {
          state.collected += 1;
          createParticles(frag.x, frag.y, 10, '#60a5fa');
          state.fragments = state.fragments.filter(f => f !== frag);

          //check win condition
          if (state.collected >= state.goal) {
            state.gameOver = true;
            onGameEnd({
              success: true,
              fragmentsCollected: state.collected,
              goal: state.goal,
              timeTaken: Math.floor(state.time),
              reward: mission.reward
            });
            return;
          }
        }
      });

      //update enemies
      state.enemies.forEach(enemy => {
        enemy.pulse += dt * 4;
        const dx = p.x - enemy.x;
        const dy = p.y - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0) {
          enemy.vx += (dx / dist) * enemy.speed;
          enemy.vy += (dy / dist) * enemy.speed;
        }

       if (dist > 0) {
        enemy.x += (dx / dist * enemy.speed);
        enemy.y += (dy / dist * enemy.speed);
       }

        //hit player
        if (p.invulnerable <= 0) {
          const playerDist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
          if (playerDist < p.size + enemy.size) {
            p.health -= 1;
            p.invulnerable = 1.5;
            createParticles(p.x, p.y, 15, '#ef4444');

            if (p.health <= 0) {
              state.gameOver = true;
              onGameEnd({
                success: false,
                fragmentsCollected: state.collected,
                goal: state.goal,
                timeTaken: Math.floor(state.time)
              });
              return;
            }
          }
        }
      });

      //update particles
      state.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.96;
        particle.vy *= 0.96;
        particle.life -= dt * 2;
      });
      state.particles = state.particles.filter(p => p.life > 0);

      //spawn fragments
      state.spawnTimer += dt;
      if (state.spawnTimer > 2 && state.fragments.length < 15) {
        state.spawnTimer = 0;
        spawnFragment();
      }

      //spawn enemies
      state.enemySpawnTimer += dt;
      const enemySpawnRate = Math.max(1.5, 3.5 - state.time * 0.05);
      if (state.enemySpawnTimer > enemySpawnRate) {
        state.enemySpawnTimer = 0;
        if (state.enemies.length < 10) {
          spawnEnemy();
        }
      }

      //update ui
      setUiState({
        collected: state.collected,
        goal: state.goal,
        health: state.player.health,
        time: Math.floor(state.time),
        progress: (state.collected / state.goal) * 100
      });
      draw(ctx, state);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return() => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [mission, onGameEnd]);

  //add mission header and progress bar
  return (
    <div className="space-y-4">

      {/*mission header*/}
      <div className="bg-slate-900/50 border border-cyan-500/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-cyan-300 text-sm">Mission: {mission.name}</div>
            <div className="text-2xl font-bold text-white">
              {uiState.collected} / {uiState.goal} Fragments
            </div>
          </div>
          <div className="text-right">
            <div className="text-red-300 text-sm">Health</div>
            <div className="text-2xl flex gap-1">
              {Array(uiState.health).fill('❤️').map((h, i) => <span key={i}>{h}</span>)}
              {Array(3 - uiState.health).fill('🖤').map((h, i) => <span key={i + uiState.health}>{h}</span>)}
            </div>
          </div>
        </div>

        {/*progress bar*/}
        <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${uiState.progress}%` }}
          />
        </div>
        <div className='text-center text-cyan-300 text-xs mt-1'>
          {Math.round(uiState.progress)}% Complete
        </div>
      </div>

      {/*canvas*/}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full rounded-xl border-2 border-cyan-500/30 bg-slate-950 shadow-2xl"
        />
      </div>

      {/*controls*/}
      <div className="text-center">
        <div className="text-slate-400 text-sm">
          Use WASD or Arrow Keys to move, collect blue fragments and avoid corruption
        </div>
        <div className='text-cyan-300 text-xs mt-1'>
          Time: {uiState.time}s
        </div>
      </div>
    </div>
  );
}

function draw(ctx, state) {
  //bg
  const bgGrad = ctx.createRadialGradient(400, 300, 0, 400, 300, 600);
  bgGrad.addColorStop(0, '#1e293b');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 600);

  //grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 800; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  for (let y = 0; y < 600; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }

  //particles
  state.particles.forEach(p => {
    const alpha = Math.floor(p.life*255).toString(16).padStart(2, '0');
    ctx.fillStyle = p.color + alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
    ctx.fill();
  });

  //fragments
  state.fragments.forEach(frag => {
    const pulse = Math.sin(frag.pulse) * 0.3 + 1;
    //glow
    const glowGrad = ctx.createRadialGradient(frag.x, frag.y, 0, frag.x, frag.y, frag.size * 3);
    glowGrad.addColorStop(0, 'rgba(96, 165, 250, 0.8)');
    glowGrad.addColorStop(1, 'rgba(96, 165, 250, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(frag.x, frag.y, frag.size * 3, 0, Math.PI*2);
    ctx.fill();
    //core
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(frag.x, frag.y, frag.size *pulse, 0, Math.PI*2);
    ctx.fill();

    //highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(frag.x - 4, frag.y - 4, 4, 0, Math.PI*2);
    ctx.fill();
  });

  //enemies
  state.enemies.forEach(enemy => {
    const pulse = Math.sin(enemy.pulse)*0.2 + 1;

    //glow
    const glowGrad = ctx.createRadialGradient(enemy.x, enemy.y, 0, enemy.x, enemy.y, enemy.size * 3);
    glowGrad.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
    glowGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size * 3, 0, Math.PI*2);
    ctx.fill();
    //core
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size * pulse, 0, Math.PI*2);
    ctx.fill();
    
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 + enemy.pulse;
      const x1 = enemy.x + Math.cos(angle) * enemy.size * 0.7;
      const y1 = enemy.y + Math.sin(angle) * enemy.size * 0.7;
      const x2 = enemy.x + Math.cos(angle) * enemy.size * 1.5;
      const y2 = enemy.y + Math.sin(angle) * enemy.size * 1.5;

      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  });
  //player
  const p = state.player;
  //shield
  if (p.invulnerable > 0) {
    const alpha = Math.sin(state.time * 20) * 0.5 + 0.5;
    ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size + 8, 0, Math.PI*2);
    ctx.stroke();
  }

  const playerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
  playerGlow.addColorStop(0, 'rgba(96, 165, 250, 0.8)');
  playerGlow.addColorStop(1, 'rgba(96, 165, 250, 0)');
  ctx.fillStyle = playerGlow;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size*2, 0, Math.PI*2);
  ctx.fill();

  //player body
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(p.x - 6, p.y - 6, 5, 0, Math.PI*2);
  ctx.fill();
}


