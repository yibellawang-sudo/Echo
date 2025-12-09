# Echo

## Overview

**Echo** is an survival arcade game set in a dystopian digital purgatory called the Panopticon. After the collapse of 3042, humanity's consciousness was digitized into "Echos" - vast repositories of collective memory. You are Subject 77, a Memory Extractor tasked with collecting fragments of lost memories while surviving waves of corrupted data entities.

## The Story

In the year 3042, civilization collapsed. Humanity's consciousness was digitalized into fragments called "Echos" - repositories containing science, art, history, and emotion. These Echos now drift mindlessly through the Panopticon, a digital purgatory.

You are **Subject 77**, a Memory Extractor directed by the Overseer AI. Your mission: collect memory fragments before total data decay. But as you progress, you begin to realize you're decaying too, losing parts of your own memory. 

The Sentinels - mysterious entities that attack you - may not be what they seem...

## Gameplay Features

### Core Mechanics
- **Wave-Based Survival**: Survive increasingly difficult waves of corrupted enemies
- **Memory Collection**: Gather glowing fragments to increase your score
- **Progressive Difficulty**: Every 30 seconds, a new wave begins with faster, tougher enemies
- **Boss Waves**: Every 5th wave introduces powerful boss enemies

### Power-Up System
-  **Shield**: Block one hit from enemies
-  **Speed**: Move 70% faster for 10 seconds
-  **Clear**: Instantly destroy all enemies on screen
-  **Magnet**: Automatically attract nearby fragments

### Combat System
- **Spike Attack**: Collect 10 fragments to unlock a projectile attack
- Press **SPACE** to fire three-directional spikes at enemies
- Strategic resource management between collection and combat

### Difficulty Modes
1. **Training Mode** (0.5x score) - Slower enemies, more health
2. **Standard Protocol** (1x score) - Balanced challenge
3. **Corruption Surge** (2x score) - Faster enemies, less health
4. **Data Apocalypse** (3x score) - Maximum chaos

## Visual Design

Echo features a **cyberpunk aesthetic** with:
- Holographic particle effects
- Glitch-style scanline overlays
- Pulsing neon geometry
- Dynamic lighting and glow effects
- CRT monitor simulation
- Corrupted data visualization

## Controls

- **WASD** or **Arrow Keys**: Move your character
- **SPACE**: Fire spike attack (costs 10 fragments)
- Navigate menus with **mouse clicks**

## Game Statistics

Track your performance across runs:
- **High Score**: Your best fragment collection run
- **Longest Survival**: Maximum time survived
- **Total Runs**: Number of games played
- **Enemies Destroyed**: Total enemy defeats
- **Power-Ups Collected**: Total power-ups acquired

## Enemy Types

1. **Basic Corruption** (Red) - Standard speed and health
2. **Fast Glitch** (Orange) - 1.5x speed, lower health
3. **Heavy Data** (Dark Red) - Slower but 2 health points
4. **Boss Entity** (Crimson) - Appears in boss waves, 3 health points

## Scoring System

- Fragment values increase with wave progression
- Combo multiplier for collecting multiple fragments quickly
- Difficulty multipliers affect final score
- Higher waves = higher value fragments

## Technical Details

### Built With
- **React** - UI framework
- **HTML5 Canvas** - Game rendering
- **Lucide React** - Icon library
- **Custom CSS** - Cyberpunk styling

### Performance
- Smooth 60 FPS gameplay
- Particle system with hundreds of effects
- Efficient collision detection
- Optimized rendering pipeline

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/echo-game.git

# Navigate to directory
cd echo-game

# Install dependencies
npm install

# Run the game
npm start
```

## Tips

1. **Prioritize survival early** - Focus on dodging rather than collecting
2. **Use power-ups strategically** - Save shields for dangerous situations
3. **Master the spike attack** - Essential for higher waves
4. **Learn enemy patterns** - Each type has predictable behavior
5. **Combo chains** - Collecting multiple fragments quickly multiplies your score
6. **Boss wave preparation** - Stock up on spike attacks before wave 5, 10, 15...

## Future Features

- Memory types: Art, Science, History, Emotion shards
- Base building mechanics between runs
- Upgrade system using collected memories
- Story revelations and plot twists
- Multiple endings based on choices
- Leaderboard system
- Achievement system

## Known Issues

- High wave counts (50+) may cause performance degradation
- Particle effects can overlap and reduce visibility
- Boss enemies may occasionally spawn off-screen

## License

This project is licensed under the MIT License - see the LICENSE file for details.
