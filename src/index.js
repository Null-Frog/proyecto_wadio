const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

// Speech to text
const fs = require('fs');

const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: 'VVWoTlBRDrbakknlv7hc3DKITgJKnQTFD0A2OkdaNAzp'
  }),
  serviceUrl: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/73c0a8ac-d262-4bbd-a737-4148abd80f07'
});

const params = {
    objectMode: true,
    contentType: 'audio/ogg;codecs=opus',
    model: 'es-ES_NarrowbandModel',
    wordConficence: true
};

const recognizeStream = speechToText.recognizeUsingWebSocket(params);


//fs.createReadStream('C:/Users/Sn4pe/Documents/Proyectos/bots/discord/proyecto_wadio/audio.ogg').pipe(recognizeStream);

recognizeStream.on('data', function(event) { onEvent('Data:', event); });
recognizeStream.on('error', function(event) { onEvent('Error:', event); });
recognizeStream.on('close', function(event) { onEvent('Close:', event); });

// Display events on the console.
function onEvent(name, event) {
    console.log(name, JSON.stringify(event, null, 2));
};

function resolveAfter3Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 3000);
    });
  }

/**
 * Cada vez que el cliente reciba un archivo de tipo audio, se le contestará con un mensaje
 */
client.on('message', async msg => {
    if (msg.hasMedia) {
        const media = await msg.downloadMedia();

        /**
         * Transforma bin a audio
         */
        const buff = Buffer.from(media.data, 'base64');
        fs.writeFileSync('audioGenereado.ogg', buff);

        if (media.mimetype == "audio/ogg; codecs=opus") {

            /**
             * Se ejecuta cuando pasan 3s
             */
            async function f1() {
                await resolveAfter3Seconds(msg.reply(fs.createReadStream('C:/Users/Sn4pe/Documents/Proyectos/bots/discord/proyecto_wadio/audioGenereado.ogg').pipe(recognizeStream)));
                await resolveAfter3Seconds(msg.reply());
                await resolveAfter3Seconds(msg.reply('No me mandéis audios, por favor'));
              }
             
            f1();
        }
    }
});



