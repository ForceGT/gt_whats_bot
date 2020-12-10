const wa = require('@open-wa/wa-automate');
var request = require('request');
const fs = require('fs-extra');
const {exec} = require('child_process')
const {menu} = require('./lib/utils');
const { stat } = require('fs');
const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
wa.create().then(client => start(client))

function start(client){
    client.onMessage(async message => {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        const groupId = isGroupMsg ? chat.groupMetadata.id : "";
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId): "";
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes("919090542359" + '@c.us') : false
        const { name, formattedTitle } = chat
        let { body } = message
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''

        //client.sendText(from, "Server Reboot!")
        
        //const args = command.split(' ')
        if(command === '#say'){
            // if(message.isGroupMsg){
                const ttsEn = require('node-gtts')('en')
                const dataText = body.slice(4)
                //console.log ('dataText:', dataText);
                try {
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
                } catch (error) {
                    console.error(error)
                }
               
            // }  
        }
        if(command === '#covid'){
            const statecode = body.slice(7, 9)
            const districtcode = body.slice(10)
            if(!statecode || !districtcode) return client.reply(from, "Arey kehna kya chahte ho bhai!", id)
            let temp = 'Here are your stats\n';
            // console.log("statecode",statecode)
            // console.log("districtcode",districtcode)
            request("https://api.covid19india.org/v2/state_district_wise.json",(error,response,body)=>{
            if(!error && response.statusCode == 200)
            {
                districtdata = body;
                res = JSON.parse(districtdata);
                i = Number.parseInt(0);
                j = Number.parseInt(0);
                cont = true;
                //console.log("Response:",res[i])
                while(cont === true && i<37){
                    // // arr = res[i];
                    // console.log(`Response ${i}:${res[i]}`)
                    //console.log(`${Object.values(res[i])} - ${res[i]["statecode"]}\n`)
                    if(res[i]["statecode"] === statecode){
                        distd = res[i]["districtData"];
                        while(true){
                            if(distd[j] === undefined) return client.reply(from, "Nahi Mila Bhai! Try Correcting state/district",id)
                            if(distd[j]["district"] === districtcode){
                                // console.log(j);
                                // global.cont = false;
                                // global.rRecovered = distd[j].recovered;
                                // global.rActive = distd[j].active;
                                // global.rConfimed = distd[j].confirmed;
                                // global.rDeceased = distd[j].deceased;
                                // console.log(distd[j].recovered);
                                // console.log(distd[j].active);
                                // console.log(distd[j].confirmed);
                                // console.log(distd[j].deceased);
                                temp+= `*Recovered*: ${distd[j].recovered}\n*Active*: ${distd[j].active}\n*Confirmed*: ${distd[j].confirmed}\n*Deceased* ${distd[j].deceased}`
                                client.reply(from,temp,id)
                                break;
                            }
                            j++;
                        }
                        break;
                    }
                    i++
                }
            }
            else{
                console.error(error)
            }
        })
        }
        if(command === '#menu'){
            client.sendText(from,menu)
        }
        if(command === '#admins'){
            try {
                
            //console.log("groupAdmins", groupAdmins);
            if (isGroupMsg) client.reply(from, 'These are your group admins', id)
            let temp = ''
            const Owner_ = chat.groupMetadata.owner
            temp+=`Owner of the group is: @${Owner_}\n`
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

            try {
                if(isMedia && type == 'image'){
                    const mediaData = await wa.decryptMedia(message, uaOverride)
                    const imgbase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendImageAsSticker(from, imgbase64)
                    client.reply(from, 'Bana diya sticker ab paisa lao!', id)
                }
                else if(quotedMsg && quotedMsg.type == 'image'){
                    const mediaData = await wa.decryptMedia(quotedMsg, uaOverride)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64)
                    client.reply(from, 'Bana diya sticker ab paisa lao!', id)
                }
                else{
                    client.reply(from, "Sahi command type karlo bhai")
                }
            } catch (error) {
                const filename = `./media/funnystickers/thakgayahun.png`
                const stickerBase64 = await fs.readFileSync(filename, {encoding:"base64"})
                await client.sendImageAsSticker(from,`data:image/png;base64,${stickerBase64}`)
                console.error(error);
            } 
        }

        if(command === '#animated') {

            try {
                if (isMedia) {
                    console.log("mimeType:",mimetype)
                    if ((mimetype === 'video/mp4' && message.duration < 5) || (mimetype === 'image/gif' && message.duration < 5)) {
                        const mediaData = await wa.decryptMedia(message, uaOverride)
                        const filename = `./media/media.${mimetype.split('/')[1]}`
                        await fs.writeFileSync(filename, mediaData)
                        try{
                            await exec(`gify ${filename} ./media/output.gif --fps=15 --scale=350:350`, async function (error, stdout, stderr) {
                                if(!error){
                                    const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                                    await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                                    client.reply(from, 'Woosh! Your animated sticker is here!', id)
                                }
                                else {
                                    const filename = `./media/funnystickers/thakgayahun.png`
                                    const stickerBase64 = await fs.readFileSync(filename, {encoding:"base64"})
                                    await client.sendImageAsSticker(from,`data:image/png;base64,${stickerBase64.toString('base64')}`)
                                    //console.error(error)
                                    
                                }
                                
                            })
                        }catch (err){
                            const filename = `./media/funnystickers/thakgayahun.png`
                            const stickerBase64 = await fs.readFileSync(filename, {encoding:"base64"})
                            await client.sendImageAsSticker(from,`data:image/png;base64,${stickerBase64.toString('base64')}`)
                            //console.error(err)
                            
                        }
                        
                    } 
                    // else if (mimetype === 'video/mp4'){
                    //     const filename = `./media/funnystickers/thakgayahun.png`
                    //     const stickerBase64 = await fs.readFileSync(filename, {encoding:"base64"})
                    //     await client.sendImageAsSticker(from,`data:image/png;base64,${stickerBase64.toString('base64')}`)
                    // }
                    else {
                        //client.reply(from, '10 sec se kam de bhai!\nBohot load hai!', id)
                        const filename = `./media/funnystickers/thakgayahun.png`
                        const stickerBase64 = await fs.readFileSync(filename, {encoding:"base64"})
                        await client.sendImageAsSticker(from,`data:image/png;base64,${stickerBase64.toString('base64')}`)
                    }
                        
                        
                        
                    
                }
                else{ 
                    client.reply(from, 'Command sahi type karle bhai', id)
                } 
            } catch (error) {
                const filename = `./media/funnystickers/thakgayahun.png`
                const stickerBase64 = await fs.readFileSync(filename, {encoding:"base64"})
                await client.sendImageAsSticker(from,`data:image/png;base64,${stickerBase64.toString('base64')}`)
                //console.error(error);
                
            }
            
            
        }
        if(command === "#grouplink"){
            
            try {
                if(!isBotGroupAdmins) return client.reply(from, "BC Pehle mujhe admin bana!", id)
                if(isGroupMsg){
                    const inviteLink = await client.getGroupInviteLink(groupId);
                    client.sendLinkWithAutoPreview(from,inviteLink,`\n Here's the group link for ${name}`)
                }
                else{
                    client.reply(from, "Group me hi chalega")
                }
            } catch (error) {
                console.error(error);
            }
            
        }
        if(command === "#compliment"){
            try{
                let temp = "";
                request('https://complimentr.com/api', function (error, response, body) {
                res = JSON.parse(response.body);
                //console.log(res['compliment']);
                // client.reply(from, res['compliment'], id);
                temp+=`@${sender.id.replace(/@c.us/g, '')}\n${res['compliment']}`
                client.sendTextWithMentions(from,temp)
            });
            } catch (error){
                console.error(error);
            }
        }
        if(command === "#everyone"){
            try {
                if(!isGroupAdmins) return client.reply(from, "Bot ki shakti ka galat istemaal?\nOnly admins can do that!", id)
                if(isGroupMsg){
                   const groupMembers = await client.getGroupMembers(groupId)
                   const dataText = body.slice(9)
                   if(dataText){
                   let temp ='';
                   for (let index = 0; index < groupMembers.length; index++) {
                       temp+=`@${groupMembers[index].id.replace(/@c.us/g, '')}\t`
                   }
                   temp+=`\n${dataText}`;
                   await client.sendTextWithMentions(from, temp);
                    }
                    else{
                        client.reply(from, "Arey kehna kya chahte ho bhai", id)
                    }
                }
                else{
                   client.reply(from, "Group me hi chalega",id)
                }
            } catch (error) {
                console.error(error); 
            }  
        }

        if(command === "#getkitty") {
            try {
                q1 = Math.floor(Math.random() * 900) + 300;
                q2 = Math.floor(Math.random() * 900) + 300;
                client.sendFileFromUrl(from, 'http://placekitten.com/'+q1+'/'+q2, `kitty.png_${q1}`,'Say Hi to Kitty!',id)
            } catch (error) {
                console.error(error)
            }
        }
        if(command === "#abuse"){
        
            try {
                let dataText = body.split(" ")[1]
                if(isGroupMsg){
                    if(dataText === "@919090542359"){
                        ttsEn.save('./media/tts/resEn.mp3', "मेरे बारे में कुछ मत बोलो भाई", function () {
                            return client.sendPtt(from, './media/tts/resEn.mp3', id)
                        })
                    }
                    const pathList = ["hindustani_nikal_lavde.mp3","ae_ji_gaali_de_raha.mp3","dadda_addha.mp3","roti_chawal.mp3","rowdy_abuse.mp3","chal_bsdk.mp3","pramod_dubey_maa_chod.mp3","teri_ma_ki.mp3","hatt_teri.mp3","tori_ma.mp3","chut_faad.mp3"]
                    let selectedAudio = pathList[Math.floor(Math.random() * pathList.length)]
                    const groupMembers = await client.getGroupMembers(groupId)
                    groupMembers.filter(function(item){
                        // Remove the bot number 
                        return item.id !== "919090542359@c.us"
                    })
                    let selectedMember = groupMembers[Math.floor(Math.random() * groupMembers.length)]
                    
                    const audioId = client.sendFile(from,`./media/abuseAudios/${selectedAudio}`,"gaali.mp3","Yeh lo gaali khao!",waitForId=true)
                    audioId.then((audioIdval)=>{
                        // console.log("audioIdval", audioIdval)
                        // console.log("selectedMember", selectedMember.id.replace(/@c.us/g, ''))
                        // const countryCode = `${selectedMember.id.replace(/@c.us/g, '').slice(0,3)}`
                        // const number = `${selectedMember.id.replace(/@c.us/g, '').slice(4, selectedMember.id.length)}`
                        // client.reply(from, `@+${countryCode}${number}`,audioIdval)
                        // console.log(dataText)
                        if(!dataText || !dataText.includes("@")) return client.sendTextWithMentions(from, `@${selectedMember.id.replace(/@c.us/g, '')} Yeh lo gaali khao!`)
                        client.sendTextWithMentions(from,`${dataText} Yeh lo gaali khao!`)
                    })
                    // console.log("audioId", audioId)
                }else{
                    client.reply(from, "Group me hi chalega",id)
                }
            } catch (error) {
                console.log(selectedAudio)
                console.error(error)
            }
        }
        if(command === "#track"){
            client.reply(from, "WIP bruh!",id)
            // if(isGroupMsg) return client.reply(from, "Slide into DMs for this", id)
        }
        if(command === "#complement"){
            client.reply(from, "Oh Maths ke fan #compliment aata hai mujhe!",id)
        }
        
    })
}