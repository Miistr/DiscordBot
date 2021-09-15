import { Client, Intents } from 'discord.js'

import { BOT_TOKEN } from '../config/config.js'
import { TRANSLATE_COMMAND } from './commands/schemas.js'
import { getTranslation } from './services/translation.js'

const myIntents = new Intents()
myIntents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES
)

const guildId = '885925230005088319'
const client = new Client({ intents: myIntents })

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

const reply = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: { content: response },
        },
    })
}

client.on('ready', async () => {
    await getApp(guildId).commands.post(TRANSLATE_COMMAND)
})

client.ws.on('INTERACTION_CREATE', async (interaction) => {
    const { name, options } = interaction.data

    const command = name.toLowerCase()
    if (command === 'translate') {
        const translateString = options[0].value
        const translation = await getTranslation(translateString)

        reply(interaction, translation)
    }
})

// Login to Discord with your client's token
client.login(BOT_TOKEN)
