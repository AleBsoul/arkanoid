const text = (ctx, x, y, string) => {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText(string, x, y);
  ctx.stroke();
};

const request = (url, body, callback) => {
  fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
    .then((result) => result.json())
    .then(callback)
    .catch(console.error);
};

const draw_hall_of_fame = () => {
  const listaChiavi = Object.keys(hall_of_fame);
  //cancella la vecchia hall_of_fame
  ctx_hall_of_fame.clearRect(0, 50, canvas_hall_of_fame.width, 310);
  for (let i = 0; i < listaChiavi.length; i++) {
    text(ctx_hall_of_fame, 10, 80 + 40 * i, listaChiavi[i]);
    text(ctx_hall_of_fame, 120, 80 + 40 * i, hall_of_fame[listaChiavi[i]]);
  }
};

const get_hall_of_fame = () => {
  body = {
    key: "hall_of_fame"
  };
  request(urlGet, body, (result) => {
    hall_of_fame = JSON.parse(result.result);
    draw_hall_of_fame();
  });
};

const salva_hall_of_fame = (hall) => {
  // dizionario in array
  const arrayDizionario = Object.entries(hall);
  // Ordina l'array(chiave-valore) in ordine decrescente in base al valore
  arrayDizionario.sort((a, b) => b[1] - a[1]);
  if (arrayDizionario.length > 5) {
    arrayDizionario.splice(5, 1);
  }
  // ricrea il dizionario
  hall_of_fame = Object.fromEntries(arrayDizionario);
  body = {
    key: "hall_of_fame",
    value: JSON.stringify(hall_of_fame)
  };
  request(urlSend, body, (result) => {});
};

const rect = (par_x, par_y, width, height) => {
  ctx_game.beginPath();
  ctx_game.fillRect(par_x, par_y, width, height); // Per il mattoncino
  ctx_game.strokeRect(par_x + 2, par_y + 2, width - 4, height - 4); // Per il mattoncino
};

const schema1 = () => {
  for (let i = 0; i < 6; i++) {
    x_matt = 0;
    ctx_game.fillStyle = colors[i];
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 3; k++) {
        x_matt += width_matt;
        listaMattoncini.push(x_matt + "," + y_matt + "," + colors[i]);
        rect(x_matt, y_matt, width_matt, height_matt);
      }
      x_matt += width_matt * 2;
    }
    y_matt += height_matt;
  }
};

const schema2 = () => {
  for (let i = 0; i < 6; i++) {
    x_matt = 0;
    ctx_game.fillStyle = colors[i];
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 3; k++) {
        x_matt += width_matt;
        listaMattoncini.push(x_matt + "," + y_matt + "," + colors[i]);
        rect(x_matt, y_matt, width_matt, height_matt);
      }
      x_matt += width_matt * 2;
    }
    y_matt += height_matt * 2;
  }
};

const schema3 = () => {
  for (let i = 0; i < 6; i++) {
    x_matt = 0;
    ctx_game.fillStyle = colors[i];
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 3; k++) {
        listaMattoncini.push(x_matt + "," + y_matt + "," + colors[i]);
        rect(x_matt, y_matt, width_matt, height_matt);
        x_matt += width_matt + width_matt * 0.8;
      }
    }
    y_matt += height_matt;
  }
};

const schema4 = () => {
  for (let i = 0; i < 6; i++) {
    x_matt = 0;
    ctx_game.fillStyle = colors[i];
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 3; k++) {
        listaMattoncini.push(x_matt + "," + y_matt + "," + colors[i]);
        rect(x_matt, y_matt, width_matt, height_matt);
        x_matt += width_matt + width_matt * 0.8;
      }
    }
    y_matt += height_matt * 2;
  }
};

const restart = () => {
  ctx_game.clearRect(0, 0, canvas_game.width, canvas_game.height);
  get_hall_of_fame();
  draw_hall_of_fame();
  matt_distrutti = 0;
  score = 0;
  contatore = 0;
  x_barra = 220;
  y_barra = 400;
  x_pallina = 250;
  x_matt = 0;
  y_matt = 45;
  y_pallina = y_barra - r * 4;
  listaMattoncini = [];
  controllo = false;
  alpha = -Math.PI / 4 + Math.random() * (-90 * (Math.PI / 180)); // Angonlo direzione
  old_x = x_pallina;
  rect(x_barra, y_barra, width_barra, height_barra);
  ctx_score.clearRect(0, 0, canvas_score.width, 100);
  text(ctx_score, 90, 40, "score");
  text(ctx_score, 120, 90, "0");
  ctx_game.fillStyle = "#000000";
  ctx_game.arc(x_pallina, y_pallina, r, 0, Math.PI * 2);
  ctx_game.fill();
  ctx_game.stroke();
  ctx_game.fillStyle = "#c3c5c4";
};

const ridisegna_mattoncini = () => {
  listaMattoncini.forEach((item) => {
    const array = item.split(",");
    ctx_game.fillStyle = array[2];
    x_matt = parseInt(array[0], 10);
    y_matt = parseInt(array[1], 10);
    rect(x_matt, y_matt, width_matt, height_matt);
  });
};

const render = () => {
  ctx_game.clearRect(
    x_pallina - r - 4,
    y_pallina - r - 4,
    r * 2 + 6,
    r * 2 + 6
  );
  ridisegna_mattoncini();
  ctx_game.beginPath();
  x_pallina += (vel + matt_distrutti / 12) * Math.cos(alpha);
  y_pallina += (vel + matt_distrutti / 12) * Math.sin(alpha);
  ctx_game.fillStyle = "#000000";
  ctx_game.arc(x_pallina, y_pallina, r, 0, Math.PI * 2);
  ctx_game.fill();
  ctx_game.stroke();
  ctx_game.beginPath();
  ctx_game.fillStyle = "#c3c5c4";
  // per non far andare la racchetta fuori dal canvas_game
  if (x_barra >= canvas_game.width - width_barra) {
    ctx_game.clearRect(
      canvas_game.width - width_barra,
      y_barra - 0.6,
      width_barra + 1,
      height_barra + 1.6
    );
  } else if (x_barra <= 0) {
    ctx_game.clearRect(0, y_barra - 0.6, width_barra + 1, height_barra + 1.6);
  } else {
    ctx_game.clearRect(
      x_barra - 0.6,
      y_barra - 0.6,
      width_barra + 1,
      height_barra + 1.6
    );
  }
  x_barra = mouseX;
  if (x_barra <= canvas_game.width - width_barra && x_barra >= 0) {
    ctx_game.clearRect(
      x_barra - 0.6,
      y_barra - 0.6,
      width_barra + 1,
      height_barra + 1.6
    );
    rect(x_barra, y_barra, width_barra, height_barra);
    ctx_game.stroke();
    // rimbalzo pallina sulla barra
    if (controllo === false) {
      if (
        x_pallina + r >= x_barra &&
        x_pallina - r <= x_barra + width_barra &&
        y_pallina + r >= y_barra &&
        y_pallina - r <= y_barra + height_barra
      ) {
        if (old_x + r >= x_barra && old_x - r <= x_barra + width_barra) {
          alpha = 2 * Math.PI - alpha;
          controllo = true;
          contatore = 0;
        } else {
          alpha = Math.PI - alpha;
          controllo = true;
          contatore = 0;
        }
      }
    }
  } else if (x_barra >= canvas_game.width - width_barra) {
    rect(canvas_game.width - width_barra, y_barra, width_barra, height_barra);
    ctx_game.stroke();
    // rimbalzo pallina sulla barra se il mouse si trova fuori dai margini del canvas_game
    if (controllo === false) {
      if (
        x_pallina + r >= canvas_game.width - width_barra &&
        x_pallina - r <= canvas_game.width &&
        y_pallina + r >= y_barra &&
        y_pallina - r <= y_barra + height_barra
      ) {
        if (
          old_x + r >= canvas_game.width - width_barra &&
          old_x - r <= canvas_game.width
        ) {
          alpha = 2 * Math.PI - alpha;
          controllo = true;
          contatore = 0;
        } else {
          alpha = Math.PI - alpha;
          controllo = true;
          contatore = 0;
        }
      }
    }
  } else {
    rect(0, y_barra, width_barra, height_barra);
    ctx_game.stroke();
    if (controllo === false) {
      if (
        x_pallina + r >= 0 &&
        x_pallina - r <= 0 + width_barra &&
        y_pallina + r >= y_barra &&
        y_pallina - r <= y_barra + height_barra
      ) {
        if (old_x + r >= 0 && old_x - r <= 0 + width_barra) {
          alpha = 2 * Math.PI - alpha;
          controllo = true;
          contatore = 0;
        } else {
          alpha = Math.PI - alpha;
          controllo = true;
          contatore = 0;
        }
      }
    }
  }
  //rimbalzo pallina sulle pareti
  if (x_pallina <= 0 || x_pallina >= 500) {
    alpha = Math.PI - alpha; //assi verticali cnavas
    controllo = false;
  }
  if (y_pallina <= 0) {
    alpha = 2 * Math.PI - alpha; //assi orizzontali canvas_game
    controllo = false;
  }
  if (y_pallina > canvas_game.height) {
    contatore = 0;
    gameOver();

    if (hall_of_fame[user.value] === undefined && score > 0) {
      hall_of_fame[user.value] = score;
    } else {
      if (score > hall_of_fame[user.value]) {
        hall_of_fame[user.value] = score;
      }
    }
    salva_hall_of_fame(hall_of_fame);
    clearInterval(interval);
    change.disabled = false;
    restart();
    draw_hall_of_fame();
    mouseY = 300; // per farlo uscire dalla condizione per riniziare il gioco
    schemi[nSchema]();
    inizio();
  }

  // Controllo per la disruzione del mattoncino
  for (let i = 0; i < listaMattoncini.length; i++) {
    let array = listaMattoncini[i].split(",");
    x_matt = parseInt(array[0], 10);
    y_matt = parseInt(array[1], 10);
    // rimbalzo pallina sul mattoncino
    if (
      x_pallina + r >= x_matt &&
      x_pallina - r <= x_matt + width_matt &&
      y_pallina + r >= y_matt &&
      y_pallina - r <= y_matt + height_matt
    ) {
      const index = listaMattoncini.indexOf(listaMattoncini[i]);
      listaMattoncini.splice(index, 1);
      ctx_game.clearRect(x_matt, y_matt, width_matt, height_matt);
      i = listaMattoncini.length;
      matt_distrutti += 1;
      contatore += 1; //numero di mattoncini distrutti di seguito senza mai toccare la raccetta
      score += contatore * contatore;
      if (contatore > 1) {
        combo_animation();
      }
      //cancello il vecchio punteggio e scrivo quello nuovo
      ctx_score.clearRect(50, 50, canvas_score.width, 100);
      text(ctx_score, 120, 90, score);
      if (matt_distrutti === 36) {
        victory();
        if (hall_of_fame[user.value] === undefined) {
          hall_of_fame[user.value] = score;
        } else {
          if (score > hall_of_fame[user.value]) {
            hall_of_fame[user.value] = score;
          }
        }
        salva_hall_of_fame(hall_of_fame);
        clearInterval(interval);
        mouseY = 300; // per farlo uscire dalla condizione per riniziare il gioco
        change.disabled = false;
        restart();
        draw_hall_of_fame();
        if (nSchema !== schemi.length - 1) {
          nSchema += 1;
          schemi[nSchema]();
        } else {
          nSchema = 0;
          schemi[0]();
        }
      }
      if (old_x + r >= x_matt && old_x - r <= x_matt + width_matt) {
        alpha = 2 * Math.PI - alpha;
        controllo = false;
      } else {
        alpha = Math.PI - alpha;
        controllo = false;
      }
    }
  }

  old_x = x_pallina;
};
const gameOver = () => {
  Swal.fire({
    title: "GAME OVER",
    position: "center",
    backdrop: "linear-gradient(red, orange)",
    background: "white",
    showConfirmButton: false,
    showCancelButton: false,
    timer: 2500
  });
};

const victory = () => {
  Swal.fire({
    title: "VICTORY ",
    position: "center",
    backdrop: "linear-gradient(green,yellow)",
    background: "white",
    showConfirmButton: false,
    showCancelButton: false,
    timer: 2500
  });
};

//funzione ricorsiva che controlla che la variabile delle coordinate del mouse sia definita
const inizio = () => {
  if (isNaN(user.value) === true && user.value.length <= 6) {
    user.classList.add("border-successful");
    user.classList.remove("border-danger");
  } else {
    user.classList.add("border-danger");
    user.classList.remove("border-successful");
    mouseX = 300;
  }
  if (
    mouseY > y_barra - 30 &&
    isNaN(user.value) === true &&
    user.value.length <= 5
  ) {
    change.disabled = true;
    interval = setInterval(render, 10);
  } else {
    setTimeout(inizio, 10);
  }
};

const combo_animation = () => {
  combo_div.innerText = "X" + contatore;
  setTimeout(function () {
    combo_div.innerText = "";
  }, 2000);
};

const wait_canvas = () => {
  if (!canvas_game && !canvas_score && !canvas_hall_of_fame) {
    setTimeout(wait_canvas, 100);
  } else {
    ctx_game = canvas_game.getContext("2d");
    ctx_score = canvas_score.getContext("2d");
    ctx_hall_of_fame = canvas_hall_of_fame.getContext("2d");
    // creazoine pallina
    ctx_game.fillStyle = "#000000";
    ctx_game.arc(x_pallina, y_pallina, r, 0, Math.PI * 2);
    ctx_game.fill();
    ctx_game.stroke();
    schemi[0]();
    ctx_game.fillStyle = "#c3c5c4";
    //barra
    rect(
      canvas_game.width / 2 - width_barra / 2,
      y_barra,
      width_barra,
      height_barra
    );

    text(ctx_score, 90, 40, "score");
    text(ctx_score, 120, 90, "0");
    change.onclick = () => {
      listaMattoncini = [];
      x_matt = 0;
      y_matt = 45;
      ctx_game.clearRect(0, 0, canvas_game.width, 300);
      if (nSchema !== schemi.length - 1) {
        nSchema += 1;
        schemi[nSchema]();
      } else {
        nSchema = 0;
        schemi[0]();
      }
    };

    text(ctx_hall_of_fame, 45, 35, "Hall of fame");
    get_hall_of_fame();
    inizio();
    canvas_game.addEventListener("mousemove", function (event) {
      // Calcola la posizione del mouse all'interno del canvas_game
      const rect = canvas_game.getBoundingClientRect();
      mouseX = event.clientX - rect.left - width_barra / 2;
      mouseY = event.clientY - rect.top - height_barra / 2;
    });
  }
};

// body = {
//   key: "hall_of_fame",
//   value: JSON.stringify({})
// };
// request(urlSend, body, (result) => {});

// main
const canvas_game = document.getElementById("canvas_game");
const canvas_score = document.getElementById("canvas_score");
const canvas_hall_of_fame = document.getElementById("canvas_hall_of_fame");
let ctx_game;
let ctx_score;
let ctx_hall_of_fame;
const change = document.getElementById("button");
const urlSend = " https://ws.progettimolinari.it/cache/set";
const urlGet = " https://ws.progettimolinari.it/cache/get";
const headers = {
  "content-type": "application/json",
  key: "3353fa1e-0fe7-4278-bf0a-73bd7471e2c5"
};
let body;
let matt_distrutti = 0; //punteggio partita
let hall_of_fame = ""; //miglior punteggi partita
let contatore = 0;
let score = 0;
const user = document.getElementById("input");

// mattoncino
const width_matt = 50; // Lunghezza mattoncini
const height_matt = 15; // Altezza mattoncini
let x_matt = 0;
let y_matt = 45;

//barra
let x_barra = 220;
let y_barra = 400;
const width_barra = 60; // Lunghezza barra
const height_barra = 5; // Altezza barra

let listaMattoncini = [];
let colors = ["#1fff11", "#54aedb", "#d71a1a", "#efdd39", "#39efd6", "#2f8155"];

// Pallina
const vel = 3;
const r = 5;
let x_pallina = 250;
let y_pallina = y_barra - r * 4;
let alpha = -Math.PI / 4 + Math.random() * (-90 * (Math.PI / 180)); // Angonlo direzione
let old_x = x_pallina;

let mouseX;
let mouseY;
let interval;
let schemi = [schema1, schema2, schema3, schema4];

let nSchema = 0;

const combo_div = document.getElementById("combo_div");
let controllo = false; //controlla che la pallina abbia rimbalzato contro la racchetta e quindi evita che ci rimbalzi dentro
wait_canvas(); // per evitare di accedere al canvas prima che venga creato
