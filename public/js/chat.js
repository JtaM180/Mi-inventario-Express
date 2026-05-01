// Conectar al servidor Socket.io
const socket = io();

const inputMensaje = document.getElementById('inputMensaje');
const btnEnviar = document.getElementById('btnEnviar');
const contenedorMensajes = document.getElementById('mensajes');

// Función para agregar un mensaje al chat
function agregarMensaje(data) {
  const div = document.createElement('div');
  div.classList.add('mensaje');

  // Si el mensaje es del usuario actual, alinearlo a la derecha
  if (data.usuario === USUARIO_ACTUAL) {
    div.classList.add('mensaje-propio');
  } else {
    div.classList.add('mensaje-otro');
  }

  div.innerHTML = `
    <span class="msg-usuario">${data.usuario}</span>
    <span class="msg-texto">${data.texto}</span>
    <span class="msg-hora">${data.hora}</span>
  `;

  contenedorMensajes.appendChild(div);
  // Auto-scroll al último mensaje
  contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
}

// Enviar mensaje al hacer clic en el botón
btnEnviar.addEventListener('click', () => {
  const texto = inputMensaje.value.trim();
  if (!texto) return;

  // Emitir evento al servidor
  socket.emit('mensaje', {
    usuario: USUARIO_ACTUAL,
    texto,
    hora: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
  });

  inputMensaje.value = '';
  inputMensaje.focus();
});

// También enviar con Enter
inputMensaje.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnEnviar.click();
});

// Recibir mensajes del servidor y mostrarlos
socket.on('mensaje', (data) => {
  agregarMensaje(data);
});

// Notificación cuando alguien se conecta
socket.on('usuarioConectado', (nombre) => {
  const div = document.createElement('div');
  div.classList.add('mensaje-sistema');
  div.textContent = `✅ ${nombre} se unió al chat`;
  contenedorMensajes.appendChild(div);
});

// Avisar al servidor que este usuario se conectó
socket.emit('unirse', USUARIO_ACTUAL);
