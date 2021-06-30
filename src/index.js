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
 * Cada vez que el cliente reciba un archivo "media", se le contestará con un mensaje
 */
client.on('message', async msg => {
    if(msg.hasMedia) {
        const media = await msg.downloadMedia();

		if(media.mimetype == "audio/ogg; codecs=opus"){
			msg.reply('No me mandéis audios, por favor');
		}
        // do something with the media data here
		console.log(media);
    }
});