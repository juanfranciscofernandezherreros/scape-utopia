import React, { useState, useEffect, useRef } from 'react';
import { GameStage, GameState } from './types';
import { ACT_1_PUZZLES, ACT_2_PUZZLES, STORY_LOGS } from './constants';
import { Button } from './components/Button';
import { Play, Volume2, VolumeX, Eye, Power, AlertTriangle, Cloud, Star, Music, Radio, Clock, MapPin, Lock, ChevronUp, ChevronDown, Globe, RefreshCcw, HelpCircle, User, Server, Video, Loader, History, ArrowLeft } from 'lucide-react';
import * as Audio from './audio';

const GAME_DURATION_SECONDS = 45 * 60; // 45 Minutes

interface EscapeRoom1Props {
  onExit: () => void;
}

const EscapeRoom1: React.FC<EscapeRoom1Props> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>({
    stage: 'INTRO',
    hasAudio: false,
    inventory: [],
    mistakes: 0,
    startTime: null,
    endTime: null,
    penaltySeconds: 0
  });

  const [inputValue, setInputValue] = useState('');
  const [lockValues, setLockValues] = useState(['0', '0', '0']); 
  const [hintLevel, setHintLevel] = useState(0); // 0 = No hint, 1 = Hint 1, etc.
  const [feedback, setFeedback] = useState<string | null>(null);
  const [transitionLines, setTransitionLines] = useState<string[]>([]);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null); 
  
  const [remainingTime, setRemainingTime] = useState(GAME_DURATION_SECONDS);
  const [showPenalty, setShowPenalty] = useState(false);

  // Core Puzzle (History) State
  const [historySelection, setHistorySelection] = useState([0, 0, 0]); // Indices for the 3 columns

  // --- AUDIO & TIMER LOOP ---
  
  useEffect(() => {
    let interval: number;
    if (gameState.startTime && !gameState.endTime) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - gameState.startTime) / 1000);
        const left = GAME_DURATION_SECONDS - elapsed - gameState.penaltySeconds;
        setRemainingTime(Math.max(0, left));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [gameState.startTime, gameState.endTime, gameState.penaltySeconds]);

  // Handle Audio Context & Mute
  useEffect(() => {
    if (gameState.hasAudio) {
      Audio.initAudio();
      Audio.setMute(false);
    } else {
      Audio.setMute(true);
      Audio.stopSpeech();
    }
  }, [gameState.hasAudio]);

  // Handle Scene Transitions
  useEffect(() => {
    window.scrollTo(0, 0);
    setInputValue('');
    setFeedback(null);
    setHintLevel(0); // Reset hint level on new stage
    setHoveredCity(null);

    // Reset lock values based on stage
    if (gameState.stage === 'ACT_2_P23') {
        // Reset History Puzzle
        setHistorySelection([0, 0, 0]);
        setLockValues(['0', '0', '0', '0', '0']);
    } else if (gameState.stage === 'ACT_2_P22') {
       setLockValues(['0', '0', '0']);
    }

    // Story Telling Trigger
    if (gameState.hasAudio && STORY_LOGS[gameState.stage]) {
        // Use "narrator" voice for INTRO and ACT_1_WIN (The Doctor), "system" for everything else
        const voiceType = (gameState.stage === 'INTRO' || gameState.stage === 'ACT_1_WIN') ? 'narrator' : 'system';
        Audio.speak(STORY_LOGS[gameState.stage], voiceType);
    }

    // Audio Triggers
    if (gameState.hasAudio) {
      if (gameState.stage === 'INTRO') {
          Audio.startCinemaAmbience(); // NEW FUN MUSIC
      }
      else if (gameState.stage === 'CINEMA_ENDING') {
         // FADE OUT AUDIO FOR DISSOLVE
         Audio.stopAmbience();
      }
      else if (gameState.stage.startsWith('ACT_1')) {
          Audio.startHappyAmbience(); // ORIGINAL LULLABY
      }
      else if (gameState.stage === 'TRANSITION') {
          Audio.startSiren(); 
          Audio.playGlitchBurst();
          setTimeout(Audio.playGlitchBurst, 500);
          setTimeout(Audio.playGlitchBurst, 1500);
          setTimeout(Audio.playGlitchBurst, 2500);
      }
      else if (gameState.stage.startsWith('ACT_2')) {
          Audio.startHorrorAmbience();
      }
      else if (gameState.stage.startsWith('ENDING')) {
          Audio.stopAmbience(); 
      }
    }

    // Logic for ACT_1_WIN Auto Transition
    if (gameState.stage === 'ACT_1_WIN') {
       const timer = setTimeout(() => {
           setGameState(prev => ({ ...prev, stage: 'TRANSITION' }));
       }, 10000); // 10 seconds delay as requested
       return () => clearTimeout(timer);
    }

    // Logic for TRANSITION scene
    if (gameState.stage === 'TRANSITION') {
        setTransitionLines([]); 
        
        const t1 = setTimeout(() => setTransitionLines(p => [...p, "ANALIZANDO PATRÓN DE RESPUESTA..."]), 1500);
        const t2 = setTimeout(() => setTransitionLines(p => [...p, "SUJETO IDENTIFICADO: INTELECTO SUPERIOR"]), 3500);
        const t3 = setTimeout(() => setTransitionLines(p => [...p, "ELIMINANDO SIMULACIÓN INFANTIL..."]), 6000);
        const t4 = setTimeout(() => setTransitionLines(p => [...p, "ACCEDIENDO A REALIDAD DE NIVEL 7..."]), 8000);
        
        const tEnd = setTimeout(() => {
            setGameState(prev => ({ ...prev, stage: 'ACT_2_INTRO' }));
        }, 10000);

        return () => {
            [t1, t2, t3, t4, tEnd].forEach(clearTimeout);
        };
    }
  }, [gameState.stage, gameState.hasAudio]);


  const toggleAudio = () => {
    if (!gameState.hasAudio) {
        Audio.initAudio();
        // Updated Audio Toggle Logic to resume correct track
        if (gameState.stage === 'INTRO') Audio.startCinemaAmbience();
        else if (gameState.stage === 'CINEMA_ENDING') Audio.stopAmbience();
        else if (gameState.stage.startsWith('ACT_1')) Audio.startHappyAmbience();
        else if (gameState.stage === 'TRANSITION') Audio.startSiren();
        else if (gameState.stage.startsWith('ACT_2')) Audio.startHorrorAmbience();
        
        // Re-trigger speech if we are toggling on in a story stage
        if (STORY_LOGS[gameState.stage]) {
           const voiceType = (gameState.stage === 'INTRO' || gameState.stage === 'ACT_1_WIN') ? 'narrator' : 'system';
           Audio.speak(STORY_LOGS[gameState.stage], voiceType);
        }
    } else {
        Audio.stopSpeech();
    }
    setGameState(prev => ({ ...prev, hasAudio: !prev.hasAudio }));
  };

  const handleStart = () => {
    setGameState(prev => ({ 
      ...prev, 
      stage: 'ACT_1_P1',
      startTime: Date.now()
    }));
  };

  // SOFT RESET FUNCTION
  const handleResetGame = () => {
    setGameState({
        stage: 'INTRO',
        hasAudio: gameState.hasAudio,
        inventory: [],
        mistakes: 0,
        startTime: null,
        endTime: null,
        penaltySeconds: 0
    });
    setRemainingTime(GAME_DURATION_SECONDS);
  };
  
  const handleFullExit = () => {
    Audio.stopAmbience();
    Audio.stopSpeech();
    onExit();
  };

  const revealHint = () => {
     if (hintLevel >= 3) return;
     
     setHintLevel(prev => prev + 1);
     setGameState(prev => ({
         ...prev,
         penaltySeconds: prev.penaltySeconds + 15
     }));
     
     // Visual penalty feedback
     setShowPenalty(true);
     setTimeout(() => setShowPenalty(false), 800);
  };

  const checkAnswer = (correct: string, nextStage: GameStage, valueToCheck?: string) => {
    const normalize = (s: string) => s.trim().toUpperCase();
    const val = valueToCheck || inputValue;
    const isAct1 = gameState.stage.startsWith('ACT_1');

    if (normalize(val) === normalize(correct)) {
      setFeedback('CORRECTO');
      if (gameState.hasAudio) Audio.playCorrectTone(isAct1 || nextStage === 'HAPPY_ENDING');
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, stage: nextStage }));
      }, 1000);
    } else {
      setFeedback('INCORRECTO');
      if (gameState.hasAudio) Audio.playErrorTone(isAct1);
      
      setGameState(prev => ({ 
        ...prev, 
        mistakes: prev.mistakes + 1,
        penaltySeconds: prev.penaltySeconds + 30 
      }));
      
      setShowPenalty(true);
      setTimeout(() => setShowPenalty(false), 800);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- UI COMPONENTS ---
  
  const TimerDisplay = () => {
    if (!gameState.startTime || gameState.endTime) return null;
    const isAct1 = gameState.stage.startsWith('ACT_1');
    const isAct2 = gameState.stage.startsWith('ACT_2') && !gameState.stage.startsWith('HAPPY') && !gameState.stage.startsWith('CINEMA');
    const isTransition = gameState.stage === 'TRANSITION';

    if (isAct1 || gameState.stage === 'HAPPY_ENDING') {
        return (
            <div className={`fixed top-4 right-4 bg-white/90 border-4 border-[#FFD93D] text-[#4D96FF] font-['Fredoka'] px-6 py-2 rounded-full text-2xl font-bold shadow-lg z-50 flex items-center gap-2 transition-transform ${showPenalty ? 'scale-125 bg-red-100 border-red-400 text-red-500' : ''}`}>
                <Clock size={24} />
                {formatTime(remainingTime)}
                {showPenalty && <span className="absolute -bottom-8 right-0 text-red-500 font-black text-xl animate-bounce">-15s</span>}
            </div>
        );
    }
    if (isTransition) {
        return (
            <div className="fixed top-4 right-4 text-red-500 font-['Share_Tech_Mono'] text-4xl font-bold z-50 animate-glitch">
                {formatTime(remainingTime)}
            </div>
        );
    }
    if (isAct2) {
        const isCritical = remainingTime < 300; 
        return (
            <div className={`fixed top-4 right-4 bg-black/80 border ${isCritical ? 'border-red-600 text-red-500 animate-pulse' : 'border-green-900 text-green-500'} font-['Share_Tech_Mono'] px-4 py-2 z-50 text-xl tracking-widest`}>
                T-{formatTime(remainingTime)}
                {showPenalty && <div className="absolute top-10 right-0 text-red-600 text-sm font-bold bg-black px-2">PENALTY DETECTED</div>}
            </div>
        );
    }
    return null;
  };

  const AudioToggle = () => (
      <button 
        onClick={toggleAudio}
        className={`fixed top-4 left-4 z-50 p-3 rounded-full shadow-lg transition-all ${
            gameState.stage.startsWith('ACT_1') || gameState.stage === 'INTRO' || gameState.stage === 'HAPPY_ENDING'
            ? 'bg-white text-[#4D96FF] hover:bg-blue-50' 
            : 'bg-black text-green-500 border border-green-800 hover:bg-green-900/20'
        }`}
      >
          {gameState.hasAudio ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
  );

  const ExitButton = () => (
    <button 
        onClick={handleFullExit}
        className="fixed top-20 left-4 z-50 p-2 text-xs bg-black/50 text-white border border-white/20 hover:bg-red-900/50 rounded flex items-center gap-1"
    >
        <ArrowLeft size={12} /> MENU
    </button>
  );

  // --- SCENE RENDERING ---

  // RENDER: THEATER INTRO (Modified with Narrative)
  const renderTheaterIntro = () => {
    return (
      <div className="min-h-screen bg-[#1a1816] flex flex-col relative overflow-hidden font-['Inter']">
        {/* ... (Existing visual structure kept mostly same, added content overlay) ... */}
        
        {/* CEILING */}
        <div className="h-1/3 w-full relative overflow-hidden bg-[#2a2622]">
           <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #443e38 2px, transparent 2.5px)', backgroundSize: '40px 40px' }}></div>
           <div className="absolute top-10 left-1/4 w-32 h-32 bg-white/80 rounded-full blur-3xl opacity-20"></div>
           <div className="absolute top-10 right-1/4 w-32 h-32 bg-white/80 rounded-full blur-3xl opacity-20"></div>
           <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-2/3 h-4 border-b-4 border-gray-400 flex justify-around items-end">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-6 h-8 bg-black rounded-sm border border-gray-600 relative">
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400/50 rounded-full blur-sm"></div>
                  </div>
              ))}
           </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="flex-1 flex relative z-10">
            <div className="w-1/6 bg-[#eaddcf] relative border-r-8 border-[#cbbcae] hidden md:block"></div>

            <div className="flex-1 relative bg-black flex flex-col justify-end perspective-1000">
               <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-red-950 via-red-800 to-red-900 shadow-2xl z-20 rounded-br-3xl transform -skew-x-2 origin-top-left"></div>
               <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-red-950 via-red-800 to-red-900 shadow-2xl z-20 rounded-bl-3xl transform skew-x-2 origin-top-right"></div>
               <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#b8860b] to-[#8a6508] z-10 border-b-4 border-[#ffd700] shadow-lg flex items-center justify-center"><div className="w-full h-1 bg-[#ffd700]/50"></div></div>

               {/* NARRATIVE SCREEN */}
               <div className="relative w-3/4 h-3/4 mx-auto mb-0 bg-gradient-to-br from-pink-200 via-pink-300 to-purple-300 border-8 border-gray-800 rounded-t-xl shadow-[0_0_100px_rgba(255,100,100,0.3)] overflow-hidden flex flex-col items-center justify-center p-8 z-0">
                  <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>
                  
                  <div className="relative z-10 text-center scale-90 md:scale-100 max-w-lg">
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-4 border-white mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2 text-[#4D96FF]">
                            <User size={32} />
                            <h3 className="text-xl font-bold font-['Fredoka']">Dra. Vance (Terapeuta)</h3>
                        </div>
                        <p className="text-gray-600 font-['Inter'] italic text-sm md:text-base leading-relaxed mb-4">
                            "El problema que vamos a resolver hoy es el Aislamiento Cognitivo de su hijo. Hemos creado este juego para que se divierta mientras mapeamos su mente. Solo queremos que sea un niño normal."
                        </p>
                    </div>

                    <Button variant="child" onClick={handleStart} className="text-2xl px-12 py-4 shadow-[0_0_30px_rgba(255,217,61,0.6)] animate-bounce-slow">
                        COMENZAR TERAPIA <Play size={24} fill="currentColor" />
                    </Button>
                    <p className="text-xs text-purple-700 mt-4 font-bold uppercase tracking-wider bg-white/50 px-2 py-1 rounded inline-block">🔊 Activa el sonido para escuchar</p>
                  </div>
               </div>

               <div className="h-12 w-full bg-[#3d342b] border-t-4 border-[#2a241e] z-10 relative"></div>
            </div>

            <div className="w-1/6 bg-[#eaddcf] relative border-l-8 border-[#cbbcae] hidden md:block"></div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="h-1/4 bg-[#1a1512] relative overflow-hidden flex flex-col items-center pt-8">
            <div className="w-full flex justify-center gap-2 mb-[-10px] scale-90 opacity-70">
                {[...Array(12)].map((_, i) => <div key={`row1-${i}`} className="w-16 h-20 bg-[#8b0000] rounded-t-2xl shadow-lg border-t border-red-500/30"></div>)}
            </div>
            <div className="w-full flex justify-center gap-3 scale-100 z-10">
                {[...Array(10)].map((_, i) => <div key={`row2-${i}`} className="w-20 h-24 bg-[#a00000] rounded-t-3xl shadow-xl border-t border-red-400/40 relative"></div>)}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-20"></div>
        </div>
      </div>
    );
  };
  
  // RENDER: CINEMA ENDING -> NOW DISSOLVE ENDING
  const renderCinemaEnding = () => {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-['Inter'] text-white">
          <div className="absolute inset-0 bg-black z-50 animate-[fadeOut_8s_ease-in-out_forwards]"></div>
          
          <div className="z-40 text-center opacity-0 animate-[fadeInOut_6s_ease-in-out_forwards]">
              <h1 className="text-2xl md:text-4xl font-light tracking-[0.5em] uppercase mb-4 text-red-900">Desconexión Total</h1>
              <p className="text-sm md:text-lg text-gray-800 font-mono">Liberando recursos...</p>
          </div>

          <style>{`
             @keyframes fadeOut {
                 0% { background-color: transparent; }
                 100% { background-color: black; }
             }
             @keyframes fadeInOut {
                 0% { opacity: 0; }
                 20% { opacity: 1; }
                 80% { opacity: 1; }
                 100% { opacity: 0; }
             }
          `}</style>
      </div>
    );
  };

  // ACT 1: INNOCENT (14 Puzzles - Expanded)
  const renderScene1 = () => {
    let puzzle;
    let nextStage: GameStage = 'ACT_1_WIN';
    const isWin = gameState.stage === 'ACT_1_WIN';

    // Puzzle Logic - Expanded to 14
    if (!isWin) {
      switch (gameState.stage) {
        case 'ACT_1_P1': puzzle = ACT_1_PUZZLES.P1; nextStage = 'ACT_1_P2'; break;
        case 'ACT_1_P2': puzzle = ACT_1_PUZZLES.P2; nextStage = 'ACT_1_P3'; break;
        case 'ACT_1_P3': puzzle = ACT_1_PUZZLES.P3; nextStage = 'ACT_1_P4'; break;
        case 'ACT_1_P4': puzzle = ACT_1_PUZZLES.P4; nextStage = 'ACT_1_P5'; break;
        case 'ACT_1_P5': puzzle = ACT_1_PUZZLES.P5; nextStage = 'ACT_1_P6'; break;
        case 'ACT_1_P6': puzzle = ACT_1_PUZZLES.P6; nextStage = 'ACT_1_P7'; break;
        case 'ACT_1_P7': puzzle = ACT_1_PUZZLES.P7; nextStage = 'ACT_1_P8'; break;
        case 'ACT_1_P8': puzzle = ACT_1_PUZZLES.P8; nextStage = 'ACT_1_P9'; break;
        case 'ACT_1_P9': puzzle = ACT_1_PUZZLES.P9; nextStage = 'ACT_1_P10'; break;
        case 'ACT_1_P10': puzzle = ACT_1_PUZZLES.P10; nextStage = 'ACT_1_P11'; break;
        case 'ACT_1_P11': puzzle = ACT_1_PUZZLES.P11; nextStage = 'ACT_1_P12'; break;
        case 'ACT_1_P12': puzzle = ACT_1_PUZZLES.P12; nextStage = 'ACT_1_P13'; break;
        case 'ACT_1_P13': puzzle = ACT_1_PUZZLES.P13; nextStage = 'ACT_1_P14'; break;
        case 'ACT_1_P14': puzzle = ACT_1_PUZZLES.P14; nextStage = 'ACT_1_WIN'; break;
      }
    }

    const currentLevel = parseInt(gameState.stage.split('_P').pop() || '0');

    return (
      <div className={`min-h-screen bg-[#E0F7FA] flex flex-col items-center justify-center p-4 font-['Fredoka'] text-[#5D4037] overflow-hidden relative ${showPenalty ? 'bg-red-50' : ''}`}>
        <div className="absolute top-10 left-10 text-[#B2EBF2] animate-float"><Cloud size={120} fill="#B2EBF2" /></div>
        <div className="absolute bottom-20 right-10 text-[#B2EBF2] animate-float" style={{animationDelay: '1s'}}><Cloud size={160} fill="#B2EBF2" /></div>
        
        {!isWin && puzzle && (
          <div className={`max-w-md w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border-8 border-white transform transition-all relative z-10 ${showPenalty ? 'animate-shake border-red-200' : ''}`}>
            <div className="bg-[#6EC1E4] p-4 flex justify-between items-center">
              <span className="bg-white/20 px-4 py-1 rounded-full text-white font-bold text-sm">Prueba {currentLevel}/14</span>
              <div className="flex gap-1 flex-wrap justify-end max-w-[150px]">
                  {Array.from({length: 14}).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full m-[1px] ${currentLevel > i ? 'bg-white' : 'bg-white/40'}`}></div>
                  ))}
              </div>
            </div>
            <div className="p-8">
              {puzzle.image && (
                <div className="mb-6 rounded-2xl overflow-hidden border-4 border-[#E0F7FA]">
                   <img src={puzzle.image} alt="Puzzle" className="w-full h-48 object-cover" />
                </div>
              )}
              <p className="text-2xl mb-8 text-center font-semibold text-[#6D4C41]">{puzzle.question}</p>
              
              {puzzle.type === 'choice' && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {puzzle.options?.map(opt => (
                    <button key={opt} onClick={() => setInputValue(opt)} className={`p-4 rounded-2xl font-bold transition-all ${inputValue === opt ? 'bg-[#FF9E80] text-white shadow-lg scale-105' : 'bg-[#F5F5F5] hover:bg-[#FFCCBC] text-[#8D6E63]'}`}>{opt}</button>
                  ))}
                </div>
              )}
              
              {puzzle.type === 'text' && (
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Respuesta" className="w-full p-4 bg-[#FAFAFA] rounded-2xl border-4 border-[#EEEEEE] focus:border-[#4D96FF] outline-none text-center text-3xl mb-8 font-bold text-[#4D96FF] uppercase" />
              )}
              
              <Button variant="child" onClick={() => checkAnswer(puzzle.correctAnswer, nextStage)} disabled={!inputValue} className="w-full">¡Listo! ✨</Button>
              
              {/* NEW HINT SYSTEM ACT 1 */}
              <div className="mt-6 space-y-2">
                 {hintLevel > 0 && (
                     <div className="bg-[#FFF8E1] p-3 rounded-xl border-2 border-[#FFE082] text-sm text-[#FF6F00] animate-fade-in">
                        <span className="font-bold">Pista 1:</span> {puzzle.hints[0]}
                     </div>
                 )}
                 {hintLevel > 1 && (
                     <div className="bg-[#FFF8E1] p-3 rounded-xl border-2 border-[#FFCA28] text-sm text-[#FF6F00] animate-fade-in">
                        <span className="font-bold">Pista 2:</span> {puzzle.hints[1]}
                     </div>
                 )}
                 {hintLevel > 2 && (
                     <div className="bg-[#FFF8E1] p-3 rounded-xl border-2 border-[#FFB300] text-sm text-[#FF6F00] animate-fade-in font-bold">
                        <span className="font-bold">Solución:</span> {puzzle.hints[2]}
                     </div>
                 )}

                 {hintLevel < 3 && (
                     <button onClick={revealHint} className="w-full mt-2 text-[#A1887F] text-sm hover:text-[#4D96FF] flex items-center justify-center gap-1 transition-colors">
                        <HelpCircle size={14} /> 
                        {hintLevel === 0 ? "¿Necesitas ayuda?" : "Pedir otra pista"} 
                        <span className="text-red-400 font-bold ml-1">(-15s)</span>
                     </button>
                 )}
              </div>
            </div>
          </div>
        )}

        {isWin && (
           <div className="text-center z-10 animate-bounce-slow">
             <h1 className="text-7xl font-bold text-[#FFD54F] drop-shadow-md mb-4">¡PERFECTO! 🎉</h1>
             <p className="text-2xl text-[#4D96FF] mb-12 font-semibold">Has completado todas las pruebas.</p>
             <p className="text-lg text-[#FF9E80] mb-8 font-semibold">Eres un niño muy especial.</p>
             <div className="text-gray-400 text-sm mt-8 animate-pulse">Procesando resultados...</div>
           </div>
        )}
      </div>
    );
  };

  // SCENE 2: GLITCH
  const renderScene2 = () => (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-red-600 animate-pulse opacity-10"></div>
        <div className="noise-overlay"></div>
        <div className="z-10 text-center space-y-4 animate-glitch mix-blend-difference text-white">
           <AlertTriangle size={80} className="mx-auto text-red-500 mb-4" />
           <h1 className="text-6xl md:text-9xl font-['Share_Tech_Mono'] font-bold tracking-tighter">FATAL ERROR</h1>
           <p className="font-mono text-xl tracking-[0.5em] text-red-500">SIMULATION_CRASH</p>
        </div>
        
        {/* Story Text Sequence */}
        <div className="z-20 mt-12 w-full max-w-2xl px-8">
            {transitionLines.map((line, i) => (
                <div key={i} className="font-mono text-green-500 text-sm md:text-lg mb-2 animate-pulse bg-black/80 p-2 border-l-2 border-green-500">
                    &gt; {line}
                </div>
            ))}
        </div>
      </div>
  );

  // SCENE 3: RUINED ROOM (Brief intro to Act 2)
  const renderScene3 = () => (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center relative overflow-hidden font-['Special_Elite']">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cracked-concrete.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
        <div className="z-10 max-w-2xl p-8 text-center">
            <h2 className="text-4xl text-stone-500 mb-6 tracking-widest uppercase border-b border-stone-800 pb-4">Protocolo de Extracción</h2>
            <div className="space-y-6 text-stone-400 text-lg leading-relaxed">
               <p>"La infancia ha sido archivada. Bienvenido a la realidad."</p>
               <div className="bg-black/50 p-6 border-l-2 border-red-900 text-left font-mono text-xs text-red-400">
                  &gt; SUBJECT: GIFTED_CHILD_007<br/>
                  &gt; STATUS: AWAKE<br/>
                  &gt; REMAINING_TIME: {formatTime(remainingTime)}<br/>
                  &gt; MENTAL_STABILITY: DEGRADING
               </div>
            </div>
            <div className="mt-12">
               <Button variant="industrial" onClick={() => setGameState(prev => ({ ...prev, stage: 'ACT_2_P15' }))}>INICIAR DESENCRIPTACIÓN</Button>
            </div>
        </div>
      </div>
  );

  // ACT 2: SYSTEM PUZZLES (P15 - P20) - P21 & P22 & P23 Moved to Lock
  const renderSceneSystem = () => {
    let puzzle;
    let nextStage: GameStage;
    
    // Mapping Act 2 System Puzzles (Renumbered)
    switch (gameState.stage) {
        case 'ACT_2_P15': puzzle = ACT_2_PUZZLES.P15; nextStage = 'ACT_2_P16'; break;
        case 'ACT_2_P16': puzzle = ACT_2_PUZZLES.P16; nextStage = 'ACT_2_P17'; break;
        case 'ACT_2_P17': puzzle = ACT_2_PUZZLES.P17; nextStage = 'ACT_2_P18'; break;
        case 'ACT_2_P18': puzzle = ACT_2_PUZZLES.P18; nextStage = 'ACT_2_P19'; break; // To Map
        case 'ACT_2_P20': puzzle = ACT_2_PUZZLES.P20; nextStage = 'ACT_2_P22'; break; // To Lock 2 (P21 Removed)
        default: return null;
    }

    return (
      <div className={`min-h-screen bg-black text-green-500 font-['Share_Tech_Mono'] flex flex-col items-center justify-center relative p-6 ${showPenalty ? 'animate-glitch' : ''}`}>
        <div className="crt-overlay absolute inset-0 z-50"></div>
        <div className="scanline"></div>
        <div className="w-full max-w-3xl border border-green-900 bg-black/90 p-1 relative shadow-[0_0_50px_rgba(0,50,0,0.5)]">
           <div className="flex justify-between items-center bg-green-900/20 p-2 mb-8 border-b border-green-800">
              <div className="flex items-center gap-2 text-xs"><Radio size={14} className="animate-pulse" /> ROOT_ACCESS // LEVEL 7</div>
              <div className="text-xs text-green-700">ENCRYPTION_LAYER: {gameState.stage}</div>
           </div>
           <div className="px-4 pb-8">
              <div className="mb-8 text-xl md:text-2xl leading-relaxed text-green-400 uppercase tracking-wide">{puzzle.question}</div>
              <div className="space-y-6">
                {puzzle.type === 'choice' && (
                  <div className="grid grid-cols-1 gap-4">
                    {puzzle.options?.map(opt => (
                      <button key={opt} onClick={() => setInputValue(opt)} className={`p-4 border border-green-800 text-left hover:bg-green-500 hover:text-black transition-all uppercase font-bold tracking-wider ${inputValue === opt ? 'bg-green-500 text-black border-green-400' : ''}`}>&gt; {opt}</button>
                    ))}
                  </div>
                )}
                {puzzle.type === 'text' && (
                  <div className="flex items-center border-b-2 border-green-800 focus-within:border-green-400 transition-colors">
                    <span className="text-green-600 mr-4 text-2xl">&gt;&gt;</span>
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-transparent p-4 text-green-400 outline-none font-mono text-xl uppercase placeholder:text-green-900" placeholder="INPUT_DATA" autoComplete="off" />
                  </div>
                )}
                <div className="flex justify-end pt-8">
                   <Button variant="system" onClick={() => checkAnswer(puzzle.correctAnswer, nextStage)} disabled={!inputValue}>EXECUTE_COMMAND</Button>
                </div>
                 
                 {/* ACT 2 HINT SYSTEM */}
                 <div className="mt-6 border-t border-green-900/50 pt-4 space-y-2">
                    {hintLevel > 0 && (
                        <div className="text-xs font-mono text-green-600 bg-green-900/10 p-2 border-l-2 border-green-600">
                            &gt; DATA_FRAGMENT_1: {puzzle.hints[0]}
                        </div>
                    )}
                    {hintLevel > 1 && (
                        <div className="text-xs font-mono text-green-500 bg-green-900/20 p-2 border-l-2 border-green-500">
                            &gt; DATA_FRAGMENT_2: {puzzle.hints[1]}
                        </div>
                    )}
                    {hintLevel > 2 && (
                        <div className="text-xs font-mono text-green-400 bg-green-900/30 p-2 border-l-2 border-green-400 font-bold">
                            &gt; DECRYPTED_KEY: {puzzle.hints[2]}
                        </div>
                    )}

                    {hintLevel < 3 && (
                        <button onClick={revealHint} className="w-full mt-2 text-green-800 text-xs text-left hover:text-green-500 hover:bg-green-900/10 p-2 transition-colors flex justify-between">
                            <span>&gt; REQUEST_HINT_PACKET...</span>
                            <span className="text-red-800">COST: 15s</span>
                        </button>
                    )}
                 </div>

              </div>
           </div>
        </div>
      </div>
    );
  };

  // SCENE: MAP PUZZLE (P19 - formerly P12)
  const renderSceneMap = () => {
    const puzzle = ACT_2_PUZZLES.P19;
    
    // Fictional cities data for the map
    const cities = [
        { name: 'NEO-VOSTOK', x: '80%', y: '30%', status: 'SILENT' },
        { name: 'SECTOR ZERO', x: '20%', y: '40%', status: 'OFFLINE' },
        { name: 'OBLIVION', x: '50%', y: '20%', status: 'ACTIVE_SIGNAL' }, // Correct one
        { name: 'EDEN-4', x: '60%', y: '70%', status: 'CORRUPTED' },
        { name: 'SANCTUM', x: '30%', y: '60%', status: 'EMPTY' },
    ];

    return (
        <div className={`min-h-screen bg-[#050505] text-red-500 font-['Share_Tech_Mono'] flex flex-col items-center justify-center relative p-4 overflow-hidden ${showPenalty ? 'bg-red-900/20' : ''}`}>
             <div className="crt-overlay absolute inset-0 z-50 pointer-events-none"></div>
             <div className="scanline pointer-events-none"></div>
             
             {/* Header */}
             <div className="z-10 w-full max-w-4xl mb-6 border-b border-red-900 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-xl tracking-[0.3em] flex items-center gap-2"><Globe size={20} className="animate-spin-slow"/> GLOBAL_TRACKING</h2>
                    <p className="text-xs text-red-800 mt-1">SATELLITE_UPLINK: UNSTABLE</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl">{puzzle.question}</p>
                </div>
             </div>

             {/* Map Container */}
             <div className="relative w-full max-w-4xl aspect-video bg-[#0a0a0a] border border-red-900 shadow-[0_0_30px_rgba(200,0,0,0.1)] overflow-hidden group">
                {/* SVG Map Background (Abstract) */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    <path d="M10,10 L90,90 M90,10 L10,90" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2,2"/>
                    <rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" strokeWidth="1"/>
                </svg>
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                {/* Cities Points */}
                {cities.map((city) => (
                    <div 
                        key={city.name}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-150 group/point"
                        style={{ left: city.x, top: city.y }}
                        onMouseEnter={() => setHoveredCity(city.name)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onClick={() => {
                            setInputValue(city.name);
                            checkAnswer(puzzle.correctAnswer, 'ACT_2_P20', city.name);
                        }}
                    >
                        <div className={`w-3 h-3 rounded-full ${city.status === 'ACTIVE_SIGNAL' ? 'bg-red-500 animate-ping' : 'bg-red-900'}`}></div>
                        <div className="w-3 h-3 rounded-full bg-red-600 absolute top-0 left-0"></div>
                        
                        {/* Tooltip */}
                        <div className="absolute top-4 left-4 bg-black border border-red-500 p-2 min-w-[150px] hidden group-hover/point:block z-20">
                            <p className="text-white text-xs font-bold">{city.name}</p>
                            <p className="text-red-400 text-[10px] tracking-widest">{city.status}</p>
                            <p className="text-gray-500 text-[8px] font-mono mt-1">LAT: {Math.random().toFixed(4)}</p>
                        </div>
                    </div>
                ))}

                {/* Radar Sweep Effect */}
                <div className="absolute inset-0 border-r border-red-500/30 w-full h-full animate-[scanline_4s_linear_infinite] pointer-events-none bg-gradient-to-l from-red-900/10 to-transparent w-[50%]"></div>
             </div>

             {/* Footer with Hint Logic */}
             <div className="w-full max-w-4xl mt-4 flex flex-col md:flex-row justify-between items-start font-mono text-xs text-red-700 gap-4">
                <div className="flex-1">
                    <div>TARGET_LOCK: {hoveredCity || 'SEARCHING...'}</div>
                    <div className="mt-2 text-red-500/50">
                        {hintLevel > 0 && <div>&gt; SAT_IMG: {puzzle.hints[0]}</div>}
                        {hintLevel > 1 && <div>&gt; THERMAL: {puzzle.hints[1]}</div>}
                        {hintLevel > 2 && <div>&gt; COORDS: {puzzle.hints[2]}</div>}
                    </div>
                </div>
                
                {hintLevel < 3 && (
                    <button onClick={revealHint} className="bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900 px-4 py-2 uppercase transition-colors">
                        Enhance Imagery (-15s)
                    </button>
                )}
             </div>
        </div>
    );
  };

  // SCENE: LOCK PUZZLE (P22) - Now only P22
  const renderSceneLock = () => {
    const puzzle = ACT_2_PUZZLES.P22;
    
    const updateLock = (index: number, direction: 'up' | 'down') => {
        let chars = '0123456789';
        setLockValues(prev => {
            const newVal = [...prev];
            const currentIdx = chars.indexOf(prev[index]);
            let nextIdx;
            if (direction === 'up') nextIdx = (currentIdx + 1) % chars.length;
            else nextIdx = (currentIdx - 1 + chars.length) % chars.length;
            newVal[index] = chars[nextIdx];
            return newVal;
        });
    };

    const submitLock = () => {
        const code = lockValues.join('-');
        // Moves to CORE ROOM
        checkAnswer(puzzle.correctAnswer, 'ACT_2_P23', code);
    };

    return (
      <div className={`min-h-screen bg-[#111] text-gray-200 font-['Share_Tech_Mono'] flex flex-col items-center justify-center relative p-6 ${showPenalty ? 'bg-red-900/10' : ''}`}>
         <div className="noise-overlay opacity-30"></div>
         
         <div className="z-10 w-full max-w-2xl bg-[#1a1a1a] border-2 border-stone-600 p-8 shadow-2xl relative">
            <div className="text-center mb-8 border-b border-stone-700 pb-4">
               <h2 className="text-xl tracking-[0.2em] text-red-500 mb-2 flex justify-center gap-2 items-center"><Lock size={18} /> SECURITY_LEVEL_CRITICAL</h2>
               <p className="text-xs text-stone-500">{puzzle.question}</p>
            </div>

            <div className="flex justify-center gap-4 mb-10">
                {lockValues.map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <button onClick={() => updateLock(i, 'up')} className="text-stone-500 hover:text-white transition-colors"><ChevronUp /></button>
                        <div className="w-12 h-20 md:w-16 md:h-24 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 border-x-4 border-black flex items-center justify-center text-3xl md:text-4xl font-bold shadow-inner font-mono text-white relative overflow-hidden">
                             <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                             {val}
                        </div>
                        <button onClick={() => updateLock(i, 'down')} className="text-stone-500 hover:text-white transition-colors"><ChevronDown /></button>
                    </div>
                ))}
            </div>

            <Button variant="industrial" onClick={submitLock} className="w-full py-4 text-xl mb-4">
                UNLOCK_GATE
            </Button>
            
            <div className="border-t border-stone-800 pt-4">
                 {hintLevel > 0 && <p className="text-xs text-stone-500 font-mono text-center mb-1">UNLOCKED_INTEL_1: {puzzle.hints[0]}</p>}
                 {hintLevel > 1 && <p className="text-xs text-stone-400 font-mono text-center mb-1">UNLOCKED_INTEL_2: {puzzle.hints[1]}</p>}
                 {hintLevel > 2 && <p className="text-xs text-stone-300 font-mono text-center mb-1 font-bold">MASTER_KEY: {puzzle.hints[2]}</p>}
                 
                 {hintLevel < 3 && (
                     <button onClick={revealHint} className="w-full text-center text-[10px] text-stone-600 hover:text-red-500 uppercase tracking-widest mt-2">
                         Brute Force Hint Protocol (-15s)
                     </button>
                 )}
            </div>
         </div>
      </div>
    );
  };

  // NEW SCENE: CORE ROOM (P23 - Replaces Lock with History Puzzle)
  const renderSceneCore = () => {
     const puzzle = ACT_2_PUZZLES.P23;
     
     // Data structure for the puzzle
     const historyOptions = [
         // COLUMN 1: TARGET "15" (Napoleon Birth)
         {
             title: "VEC. ORIGEN (DÍA)",
             events: [
                 { name: "Toma de la Bastilla (Francia)", date: "14" },
                 { name: "Nacimiento de Napoleón (Córcega)", date: "15" }, // Correct
                 { name: "Inicio I Guerra Mundial (Austria)", date: "28" },
                 { name: "Tratado de Roma (Italia)", date: "25" }
             ]
         },
         // COLUMN 2: TARGET "08" (Wall Construction Month)
         {
             title: "VEC. CONST. (MES)",
             events: [
                 { name: "Desembarco de Normandía", date: "06" },
                 { name: "Revolución de Octubre (Rusia)", date: "10" },
                 { name: "Construcción Muro Berlín", date: "08" }, // Correct
                 { name: "Armisticio I Guerra Mundial", date: "11" }
             ]
         },
         // COLUMN 3: TARGET "9" (Wall Fall Day)
         {
             title: "VEC. CAÍDA (DÍA)",
             events: [
                 { name: "Atentado de Sarajevo", date: "28" },
                 { name: "Caída del Muro de Berlín", date: "9" }, // Correct
                 { name: "Día D (Día)", date: "6" },
                 { name: "Coronación Carlomagno", date: "25" }
             ]
         }
     ];

     // Helper to convert selection indices to the 5-digit code
     const getCodeFromSelection = () => {
         const col1Val = historyOptions[0].events[historySelection[0]].date; // e.g. "15"
         const col2Val = historyOptions[1].events[historySelection[1]].date; // e.g. "08"
         const col3Val = historyOptions[2].events[historySelection[2]].date; // e.g. "9"
         
         // Split into chars: "1", "5", "0", "8", "9"
         return (col1Val + col2Val + col3Val).split('');
     };

     const currentCode = getCodeFromSelection();

     const cycleOption = (colIndex: number) => {
         if (gameState.hasAudio) Audio.playClickSound();
         setHistorySelection(prev => {
             const newSel = [...prev];
             const count = historyOptions[colIndex].events.length;
             newSel[colIndex] = (newSel[colIndex] + 1) % count;
             return newSel;
         });
     };

     return (
       <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden font-['Share_Tech_Mono']">
         {/* -- CEILING: Data Cables -- */}
         <div className="h-1/5 w-full relative overflow-hidden bg-[#111] border-b-4 border-gray-900 shadow-2xl z-20 flex items-center justify-center">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 49px, #333 50px)' }}></div>
             <div className="text-center z-10">
                 <h2 className="text-red-500 text-xl md:text-2xl tracking-widest uppercase mb-1 animate-glitch"><History className="inline mb-1 mr-2"/>SINCRONIZACIÓN HISTÓRICA</h2>
                 <p className="text-xs text-red-800 font-mono">ALINEAR LINEAS TEMPORALES EUROPEAS</p>
             </div>
         </div>

         {/* -- MIDDLE: The Interface -- */}
         <div className="flex-1 flex flex-col md:flex-row relative bg-[#080808] z-10 px-4 py-8 gap-4 items-center justify-center">
             
             {/* LEFT SIDE: SELECTION PANELS */}
             <div className="flex-1 w-full max-w-3xl flex flex-col md:flex-row gap-4 justify-center">
                 {historyOptions.map((column, colIdx) => (
                     <div key={colIdx} className="flex-1 border border-gray-800 bg-gray-900/50 p-2 rounded flex flex-col">
                         <div className="text-xs text-center text-gray-500 border-b border-gray-800 pb-2 mb-2 uppercase">{column.title}</div>
                         <div className="flex-1 flex flex-col gap-2">
                             {column.events.map((evt, evtIdx) => (
                                 <button 
                                    key={evtIdx}
                                    onClick={() => {
                                        if (gameState.hasAudio) Audio.playClickSound();
                                        setHistorySelection(prev => {
                                            const newSel = [...prev];
                                            newSel[colIdx] = evtIdx;
                                            return newSel;
                                        });
                                    }}
                                    className={`p-3 text-xs md:text-sm text-left border transition-all ${
                                        historySelection[colIdx] === evtIdx 
                                        ? 'bg-red-900/40 border-red-500 text-white shadow-[0_0_15px_rgba(200,0,0,0.3)]' 
                                        : 'bg-black border-gray-800 text-gray-600 hover:border-gray-600'
                                    }`}
                                 >
                                     {evt.name}
                                 </button>
                             ))}
                         </div>
                     </div>
                 ))}
             </div>

             {/* RIGHT SIDE (or Bottom): THE CORE ROLLERS VISUALIZATION */}
             <div className="w-full md:w-auto flex md:flex-col gap-2 justify-center items-center mt-4 md:mt-0 md:ml-8 bg-black/50 p-4 border border-red-900/30 rounded-xl">
                 <div className="text-xs text-red-800 mb-2 md:hidden w-full text-center">CORE PREVIEW</div>
                 <div className="flex gap-2">
                    {currentCode.map((digit, i) => (
                        <div key={i} className="w-12 h-20 bg-gradient-to-b from-gray-900 to-black border border-red-900/50 flex items-center justify-center text-4xl text-red-500 font-bold shadow-inner">
                            {digit}
                        </div>
                    ))}
                 </div>
             </div>
         </div>

         {/* -- FLOOR: Control Panel -- */}
         <div className="h-1/4 bg-[#111] relative border-t-4 border-red-900/30 flex flex-col items-center justify-center p-6 z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
             <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,0,0,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
             
             <Button variant="industrial" onClick={() => checkAnswer(puzzle.correctAnswer, 'HAPPY_ENDING', currentCode.join('-'))} className="text-xl md:text-2xl px-12 py-6 border-red-600 text-red-500 hover:bg-red-900/20 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
                <Server className="mr-4" /> INITIATE_RESTORE
             </Button>

             {/* Hint Module */}
             <div className="mt-4 text-center">
                 {hintLevel > 0 && <span className="text-red-800 text-xs font-mono mr-4 block md:inline">[LOG: {puzzle.hints[0]}]</span>}
                 {hintLevel > 1 && <span className="text-red-700 text-xs font-mono mr-4 block md:inline">[LOG: {puzzle.hints[1]}]</span>}
                 {hintLevel > 2 && <span className="text-red-500 text-xs font-mono font-bold block md:inline">[LOG: {puzzle.hints[2]}]</span>}
                 
                 {hintLevel < 3 && (
                     <button onClick={revealHint} className="text-[10px] text-gray-600 hover:text-white uppercase tracking-widest mt-2 block mx-auto">
                         Access Historical Archives (-15s)
                     </button>
                 )}
             </div>
         </div>
       </div>
     );
  };

  // SCENE 6: FINALE (Choice or Normalcy)
  const renderFinale = () => {
    // SPECIAL HAPPY ENDING (Restoration)
    if (gameState.stage === 'HAPPY_ENDING') {
        return (
          <div className="min-h-screen bg-[#000] flex flex-col items-center justify-center p-4 font-['Share_Tech_Mono'] text-white overflow-hidden relative animate-fade-in">
             
             {/* Background Effects */}
             <div className="absolute inset-0 bg-red-900/20 animate-pulse"></div>
             <div className="noise-overlay opacity-50"></div>

             <div className="text-center z-10 max-w-2xl bg-black/90 backdrop-blur-sm p-12 border-2 border-red-900/50 shadow-[0_0_50px_rgba(255,0,0,0.3)]">
                <div className="mb-6 flex justify-center">
                    <AlertTriangle className="animate-pulse text-red-500" size={64} />
                </div>
                {/* DYSTOPIAN UTOPIA THEME */}
                <h1 className="text-4xl font-bold text-red-500 mb-6 uppercase tracking-widest">INEVITABILIDAD CONFIRMADA</h1>
                <p className="text-xl text-red-400 mb-6 font-semibold">"El código fuente no puede ser reescrito."</p>
                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                    Has alineado la historia. Has introducido la fecha. Pero no entendiste el propósito del sistema. 
                    <br/><br/>
                    <span className="font-bold text-red-500">No era una herramienta de reparación. Era una caja negra.</span>
                </p>
                <Button variant="industrial" className="text-xl px-12 py-6 border-red-500 hover:bg-red-900/50" onClick={() => setGameState(prev => ({...prev, stage: 'CINEMA_ENDING'}))}>
                    <Power className="mr-2" /> ACEPTAR EL FINAL
                </Button>
             </div>
          </div>
        );
    }

    const isEnding = gameState.stage.startsWith('ENDING');
    return (
      <div className="min-h-screen bg-black text-white font-['Inter'] flex flex-col items-center justify-center p-12 text-center">
        {!isEnding ? (
           <div className="max-w-xl animate-fade-in-up">
             <div className="mb-16 border-b border-white pb-8">
               <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase">Instalación 7</h1>
               <p className="text-gray-500 font-light text-sm tracking-widest uppercase">Punto de Decisión Final</p>
             </div>
             <p className="text-gray-300 text-lg mb-12 font-light leading-relaxed">
               Has descifrado todo el sistema. El niño fue "archivado" porque demostraste una inteligencia superior a la humana.
               <br/><br/>
               <span className="text-white">Tienes dos opciones. Ninguna es correcta.</span>
             </p>
             <div className="flex flex-col md:flex-row gap-6 justify-center">
               <Button variant="minimal" onClick={() => setGameState(prev => ({ ...prev, stage: 'ENDING_1', endTime: Date.now() }))} className="flex-1 py-6"><div className="flex flex-col items-center gap-4"><Eye strokeWidth={1} size={32} /><span>Entrar al Archivo</span></div></Button>
               <Button variant="minimal" onClick={() => setGameState(prev => ({ ...prev, stage: 'ENDING_2', endTime: Date.now() }))} className="flex-1 py-6"><div className="flex flex-col items-center gap-4"><Power strokeWidth={1} size={32} /><span>Apagar Sistema</span></div></Button>
             </div>
           </div>
        ) : (
          <div className="max-w-xl animate-fade-in text-left">
             <h1 className="text-6xl font-black mb-8 text-gray-100">{gameState.stage === 'ENDING_1' ? "BÚSQUEDA" : "SILENCIO"}</h1>
             <p className="text-gray-400 font-light text-xl leading-relaxed mb-8">
               {gameState.stage === 'ENDING_1' 
                 ? "Te adentraste en el código fuente. Escuchas su risa en bucles infinitos. Nunca lo encuentras, pero te niegas a salir. Ahora tú eres parte del glitch." 
                 : "Desconectaste el servidor. La pantalla se fue a negro. Salvaste a los futuros niños, pero borraste al tuyo para siempre. El silencio es absoluto."}
             </p>
             <p className="text-sm font-mono text-gray-600 border-t border-gray-800 pt-4 mt-8">
                ESTADÍSTICAS FINALES:<br/>
                TIEMPO RESTANTE: {formatTime(remainingTime)}<br/>
                ERRORES COMETIDOS: {gameState.mistakes}
             </p>
             <Button variant="minimal" onClick={handleResetGame} className="mt-8">REINICIAR EXPERIENCIA</Button>
             <div className="mt-12 text-center">
                 <ExitButton />
             </div>
          </div>
        )}
      </div>
    );
  };

  // --- MAIN RENDER SWITCH ---
  
  if (gameState.stage === 'TRANSITION') {
    return (
        <div className="bg-black min-h-screen">
             <TimerDisplay />
             {renderScene2()}
        </div>
    );
  }

  return (
    <>
        <TimerDisplay />
        <AudioToggle />
        <ExitButton />
        {gameState.stage === 'INTRO' && renderTheaterIntro()}
        {gameState.stage === 'CINEMA_ENDING' && renderCinemaEnding()}
        {gameState.stage.startsWith('ACT_1') && renderScene1()}
        {gameState.stage === 'ACT_2_INTRO' && renderScene3()}
        {(gameState.stage.startsWith('ACT_2_P') && gameState.stage !== 'ACT_2_P19' && gameState.stage !== 'ACT_2_P22' && gameState.stage !== 'ACT_2_P23') && renderSceneSystem()}
        {gameState.stage === 'ACT_2_P19' && renderSceneMap()}
        {gameState.stage === 'ACT_2_P22' && renderSceneLock()}
        {gameState.stage === 'ACT_2_P23' && renderSceneCore()}
        {(gameState.stage === 'FINALE_CHOICE' || gameState.stage.startsWith('ENDING') || gameState.stage === 'HAPPY_ENDING') && renderFinale()}
    </>
  );
};

export default EscapeRoom1;