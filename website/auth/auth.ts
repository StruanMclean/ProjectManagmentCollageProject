'use client'

export const URL = "http://67.205.163.69:4000"

export function createAccount(
    setLoading: any, 
    loading: boolean, 
    email: string,
    username: string,
    password: string
) {
    if (!loading) {
      setLoading(true)
      fetch(`${URL}/users/create`, {
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
      fetch(`${URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true"
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
