'use client'

export function createAccount(
    setLoading: any, 
    loading: boolean, 
    email: string,
    username: string,
    password: string
) {
    if (!loading) {
      setLoading(true)
      fetch(window.location.origin.replace("3000", "4000") + "/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password
        })
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error creating account:", error);
      })
      .finally(() => {
        setLoading(false);
      });   
    }
}

export function Login(
    setLoading: any,
    loading: boolean,
    email: string,
    password: string
) {    
    if (!loading) {
      setLoading(true)
      fetch(window.location.origin.replace("3000", "4000") + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          window.location.replace("/")
        }
      })
      .catch((error) => {
        console.error("Error creating account:", error);
      })
      .finally(() => {
        setLoading(false);
      });   
    }
  }
