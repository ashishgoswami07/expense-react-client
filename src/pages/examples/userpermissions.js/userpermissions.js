export const ROLE_PERMISSIONS = {
    viewer: {
        viewDashboard: true,
        viewReports: true,
        viewProfile: true
    },

    manager: {
        viewDashboard: true,
        viewReports: true,
        viewProfile: true,

        createContent: true,
        updateContent: true,
        deleteOwnContent: true,

        manageTeamTasks: true,
        assignWork: true,

        exportData: true
    },

    admin: {
        viewDashboard: true,
        viewReports: true,
        viewProfile: true,

        createContent: true,
        updateContent: true,
        deleteContent: true,

        manageTeamTasks: true,
        assignWork: true,

        exportData: true,
        importData: true,

        manageUsers: true,
        manageRoles: true,
        manageSettings: true,

        accessAuditLogs: true,
        systemConfiguration: true,

        billingAccess: true,
        paymentManagement: true,

        databaseBackup: true,
        databaseRestore: true
    }
};


export const usePermission = () => {
    const user = useSelector((State) => State.userDetails);
    return ROLE_PERMISSIONS[user?.role] || {};
};

  