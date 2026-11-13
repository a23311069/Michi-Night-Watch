# Michi Night Watch

Juego 2D en pixel art donde **Canela**, una gatita tricolor, defiende la ventana de un segundo piso durante una invasión de zombis. Sobrevive el mayor tiempo posible y consigue la mejor puntuación.

**Jugar en línea:** https://a23311069.github.io/Michi-Night-Watch/

## Cómo se juega

- **Mover el ratón:** Canela camina por la repisa hacia donde apuntes.
- **Clic izquierdo:** da un manotazo con la patita y derriba a los zombis que estén al alcance.
- **P o Esc:** pausa el juego.
- Si un zombi llega a la ventana, pierdes una vida. Tienes 3 vidas.
- Cada 15 segundos sube el nivel: aparecen más zombis y suben más rápido.
- Tu récord se guarda en el navegador.

## Características

- Pixel art hecho por código (sin imágenes externas).
- Audio dinámico con Web Audio API: los gemidos se hacen más fuertes y claros conforme los zombis se acercan.
- Música de fondo suave, con control de volumen y botón de silencio.
- Pausa manual y automática al cambiar de pestaña.
- Se adapta a distintos tamaños de pantalla.
- Sin frameworks ni dependencias.

## Estructura del proyecto

```
michi-night-watch/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── main.js      # entrada del usuario, bucle principal, pausa automática
    ├── game.js      # estado, dificultad, colisiones, puntuación y render
    ├── player.js    # Canela y su patita
    ├── zombie.js    # zombis
    ├── sprites.js   # sprites en pixel art
    ├── scene.js     # escenario (ventana, ciudad nocturna, habitación)
    ├── audio.js     # sonido dinámico y música
    ├── ui.js        # HUD, pantallas y controles de sonido
    └── config.js    # constantes y utilidades
```

## Tecnologías

HTML5, CSS3, JavaScript ES6+ (módulos), Canvas 2D, Web Audio API y LocalStorage.