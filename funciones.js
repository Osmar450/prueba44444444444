// Obtener referencias a los elementos del DOM
const audioInput = document.getElementById('audio-input');
const imageInput = document.getElementById('image-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button'); // Corregido para obtener el botón por su ID
const messagesContainer = document.getElementById('messages');

// Función para iniciar la grabación de audio
function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.addEventListener('dataavailable', event => {
        chunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
        sendMediaToChat(audioFile, 'audio');
      });

      mediaRecorder.start();
      // Detener la grabación después de un tiempo determinado (por ejemplo, 10 segundos)
      setTimeout(() => {
        mediaRecorder.stop();
      }, 10000);
    })
    .catch(error => {
      console.error('Error al acceder al micrófono:', error);
    });
}

// Función para seleccionar y enviar una imagen
function selectImage() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const track = stream.getTracks()[0];
      const imageCapture = new ImageCapture(track);
      imageCapture.grabFrame()
        .then(imageBitmap => {
          const canvas = document.createElement('canvas');
          canvas.width = imageBitmap.width;
          canvas.height = imageBitmap.height;
          const context = canvas.getContext('2d');
          context.drawImage(imageBitmap, 0, 0);
          canvas.toBlob(blob => {
            const imageFile = new File([blob], 'image.png', { type: 'image/png' });
            sendMediaToChat(imageFile, 'image');
          }, 'image/png');
          track.stop();
        })
        .catch(error => {
          console.error('Error al capturar la imagen:', error);
        });
    })
    .catch(error => {
      console.error('Error al acceder a la cámara:', error);
    });
}

function sendMessage() {
    var messageInput = document.getElementById("message");
    var message = messageInput.value;
    var username = document.getElementById("username").textContent.trim(); // Obtén el nombre de usuario
    if (message.trim() !== "") {
        var chatbox = document.getElementById("chatbox");
        var newMessage = document.createElement("div");
        newMessage.textContent = username + ": " + message; // Concatena el nombre de usuario y el mensaje
        chatbox.appendChild(newMessage);
        messageInput.value = "";
        // Scroll al final del chat
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}



// Función para enviar archivos multimedia al chat
function sendMediaToChat(file, type) {
  const outgoingMessage = document.createElement('div');
  outgoingMessage.classList.add('message', 'outgoing');

  if (type === 'image') {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    outgoingMessage.appendChild(img);
  } else if (type === 'audio') {
    const audio = document.createElement('audio');
    audio.controls = true;
    const source = document.createElement('source');
    source.src = URL.createObjectURL(file);
    source.type = 'audio/webm';
    audio.appendChild(source);
    outgoingMessage.appendChild(audio);
  }

  messagesContainer.appendChild(outgoingMessage);
}

// Asignar evento de clic al botón de envío para mensajes de texto
sendButton.addEventListener('click', sendMessage);

// Asignar evento de clic al botón de audio para iniciar la grabación
audioInput.addEventListener('click', startRecording);

// Asignar evento de clic al botón de imagen para seleccionar una imagen
imageInput.addEventListener('click', selectImage);
document.addEventListener("DOMContentLoaded", function() {
    const messageInput = document.getElementById("message-input");

    messageInput.addEventListener("keypress", function(event) {
        // Verifica si la tecla presionada es Enter (código 13)
        if (event.key === "Enter") {
            sendMessage(); // Llama a la función sendMessage
        }
    });
});

