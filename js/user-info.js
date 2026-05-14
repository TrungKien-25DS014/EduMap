const UserInfo = {
    getUserID: async () => {
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        return user ? user.id : null;
    },
    isLoggedIn: async () => {
        const id = await UserInfo.getUserID();
        return !!id;
    },
    getUserProfile: async () => {
        const userID = await UserInfo.getUserID();
        if (!userID) return null;
        try {
            const { data, error } = await window.supabaseClient
                .from('accounts')
                .select('*')
                .eq('id', userID)
                .single(); 
            if (error) throw error;
            return { userProfile: data }; 
        } catch(e) {
            console.error("Lỗi khi lấy thông tin người dùng:", e.message);
            return null;
        }
    }
};
window.UserInfo = UserInfo;