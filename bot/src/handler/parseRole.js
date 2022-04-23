// Take a given role name or id and return the role object.
module.exports = (guild, role) => {
    const roles = guild.roles.cache
    const roleName = role.toLowerCase()
    const roleId = role.replace(/[^0-9]/g, '')

    if (roleId.length > 0) {
        const _role = roles.get(roleId)
        if (_role) return _role
    }

    const _role = roles.find(r => r.name.toLowerCase() === roleName)
    if (_role) return _role

    return null
}