const wa = require('@open-wa/wa-automate');
const fs = require('fs-extra');
const {exec} = require('child_process')
const {menu} = require('./lib/utils');
const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
wa.create().then(client => start(client))

function start(client){
    client.onMessage(async message => {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        const groupId = isGroupMsg ? chat.groupMetadata.id : "";
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId): "";
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes("919028833886" + '@c.us') : false
        const { name, formattedTitle } = chat
        let { body } = message
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        
        //const args = command.split(' ')
        if(command === '#say'){
            // if(message.isGroupMsg){
                const ttsEn = require('node-gtts')('en')
                const dataText = body.slice(4)
                //console.log ('dataText:', dataText);
                if (dataText === '') return client.reply(from, 'Arey kehna kya chahte ho bhai', id)
                if (dataText.length > 200) return client.reply(from, 'Bot hun toh itna bada message translate karwayega?', id)
                if(dataText.includes('bot') || dataText.includes('GT') || dataText.includes("GtXtreme") || dataText.includes("Gaurav") || dataText.includes("gaurav")){
                    ttsEn.save('./media/tts/resEn.mp3', "मेरे बारे में कुछ मत बोलो भाई", function () {
                        return client.sendPtt(from, './media/tts/resEn.mp3', id)
                    })
                } else{
                    ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                        client.sendPtt(from, './media/tts/resEn.mp3', id)
                    })
                }
            // }  
        }
        if(command === '#menu'){
            client.sendText(from,menu)
        }
        if(command === '#admins'){
            try {
                
            //console.log("groupAdmins", groupAdmins);
            if (isGroupMsg) client.reply(from, 'These are your group admins', id)
            let temp = ''
            for (let admin of groupAdmins) {
                //console.log("admin:", admin);
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
                client.reply(from, 'Bana diya sticker ab paisa lao!', id)
                await client.sendImageAsSticker(from, imgbase64)
            }
            else if(quotedMsg && quotedMsg.type == 'image'){
                const mediaData = await wa.decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Bana diya sticker ab paisa lao!', id)
                await client.sendImageAsSticker(from, imageBase64)
            }
            else{
                client.reply(from, "Sahi command type karlo bhai")
            }
        }

        if(command === '#animated') {
            if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    const mediaData = await wa.decryptMedia(message, uaOverride)
                    client.reply(from, 'Woosh! Your animated sticker is here!', id)
                    const filename = `./media/media.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    try{
                        await exec(`gify ${filename} ./media/output.gif --fps=60 --scale=320:320`, async function (error, stdout, stderr) {
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
        if(command === "#grouplink"){
            if(isBotGroupAdmins) return client.reply(from, "Mai admin nahi hun bhai!", id)
            if(isGroupMsg){
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from,inviteLink,`\n Group Link for ${name}`)
            }
            else{
                client.reply(from, "Group me hi chalega")
            }
        }
        if(command === "#everyone"){
             if(isGroupMsg){
                const groupMembers = await client.getGroupMembers(groupId)
                const dataText = body.slice(9)
                if(dataText){

            
                let temp ='';
                for (let index = 0; index < groupMembers.length; index++) {
                    temp +='╠➥'
                    temp+=`@${groupMembers[index].id.replace(/@c.us/g, '')}\n`
                }
                temp+=`\n ${dataText}`;
                await client.sendTextWithMentions(from, temp);
            }
            else{
                client.reply(from, "Arey kehna kya chahte ho bhai")
            }
             }else{
                client.reply(from, "Group me hi chalega")
             }
        }
        
    })
}