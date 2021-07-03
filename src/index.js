const qrcode = require('qrcode-terminal');
require('dotenv').config();
const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('[!] Client is ready!');
});

client.initialize();

// Speech to text
const fs = require('fs');

const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.APIKEY
  }),
  serviceUrl: process.env.URL
});

const params = {
  objectMode: true,
  contentType: 'audio/ogg;codecs=opus',
  model: 'es-ES_NarrowbandModel',
  wordConficence: true
};

const recognizeStream = speechToText.recognizeUsingWebSocket(params);

recognizeStream.on('data', function (event) { onEvent('Data:', event); });
recognizeStream.on('error', function (event) { onEvent('Error:', event); });
recognizeStream.on('close', function (event) { onEvent('Close:', event); });

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

    if (media.mimetype == "audio/ogg; codecs=opus") {
      msg.reply('No me mandéis audios, por favor');

      /**
       * Transforma bin a audio
       */
      const buff = Buffer.from(media.data, 'base64');
      fs.writeFileSync('audio/audioGenerado.ogg', buff);
      console.log("[!] Audio generado");

      /**
       * Lee el archivo de audio
       */
      async function leerAudio() {
        const leerAudio = fs.createReadStream(process.env.AUDIO);

        const recognizeParams = {
          audio: leerAudio,
          contentType: 'audio/ogg;codecs=opus',
          model: 'es-ES_NarrowbandModel',
          endOfPhraseSilenceTime: 120.0
        };

        var audioObject;
        var mensajeAudio;
        var fiabilidad;

        const transcribirAudio = speechToText.recognize(recognizeParams)
        .then(SpeechRecognitionResults => {
          audioObject = SpeechRecognitionResults;
        })
        .catch(err =>{
          console.log('error', err);
        });

        await resolveAfter3Seconds(transcribirAudio);

        mensajeAudio = audioObject.result.results[0].alternatives[0].transcript;
        fiabilidad = audioObject.result.results[0].alternatives[0].confidence;
        console.log("[!] Audio leído");
        msg.reply("[Transcripción de audio]\n\n"+mensajeAudio+"\n\n[Fiabilidad: "+fiabilidad+"]");
      }

      leerAudio();
    }
  }
});