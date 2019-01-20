import { GuildService as IGuildService } from '../interfaces'
import { Guild } from 'discord.js'
import { api } from '../utils'
import { Guild as BotGuild, GuildSettings } from '../../db'
import { injectable } from 'inversify'

@injectable()
export class GuildService implements IGuildService {
  public create = async (guild: Guild) => {
    const existingGuild = await this.find(guild.id)

    if (existingGuild) {
      return
    }

    const newGuild = new BotGuild()
    newGuild.id = guild.id
    newGuild.settings = new GuildSettings()
    newGuild.name = guild.name

    const postRoute = `/guilds`

    await api.post(postRoute, newGuild)
  }

  public find = async (id: string) => {
    const route = `/guilds/${id}`

    const { data } = await api.get(route)

    return data
  }
}
