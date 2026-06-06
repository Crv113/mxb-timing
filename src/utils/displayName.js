export const getDisplayName = (user) =>
    user?.name || user?.discord_global_name || user?.discord_username || '';
