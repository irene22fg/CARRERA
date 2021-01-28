const tortuga = {
    id: 1,
    casilla: 150,
    nombre: "tortuga",
    img: "tortuga.jpg",
    ventaja: {
        min: 1,
        max: 10,
        mueve: 5
    },
    normal: {
        min: 11,
        max: 65,
        mueve: 3
    },
    dificultad: {
        min: 66,
        max: 100,
        mueve: 0
    }
}
const liebre = {
    id: 2,
    casilla: 0,
    nombre: "liebre",
    img: "liebre.jpg",
    ventaja: {
        min: 1,
        max: 45,
        mueve: 20
    },
    normal: {
        min: 46,
        max: 80,
        mueve: 10
    },
    dificultad: {
        min: 81,
        max: 100,
        mueve: -20
    }
}
const zorro = {
    id: 3,
    casilla: 20,
    nombre: "zorro",
    img: "zorro.jpg",
    ventaja: {
        min: 1,
        max: 33,
        mueve: 14
    },
    normal: {
        min: 34,
        max: 66,
        mueve: 12
    },
    dificultad: {
        min: 67,
        max: 100,
        mueve: -3
    }
}
const caballo = {
    id: 4,
    casilla: 30,
    nombre: "caballo",
    img: "caballo.jpg",
    ventaja: {
        min: 1,
        max: 40,
        mueve: 9
    },
    normal: {
        min: 41,
        max: 86,
        mueve: 5
    },
    dificultad: {
        min: 87,
        max: 100,
        mueve: -10
    }
}
const pinguino = {
    id: 5,
    casilla: 90,
    nombre: "pinguino",
    img: "pinguino.jpg",
    ventaja: {
        min: 1,
        max: 30,
        mueve: 10
    },
    normal: {
        min: 31,
        max: 69,
        mueve: 4
    },
    dificultad: {
        min: 70,
        max: 100,
        mueve: 0
    }
}

const animales = [tortuga, liebre, zorro, caballo, pinguino];
const nCasillas = 750;

document.getElementById("bSubmit").addEventListener('click', crearCarrera);

function randomId() {
    let n = Math.floor(Math.random() * (6 - 1) + 1);
    return n;
}

function randomMovimiento() {
    let n = Math.floor(Math.random() * 100) + 1;
    return n;
}

let movimientos = {};

function getParticipantes() {      //Saco el número de participantes y los almaceno de manera random
    let participantesSet = [];

    let nPar = document.getElementById('nParticipantes');
    let participantesN = nPar.value;

    while (participantesSet.length < participantesN) {
        idParticipante = randomId();
        let i = 0;
        while (i < animales.length) {
            if ((animales[i].id == idParticipante) && (participantesSet.includes(animales[i]) == false)) {   //tienen que ser valores únicos (no repetidos)
                participantesSet.push(animales[i]);
                i = animales.length;
            }
            i++;
        }
    }
    participantesSet.forEach(participante => {   //Creamos el objeto movimientos
        movimientos[participante.nombre] = [];
    });
    return participantesSet;
}

const zonaCarrera = document.getElementsByClassName("carrera")[0];    //zona html para la carrera
const tabla = document.getElementById("tabla");
const podio = document.getElementById("podio");

function crearCarrera() {    //creo la pista con los animales en su posición indicada
    document.getElementById("finalizar").disabled=false;
    document.getElementById("paso").disabled=false;
    participantesSet = getParticipantes();
    borrarNodo(zonaCarrera);
    participantesSet.forEach(participante => {   //creo los carriles para los animales correspondientes
        let pista = crearNodo("div", "", ["pista"], []);
        pista.appendChild(crearNodo("img", "", [], [{ name: "src", value: "./img/" + participante.img }, { name: "id", value: participante.nombre }]));
        zonaCarrera.appendChild(pista);
        document.getElementById(participante.nombre).style.marginLeft = participante.casilla + 'px';
        movimientos[participante.nombre].push({ tipo: 'salida', valor: participante.casilla });
    });
    crearTabla();
}

function crearTabla() {    //Creamos la tabla con la estructura principal y añadimos la casilla de salida si la hubiera
    borrarNodo(tabla);
    borrarNodo(podio);
    let thead = crearNodo("thead", "", [], []);
    let tbody = crearNodo("tbody", "", [], []);
    let trCabecera = crearNodo("tr", "", [], []);
    trCabecera.appendChild(crearNodo("th", "TURNO", [], []));
    thead.appendChild(trCabecera);
    participantesSet.forEach(participante => {
        trCabecera.appendChild(crearNodo("th", participante.nombre, [], []));
    });
    tabla.appendChild(thead);
    let trSalida = crearNodo("tr", "", [], []);
    trSalida.appendChild(crearNodo("td", "0", [], []));
    tbody.appendChild(trSalida);
    participantesSet.forEach(participante => {
        trSalida.appendChild(crearNodo("td", movimientos[participante.nombre][0].tipo + ": " + movimientos[participante.nombre][0].valor, [], []));
    });
    tabla.appendChild(tbody);
}

let turnoTabla = 0;
function addMovsTabla(movimientos) {    //Añadimos los movimientos de este turno a la tabla
    turnoTabla++;
    let tbody = document.body.children[7].lastElementChild;
    let tr = crearNodo("tr", "", [], []);
    tr.appendChild(crearNodo("td", turnoTabla, [], []));
    movimientos.forEach(mov => {
        tr.appendChild(crearNodo("td", mov.tipo + ": " + mov.valor, [], []));
    });
    tbody.appendChild(tr);
}

function borrarNodo(div) {
    let nodoBorrar = div;
    while (nodoBorrar.firstChild) {
        nodoBorrar.removeChild(nodoBorrar.firstChild);
    }
}

function crearNodo(tipo, texto, clases, atributos) {     //función CREAR NODO
    let nodo = document.createElement(tipo);
    if (texto != "" && texto != null) {
        nodo.appendChild(document.createTextNode(texto));
    }
    if (clases.length > 0) {
        clases.forEach(clase => nodo.classList.add(clase));
    }
    if (atributos.length > 0) {
        atributos.forEach(atributo => nodo.setAttribute(atributo.name, atributo.value));
    }
    return nodo;
}

function calculaTotalMovs(movimientos) {
    let suma = 0;
    let arr = [];
    let i = 0;
    while (i < movimientos.length) {   //creamos un array para almacerar los movimientos, ya que es un objeto
        arr.push(movimientos[i].valor);
        i++;
    }
    suma = arr.reduce(function (acumulador, avance) {
        return (acumulador + avance) < 0 ? 0 : acumulador + avance;
    }, 0);
    return suma;
}

let terminado;
function turno() {   //Turno paso a paso
    terminado = comprobarCarrera();
    if (terminado != true) {
        let movsTurno = [];
        participantesSet.forEach(participante => {
            let total = calculaTotalMovs(movimientos[participante.nombre]);
            if (total < nCasillas) {
                let num = randomMovimiento();
                if (num < (participante.ventaja.min + participante.ventaja.max)) {
                    movimientos[participante.nombre].push({ tipo: 'ventaja', valor: participante.ventaja.mueve });
                    movsTurno.push({ tipo: 'ventaja', valor: participante.ventaja.mueve });
                    document.getElementById(participante.nombre).style.marginLeft = participante.ventaja.mueve * 3 + total + 'px';
                }
                else if (num >= participante.normal.min && num <= participante.normal.max) {
                    movimientos[participante.nombre].push({ tipo: 'normal', valor: participante.normal.mueve });
                    movsTurno.push({ tipo: 'normal', valor: participante.normal.mueve });
                    document.getElementById(participante.nombre).style.marginLeft = participante.normal.mueve * 3 + total + 'px';
                }
                else if (total - (participante.dificultad.mueve * 3) > 0) {
                    movimientos[participante.nombre].push({ tipo: 'dificultad', valor: participante.dificultad.mueve });
                    movsTurno.push({ tipo: 'dificultad', valor: participante.dificultad.mueve });
                    document.getElementById(participante.nombre).style.marginLeft = participante.dificultad.mueve * 3 + total + 'px';
                }
            }
            else{
                movsTurno.push({tipo: 'termina', valor: '0'});
            }
        });
        addMovsTabla(movsTurno)  //Pasamos los movimientos de este turno
    }
}

function comprobarCarrera() {    //Comprueba si todos los participantes estan en la meta
    let todos = 0;
    participantesSet.forEach(participante => {
        let total = calculaTotalMovs(movimientos[participante.nombre]);
        if (total >= nCasillas) {
            todos++;
        }
    });
    if (todos == participantesSet.length) {
        mostrarPodio();
        document.getElementById("finalizar").disabled=true;
        document.getElementById("paso").disabled=true;
        turnoTabla = 0;   //igualamos a 0 cuando termina la carrera para que se "resetee"
        return true;
    }
    else {
        return false;
    }
}

function completo() {    //Hace Paso a Paso mientras no estén todos en la meta
    terminado = comprobarCarrera();
    while (terminado != true) {
        turno();
    }
}

function mostrarPodio() {
    let movsTotales = [];
    let i = 0;
    participantesSet.forEach(participante => {    //cuento los turnos de cada uno
        movsTotales.push(movimientos[participante.nombre].length);
        i++;
    });
    let arrayMovsTotales = movsTotales.slice();  //copio los valore sin ordenar
    movsTotales.sort(function(a,b){return a-b});   //Ordenolos valores
    let orden = [];
    for(let i = 0; i<movsTotales.length; i++){    //almaceno el nombre por valores ordenados
        for(let j = 0; j<arrayMovsTotales.length; j++){
            if(movsTotales[i] == arrayMovsTotales[j]){
                orden.push(participantesSet[j].nombre);
            }
        }
    }
    let j = 1;
    orden.forEach(animal => {  //Muestro el podio
        podio.appendChild(crearNodo("p", j + "º " + animal + ": " + movsTotales[j-1] + " turnos", [], []));
        j++;
    });
}

document.getElementById("paso").addEventListener('click', turno);
document.getElementById("finalizar").addEventListener('click', completo);