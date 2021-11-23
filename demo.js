let host, port;
let client = [];
let count = 0;
let messageNames = [];

// -------------------------------------------------------------------------

// Called to connect to the broker
// http://www.hivemq.com/demos/websocket-client/
function startOwnerSubcription() {
  // generate a random clientID
  let clientID = 'clientID-' + parseInt(Math.random() * 100);

  // Fetch the hostname / IP address and port number from the form
  host = document.getElementById('host').value;
  port = document.getElementById('port').value;

  //Print output for the user in the messages div
  document.getElementById('messages').innerHTML += `
  <span>Connecting to: ${host} on port: ${port} </span><br/>
  Using the following client value: ${clientID} </span><br/>
  `;

  // Initialize new Phao client connection
  client = new Paho.MQTT.Client(host, Number(port), clientID);
  // Set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // Connect the client, if successful, call onConnect function
  client.connect({
    onSuccess: onOwnerConnect,
  });
}

//Called when the client connects
function onOwnerConnect() {
  // Fetch the MQTT topic from the form
  console.log('Connecting to');
  let topic = document.getElementById('ownerTopic').value;
  let messageID = 'owner-messages';

  // Print output for the user in the messages div
  document.getElementById(
    messageID
  ).innerHTML += `<span>Subscribing to: ${topic} </span><br/>`;

  client.subscribe(topic);
}

function startOwnerUnsubscribe() {
  client.disconnect();
  document.getElementById('messages').innerHTML +=
    '<span>Owner | unsubscribed</span><br/>';
  document.getElementById('owner-messages').innerHTML = '';
}
// -------------------------------------------------------------------------

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log('onConnectionLost:' + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  if (message.destinationName === 'SmartMailBoxNTNU/wot') {
    document.getElementById(
      'owner-messages'
    ).innerHTML += `<span>Topic: ${message.destinationName} | Message: ${message.payloadString} </span><br/>`;
    document.querySelectorAll('.guest-messages').forEach((name) => {
      if (name.value === undefined) {
        name.innerHTML += `<span>Owner mailbox:${message.payloadString} </span><br/>`;
        console.log(client.clientId);
      }
    });
  }
}

// called when a message arrives
function onGuestMessageArrived(message) {
  //TODO: Do not remove this, i dont know why it works.. but i does.
}

// -------------------------------------------------------------------------

// Called to connect to the broker
// http://www.hivemq.com/demos/websocket-client/
function startGuestSubcription() {
  // generate a random clientID
  let clientID = 'clientID-' + parseInt(Math.random() * 100);

  //Print output for the user in the messages div
  document.getElementById('messages').innerHTML += `
  <span>Connecting to: ${host} on port: ${port} </span><br/>
  Using the following client value: ${clientID} </span><br/>
  `;

  // Initialize new Phao client connection
  client = new Paho.MQTT.Client(host, Number(port), clientID);
  let messageID = `${client.clientId}-messages`;

  document
    .getElementById(`subscribe-guest-${count}`)
    .querySelector(
      '.guest-messages'
    ).innerHTML += `<span id="${messageID}">Subscribing to: ${messageID}</span></br>`;

  // Set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onGuestMessageArrived;

  // Connect the client, if successful, call onConnect function
  count++;
  client.connect({
    onSuccess: onGuestConnect,
  });
}

//Called when the client connects
function onGuestConnect() {
  // Fetch the MQTT topic from the form
  console.log('Connecting to');
  let topic = document.getElementById('guestTopic').value;

  document.getElementById(
    'owner-messages'
  ).innerHTML += `<span>Guest subscribed to your mailbox </span><br/>`;

  // Subscribe to the requested topic
  client.subscribe(topic);
}

function startGuestUnsubscribe() {
  client.disconnect();
  document.getElementById('messages').innerHTML +=
    '<span>Guest  | unsubscribed</span><br/>';

  document.getElementById(
    'owner-messages'
  ).innerHTML += `<span>Guest unsubscribed from your mailbox </span><br/>`;
  document.getElementById('guest-messages').innerHTML = '';
}

function createGuest() {
  document.getElementById('createGuest').innerHTML += `
  <div id="subscribe-guest-${count}">
      <h3>Guest</h3>
      <strong>Topic:</strong>
      <input
        id="guestTopic"
        type="text"
        name="Guest topic"
        value="SmartMailBoxNTNU/wot2"
      />
      <input
        type="button"
        onclick="startGuestSubcription()"
        value="Subscribe"
      />
      <input
        type="button"
        onclick="startGuestUnsubscribe()"
        value="Unsubscribe"
      />
      <div class="guest-messages"></div>
    </div>
    `;
}

function publishMessage() {
  let topic = document.getElementById('ownerTopic').value;
  let messageToSend = document.getElementById('ownerMessage').value;
  let message = new Paho.MQTT.Message(messageToSend);
  message.destinationName = topic;
  if (messageToSend !== '') {
    client.send(message);
  }
}
