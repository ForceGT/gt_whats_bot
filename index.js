const wa = require('@open-wa/wa-automate');
const fs = require('fs-extra');
const {exec} = require('child_process')
const {menu} = require('./lib/utils');
const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
wa.create().then(client => start(client))

function start(client){
    client.onMessage(async message => {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        //console.log("groupId:",chat.groupMetadata.id)
        // if(message.body === 'Hi'){
        //     await client.sendText(message.from, '👋 Hello!')
        //     // console.log(```Sent Hi to $message.from```)
        // }
        // if(message.body === 'Hello'){
        //     await client.sendText(message.from, 'Hello ke aage bhi kuch bol le bhai')
        //     // console.log(message.from)
        // }
        const commands = message.caption || message.body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        //console.log(command);
        //const args = command.split(' ')
        if(command === '#say'){
            // if(message.isGroupMsg){
                const ttsEn = require('node-gtts')('en')
                const dataText = message.body.slice(4)
                //console.log ('dataText:', dataText);
                if (dataText === '') return client.reply(from, 'Arey kehna kya chahte ho', message.id)
                if (dataText.length > 200) return client.reply(message.from, 'Bot hun toh itna bada message translate karwayega?', message.id)
                if(dataText.includes('bot') || dataText.includes('GT') || dataText.includes("GtXtreme") || dataText.includes("Gaurav")){
                    ttsEn.save('./media/tts/resEn.mp3', "Mere bare me kuch nahi bolna", function () {
                        client.sendPtt(message.from, './media/tts/resEn.mp3', message.id)
                    })
                } 
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                        client.sendPtt(message.from, './media/tts/resEn.mp3', message.id)
                    })
                
                
                
            // }
            
        }
        if(command === '#menu'){
            client.sendText(message.from,menu)
        }
        if(command === '#admins'){
            try {
                const groupAdmins = messsage.isGroupMsg ? await client.getGroupAdmins(chat.groupMetadata.id): "";
            console.log("groupAdmins", groupAdmins);
            //if (message.isGroupMsg) return client.reply(message.from, 'These are your group admins', message.id)
            let temp = 'These are the group admins\n'
            for (let admin of groupAdmins) {
                console.log("admin:", admin);
                temp += `➸ @${admin.replace(/@c.us/g, '')}\n` 
            }
            return await client.sendTextWithMentions(from, temp)
            } catch (error) {
                console.error(error);
            }
            
        }
        if(command === '#sticker') {
            if(isMedia && type == 'image'){
                const mediaData = await wa.decryptMedia(message, uaOverride)
                const imgbase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imgbase64)
            }
            else if(quotedMsg && quotedMsg.type == 'image'){
                const mediaData = await wa.decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            }
        }

        if(command === '#animated') {
            if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    const mediaData = await wa.decryptMedia(message, uaOverride)
                    //client.reply(from, 'Woosh! Your animated sticker is here!', id)
                    const filename = `./media/media.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    try{
                        await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                            if(!error){
                                const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                                await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                            }
                            else {
                                console.error(error)
                            }
                            
                        })
                    }catch (err){
                        console.error(err)
                    }
                    
                } else (
                    client.reply(from, '10 sec se kam de bhai!Bohot load hai', id)
                )
            }
            else{
                client.reply(from, 'Command sahi type karle bhai', id)
            }
        }
        
    })
}