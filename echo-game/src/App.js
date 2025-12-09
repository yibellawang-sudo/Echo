/*
world lore:
-name: Panopticon
-backstory: after the collapse of 3042, humanity's consciousness was digitalized into "Echos", 
vast repositries of our collective memory -- science, art, history, love, fear...
These Echos drift mindlessly through the Panopticon, a digital purgatory
You are Subject 77, a "Memory Extractor" directed by the Overseer, an AI model left behind programmed
to collect the fragments of human memories left behind to prevent total data decay
At the same time, however, you start realizing that you are decaying yourself as well
Realizing that you're conciousness is falling apart and that you've already lost parts of your memory,
you begin desperately buiding a "home" out of stolen memories to anchor your own existence
Thus, each collected (somewhat) hollistic memory fragment can be installed into your home base
These memory types include:
- Art (Beauty/morale), used to install cosmetic upgrades or reduce degradation rate
- Science, used to unlock upgrades and better tech
- History, these contain knowledge, helping you piece together what really happened (the subject doesn't
know about the collapse initially, and is immediately ushered to work collecting echos)
They also reveal shortcuts, map data or hidden caches
- Emotion, used to stabilize, increase max health and slow the entropy taking place
The user must build defenses and stabilizers or they will be either erased or lose conciousness
Their base is periodically attacked by Sentinels, mindless beings looking to consume any shard of remainging order
You try desperately to contact the Overseer to warn them of the incoming attack, believing Sentinels are antagonistic AI.
 PLOT TWIST! The sentinels are actually what used to be the humans, and the Overseer actually encourages their downward spiral
Story Arc:
- Early game: Lost contact with the Overseer but follows their instructions, just surviving
- Mid game: Building elaborate defenses, hoarding memories
- Late game: Revelation - by preserving these memories, you're becoming more human
- End game: Choice - Submit to erasure, or rebel using your accumulated humanity?

Resource Types

Raw Fragments (from extraction runs) - base currency
Specialized Memories (Each shard is a few sentences):
- Science Shards
- Art Shards
- History Shards
- Emotion Shards

Rare Artifacts: Special memories with unique properties

Siege Mechanics: Between runs, Sentinels attack in waves, and your defenses auto-fire
If they breach your Core, you lose stored resources. Higher-level defenses = safer storage

*/

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Trash2, Magnet, Trophy, TrendingUp } from 'lucide-react';
import './App.css';

const STORY_CHAPTERS = [
  {
    title: "SYSTEM REBOOT",
    text: "Welcome, Subject 77. I am the Overseer. You have been activated to perform Memory Extraction Protocol. Your mission is simple: survive and collect. There is no end, only progression.",
    instruction: "Enter the Maze. Collect fragments. Survive as long as you can.",
  }
];

export default function App() {
  const [screen, setScreen] = useState('awakening');
  
  //stats
  const [stats, setStats] = useState({
    totalFragments: 0,
    highScore: 0,
    longestSurvival: 0,
    totalRuns: 0,
    totalKills: 0,
    powerUpsCollected: 0
  });
  
  const [lastRunResult, setLastRunResult] = useState(null);
  const [difficulty, setDifficulty] = useState('normal');

  const onGameEnd = (result) => {
    setStats(prev => ({
      totalFragments: prev.totalFragments + result.fragmentsCollected,
      highScore: Math.max(prev.highScore, result.fragmentsCollected),
      longestSurvival: Math.max(prev.longestSurvival, result.timeSurvived),
      totalRuns: prev.totalRuns + 1,
      totalKills: prev.totalKills + (result.enemiesDestroyed || 0),
      powerUpsCollected: prev.powerUpsCollected + result.powerUpsCollected
    }));
    
    setLastRunResult(result);
    setScreen("menu");
  };

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setScreen('game');
  };

  const handleAwakeningComplete = () => {
    setScreen('menu');
  };

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <div className="app-card">
          {/* Header */}
          <div className="app-header">
            <h1 className="app-title">Echo</h1>
            {screen !== 'awakening' && (
              <div className="stats-grid">
                <div className="stat-card stat-cyan">
                  <div className="stat-label">High Score</div>
                  <div className="stat-value">{stats.highScore}</div>
                </div>
                <div className="stat-card stat-purple">
                  <div className="stat-label">Longest Survival</div>
                  <div className="stat-value">{stats.longestSurvival}s</div>
                </div>
                <div className="stat-card stat-green">
                  <div className="stat-label">Total Runs</div>
                  <div className="stat-value">{stats.totalRuns}</div>
                </div>
              </div>
            )}
          </div>

          {/* Awakening Screen */}
          {screen === 'awakening' && (
            <AwakeningScreen onComplete={handleAwakeningComplete} />
          )}

          {/* Main Menu */}
          {screen === "menu" && (
            <MenuScreen
              stats={stats}
              lastRunResult={lastRunResult}
              onStartGame={startGame}
            />
          )}

          {/* Game */}
          {screen === 'game' && (
            <GameScreen
              difficulty={difficulty}
              onGameEnd={onGameEnd}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AwakeningScreen({ onComplete }) {
  const [opacity, setOpacity] = useState(0);
  const [text, setText] = useState('');
  const fullText = "INITIALIZING PROTOCOL...";

  useEffect(() => {
    setOpacity(1);
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="awakening-screen" style={{ opacity }}>
      <div className="awakening-icon">Eye</div>
      <div className="awakening-text">{text}</div>
      <div className="awakening-description">
        You are Subject 77, a Memory Extractor in the Panopticon. Your mission: survive the waves of corruption while collecting fragments of humanity's lost memories. How long can you last?
      </div>
      <button onClick={onComplete} className="btn-primary btn-large">
        Enter Game
      </button>
    </div>
  );
}

function MenuScreen({ stats, lastRunResult, onStartGame }) {
  const difficulties = [
    { 
      id: 'easy', 
      name: 'Training Mode', 
      desc: 'Slower enemies, more health', 
      color: 'green',
      multiplier: '0.5x score'
    },
    { 
      id: 'normal', 
      name: 'Standard Protocol', 
      desc: 'Balanced challenge', 
      color: 'blue',
      multiplier: '1x score'
    },
    { 
      id: 'hard', 
      name: 'Corruption Surge', 
      desc: 'Faster enemies, less health', 
      color: 'orange',
      multiplier: '2x score'
    },
    { 
      id: 'insane', 
      name: 'Data Apocalypse', 
      desc: 'Maximum chaos', 
      color: 'red',
      multiplier: '3x score'
    }
  ];

  return (
    <div className="menu-screen">
      {lastRunResult && (
        <div className="result-card">
          <div className="result-content">
            <div className="result-title">Run Complete</div>
            <div className="result-stats-grid">
              <div>
                <div className="result-label">Fragments</div>
                <div className="result-value">{lastRunResult.fragmentsCollected}</div>
              </div>
              <div>
                <div className="result-label">Survival Time</div>
                <div className="result-value">{lastRunResult.timeSurvived}s</div>
              </div>
              <div>
                <div className="result-label">Enemies</div>
                <div className="result-value">{lastRunResult.enemiesDestroyed}</div>
              </div>
              <div>
                <div className="result-label">Wave</div>
                <div className="result-value">{lastRunResult.waveReached}</div>
              </div>
            </div>
            {lastRunResult.isNewHighScore && (
              <div className="new-highscore">
                <Trophy className="trophy-icon" />
                NEW HIGH SCORE!
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <h2 className="section-title">Select Difficulty</h2>
        <div className="difficulty-grid">
          {difficulties.map(diff => (
            <button
              key={diff.id}
              onClick={() => onStartGame(diff.id)}
              className={`difficulty-card difficulty-${diff.color}`}
            >
              <h3 className="difficulty-name">{diff.name}</h3>
              <p className="difficulty-desc">{diff.desc}</p>
              <div className="difficulty-multiplier">{diff.multiplier}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="info-card">
        <h3 className="info-title">Power-Ups</h3>
        <div className="powerup-grid">
          <div className="powerup-item powerup-blue">
            <Shield className="powerup-icon" />
            <div className="powerup-name">Shield</div>
            <div className="powerup-desc">Block one hit</div>
          </div>
          <div className="powerup-item powerup-yellow">
            <Zap className="powerup-icon" />
            <div className="powerup-name">Speed</div>
            <div className="powerup-desc">Move 70% faster</div>
          </div>
          <div className="powerup-item powerup-red">
            <Trash2 className="powerup-icon" />
            <div className="powerup-name">Clear</div>
            <div className="powerup-desc">Destroy all enemies</div>
          </div>
          <div className="powerup-item powerup-purple">
            <Magnet className="powerup-icon" />
            <div className="powerup-name">Magnet</div>
            <div className="powerup-desc">Attract fragments</div>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h3 className="info-title-features">
          <TrendingUp className="features-icon" />
          Features
        </h3>
        <ul className="features-list">
          <li>• Difficulty increases every 30 seconds</li>
          <li>• Enemies become faster and more numerous</li>
          <li>• Fragment values increase over time</li>
          <li>• Boss waves every 5 waves with special enemies</li>
          <li>• Survive as long as you can and beat your high score!</li>
        </ul>
      </div>
    </div>
  );
}

function GameScreen({ difficulty, onGameEnd }) {
  const canvasRef = useRef(null);
  const [uiState, setUiState] = useState({
    collected: 0,
    health: 3,
    maxHealth: 3,
    time: 0,
    wave: 1,
    activePowerUp: null,
    powerUpTimer: 0,
    enemyCount: 0,
    difficultyMultiplier: 1.0,
    nextWaveIn: 30,
    isBossWave: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    //difficulty settings
    const difficultySettings = {
      easy: { healthMod: 5, speedMod: 0.7, spawnMod: 1.5, scoreMultiplier: 0.5 },
      normal: { healthMod: 3, speedMod: 1.0, spawnMod: 1.0, scoreMultiplier: 1.0 },
      hard: { healthMod: 2, speedMod: 1.3, spawnMod: 0.7, scoreMultiplier: 2.0 },
      insane: { healthMod: 1, speedMod: 1.6, spawnMod: 0.5, scoreMultiplier: 3.0 }
    };

    const settings = difficultySettings[difficulty];

    const POWERUP_TYPES = [
      { type: 'shield', color: '#3b82f6', duration: 10 },
      { type: 'speed', color: '#eab308', duration: 10 },
      { type: 'clear', color: '#ef4444', duration: 0 },
      { type: 'magnet', color: '#a855f7', duration: 10 }
    ];

    const state = {
      player: {
        x: 400, y: 300,
        size: 20,
        baseSpeed: 5,
        speed: 5,
        health: settings.healthMod,
        maxHealth: settings.healthMod,
        invulnerable: 0,
        hasShield: false
      },
      fragments: [],
      enemies: [],
      particles: [],
      keys: {},
      powerUps: [],
      floatingTexts: [],
      collected: 0,
      enemiesDestroyed: 0,
      time: 0,
      wave: 1,
      waveTimer: 0,
      spawnTimer: 0,
      enemySpawnTimer: 0,
      powerUpSpawnTimer: 0,
      activePowerUp: null,
      powerUpTimer: 0,
      powerUpsCollected: 0,
      combo: 0,
      comboTimer: 0,
      gameOver: false,
      difficultyMultiplier: 1.0,
      isBossWave: false
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
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        state.particles.push({
          x, y,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          life: 1,
          color,
          size: 2 + Math.random() * 2
        });
      }
    }

    function addFloatingText(x, y, text, color) {
      state.floatingTexts.push({
        x, y,
        text,
        color,
        life: 1,
        vy: -2
      });
    }

    function spawnFragment() {
      const x = Math.random() * 760 + 20;
      const y = Math.random() * 560 + 20;

      const waveBonus = Math.floor(state.wave / 5);
      const types = [
        { value: 1 + waveBonus, size: 10, color: '#60a5fa' },
        { value: 2 + waveBonus, size: 14, color: '#4980ff' },
        { value: 3 + waveBonus, size: 16, color: '#3140e4' }
      ];
      const type = types[Math.min(Math.floor(Math.random() * 3), 2)];

      state.fragments.push({
        x, y,
        size: type.size,
        value: type.value,
        color: type.color,
        pulse: Math.random() * Math.PI * 2
      });
    }

    function spawnEnemy() {
      const edge = Math.floor(Math.random() * 4);
      let x, y;

      switch (edge) {
        case 0: x = Math.random() * 800; y = -20; break;
        case 1: x = 820; y = Math.random() * 600; break;
        case 2: x = Math.random() * 800; y = 620; break;
        default: x = -20; y = Math.random() * 600;
      }

      const baseSpeed = (1 + state.wave * 0.1) * settings.speedMod;
      const isBoss = state.isBossWave && Math.random() < 0.3;
      
      const types = [
        { speed: baseSpeed, size: 15, color: '#ef4444', health: 1 },
        { speed: baseSpeed * 1.5, size: 12, color: '#f48536', health: 1 },
        { speed: baseSpeed * 0.7, size: 20, color: '#b31f1f', health: 2 },
        { speed: baseSpeed * 0.5, size: 25, color: '#7f1d1d', health: 3 },
      ];
      
      let type;
      if (isBoss) {
        type = types[3];
      } else {
        const maxTypeIndex = Math.min(2 + Math.floor(state.wave / 3), types.length - 1);
        type = types[Math.floor(Math.random() * maxTypeIndex)];
      }

      state.enemies.push({
        x, y,
        size: type.size,
        speed: type.speed,
        color: type.color,
        health: type.health,
        maxHealth: type.health,
        pulse: Math.random() * Math.PI * 2,
        isBoss: isBoss
      });
    }

    function spawnPowerUp() {
      const margin = 60;
      const x = margin + Math.random() * (800 - margin * 2);
      const y = margin + Math.random() * (600 - margin * 2);

      const PUType = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];

      state.powerUps.push({
        x, y,
        size: 16,
        type: PUType.type,
        color: PUType.color,
        duration: PUType.duration,
        pulse: Math.random() * Math.PI * 2,
        lifetime: 15
      });
    }

    for (let i = 0; i < 15; i++) spawnFragment();
    for (let i = 0; i < 5; i++) spawnEnemy();

    let last = performance.now();
    let animationFrameId = null;

    const loop = (now) => {
      if (state.gameOver) {
        if (animationFrameId) {
          window.cancelAnimationFrame(animationFrameId);
        }
        return;
      }

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      state.time += dt;
      state.waveTimer += dt;
      state.player.invulnerable = Math.max(0, state.player.invulnerable - dt);
      state.powerUpTimer = Math.max(0, state.powerUpTimer - dt);
      state.comboTimer = Math.max(0, state.comboTimer - dt);

      if (state.comboTimer <= 0) state.combo = 0;

      if (state.waveTimer >= 30) {
        state.wave += 1;
        state.waveTimer = 0;
        state.difficultyMultiplier = 1 + (state.wave - 1) * 0.15;
        state.isBossWave = state.wave % 5 === 0;
        
        addFloatingText(400, 100, `WAVE ${state.wave}${state.isBossWave ? ' - BOSS WAVE!' : ''}`, state.isBossWave ? '#ef4444' : '#fbbf24');
        
        for (let i = 0; i < 3 + state.wave; i++) {
          spawnEnemy();
        }
      }

      if (state.powerUpTimer <= 0 && state.activePowerUp) {
        if (state.activePowerUp === 'speed') {
          state.player.speed = state.player.baseSpeed;
        }
        if (state.activePowerUp === 'shield') {
          state.player.hasShield = false;
        }
        state.activePowerUp = null;
      }

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

      if (state.activePowerUp === 'magnet') {
        state.fragments.forEach(frag => {
          const dx = p.x - frag.x;
          const dy = p.y - frag.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 200 && dist > 0) {
            frag.x += (dx / dist) * 3;
            frag.y += (dy / dist) * 3;
          }
        });
      }

      state.fragments.forEach(frag => {
        frag.pulse += dt * 5;

        const dist = Math.hypot(frag.x - p.x, frag.y - p.y);
        if (dist < p.size + frag.size) {
          const scoreValue = Math.floor(frag.value * settings.scoreMultiplier);
          state.collected += scoreValue;
          state.combo++;
          state.comboTimer = 3;

          createParticles(frag.x, frag.y, 12, frag.color);
          if (frag.value > 1) {
            addFloatingText(frag.x, frag.y, `+${scoreValue}`, frag.color);
          }
          if (state.combo > 3) {
            addFloatingText(p.x, p.y - 30, `${state.combo}x COMBO!`, '#fbbf24');
          }
          state.fragments = state.fragments.filter(f => f !== frag);
        }
      });

      state.powerUps.forEach(powerUp => {
        powerUp.pulse += dt * 4;
        powerUp.lifetime -= dt;

        const dist = Math.hypot(powerUp.x - p.x, powerUp.y - p.y);
        if (dist < p.size + powerUp.size) {
          state.powerUpsCollected++;
          createParticles(powerUp.x, powerUp.y, 15, powerUp.color);

          if (powerUp.type === 'shield') {
            state.player.hasShield = true;
            state.activePowerUp = 'shield';
            state.powerUpTimer = powerUp.duration;
            addFloatingText(powerUp.x, powerUp.y, 'SHIELD!', powerUp.color);
          } else if (powerUp.type === 'speed') {
            state.player.speed = state.player.baseSpeed * 1.7;
            state.activePowerUp = 'speed';
            state.powerUpTimer = powerUp.duration;
            addFloatingText(powerUp.x, powerUp.y, 'SPEED!', powerUp.color);
          } else if (powerUp.type === 'clear') {
            const destroyedCount = state.enemies.length;
            state.enemiesDestroyed += destroyedCount;
            state.enemies.forEach(e => {
              createParticles(e.x, e.y, 15, '#ef4444');
            });
            state.enemies = [];
            addFloatingText(400, 100, `${destroyedCount} ENEMIES CLEARED!`, '#ef4444');
          } else if (powerUp.type === 'magnet') {
            state.activePowerUp = 'magnet';
            state.powerUpTimer = powerUp.duration;
            addFloatingText(powerUp.x, powerUp.y, 'MAGNET!', powerUp.color);
          }

          state.powerUps = state.powerUps.filter(pu => pu !== powerUp);
        }
      });

      state.powerUps = state.powerUps.filter(pu => pu.lifetime > 0);

      state.enemies.forEach(enemy => {
        enemy.pulse += dt * 4;
        const dx = p.x - enemy.x;
        const dy = p.y - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0) {
          enemy.x += (dx / dist * enemy.speed);
          enemy.y += (dy / dist * enemy.speed);
        }

        if (p.invulnerable <= 0) {
          const playerDist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
          if (playerDist < p.size + enemy.size) {
            if (state.player.hasShield) {
              state.player.hasShield = false;
              state.activePowerUp = null;
              state.powerUpTimer = 0;
              createParticles(p.x, p.y, 20, '#3b82f6');
              addFloatingText(p.x, p.y - 30, 'SHIELD BROKE!', '#3b82f6');
              enemy.health -= 1;
              if (enemy.health <= 0) {
                state.enemiesDestroyed++;
                createParticles(enemy.x, enemy.y, 20, enemy.color);
                state.enemies = state.enemies.filter(e => e !== enemy);
              }
            } else {
              state.combo = 0;
              p.health -= 1;
              p.invulnerable = 1.5;
              createParticles(p.x, p.y, 20, '#ef4444');
              addFloatingText(p.x, p.y - 30, '-1 HEALTH', '#ef4444');

              if (p.health <= 0) {
                state.gameOver = true;
                
                //cancel animation frame
                window.cancelAnimationFrame(loop);
                
                const isNewHighScore = state.collected > (parseInt(localStorage.getItem('highScore') || '0'));
                if (isNewHighScore) {
                  localStorage.setItem('highScore', state.collected.toString());
                }
                
                onGameEnd({
                  fragmentsCollected: state.collected,
                  timeSurvived: Math.floor(state.time),
                  powerUpsCollected: state.powerUpsCollected,
                  enemiesDestroyed: state.enemiesDestroyed,
                  waveReached: state.wave,
                  isNewHighScore
                });
                return;
              }
            }
          }
        }
      });

      state.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.96;
        particle.vy *= 0.96;
        particle.life -= dt * 2;
      });
      state.particles = state.particles.filter(p => p.life > 0);

      state.floatingTexts.forEach(text => {
        text.y += text.vy * dt * 30;
        text.life -= dt;
      });
      state.floatingTexts = state.floatingTexts.filter(t => t.life > 0);

      state.spawnTimer += dt;
      const fragmentSpawnRate = Math.max(1, 2 - state.wave*0.05);
      const maxFragments = 20 + Math.floor(state.wave / 2);
      if (state.spawnTimer > fragmentSpawnRate && state.fragments.length < maxFragments) {
        state.spawnTimer = 0;
        spawnFragment();
      }

      state.enemySpawnTimer += dt;
      const enemySpawnRate = Math.max(0.8, 2.5 - state.wave*0.08) * settings.spawnMod;
      if (state.enemySpawnTimer > enemySpawnRate) {
        state.enemySpawnTimer = 0;
        const maxEnemies = 10 + state.wave*2;
        if (state.enemies.length < maxEnemies) {
          spawnEnemy();
        }
      }

      state.powerUpSpawnTimer += dt;
      if (state.powerUpSpawnTimer > 12 && state.powerUps.length < 2) {
        state.powerUpSpawnTimer = 0;
        spawnPowerUp();
      }

      //update UI
      setUiState({
        collected: Math.max(0, state.collected) || 0,
        health: Math.max(0, Math.min(state.player.maxHealth, state.player.health)) || 0,
        maxHealth: Math.max(1, state.player.maxHealth) || 3,
        time: Math.max(0, Math.floor(state.time)) || 0,
        wave: Math.max(1, state.wave) || 1,
        activePowerUp: state.activePowerUp || null,
        powerUpTimer: Math.max(0, Math.ceil(state.powerUpTimer)) || 0,
        enemyCount: Math.max(0, state.enemies.length) || 0,
        difficultyMultiplier: Math.max(1, state.difficultyMultiplier) || 1.0,
        nextWaveIn: Math.max(0, Math.ceil(30 - state.waveTimer)) || 0,
        isBossWave: state.isBossWave || false
      });

      draw(ctx, state);
      
      if (!state.gameOver) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [difficulty, onGameEnd]);

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="game-stats-grid">
          <div>
            <div className="game-stat-label">Score</div>
            <div className="game-stat-value">{uiState.collected}</div>
          </div>
          <div>
            <div className="game-stat-label">Wave {uiState.wave}</div>
            <div className="game-stat-next">Next: {uiState.nextWaveIn}s</div>
          </div>
          <div>
            <div className="game-stat-label">Enemies</div>
            <div className="game-stat-value">{uiState.enemyCount}</div>
          </div>
          <div className="game-stat-right">
            <div className="game-stat-label">Health</div>
            <div className="game-health">
              {Array(Math.max(0, uiState.health || 0)).fill('❤️').map((h, i) => <span key={`heart-${i}`}>{h}</span>)}
              {Array(Math.max(0, (uiState.maxHealth || 3) - (uiState.health || 0))).fill('🖤').map((h, i) => <span key={`empty-${i}`}>{h}</span>)}
            </div>
          </div>
        </div>

        {uiState.isBossWave && (
          <div className="boss-wave-indicator">
            <span className="boss-wave-text">BOSS WAVE</span>
          </div>
        )}

        {uiState.activePowerUp && (
          <div className="active-powerup">
            <span className="powerup-active-name">{uiState.activePowerUp}</span>
            <span className="powerup-active-timer">{uiState.powerUpTimer}s</span>
          </div>
        )}
      </div>

      <div className="game-canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="game-canvas"
        />
      </div>

      <div className="game-controls">
        <div className="game-controls-text">
          Use WASD or Arrow Keys • Collect fragments • Avoid enemies • Survive!
        </div>
        <div className="game-controls-info">
          Time: {uiState.time}s • Difficulty: x{uiState.difficultyMultiplier.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

//drawing helpers
function _pulse(time, speed = 6, amp = 1) {
  return Math.sin(time * speed) * amp;
}
function _jitter(strength = 1) {
  return (Math.random() - 0.5) * strength;
}
function _rgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

//player (next step is to make this spin & "spit out" spikes from the corners to attack enemies)
function drawPlayer(ctx, player, time) {
  const blueCore = '#0ea5e9';    // bright core
  const blueFill = '#67e8f9';    // soft fill
  const cyanOutline = '#8be9ff'; // outline/glow

  const pulse = _pulse(time, 5, 0.8);
  const jitter = _jitter(1.2);

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate((player.x + player.y + time * 0.2) * 0.0008); //tiny rotation for drifting

  //holographic glow
  ctx.globalCompositeOperation = 'lighter';
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, player.size * 3.2);
  glow.addColorStop(0, _rgba(blueCore, 0.18));
  glow.addColorStop(0.6, _rgba(blueFill, 0.06));
  glow.addColorStop(1, _rgba('#000000', 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, player.size * 3.2, 0, Math.PI * 2);
  ctx.fill();

  //Core shard 
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineJoin = 'miter';

  ctx.fillStyle = blueFill;
  ctx.strokeStyle = cyanOutline;
  ctx.lineWidth = 1.5 + Math.max(0, pulse) * 0.6;

  //three-point shard with jitter to feel corrupted
  ctx.beginPath();
  ctx.moveTo(0 + _jitter(0.6), -player.size * 1.45 + jitter * 0.25);
  ctx.lineTo(player.size * 1.15 + _jitter(0.6), player.size * 0.75 + jitter * 0.4);
  ctx.lineTo(-player.size * 1.15 + _jitter(0.6), player.size * 0.75 + _jitter(0.4));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  //inner core accent
  ctx.fillStyle = blueCore;
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.moveTo(0, -player.size * 0.7 + _jitter(0.4));
  ctx.lineTo(player.size * 0.55 + _jitter(0.3), player.size * 0.35 + _jitter(0.3));
  ctx.lineTo(-player.size * 0.55 + _jitter(0.3), player.size * 0.35 + _jitter(0.3));
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  //scanline 
  ctx.strokeStyle = _rgba(blueCore, 0.28);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-player.size * 0.9, _jitter(0.8));
  ctx.lineTo(player.size * 0.9, _jitter(0.8));
  ctx.stroke();

  //shield rings
  if (player.hasShield) {
    const shieldPulse = 1 + Math.abs(_pulse(time, 4, 0.12));
    ctx.strokeStyle = _rgba(blueCore, 0.9);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, (player.size + 9) * shieldPulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = _rgba(blueFill, 0.45);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, (player.size + 14) * shieldPulse, 0, Math.PI * 2);
    ctx.stroke();
  }

  //invulnerability flash
  if (player.invulnerable > 0) {
    const alpha = 0.25 + 0.5 * Math.abs(Math.sin(time * 18));
    ctx.strokeStyle = _rgba('#67e8f9', alpha);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, player.size + 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

//enemy
function drawEnemy(ctx, enemy, time) {
  const redCore = '#be123c';
  const redFill = '#fb7185';
  const ember = '#ffb8c1';

  const pulse = 1 + _pulse(enemy.pulse + time * 0.4, 3, 0.6);
  const jitterX = _jitter(1.1);
  const jitterY = _jitter(1.1);

  ctx.save();
  ctx.translate(enemy.x + _jitter(0.6), enemy.y + _jitter(0.6));
  ctx.rotate((enemy.x - enemy.y) * 0.0009 + _pulse(time, 8, 0.02));

  //subtle red glow
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, enemy.size * 3.2);
  g.addColorStop(0, _rgba(redFill, 0.14));
  g.addColorStop(0.6, _rgba(redCore, 0.06));
  g.addColorStop(1, _rgba('#000000', 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, enemy.size * 3.2, 0, Math.PI * 2);
  ctx.fill();

  //shard body 
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = redFill;
  ctx.strokeStyle = redCore;
  ctx.lineWidth = enemy.isBoss ? 3 : 1.8;

  ctx.beginPath();
  ctx.moveTo(0, -enemy.size - pulse * 0.8 + jitterY);
  ctx.lineTo(enemy.size + jitterX, 0);
  ctx.lineTo(0, enemy.size + pulse * 0.8 - jitterY);
  ctx.lineTo(-enemy.size - jitterX, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  //small crack lines 
  ctx.strokeStyle = _rgba('#000000', 0.18);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-enemy.size * 0.25, -enemy.size * 0.2);
  ctx.lineTo(enemy.size * 0.35, enemy.size * 0.45);
  ctx.stroke();

  //boss accent
  if (enemy.isBoss) {
    ctx.fillStyle = ember;
    ctx.font = `${12 + Math.min(8, Math.floor(enemy.size/3))}px ParticleFont, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☥', 0, -enemy.size - 10);
  }

  ctx.restore();
}

function draw(ctx, state) {
  if (!ctx || !state || !state.player) return;

  const time = state.time || 0;
  const W = 800, H = 600;

  //background: radial haze + faint nebula
  const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H));
  bgGrad.addColorStop(0, _rgba('#071026', 1)); // deep navy center
  bgGrad.addColorStop(0.5, _rgba('#001428', 0.9));
  bgGrad.addColorStop(1, _rgba('#000005', 1));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  //flickering holographic haze (blue-ish)
  if (Math.random() < 0.06) {
    ctx.globalAlpha = 0.02 + Math.random() * 0.04;
    ctx.fillStyle = _rgba('#0ea5e9', 1);
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  //grid/scanlines
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x + (_jitter(0.2)), 0);
    ctx.lineTo(x + (_jitter(0.2)), H);
    ctx.strokeStyle = Math.random() < 0.06 ? _rgba('#be123c', 0.08) : _rgba('#67e8f9', 0.06);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y + (_jitter(0.2)));
    ctx.lineTo(W, y + (_jitter(0.2)));
    ctx.strokeStyle = Math.random() < 0.06 ? _rgba('#fb7185', 0.08) : _rgba('#67e8f9', 0.06);
    ctx.stroke();
  }

  //subtle CRT horizontal scanlines overlay
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = _rgba('#000000', 0.03);
  for (let y = 0; y < H; y += 2) {
    if (y % 6 === 0) continue; // make it irregular
    ctx.fillRect(0, y + Math.sin(time * 12 + y * 0.02) * 0.5, W, 1);
  }
  ctx.restore();

  //particles 
  state.particles.forEach(p => {
    const alpha = Math.max(0, Math.min(1, p.life));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    //make shards (small rotated rects)
    ctx.translate(p.x + _jitter(0.4), p.y + _jitter(0.4));
    ctx.rotate(p.vx * 0.05 + _jitter(0.6));

    const w = Math.max(1, p.size * (0.6 + Math.random() * 0.8));
    const h = Math.max(1, p.size * (0.8 + Math.random() * 1.2));

    ctx.fillStyle = _rgba(p.color || '#67e8f9', alpha * 0.95);
    ctx.fillRect(-w/2, -h/2, w, h);

    //streak tail
    ctx.strokeStyle = _rgba(p.color || '#67e8f9', alpha * 0.5);
    ctx.lineWidth = Math.max(1, w * 0.12);
    ctx.beginPath();
    ctx.moveTo(-w * 0.6, 0);
    ctx.lineTo(-w * 1.8 - (p.vx || 0), 0);
    ctx.stroke();

    ctx.restore();
  });

  //magnet ring
  if (state.activePowerUp === 'magnet') {
    ctx.save();
    ctx.setLineDash([6,6]);
    ctx.strokeStyle = _rgba('#67e8f9', 0.22);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, 200, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  //fragments
  state.fragments.forEach(frag => {
    const fragPulse = 1 + Math.sin(frag.pulse + time * 6) * 0.18;
    const fx = frag.x + _jitter(0.4);
    const fy = frag.y + _jitter(0.4);

    //outer halo
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, frag.size * 3.2);
    g.addColorStop(0, _rgba('#0ea5e9', 0.12));
    g.addColorStop(0.6, _rgba('#67e8f9', 0.06));
    g.addColorStop(1, _rgba('#000000', 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(fx, fy, frag.size * 3.2, 0, Math.PI * 2);
    ctx.fill();

    //shard body
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = frag.color || '#67e8f9';
    ctx.strokeStyle = _rgba('#0ea5e9', 0.95);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fx, fy - frag.size * fragPulse);
    ctx.lineTo(fx + frag.size * 0.9, fy);
    ctx.lineTo(fx, fy + frag.size * fragPulse);
    ctx.lineTo(fx - frag.size * 0.9, fy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    //highlight
    ctx.fillStyle = _rgba('#ffffff', 0.85);
    ctx.beginPath();
    ctx.arc(fx - frag.size * 0.25, fy - frag.size * 0.25, frag.size * 0.25, 0, Math.PI*2);
    ctx.fill();

    //value text
    if (frag.value > 1) {
      ctx.fillStyle = '#e6f9ff';
      ctx.font = 'bold 11px ParticleFont, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`x${frag.value}`, fx, fy + frag.size + 12);
    }
  });

  //powerups
  state.powerUps.forEach(powerUp => {
    const pp = 1 + Math.sin(powerUp.pulse + time * 6) * 0.12;
    const px = powerUp.x, py = powerUp.y;

    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createRadialGradient(px, py, 0, px, py, powerUp.size * 4);
    grad.addColorStop(0, _rgba(powerUp.color, 0.22));
    grad.addColorStop(0.6, _rgba(powerUp.color, 0.1));
    grad.addColorStop(1, _rgba('#000000', 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, powerUp.size * 4, 0, Math.PI*2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = _rgba(powerUp.color, 0.95);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, powerUp.size * pp, 0, Math.PI*2);
    ctx.stroke();

    ctx.fillStyle = powerUp.color;
    ctx.font = `bold ${16 + Math.floor(powerUp.size/2)}px ParticleFont, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icons = { shield: '⛨', speed: '⚡', clear: '✖', magnet: '⤓' };
    ctx.fillText(icons[powerUp.type] || '?', px, py);
  });

  //enemies
  state.enemies.forEach(enemy => {
    //soft halo before the body
    const glowColor = enemy.isBoss ? '#be123c' : (enemy.color || '#fb7185');
    ctx.globalCompositeOperation = 'lighter';
    const eg = ctx.createRadialGradient(enemy.x, enemy.y, 0, enemy.x, enemy.y, enemy.size * 3.2);
    eg.addColorStop(0, _rgba(glowColor, 0.16));
    eg.addColorStop(0.6, _rgba(glowColor, 0.06));
    eg.addColorStop(1, _rgba('#000000', 0));
    ctx.fillStyle = eg;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size * 3.2, 0, Math.PI*2);
    ctx.fill();

    drawEnemy(ctx, enemy, time);

    //boss marker & health
    if (enemy.isBoss) {
      ctx.fillStyle = '#ffd5d9';
      ctx.font = 'bold 14px ParticleFont, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BOSS', enemy.x, enemy.y - enemy.size - 14);
    }

    if (enemy.maxHealth > 1) {
      const barWidth = enemy.size * 2;
      const barHeight = 5;
      const barX = enemy.x - barWidth / 2;
      const barY = enemy.y - enemy.size - 8;
      ctx.fillStyle = _rgba('#2b0206', 0.9);
      ctx.fillRect(barX, barY, barWidth, barHeight);

      ctx.fillStyle = _rgba('#fb7185', 0.95);
      const healthPercent = Math.max(0, Math.min(1, enemy.health / enemy.maxHealth));
      ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }

    //jagged spikes
    const spikeCount = enemy.isBoss ? 8 : 6;
    ctx.strokeStyle = _rgba('#000000', 0.25);
    ctx.lineWidth = enemy.isBoss ? 3 : 2;
    for (let i = 0; i < spikeCount; i++) {
      const angle = (Math.PI * 2 * i) / spikeCount + enemy.pulse * 0.5;
      const x1 = enemy.x + Math.cos(angle) * enemy.size * 0.7;
      const y1 = enemy.y + Math.sin(angle) * enemy.size * 0.7;
      const x2 = enemy.x + Math.cos(angle) * enemy.size * 1.5;
      const y2 = enemy.y + Math.sin(angle) * enemy.size * 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  });

  //player (draw last so it's on top)
  drawPlayer(ctx, state.player, time);

  //speed trail for player
  if (state.activePowerUp === 'speed') {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = _rgba('#0ea5e9', 0.18);
    ctx.beginPath();
    ctx.ellipse(state.player.x - 6, state.player.y, state.player.size * 1.8, state.player.size * 0.9, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  //combo display (holographic font)
  if (state.combo > 3) {
    ctx.save();
    ctx.font = 'bold 34px UIFont, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const comboText = `${state.combo}x COMBO!`;
    //soft stroke then light fill
    ctx.lineWidth = 4;
    ctx.strokeStyle = _rgba('#001428', 0.85);
    ctx.strokeText(comboText, W/2, 78);
    ctx.fillStyle = '#e6fbff';
    ctx.fillText(comboText, W/2, 78);
    ctx.restore();
  }

  //floating texts
  state.floatingTexts.forEach(text => {
    ctx.save();
    const alpha = Math.max(0, Math.min(1, text.life));
    ctx.font = 'bold 16px ParticleFont, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    //stroke for legibility
    ctx.lineWidth = 3;
    ctx.strokeStyle = _rgba('#001428', alpha * 0.9);
    ctx.strokeText(text.text, text.x, text.y);
    ctx.fillStyle = _rgba(text.color || '#e6fbff', alpha);
    ctx.fillText(text.text, text.x, text.y);
    ctx.restore();
  });

  ctx.globalCompositeOperation = 'source-over';
}
