// Make sure you don't change the formatting

function getMenu() {
    return `
    WELCOME TO GtXtreme's Bot !\n\nI am being constantly developed so features will be added soon\nPlease note that bots are not officially supported on WhatsApp and don't spam commands\nThe Bot works on priority basis i.e if your group sends a lot of commands all other groups which the bot is in will get delayed replies and it will honour your request first\n\n**List of all Available commands**
    \n*#menu*:\nTo display this menu
    \n*#admins*:\nTo display the admins of the group
    \n*#say [text]*:\nProduces a Google Voice Translation for the given text (English)
    \n*#sticker*:\nMakes the bot do some sticker kung fu;\nReply with #sticker to an image\nOR\nUpload an image with #sticker as caption 
    \n*#animated*:\nMakes the bot do some animated sticker magic\nUpload a video/gif(<10s) with #animated or reply to a message with gif/video(<10s) using #animated
    \n*#everyone [text]*:\n Sends the text to everyone
    \n*#getkitty*:\n Sends a kitty as a reply (Surprise!)
    \n*#grouplink*:\nGet the invite link of the group (Bot has to be admin to work)\n\nList of features being worked upon :\n*#abuse*:\nAbuses someone from the group randomly*#track [id]*:\nTracks an order from delivery services (optional/maynot be implemented)*#ytmp4 [link]*:\nGrabs you an mp4 from  a given youtube link
    \n\n*Many More coming soon*\n\n*PM for a request*
    `
}

exports.menu = getMenu()