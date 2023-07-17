var exec = false;
var timeList = [];
var observer = null;
var modalCreated = false;

function verificarElemento() {
  const elemento = document.querySelectorAll(".sc-cjibBx");
  console.log(elemento[0] + exec);
  if (elemento) {
    timeList = []
    for (let i = 0; i < elemento.length; i++) {
      exec = true;
      if(elemento[i].querySelector('.nome').querySelector('img').src != 'https://devmonk.com.br/assets/images/icones/green_check.svg') {
        timeList.push(elemento[i].querySelector('.tempo').querySelector('span')?.textContent)
      }
    }

    let tempoTotal = somarTempos(timeList);
    return tempoTotal;

  } 
}

function injectModal(tempoTotal, numeroTarefas, numeroTarefasConcluidas) {
  const existingModal = document.getElementById('modal');

  if (existingModal) {
    existingModal.style.display = 'block';
    document.querySelector('#tempo-total').textContent = tempoTotal ? tempoTotal : '00:00:00';
    document.querySelector('#ex-page-name').textContent = document.querySelector('h1').textContent;
    document.querySelector('#ex-numero-task-total').textContent = numeroTarefas;
    document.querySelector('#ex-numero-task-concluida').textContent = numeroTarefasConcluidas;
    return;
  }

  if (!modalCreated) {
    modalCreated = true; // Define modalCreated como verdadeiro antes de fazer a requisição assíncrona
    fetch(chrome.runtime.getURL('pages/modal.html'))
      .then(response => response.text())
      .then(html => {
        const modalElement = document.createElement('div');
        modalElement.innerHTML = html;
        modalElement.style.display = 'block';
        modalElement.id = 'modal'; // Define o ID do elemento modal
        document.body.appendChild(modalElement);
      });
  }
}


function verificarTarefas() {
  var elements = document.querySelectorAll('.nome')
  let numeroTarefasConcluidas = 0;
  for (let i = 0; i < elements.length; i++) {
    if(elements[i]?.querySelector('img').src == 'https://devmonk.com.br/assets/images/icones/green_check.svg')
      numeroTarefasConcluidas++
  }

  return {
    numeroTarefasConcluidas: numeroTarefasConcluidas, numeroTarefas: elements.length
  }
}


function somarTempos(arrayTempos) {
  let totalSegundos = 0;

  if(arrayTempos.length < 1)
    return

  for (let i = 0; i < arrayTempos.length; i++) {
    let tempo = arrayTempos[i].split(':');
    let minutos = parseInt(tempo[0]);
    let segundos = parseInt(tempo[1]);

    totalSegundos += minutos * 60 + segundos;
  }

  let horas = Math.floor(totalSegundos / 3600);
  let minutosRestantes = Math.floor((totalSegundos % 3600) / 60);
  let segundosRestantes = totalSegundos % 60;

  horas = String(horas).padStart(2, '0');
  minutosRestantes = String(minutosRestantes).padStart(2, '0');
  segundosRestantes = String(segundosRestantes).padStart(2, '0');

  return `${horas}:${minutosRestantes}:${segundosRestantes}`;
}

function createObserver() {
  const elementoPai = document.querySelector(".conteudo_cla_aluno");
  const config = { childList: true, subtree: true };
  observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
         let tarefas = verificarTarefas();
         let tempo = verificarElemento();
         injectModal(tempo, tarefas.numeroTarefas, tarefas.numeroTarefasConcluidas)
         
      }
    });
  });

  observer.observe(elementoPai, config);
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

if (!observer) {
  createObserver();
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("close")) {
    document.getElementById("modal").style.display = "none";
  }
});

if (!document.getElementById('modal')) {
  createObserver();
}


