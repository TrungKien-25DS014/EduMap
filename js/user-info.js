const UserInfo = {
    getUserID: () => {
        return localStorage.getItem('userID');
    },
    isLoggedIn: () => {
        return !!localStorage.getItem('userID');
    },
    getUserProfile: async () => {
        const userID = UserInfo.getUserID();
        if (!userID) return null;
        try{
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userID)
                .Single();
            if (error) throw error;
            return data;
        }catch(e) {
            console.error("Lỗi khi lấy thông tin người dùng:", e.message);
            return null;
        }
    }
};
window.UserInfo = UserInfo;