const socket = io();
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

function loadScript(url, callback) {
  let script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

function showNameInput() {
  loadScript('https://cdn.jsdelivr.net/npm/sweetalert2@11', () => {
    Swal.fire({
      title: 'Please enter your name',
      input: 'text',
      inputValidator: (value) => {
        if (!value) {
          return 'Name is required!';
        }
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showCloseButton: false,
      confirmButtonText: 'Submit',
      inputAttributes: {
        autocapitalize: 'off'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        name = result.value;
        initializeChat();
      } else {
        showNameInput();
      }
    });
  });
}

function initializeChat() {
  textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      sendMessage(e.target.value);
    }
  });

  function sendMessage(message) {
    let msg = {
      user: name,
      message: message.trim()
    };
    // Append
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // Send to server
    socket.emit('message', msg);
  }

  function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
      <h4>${msg.user}</h4>
      <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
  }

  // Receive messages
  socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
  });

  function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
  }
}

// Initialize the chat when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
  showNameInput();
});
