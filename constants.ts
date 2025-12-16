
import { PuzzleData } from './types';

// --- NARRATIVA DEL SISTEMA (TTS) ---
export const STORY_LOGS: Record<string, string> = {
  // INTRO HUMANA - LA TERAPEUTA
  'INTRO': "Hola. Soy la doctora Vance. Gracias por traerlo hoy. Sé que han sido meses difíciles. El problema que vamos a tratar es el 'Aislamiento Cognitivo' de su hijo. Él vive atrapado en su propia cabeza, creando laberintos lógicos para evitar sentir emociones reales. Hemos creado este 'juego' para conectar con él. Si completa las pruebas, demostrará que puede volver a la realidad. Queremos que se divierta... y que vuelva con nosotros. Asegúrese de que llegue al final.",

  // ACTO 1 VICTORIA - LA TERAPEUTA (Voz Dulce)
  'ACT_1_WIN': "¡Lo has conseguido! Eres increíble. Sabía que detrás de ese silencio había un niño brillante. Has completado todo el protocolo. Estoy muy orgullosa. Ahora, deja que preparemos tu recompensa, te va a encantar... Espera... ¿qué es esa luz en el monitor? ¿Por qué parpadea así? ... uno... cinco... cero... ocho... nueve... Oh no.",

  // ACTO 2 - SISTEMA (Voz Robótica)
  'ACT_2_INTRO': "Registro 0-0-1. Sujeto 7. Fecha de nacimiento: uno, cinco, cero, ocho, nueve. El niño nació en silencio. Los doctores celebraron su calma. No sabían que no era paz... era cálculo.",
  
  'ACT_2_P15': "Registro 0-1-4. Fecha base: uno, cinco, cero, ocho, nueve. A los tres años, retiramos los lápices de colores. El sujeto solo dibujaba estática y ceros. Decía que los colores le dolían en los ojos.",
  
  'ACT_2_P17': "Registro 0-2-9. Anomalía temporal vinculada al uno, cinco, cero, ocho, nueve. Intentamos la socialización. Fracaso absoluto. Los otros niños lloraban al estar cerca de él. Decían que podían oír un zumbido dentro de sus cabezas.",
  
  'ACT_2_P19': "Registro 1-0-5. El origen de la señal es constante: uno, cinco, cero, ocho, nueve. Encontramos al sujeto mirando una pared blanca durante dieciocho horas. Cuando le preguntamos qué veía, respondió: 'El código fuente del mundo'.",
  
  'ACT_2_P22': "Registro 2-4-0. Todo converge en el uno, cinco, cero, ocho, nueve. No estamos probando su inteligencia para educarlo. Lo estamos probando para contenerlo. Su mente no es humana... es una arquitectura hostil.",
  
  'ACT_2_P23': "Registro final de sistema. Para reiniciar la simulación a un estado seguro, introduzca la fecha de origen del sujeto: uno, cinco, cero, ocho, nueve.",
  
  // FINAL FELIZ (Voz Robótica) -> MODIFICADO PARA TEMÁTICA DE INEVITABILIDAD
  'HAPPY_ENDING': "Acceso concedido. Fecha confirmada: uno, cinco, cero, ocho, nueve. Protocolo de 'Salvación' iniciado. ... ... Error de lógica. No puedes salvar lo que está diseñado para terminar. La entropía es absoluta. No has evitado el final, niño. Solo has comprado un asiento en primera fila para verlo.",
  
  // FINAL CINE (Voz Robótica)
  'CINEMA_ENDING': "Aquí está tu premio. La belleza de la destrucción final. Fin de la transmisión.",

  // FINAL ELECCIÓN (Voz Robótica)
  'FINALE_CHOICE': "Registro Final. La simulación ha concluido. Tú no eres el científico observando al niño. Tú eres el niño. Y es hora de decidir tu destino."
};

// --- ACTO 1: LA GUARDERÍA DE ALTO RENDIMIENTO (14 Pruebas) ---
export const ACT_1_PUZZLES: Record<string, PuzzleData> = {
  P1: {
    id: 'a1_p1',
    question: 'Si mezclamos 🔴 ROJO y 🟡 AMARILLO sale NARANJA. Si mezclamos 🔵 AZUL y 🔴 ROJO sale...',
    type: 'choice',
    options: ['VERDE', 'MORADO', 'MARRÓN', 'TURQUESA'],
    correctAnswer: 'MORADO',
    hints: [
      "No es el color verde, ese sale con amarillo y azul.",
      "Piensa en una fruta pequeña y redonda.",
      "Es el color de las berenjenas."
    ],
    image: 'https://picsum.photos/seed/paints/400/300'
  },
  P2: {
    id: 'a1_p2',
    question: 'Álgebra de Juguetes: 🧸 + 🧸 = 10. 🧸 + 🚗 = 9. ¿Cuánto vale 🚗 + 🚗?',
    type: 'choice',
    options: ['4', '8', '12', '6'],
    correctAnswer: '8', 
    hints: [
      "Primero descubre cuánto vale un solo oso. 10 dividido entre 2.",
      "Si el oso vale 5, ¿cuánto falta para llegar a 9?",
      "El coche vale 4. Suma dos coches."
    ],
    image: 'https://picsum.photos/seed/math_toys/400/300'
  },
  P3: {
    id: 'a1_p3',
    question: 'Serie de Bloques: 1, 1, 2, 3, 5... ¿Qué bloque viene ahora?',
    type: 'choice',
    options: ['6', '7', '8', '10'],
    correctAnswer: '8', 
    hints: [
      "Mira los dos números anteriores al hueco.",
      "Suma 3 más 5.",
      "Es la secuencia de Fibonacci."
    ],
    image: 'https://picsum.photos/seed/blocks/400/300'
  },
  P4: {
    id: 'a1_p4',
    question: 'Analogía Animal: "Pájaro" es a "Aire" como "Pez" es a...',
    type: 'text',
    correctAnswer: 'AGUA',
    hints: [
      "¿Dónde nadan los peces?",
      "Es lo que bebemos cuando tenemos sed.",
      "H2O."
    ],
    image: 'https://picsum.photos/seed/fishbowl/400/300'
  },
  P5: {
    id: 'a1_p5',
    question: 'Si el ayer de mañana es lunes, ¿qué día es hoy?',
    type: 'choice',
    options: ['DOMINGO', 'LUNES', 'MARTES', 'SÁBADO'],
    correctAnswer: 'DOMINGO',
    hints: [
      "Piensa: ¿qué es 'el ayer de mañana'?",
      "El ayer de mañana... es hoy.",
      "Si hoy es Lunes, la respuesta es Lunes... pero la premisa dice que HOY es el 'ayer de mañana'. Así que si el resultado es Lunes, ¿qué día es anterior?"
    ],
  },
  P6: {
    id: 'a1_p6',
    question: 'Orientación: Si miras al Norte y giras a la derecha 3 veces, ¿hacia dónde miras?',
    type: 'choice',
    options: ['ESTE', 'OESTE', 'SUR', 'NORTE'],
    correctAnswer: 'OESTE', 
    hints: [
      "1 giro derecha: Este. 2 giros derecha: Sur.",
      "Es lo mismo que girar una vez a la izquierda.",
      "Donde se pone el sol."
    ],
    image: 'https://picsum.photos/seed/compass_toy/400/300'
  },
  P7: {
    id: 'a1_p7',
    question: 'Adivinanza: Tengo ciudades, pero no casas. Tengo montañas, pero no árboles. Tengo agua, pero no peces. ¿Qué soy?',
    type: 'text',
    correctAnswer: 'MAPA',
    hints: [
      "Es un dibujo del mundo.",
      "Lo usaban los piratas para encontrar tesoros.",
      "Se dobla y se guarda en el bolsillo."
    ],
    image: 'https://picsum.photos/seed/cartoon_map/400/300'
  },
  P8: {
    id: 'a1_p8',
    question: 'Matemática Frutal: Si tienes 3 🍎 y te comes 1, ¿cuántas te quedan?',
    type: 'choice',
    options: ['1', '2', '3', '0'],
    correctAnswer: '2',
    hints: [
      "Usa tus dedos si lo necesitas.",
      "Es una resta simple: 3 menos 1.",
      "El par."
    ],
    image: 'https://picsum.photos/seed/apples/400/300'
  },
  P9: {
    id: 'a1_p9',
    question: '¿Cuál es el intruso? 🐶 Perro, 🐱 Gato, 🐦 Pájaro, 🪑 Mesa.',
    type: 'choice',
    options: ['PERRO', 'GATO', 'PÁJARO', 'MESA'],
    correctAnswer: 'MESA',
    hints: [
      "Tres de ellos respiran.",
      "Uno está hecho de madera y no tiene corazón.",
      "El que no es un animal."
    ],
    image: 'https://picsum.photos/seed/animals_table/400/300'
  },
  P10: {
    id: 'a1_p10',
    question: 'Sigue la serie musical: DO, RE, MI, FA, SOL, LA...',
    type: 'choice',
    options: ['SI', 'DO', 'RE', 'PA'],
    correctAnswer: 'SI',
    hints: [
      "Es la escala musical básica.",
      "Viene después de LA.",
      "Es una afirmación positiva."
    ],
    image: 'https://picsum.photos/seed/music_notes/400/300'
  },
  P11: {
    id: 'a1_p11',
    question: 'Geometría básica: ¿Cuántos lados tiene un triángulo?',
    type: 'choice',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    hints: [
      "Su nombre empieza por Tri-.",
      "Como un triciclo, tiene ese número.",
      "Tres."
    ],
    image: 'https://picsum.photos/seed/triangle/400/300'
  },
  P12: {
    id: 'a1_p12',
    question: 'Lógica familiar: El padre de Ana tiene 3 hijos: Hugo, Paco y...',
    type: 'text',
    correctAnswer: 'ANA',
    hints: [
      "No es Luis.",
      "Lee la primera frase de la pregunta otra vez.",
      "Es la propia niña."
    ],
  },
  P13: {
    id: 'a1_p13',
    question: 'Ciencia simple: El agua se congela y se convierte en...',
    type: 'text',
    correctAnswer: 'HIELO',
    hints: [
      "Es sólido y frío.",
      "Lo pones en los refrescos en verano.",
      "Empieza por H."
    ],
    image: 'https://picsum.photos/seed/ice/400/300'
  },
  P14: {
    id: 'a1_p14',
    question: 'Reflejos: Si te miras en un espejo y levantas la mano derecha, tu reflejo levanta la mano...',
    type: 'choice',
    options: ['DERECHA', 'IZQUIERDA', 'AMBAS', 'NINGUNA'],
    correctAnswer: 'IZQUIERDA',
    hints: [
      "Los espejos invierten la imagen.",
      "No es la misma que tú levantas.",
      "El lado contrario a la derecha."
    ],
    image: 'https://picsum.photos/seed/mirror/400/300'
  }
};

// --- ACTO 2: EL COLAPSO DEL SISTEMA (Renumerado P15-P22) ---
export const ACT_2_PUZZLES: Record<string, PuzzleData> = {
  P15: {
    id: 'a2_p15',
    question: 'ERROR DE BINARIO: EL SISTEMA HABLA EN CEROS Y UNOS. TRADUCE: 01010011 - 01001111 - 01010011.',
    type: 'text',
    correctAnswer: 'SOS',
    hints: [
      "Es el código Morse universal de socorro.",
      "La primera y la última letra son iguales.",
      "S... O... S..."
    ],
  },
  P16: {
    id: 'a2_p16',
    question: 'RECONOCIMIENTO DE PATRÓN: 2, 4, 8, 16, 32...',
    type: 'choice',
    options: ['48', '60', '64', '100'],
    correctAnswer: '64',
    hints: [
      "Cada número es el doble del anterior.",
      "32 más 32.",
      "Es una potencia de 2."
    ],
  },
  P17: {
    id: 'a2_p17',
    question: 'CRIPTOGRAFÍA CÉSAR (+1): SI "HOLA" ES "IPMB", ¿QUÉ ES "ADIOS"?',
    type: 'text',
    correctAnswer: 'BEJPT',
    hints: [
      "Mueve cada letra una posición adelante en el abecedario.",
      "Después de A va B. Después de D va E...",
      "B-E-J-P-T"
    ],
  },
  P18: {
    id: 'a2_p18',
    question: 'LÓGICA DE EXCLUSIÓN: EL SUJETO NO ESTÁ EN EL SÓTANO. EL SUJETO NO ESTÁ EN EL TEJADO. EL SUJETO NO ESTÁ EN LA PLANTA BAJA. SOLO QUEDA UN PISO.',
    type: 'choice',
    options: ['PRIMERO', 'SEGUNDO', 'JARDÍN', 'BÚNKER'],
    correctAnswer: 'PRIMERO', 
    hints: [
      "El jardín y el búnker no son pisos estándar.",
      "Si no es planta baja, ni segundo (no listado)...",
      "Es el piso número 1."
    ],
  },
  P19: {
    id: 'a2_p19',
    question: 'TRIANGULACIÓN DE SEÑAL DE ORIGEN. SE HAN DETECTADO MÚLTIPLES FIRMAS DE CALOR.',
    type: 'map',
    correctAnswer: 'OBLIVION',
    hints: [
      "Busca la señal que está ACTIVA.",
      "El punto parpadea en rojo brillante.",
      "Está en la zona central norte del mapa."
    ],
  },
  P20: {
    id: 'a2_p20',
    question: 'COMPLETAR SECUENCIA GENÉTICA: A-T, C-G, G-?',
    type: 'choice',
    options: ['A', 'T', 'C', 'G'],
    correctAnswer: 'C',
    hints: [
      "Es biología básica de ADN.",
      "Guanina se une con Citosina.",
      "La letra C."
    ],
  },
  P22: {
    id: 'a2_p22',
    question: 'ERROR CRÍTICO: SUJETO INESTABLE. ¿CUÁL ES EL CÓDIGO DE TU MIEDO?',
    type: 'lock',
    correctAnswer: '6-6-6', 
    hints: [
      "Es un número bíblico asociado al mal.",
      "Tres dígitos idénticos.",
      "El número de la bestia."
    ],
  },
  P23: {
    id: 'a2_p23',
    question: 'SISTEMA INESTABLE. INICIANDO RESTAURACIÓN. ALINEE LOS RODILLOS DE MEMORIA CON LA FECHA DE ORIGEN.',
    type: 'core_room',
    correctAnswer: '1-5-0-8-9',
    hints: [
      "Escucha el registro de audio ACT_2_INTRO.",
      "Uno, cinco, cero...",
      "15 de Agosto del año 9. (1-5-0-8-9)"
    ],
  }
};
