export default {
    curEmp: {
        employeeId: 0,
        token: '',
        rights: [],
        company: {
            logo: undefined,
            defaultLanguage: undefined,
            name: undefined
        },
    },
    payload:
    {
        visibilityAppbar: true,
        isAuthenticated: false,
        redirect: '',
        isLoading: false,
        error: {
            status: 0,
            code: 0,
            message: '',
            exception: false
        },
        errors: [],
        success: false,
        editSuccess: false,
        changePWSuccess: false,
        type: 'VIEW'
    },
    error: {
        status: 0,
        code: 0,
        message: '',
        exception: false
    }
};
