
const wa = require('@open-wa/wa-automate');
const request = require('request');
const fs = require('fs');
const { url } = require('inspector');
const e = require('express');
wa.create().then(client => start(client))

function start(client){
    client.onMessage(async message => {
        if(message.body === 'Hi'){
            await client.sendText(message.from, '👋 Hello!')
            console.log(```Sent Hi to $message.from```)
        }
        if(message.body === 'Hello'){
            await client.sendText(message.from, 'Hello ke aage bhi kuch bol le bhai')
            console.log(message.from)
        }
        const commands = message.caption || message.body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        //const args = command.split(' ')
        if(command === '#say'){
            //if (args.length === 1) return client.reply(from, 'Dhang se type karle bhai')
            // if(message.isGroupMsg){
                const ttsEn = require('node-gtts')('en')
                const dataText = message.body.slice(4)
                //console.log ('dataText:', dataText);
                if (dataText === '') return client.reply(from, 'Arey kehna kya chahte ho', message.id)
                if (dataText.length > 200) return client.reply(message.from, 'Bot hun toh itna bada message translate karwayega?', message.id)
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                        client.sendPtt(message.from, './media/tts/resEn.mp3', message.id)
                    })
                
                
                
            // }
         
            
        }
        if(command === '#menu'){
            client.sendText(message.from,"GtXtreme in bot mode is still in beta, will update soon\n Currently I only support the following commands \n #say")
        }
        
        
    })
}