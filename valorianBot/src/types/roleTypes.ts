import discord from 'discord.js'
import '../handler/parseRole.js'

export interface IRole {
    id: string;
    name: string;
    color: string;
}

export class Role {
    private _id: string;
    private _name: string;
    private _color: number;
    private _guild: discord.Guild;
    private _role: discord.Role;

    constructor(role: discord.Role) {
        this._id = role.id;
        this._name = role.name;
        this._color = role.color;
        this._guild = role.guild;
        this._role = role;
    }

    public returnRole(): discord.Role {
        const role = this._guild.roles.cache.find(role => role.id === this._id);
        if (role) {
            return role;
        } else {
            throw new Error('Role not found');
        }
    }
    
    public get id(): string { return this._id; }
    public get name(): string { return this._name; }
    public get color(): number { return this._color; }

    public set id(id: string) { this._id = id; }
    public set name(name: string) { this._name = name; }
    private set color(color: number) { this._color = color; }

    public static fromJSON(json: any): Role { return new Role(json.role); }

    public static fromJSONArray(json: any[]): Role[] { return json.map(Role.fromJSON); }

    public static toJSON(role: Role): object {
        return {
            id: role._id,
            name: role._name,
            color: role._color,
            guild: role._guild,
            role: role._role
        };
    }

    public static toJSONArray(roles: Role[]): object[] { return roles.map(Role.toJSON); }
}