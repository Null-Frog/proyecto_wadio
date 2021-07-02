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

/**
 * Cada vez que el cliente reciba un archivo de tipo audio, se le contestará con un mensaje
 */
client.on('message', async msg => {
    if(msg.hasMedia) {
        const media = await msg.downloadMedia();

		if(media.mimetype == "audio/ogg; codecs=opus"){
			msg.reply('No me mandéis audios, por favor');
		}
    }
});

// Speech to text
const fs = require('fs');

const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY,
  }),
  serviceUrl: process.env.SPEECH_TO_TEXT_URL,
});

const params = {
    contentType: 'audio/ogg;codecs=opus',
    model: 'ES_BroadbandModel, es-',
    wordConficence: true
};

const recognizeStream = speechToText.recognizeUsingWebSocket(params);
fs.createReadStream('../sound.wav').pipe(recognizeStream);