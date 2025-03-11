import { Center, Loader } from '@mantine/core'
import { createContext, useState, useEffect, useContext } from 'react'

export const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    const checkAuthStatus = () => {
        setLoading(true)

        try {
            fetch(window.location.origin.replace("3000", "4000") + "/auth/check", {
                method: "GET",
                credentials: 'include',
                headers: {
                  "Accept": "application/json"
                }
              })
              .then((response) => {
                if (!response.ok) {
                    if (
                        window.location.pathname != "/auth/login" &&
                        window.location.pathname != "/auth/create-account"
                    ) {
                        window.location.replace("/auth/login")
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then((data) => {
                setIsAuthenticated(data.isAuthenticated)
                setUser(data.user)
              })
              .catch((error) => {
                console.error("Error creating account:", error);
              })
              .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1500);
              });   
        } 
        catch {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkAuthStatus()
    }, [])

    if (loading == true) {
        return (
            <Center w="100vw" h="100vh">
                <Loader></Loader>
            </Center>
        )
    }

    const value: any = {
        user,
        isAuthenticated,
        loading,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}