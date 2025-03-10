'use client'
import {
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
  
export default function CreateAccount() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

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
          <TextInput value={username} onChange={(e) => setUsername(e.target.value!)} label="Username" placeholder="Struan Mclean" required />
          <TextInput value={email} onChange={(e) => setEmail(e.target.value!)} label="Email" placeholder="struanmclean16@gmail.com" required mt="md" />
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value!)} label="Password" placeholder="Your password" required mt="md" />
          <Group justify="space-between" mt="lg">
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button loading={loading} onClick={() => {
            createAccount(setLoading, loading, email, username, password)
            Login(setLoading, loading, email, password)
          }} fullWidth mt="xl">
            Create Account
          </Button>
        </Paper>
      </Container>
    </Center>
  );
}