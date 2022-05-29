"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
require("../handler/parseRole.js");
class Role {
    constructor(role) {
        this._id = role.id;
        this._name = role.name;
        this._color = role.color;
        this._guild = role.guild;
        this._role = role;
    }
    returnRole() {
        const role = this._guild.roles.cache.find(role => role.id === this._id);
        if (role) {
            return role;
        }
        else {
            throw new Error('Role not found');
        }
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get color() { return this._color; }
    set id(id) { this._id = id; }
    set name(name) { this._name = name; }
    set color(color) { this._color = color; }
    static fromJSON(json) { return new Role(json.role); }
    static fromJSONArray(json) { return json.map(Role.fromJSON); }
    static toJSON(role) {
        return {
            id: role._id,
            name: role._name,
            color: role._color,
            guild: role._guild,
            role: role._role
        };
    }
    static toJSONArray(roles) { return roles.map(Role.toJSON); }
}
exports.Role = Role;
