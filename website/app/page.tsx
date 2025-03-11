'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { 
  Button, 
  Card, 
  Center, 
  Container, 
  Flex, 
  Group,
  Modal, 
  Skeleton, 
  Text, 
  TextInput, 
  Title,
  useMantineTheme 
} from "@mantine/core";
import {
  IconPackage,
  IconPlus,
  IconSquareCheck,
  IconUsers,
} from '@tabler/icons-react';
import { useDisclosure } from "@mantine/hooks";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [groupName, setGroupName] = useState("");

  const theme = useMantineTheme();

  function getLists() {
    try {
      fetch(window.location.origin.replace("3000", "4000") + "/data/get-groups", {
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
                window.location.replace("/auth/login");
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });   
    }
    catch {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLists();
  }, []);

  function createGroup() {
    if (!groupName.trim()) return;
    
    setLoading(true);
    fetch(window.location.origin.replace("3000", "4000") + "/data/create-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        name: groupName
      })
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error creating group:", error);
    })
    .finally(() => {
      setLoading(false);
    });   
  }

  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)',
      'linear-gradient(135deg, #37ecba 0%, #72afd3 100%)',
      'linear-gradient(135deg, #ebbba7 0%, #cfc7f8 100%)',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const skeletonItems = Array(6).fill(null);

  if (loading) {
    return (
      <Container size="lg" py={40}>
        <Group justify="space-between" mb={30}>
          <Title order={2}>My Groups</Title>
          <Skeleton height={36} width={120} radius="md" />
        </Group>
        
        <Flex gap="md" justify="flex-start" align="stretch" wrap="wrap">
          {skeletonItems.map((_, index) => (
            <Skeleton key={index} height={180} radius="md" style={{ flex: '1 1 300px', maxWidth: 'calc(33.333% - 16px)', minWidth: '250px' }} />
          ))}
        </Flex>
      </Container>
    );
  }

  const EmptyState = () => (
    <Container size="lg" py={40}>
      <Group justify="space-between" mb={30}>
        <Title order={2}>My Groups</Title>
        <Button 
          onClick={open}
          size="md"
          radius="md"
          leftSection={<IconPlus size={18} />}
          variant="filled"
          color={theme.primaryColor}
        >
          Create First Group
        </Button>
      </Group>

      <Card 
        withBorder 
        shadow="sm" 
        radius="md" 
        p="xl"
        style={{ 
          textAlign: 'center',
          backgroundColor: theme.primaryColor === 'dark' ? theme.colors.dark[7] : theme.white
        }}
      >
        <Center style={{ flexDirection: 'column', height: '60vh' }}>
          <IconPackage size={80} stroke={1.5} color={theme.colors.gray[5]} />
          <Text size="xl" fw={500} mt="md" color={theme.colors.gray[7]}>
            No Groups Yet
          </Text>
          <Text color="dimmed" size="sm" mt={5} mb="xl" maw={400}>
            Create your first group to start organizing your tasks and collaborate with others.
          </Text>
          <Button 
            onClick={open}
            size="md"
            radius="md"
            leftSection={<IconPlus size={18} />}
            variant="filled"
            color={theme.primaryColor}
          >
            Create First Group
          </Button>
        </Center>
      </Card>

      <Modal 
        opened={opened} 
        onClose={close} 
        title={<Text fw={600} size="lg">Create your first group</Text>} 
        centered 
        radius="md"
      >
        <TextInput 
          value={groupName} 
          onChange={(e) => setGroupName(e.target.value)} 
          label="Group Name" 
          placeholder="Enter a name for your group" 
          required 
          mt="md" 
          size="md"
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="subtle" onClick={close}>Cancel</Button>
          <Button 
            loading={loading} 
            onClick={() => createGroup()} 
            variant="filled"
            color={theme.primaryColor}
          >
            Create Group
          </Button>
        </Group>
      </Modal>
    </Container>
  );

  if (groups.length === 0) {
    return <EmptyState />;
  }

  return (
    <Container size="lg" py={40}>
      <Modal 
        opened={opened} 
        onClose={close} 
        title={<Text fw={600} size="lg">Create New Group</Text>} 
        centered 
        radius="md"
      >
        <TextInput 
          value={groupName} 
          onChange={(e) => setGroupName(e.target.value)} 
          label="Group Name" 
          placeholder="Enter a name for your group" 
          required 
          mt="md" 
          size="md"
        />

        <Group mt="xl">
          <Button variant="subtle" onClick={close}>Cancel</Button>
          <Button 
            loading={loading} 
            onClick={() => createGroup()} 
            variant="filled"
            color={theme.primaryColor}
          >
            Create Group
          </Button>
        </Group>
      </Modal>

      <Group justify="space-between" mb={30}>
        <Title order={2}>My Groups</Title>
        <Button 
          onClick={open}
          size="md"
          radius="md"
          leftSection={<IconPlus size={18} />}
          variant="filled"
          color={theme.primaryColor}
        >
          Create New Group
        </Button>
      </Group>
      
      <Flex gap="md" justify="flex-start" align="stretch" wrap="wrap">
        {groups.map((values: {
          id: number,
          name: string,
          user: [
            {
              pfp: string
            }
          ],
          Tasks: [
            {
              id: number
            }
          ]
        }) => (
          <Card 
            key={values.id} 
            p={0} 
            radius="md" 
            shadow="sm"
            style={{ 
              flex: '1 1 300px', 
              maxWidth: 'calc(33.333% - 16px)', 
              minWidth: '250px',
              height: '180px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows.md,
              }
            }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: getRandomGradient(),
                zIndex: 0,
              }} 
            />
            
            <Flex 
              direction="column" 
              justify="space-between" 
              h="100%" 
              p="md" 
              style={{ position: 'relative', zIndex: 1 }}
            >
              <div>
                <Text size="xl" fw={700} color="white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                  {values.name}
                </Text>
                
                <Group mt={5}>
                  <Group gap={4}>
                    <IconSquareCheck size={16} color="white" />
                    <Text size="sm" color="white" style={{ opacity: 0.9 }}>{values.Tasks?.length || 0} Tasks</Text>
                  </Group>
                  
                  <Group gap={4}>
                    <IconUsers size={16} color="white" />
                    <Text size="sm" c="white" style={{ opacity: 0.9 }}>
                      {values.user?.length || 1} Members
                    </Text>
                  </Group>
                </Group>
              </div>
              
              <Button 
                variant="white" 
                color="dark" 
                size="sm" 
                radius="md"
                onClick={() => window.location.replace(`/dashboard?groupId=${values.id}`)}
              >
                View Tasks
              </Button>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Container>
  );
}