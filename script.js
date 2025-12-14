//ELEMENTOS DEL DOM
let tabla = document.getElementById("tabla10x10");              // tabla del juego
let btnJugar = document.getElementById("btnJugar");             // botón jugar
let btnTirarDado = document.getElementById("btnTirarDado");     // botón tirar dado
let imgDado = document.getElementById("imgDado");               // imagen del dado
let mensaje = document.getElementById("mensaje");               // mensajes de victoria
let contadorTiradas = document.getElementById("contadorTiradas"); // contador final
let btnSiguiente = document.getElementById("btnSiguiente");     // siguiente partida

//VARIABLES DEL JUEGO
let heroFila = 0;        // fila actual del héroe
let heroCol = 0;         // columna actual del héroe
let cofreFila = 9;       // fila del cofre
let cofreCol = 9;        // columna del cofre
let tiradas = 0;         // número de tiradas (oculto hasta ganar)
let puedeTirar = true;   // controla si se puede tirar el dado, que siempre empieza pudiendo hasta que salga false


//OCULTAR ELEMENTOS AL INICIO
tabla.style.display = "none";          // oculto la tabla
btnTirarDado.style.display = "none";   // oculto botón dado
imgDado.style.display = "none";        // oculto imagen dado
btnSiguiente.style.display = "none";   // oculto siguiente partida

//VALIDAR NOMBRE
let validarNombre = (nombre, ev) => {//funcion de validar nombre
    if (nombre.length < 4) {// mínimo 4 letras
        alert("Mínimo 4 letras");
        return ;//volvemos
    }

    for (let i = 0; i < nombre.length; i++) { // compruebo que no haya números desde el 0 hasta la longitud del nombre
        if (nombre[i] >= "0" && nombre[i] <= "9") {//si hay un número
            alert("No se permiten números");//no se permiten
            return ;//volvemos
        }
    }

    return true;// devuelvo true porque el nombre es válido
};

//INICIAR JUEGO
let iniciarJuego = (ev) => {//funcion de iniciar juego
    let nombre = document.getElementById("nombreJugador").value; //leo nombre

    if (!validarNombre(nombre, ev)) return; // valido nombre "si pasa lo contrario a valido nombre volvemos"

    document.getElementById("zonaNombre").style.display = "none"; // oculto formulario
    document.getElementById("tituloHeroe").textContent =
        "A luchar héroe: " + nombre;       // muestro título mas el nombre

    btnJugar.disabled = false;            // activo botón jugar, lo contrario a disabled
};

//GENERAR TABLERO
let generarTablero = (ev) => {
    tabla.innerHTML = "";                 // limpio la tabla porque si no se duplica, es como redibujar

    for (let f = 0; f < 10; f++) {        // recorro filas
        let tr = document.createElement("tr");

        for (let c = 0; c < 10; c++) {    // recorro columnas
            let td = document.createElement("td");
            td.dataset.f = f;             // guardo fila
            td.dataset.c = c;             // guardo columna

            if (f === heroFila && c === heroCol) { // coloco héroe
                let img = document.createElement("img");
                img.src = "img/heroe.jpg";
                td.appendChild(img);
            }

            if (f === cofreFila && c === cofreCol) { // coloco cofre
                let img = document.createElement("img");
                img.src = "img/cofre.png";
                td.appendChild(img);
            }

            tr.appendChild(td);
        }

        tabla.appendChild(tr);
    }
};

//TIRAR DADO
let tirarDado = (ev) => {
    if (!puedeTirar) return;              // si no toca, no tiro

    let numero = Math.floor(Math.random() * 6) + 1; // número 1–6, el +1 es porq imagina q sale 0.2, se le suma 1 y trunca a 1
    imgDado.src = "img/dado" + numero + ".jpg";     // cambio imagen, carpeta img con dado + numero qeu salga + .jpg
    tiradas++;                           // aumento contador oculto

    for (let f = 0; f < 10; f++)          // limpio marcas anteriores
        for (let c = 0; c < 10; c++)
            tabla.rows[f].cells[c].style.backgroundColor = "";//poniendole nada de estilo

    if (heroFila - numero >= 0)           // arriba
        tabla.rows[heroFila - numero].cells[heroCol].style.backgroundColor = "red";//row final cell celda

    if (heroFila + numero < 10)           // abajo
        tabla.rows[heroFila + numero].cells[heroCol].style.backgroundColor = "red";

    if (heroCol - numero >= 0)            // izquierda
        tabla.rows[heroFila].cells[heroCol - numero].style.backgroundColor = "red";

    if (heroCol + numero < 10)            // derecha
        tabla.rows[heroFila].cells[heroCol + numero].style.backgroundColor = "red";

    puedeTirar = false;                   // bloqueo tirar
    btnTirarDado.disabled = true;//cierto q esta deshabilitado
};

//MOVER HÉROE
let moverHeroe = (ev) => {                          // función que se ejecuta al hacer click en la tabla
    let td = ev.target;                             // guardo exactamente lo que he pulsado con el ratón

    if (td.tagName === "IMG")                       // si he pulsado una imagen
        td = td.parentNode;                         // cojo la celda que contiene esa imagen

    if (td.tagName !== "TD") return;                // si no es una celda, no hago nada y salgo

    if (td.style.backgroundColor !== "red") return; // si la celda no es roja, no se puede mover ahí

    heroFila = parseInt(td.dataset.f);              // actualizo la fila del héroe con la celda pulsada
    heroCol = parseInt(td.dataset.c);               // actualizo la columna del héroe con la celda pulsada

    if (heroFila === cofreFila && heroCol === cofreCol) { // compruebo si el héroe ha llegado al cofre

        contadorTiradas.textContent =               // escribo el número de tiradas realizadas
            "Tiradas: " + tiradas;

        contadorTiradas.style.display = "block";    // muestro el contador en pantalla

        let record = localStorage.getItem("recordTiradas"); // leo el récord guardado en el navegador

        if (record === null || tiradas < parseInt(record)) { // si no hay récord o he hecho menos tiradas
            localStorage.setItem("recordTiradas", tiradas);  // guardo el nuevo récord
            mensaje.textContent =
                "HAS GANADO - Nuevo récord: " + tiradas;     // muestro mensaje de victoria con récord
        } else {
            mensaje.textContent =
                "HAS GANADO - Récord no superado: " + record; // muestro mensaje sin récord
        }

        btnTirarDado.disabled = true;               // desactivo el botón de tirar dado
        btnSiguiente.style.display = "inline-block";// muestro el botón de siguiente partida
        puedeTirar = false;                         // bloqueo el turno
        return;                                     // salgo porque la partida ha terminado
    }

    puedeTirar = true;                              // permito volver a tirar el dado
    btnTirarDado.disabled = false;                  // activo el botón del dado otra vez
    generarTablero(ev);                             // redibujo la tabla con el héroe movido
};

//SIGUIENTE PARTIDA
let siguientePartida = (ev) => {
    heroFila = 0;
    heroCol = 0;
    tiradas = 0;
    puedeTirar = true;

    mensaje.textContent = "";
    contadorTiradas.style.display = "none";
    btnSiguiente.style.display = "none";
    btnTirarDado.disabled = false;

    generarTablero(ev);
};

//EVENTOS
document.getElementById("btnIntroducirNombre")
    .addEventListener("click", (ev) => iniciarJuego(ev));

btnJugar.addEventListener("click", (ev) => {
    tabla.style.display = "table";
    btnTirarDado.style.display = "inline-block";
    imgDado.style.display = "inline-block";
    btnJugar.style.display = "none";
    siguientePartida(ev);
});

btnTirarDado.addEventListener("click", (ev) => tirarDado(ev));
tabla.addEventListener("click", (ev) => moverHeroe(ev));
btnSiguiente.addEventListener("click", (ev) => siguientePartida(ev));