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
        max: 79,
        mueve: 10
    },
    dificultad: {
        min: 80,
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
    participantesSet.forEach(participante => {
        movimientos[participante.nombre] = [];
    });
    return participantesSet;
}

const zonaCarrera = document.getElementsByClassName("carrera")[0];    //zona html para la carrera

function crearCarrera() {    //creo la pista con los animales en su posición indicada
    participantesSet = getParticipantes();
    borrarNodo();
    participantesSet.forEach(participante => {   //creo los carriles para los animales correspondientes
        let pista = crearNodo("div", "", ["pista"], []);
        pista.appendChild(crearNodo("img", "", [], [{ name: "src", value: "./img/" + participante.img }, { name: "id", value: participante.nombre }]));
        zonaCarrera.appendChild(pista);
        document.getElementById(participante.nombre).style.marginLeft = participante.casilla + 'px';
        movimientos[participante.nombre].push({ tipo: 'salida', valor: participante.casilla });
    });
}

function borrarNodo() {
    let divCarrera = zonaCarrera
    while (divCarrera.firstChild) {
        divCarrera.removeChild(divCarrera.firstChild);
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
    while(i<movimientos.length){
        arr.push(movimientos[i].valor);
        i++;
    }
    suma = arr.reduce(function (acumulador, avance) {
        return (acumulador + avance) < 0 ? 0 : acumulador + avance;
    }, 0);
    return suma;
}
let terminado;
function turno() {
    terminado = comprobarCarrera();
    if(terminado != true){
        participantesSet.forEach(participante => {
            let total = calculaTotalMovs(movimientos[participante.nombre]);
            if (total < nCasillas) {    
                let num = randomMovimiento();
                if (num < (participante.ventaja.min + participante.ventaja.max)) {
                    movimientos[participante.nombre].push({ tipo: 'ventaja', valor: participante.ventaja.mueve });
                    document.getElementById(participante.nombre).style.marginLeft = participante.ventaja.mueve * 3 + total + 'px';
                }
                else if (num >= participante.normal.min && num <= participante.normal.max) {
                    movimientos[participante.nombre].push({ tipo: 'normal', valor: participante.normal.mueve });
                    document.getElementById(participante.nombre).style.marginLeft = participante.normal.mueve * 3 + total + 'px';
                }
                else if(total - (participante.dificultad.mueve * 3) > 0){
                    movimientos[participante.nombre].push({ tipo: 'dificultad', valor: participante.dificultad.mueve });
                    document.getElementById(participante.nombre).style.marginLeft = participante.dificultad.mueve * 3 + total + 'px';
                }
            }
        });
    }
}

function comprobarCarrera(){
    let todos = 0;
    participantesSet.forEach(participante => {
        let total = calculaTotalMovs(movimientos[participante.nombre]);
        if(total >= nCasillas){
            todos++;
        }
    });
    if(todos == participantesSet.length){
        return true;
    }
    else{
        return false;
    }
}

function completo() {
    terminado = comprobarCarrera();
    while(terminado != true){
        turno();
    }
}

document.getElementById("paso").addEventListener('click', turno);
document.getElementById("finalizar").addEventListener('click', completo);