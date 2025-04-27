'use client'
import {
  Alert,
    Anchor,
    Button,
    Center,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import classes from './Authentication.module.css';
import { useState } from 'react';
import { createAccount, Login } from '@/auth/auth';
import { z } from "zod";
import { IconInfoCircle } from '@tabler/icons-react';
  
export default function CreateAccount() {
  const icon = <IconInfoCircle />;
  
  const User = z.object({
    username: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(5)
  });

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [login, setLogin] = useState(false)

  const validate = () => {
    const val = User.safeParse({
      username: username,
      email: email,
      password: password
    })

    const errorMessage = val.error?.issues.map((val: z.ZodIssue) => {
      if (val.path[0] == "username") return "Invalid username min of 5 letters"
      if (val.path[0] == "email") return "Invalid email"
      if (val.path[0] == "password") return "Invalid password min of 5 letters"
    })

    setError(errorMessage?.join(", ") || "")

    return val.success
  }

  return (
    <Center h="100vh" w="100vw">
      <Container miw="30vw">
        <Title ta="center" className={classes.title}>
          Welcome!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do you have an account?{' '}
          <Anchor onClick={() => window.location.replace("/auth/login")} size="sm" component="button">
            Login
          </Anchor>
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          {
            error.length != 0 && (
              <Alert variant="light" color="red" title="Alert" icon={icon} maw={400}>
                {error}
              </Alert>
            )
          }
          {
            login == true && (
              <Alert variant="light" color="blue" title="Alert" icon={icon} maw={400}>
                Now navigate to the login page
              </Alert>
            )
          }
          <TextInput value={username} onChange={(e) => setUsername(e.target.value!)} label="Username" placeholder="Struan Mclean" required />
          <TextInput value={email} onChange={(e) => setEmail(e.target.value!)} label="Email" placeholder="struanmclean16@gmail.com" required mt="md" />
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value!)} label="Password" placeholder="Your password" required mt="md" />
          <Group justify="space-between" mt="lg">
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button loading={loading} onClick={() => {
            if (validate()) {
              createAccount(setLoading, loading, email, username, password)    
              setLogin(true)
            }

          }} fullWidth mt="xl">
            Create Account
          </Button>
        </Paper>
      </Container>
    </Center>
  );
}