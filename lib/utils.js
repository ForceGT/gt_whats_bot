function getMenu() {
    return `
    WELCOME TO GtXtreme's Bot !\n\nI am being constantly developed so features will be added soon\nPlease note that bots are not officially supported on WhatsApp and don't spam commands\nThe Bot works on priority basis i.e if your group sends a lot of commands all other groups which the bot is in will get delayed replies and it will honour your request first\n\n**List of all Available commands**
    \n*#menu*:\nTo display this menu
    \n*#say [text]*:\nProduces a Google Voice Translation for the given text (English)
    \n*#sticker*:\nMakes the bot do some sticker kung fu;\nReply with #sticker to an image\nOR\nUpload an image with #sticker as caption 
    \n*#animated*:\nJust like *#sticker* but this one produces an animated sticker (video/gif<10s only)
    `
}

exports.menu = getMenu()