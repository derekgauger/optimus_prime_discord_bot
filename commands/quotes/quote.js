const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder } = require('discord.js')
const GoogleImages = require('google-images');
const nodeHtmlToImage = require('node-html-to-image')

require('../../functions/discord_messages/createInfo')

API_KEY = "AIzaSyBzGrEpB8KAZPFes6UdvolT7jXWcB6zXuY"
SEARCH_ENGINE_ID = "cb6bd904687d57c4e"

const googleClient = new GoogleImages(SEARCH_ENGINE_ID, API_KEY);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription("Creates a quote")
        .addStringOption((option) => option.setName("quote").setDescription("The quote you would like to make").setMaxLength(200).setRequired(true))
        .addStringOption((option) => option.setName("name").setDescription("The name of the person that said the quote").setMaxLength(32).setRequired(true)),

    async execute(interaction, client) {
        
        await interaction.deferReply();

        try {
            const phrase = interaction.options.getString('quote')
            const name = interaction.options.getString('name')
    
    
            const images = await googleClient.search('nature wallpaper light', {page: Math.floor(Math.random()*10)})
    
            const current_image = images[Math.floor(Math.random()*images.length)]
    
            let font_size = 45;
    
            if (100 < phrase.length) {
                font_size = 38
    
            } else if (100 < phrase.length && phrase.length <= 150) {
                font_size = 34
    
            } else if (150 < phrase.length) {
                font_size = 32
    
            }
    
            let overflow = "overflow-wrap: break-word;"
            for (const string of phrase.split(" ")) {
                if (string.length >= 35) {
                    overflow = "word-break: break-all;"
                }
            }
    
            
            const _htmlTemplate = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    
                <style>
                
                body {
                    font-family: "Comic Sans MS", "Comic Sans", cursive;
                    background: rgb(22, 22, 22);
                    color: #fff;
                  }
                
                  .app {
                    position: relative;
                    text-align: center;
                    color: white;
                  }
                
                  .centered {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    -webkit-text-stroke: 1px black;
                    -webkit-text-fill-color: white;
                    font-weight: 600;
                    ${overflow}
                    font-size: ${font_size}px;
                  }
                
                </style>
                </head>
              <body>
              <div class="app">
                  <img width="800px" height="500px" style="object-fit: fill" src="${current_image.url}" />
                  <div class="centered">"${phrase}"</br> - ${name}</div>
                
                </div>
              </body>
            </html>
            `
    
            const image = await nodeHtmlToImage({
                html: _htmlTemplate,
                quality: 100,
                type: 'png',
                puppeteerArgs: {
                    args: ['--no-sandbox'],
                },
                encoding: 'buffer',
            })
    
            await interaction.editReply({
                files: [new AttachmentBuilder(image, { name: `${name}.png` })]
            }).catch(err => console.log(err))
        } catch (error) {
            console.log(error)
            await interaction.editReply({
                content: "There was an internal error : Contact Dirk#8540"
            })
        }
    }
}


