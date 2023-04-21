const roleToChinese = (role) => {
    const roleMap = {
        admin: "管理员",
        user: "用户",
        // Add other roles and their Chinese translations as needed
    };

    return roleMap[role] || role;
};

const roleToEnglish = (role) => {
    const roleMap = {
        管理员: "admin",
        用户: "user",
        // Add other roles and their Chinese translations as needed
    };

    return roleMap[role] || role;
};

export { roleToChinese, roleToEnglish };