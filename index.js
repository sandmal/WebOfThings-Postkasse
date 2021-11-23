var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://broker.hivemq.com');

const topic = 'SmartMailBoxNTNU/wot';

client.on('connect', () => {
  console.log('Connected');
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  //console.log(topic + ': ' + message.toString());
  if (message.toString() == 'Mail received') {
    console.log('Mail received');
  }

  if (message.toString() == 'Mailbox is full') {
    console.log('Mailbox is full');
  }

  if (message.toString() == 'newTopic') {
    client.subscribe([topic], () => {
      console.log(`New subscriber to '${topic}'`);
    });
  }
});
