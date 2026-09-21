const API_BASE = import.meta.env.VITE_API_URL + "/api/user-settings";

const handleResponse = async (res, errorMsg) => {
    if (!res.ok)
        throw new Error(errorMsg);
    return res.json();
};

const userSettingsApi = {
    getUserSettings: async () => {
        const res = await fetch(`${API_BASE}`, {
            credentials: "include"
        });

        return handleResponse(res, "Failed to fetch user settings");
    },

    updateUserSettings: async (settings) => {
        const res = await fetch(`${API_BASE}`, {
            credentials: "include",
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings)
        });

        return handleResponse(res, "Failed to update user settings");
    }
}

export default userSettingsApi;