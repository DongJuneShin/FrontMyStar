import Cookies from 'js-cookie'

export const getToken = () => Cookies.get('accessToken')

export const getUserFromToken = () => {
    const token = getToken()
    return parseJwt(token)
}

export const parseJwt = (token) => {
    if (!token) return null

    try {
        const base64Url = token.split('.')[1]
        if (!base64Url) return null

        // Base64Url -> Base64 변환
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

        // 디코딩 (브라우저에서 atob 사용)
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )

        return JSON.parse(jsonPayload)
    } catch (e) {
        console.error('JWT 디코딩 실패:', e)
        return null
    }
}