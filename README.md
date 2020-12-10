# GTXtreme Bot
A Whatsapp Bot just made for prank purposes

**Not being maintained anymore**

## Description
 This is not one of those usual ones made with selenium in headless mode but uses the much more powerful [open-wa](https://github.com/open-wa/wa-automate-nodejs) library
 
 This started off as an inspiration from [MhankBarBar's](https://github.com/MhankBarBar/whatsapp-bot) Whatsapp bot made using this (Thanks to him) but **is maintained no more**
 
 ## Tech Stack 
 - NodeJS
 - PupeteerJS

## File Distribution 
- *utils.js* : It contains all the commands the bot can answer
- *index.js* : It contains all the implementation of these commands

## How to use

You can use this code to start a bot off your own Whatsapp Number

1. Get all dependencies
```
npm i
```

2. Make sure to change the ```botNumber``` and ```botOwner``` variables in ```index.js```. This prevents the bots commands from being used against it xD
3. You will get a QR code in your terminal scan that using the number you want to use for the bot. The library remembers and you don't have to login each time. A ```
session.data.json``` will be generated which is the token
4. Start your server using
```
node index.js
```


## More Info

For any more modifications and detailed knowledge
Head over to [Open WA Docs](https://docs.openwa.dev/)


Feel free to fork and file a PR for changes
