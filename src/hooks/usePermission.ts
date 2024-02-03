export const usePermission = () => {
    const allowedRoles = ["admin", "manager"];

    const _hasPermission = (user: User) => {
        return allowedRoles.includes(user.role);
    };

    return {
        hasPermission: _hasPermission
    };
}