import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let status = "Employee"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')
        isStudent = roles.includes('Student')

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"
        if (isStudent) status = "Student"

        return { username, roles, status, isManager, isAdmin,isStudent }
    }

    return { username: '', roles: [], isManager, isAdmin, isStudent,status }
}
export default useAuth