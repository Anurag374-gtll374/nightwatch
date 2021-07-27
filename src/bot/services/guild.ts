import { GuildService as IGuildService } from '../interfaces'
import { Guild } from 'discord.js'
import { api } from '../utils'
import {
  Guild as BotGuild,
  GuildSettings,
  GuildSupportTicket,
  GuildSuggestion,
  GuildSelfAssignableRole,
  Song
} from '../../db'
import { injectable } from 'inversify'

@injectable()
export class GuildService implements IGuildService {
  public readonly create = async (guild: Guild) => {
    const existingGuild = await this.find(guild.id).catch(() => null)

    if (existingGuild) {
      return existingGuild
    }

    const newGuild = new BotGuild()
    newGuild.id = guild.id
    newGuild.settings = new GuildSettings()
    newGuild.name = guild.name

    const postRoute = `/guilds`

    return api.post<BotGuild>(postRoute, newGuild).then(x => x.data)
  }

  public readonly find = async (id: string): Promise<BotGuild | undefined> => {
    const route = `/guilds/${id}`

    return api.get<BotGuild>(route).then(response => response.data)
  }

  public readonly createSupportTicket = async (
    id: string,
    ticket: GuildSupportTicket
  ) => {
    const route = `/guilds/${id}/support-tickets`

    return api.post<GuildSupportTicket>(route, ticket).then(x => x.data)
  }

  public readonly updateSupportTicket = async (
    id: string,
    ticketId: number,
    ticket: GuildSupportTicket
  ) => {
    const route = `/guilds/${id}/support-tickets/${ticketId}`

    return api.put<GuildSupportTicket>(route, ticket).then(x => x.data)
  }

  public readonly createSuggestion = async (id: string, ticket: GuildSuggestion) => {
    const route = `/guilds/${id}/suggestions`

    return api.post<GuildSuggestion>(route, ticket).then(x => x.data)
  }

  public readonly updateSuggestion = async (
    id: string,
    ticketId: number,
    ticket: GuildSuggestion
  ) => {
    const route = `/guilds/${id}/suggestions/${ticketId}`

    return api.put<GuildSuggestion>(route, ticket).then(x => x.data)
  }

  public readonly findSelfAssignableRoles = async (id: string) => {
    const route = `/guilds/${id}/self-assignable-roles`

    return api.get<GuildSelfAssignableRole[]>(route).then(response => response.data)
  }

  public readonly findSelfAssignableRole = async (id: string, roleId: string) => {
    const route = `/guilds/${id}/self-assignable-roles/${roleId}`

    return api.get<GuildSelfAssignableRole>(route).then(response => response.data)
  }

  public readonly createSelfAssignableRole = async (
    id: string,
    selfAssignableRole: GuildSelfAssignableRole
  ) => {
    const route = `/guilds/${id}/self-assignable-roles`

    return api.post<GuildSelfAssignableRole>(route, selfAssignableRole).then(x => x.data)
  }

  public readonly deleteSelfAssignableRole = async (id: string, roleId: string) => {
    const route = `/guilds/${id}/self-assignable-roles/${roleId}`

    await api.delete(route)
  }

  public readonly findPlaylist = async (id: string) => {
    const route = `/guilds/${id}/playlist`

    return api.get(route).then(r => r.data)
  }

  public readonly findPlaylistSongsByUserId = async (id: string, userId: string) => {
    const route = `/guilds/${id}/playlist/user/${userId}`

    return Promise.resolve(api.get(route)).then(r => r.data)
  }

  public readonly createSong = async (id: string, song: Song) => {
    const route = `/guilds/${id}/playlist`

    return api.post(route, song).then(r => r.data)
  }

  public readonly deleteSong = async (id: string, songId: number) => {
    const route = `/guilds/${id}/playlist/${songId}`

    await api.delete(route)
  }

  public readonly clearPlaylist = async (id: string) => {
    const route = `/guilds/${id}/playlist`

    await api.delete(route)
  }

  public readonly deleteSongsByUserId = async (id: string, userId: string) => {
    const route = `/guilds/${id}/playlist/user/${userId}`

    await api.delete(route)
  }
}
