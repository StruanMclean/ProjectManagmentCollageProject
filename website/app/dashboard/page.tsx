'use client'
import { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Text,
  Title,
  Card,
  Skeleton,
  Badge,
  Group,
  Box,
  Menu,
  Button,
  Modal,
  TextInput,
  Textarea,
  Stack,
  ActionIcon,
  Checkbox
} from "@mantine/core";
import { DateInput } from '@mantine/dates';
import {
    IconPlus,
    IconX,
    IconCalendar,
    IconTrash,
    IconArrowsLeftRight,
    IconChevronDown,
    IconInbox
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useWebSocket } from "@/lib/websocketClient";
import { URL } from "@/auth/auth";

interface Task {
  id: number;
  name: string;
  desc: string;
  status: string;
  to_be_done_by: string;
  amount_complete: number;
  users_assigned: [
    {
        name: string,
        email: string,
        pfp: string
    }
  ]
}

interface GroupData {
  id: number;
  name: string;
  Tasks: Task[];
}

interface StatusCategory {
  value: string;
  label: string;
  color: string;
}

export default function TasksPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [modalOpenedInvite, { open: openModalInvite, close: closeModalInvite }] = useDisclosure(false);
  const [taskName, setTaskName] = useState<string>('');
  const [taskDesc, setTaskDesc] = useState<string>('');
  const [taskDate, setTaskDate] = useState<Date | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [inviteEmails, setInviteEmails] = useState<string>('');
  
  const searchParams = useSearchParams();
  const groupId = parseInt(searchParams.get('groupId')!);
  const realtime = useWebSocket(groupId)

  const [toDelete, setToDelete] = useState<number[]>([])

  const statusCategories: StatusCategory[] = [
    { value: "TO_COMPLETE", label: "To Do", color: "blue" },
    { value: "WORKING_ON", label: "In Progress", color: "yellow" },
    { value: "FINISHED", label: "Done", color: "green" },
    { value: "TO_REVIEW", label: "To Review", color: "red" }
  ];

  const fetchTasks = async (): Promise<void> => {
    setLoading(true);

    try {
        const response = await fetch(`${URL}/data/get-tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                group_id: groupId
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: GroupData = await response.json();
        setGroupData(data);
        setTasks(data.Tasks || []);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    } finally {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }
  };

  const addTask = async (): Promise<void> => {
    if (!taskName.trim()) {
      setFormError('Task name is required');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');

    const taskToBeDoneBy = taskDate ? taskDate.toISOString() : new Date().toISOString();

    try {
        const response = await fetch(`${URL}/data/create-task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                group_id: groupId,
                name: taskName,
                desc: taskDesc,
                to_be_done_by: taskToBeDoneBy
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        await fetchTasks();
        
        resetForm();
        closeModal();
    } catch (error) {
        console.error("Error adding task:", error);
        setFormError('Failed to add task. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const inviteToGroup = async (): Promise<void> => {
    if (!inviteEmails.trim()) {
      setFormError('Task name is required');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');

    try {
        const response = await fetch(`${URL}/data/invite-user-group`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
              group_id: groupId,
              email: inviteEmails,
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        await fetchTasks();
        
        resetForm();
        closeModal();
    } catch (error) {
        console.error("Error adding task:", error);
        setFormError('Failed to add task. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const deleteTasks = async (): Promise<void> => {
    try {
        const response = await fetch(`${URL}/data/delete-task`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
              task_ids: toDelete
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        await fetchTasks();
    } catch (error) {
      await fetchTasks();
    } finally {
        setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTaskName('');
    setTaskDesc('');
    setTaskDate(null);
    setFormError('');
  };

  const resetFormInvite= () => {
    setInviteEmails('');
  };

  const handleOpenModal = () => {
    resetForm();
    openModal();
  };


  const handleOpenModalInvite = () => {
    resetFormInvite();
    openModalInvite();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    try {
      if (realtime.messages.data.length != 0) {
        setTasks(realtime.messages.data)
      }
    } catch {}
  }, [realtime])

  const getTasksByStatus = (status: string): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === "1970-01-01T00:00:00.000Z") return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const taskId = parseInt(draggableId.replace('task-', ''));
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return;

    const newTasks = [...tasks];
    newTasks[taskIndex] = {
      ...newTasks[taskIndex],
      status: destination.droppableId
    };

    setTasks(newTasks);

    const currentDateISOString: string = new Date().toISOString()

    fetch(`${URL}/data/update-task`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
            task_id: newTasks[taskIndex].id,
            name: newTasks[taskIndex].name,
            desc: newTasks[taskIndex].desc,
            to_be_done_by: currentDateISOString,
            status: destination.droppableId,
            amount_complete: newTasks[taskIndex].amount_complete,
            emails: newTasks[taskIndex].users_assigned.map((values, index) => {
                if (index == newTasks[taskIndex].users_assigned.length - 1) {
                    return values.email
                }
                return values.email + ","
            }).join("")
        })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
  };

  if (loading) {
    return (
      <Container size="lg" py={40}>
        <Skeleton height={50} width={300} mb={30} />
        <Flex gap="md" wrap="nowrap" style={{ overflowX: 'auto' }}>
          {[1, 2, 3, 4].map((_, i) => (
            <Box key={i} style={{ minWidth: 250, width: 250 }}>
              <Skeleton height={40} mb={10} />
              <Skeleton height={120} mb={10} />
              <Skeleton height={120} mb={10} />
            </Box>
          ))}
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="lg" py={40}>
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          title="Add New Task"
          size="md"
          centered
        >
          <Stack>
            {formError && (
              <Group bg="red.1" p="xs" style={{ borderRadius: '4px' }}>
                <Text size="sm" c="red">{formError}</Text>
                <ActionIcon size="sm" color="red" onClick={() => setFormError('')} ml="auto">
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            )}
            
            <TextInput
              label="Task Name"
              placeholder="Enter task name"
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            
            <Textarea
              label="Description"
              placeholder="Enter task description"
              minRows={3}
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />

            <DateInput
                label="Due Date"
                placeholder="Month Day Year"
                value={taskDate}
                onChange={setTaskDate}
                clearable
                minDate={new Date()}
                valueFormat="MMMM D, YYYY" 
                leftSection={<IconCalendar size={16} />} 
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeModal}>Cancel</Button>
              <Button 
                onClick={addTask}
                loading={isSubmitting}
              >
                Create Task
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Modal
          opened={modalOpenedInvite}
          onClose={closeModalInvite}
          title="Add New Task"
          size="md"
          centered
        >
          <Stack>
            {formError && (
              <Group bg="red.1" p="xs" style={{ borderRadius: '4px' }}>
                <Text size="sm" c="red">{formError}</Text>
                <ActionIcon size="sm" color="red" onClick={() => setFormError('')} ml="auto">
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            )}
            
            <TextInput
              label="Task Name"
              placeholder="Seperate By , 'test@gmail.com,test2@gmail.com'"
              required
              value={inviteEmails}
              onChange={(e) => setInviteEmails(e.target.value)}
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeModalInvite}>Cancel</Button>
              <Button 
                onClick={inviteToGroup}
                loading={isSubmitting}
              >
                Invite Users
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Flex>
            <Title order={2} mb={30} mr={30}>{groupData?.name || "Tasks"}</Title>

            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <Button rightSection={<IconChevronDown size={14} />}>Actions</Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item onClick={handleOpenModal} leftSection={<IconPlus size={14} />}>
                    Add Task
                    </Menu.Item>
                    <Menu.Item onClick={handleOpenModalInvite} leftSection={<IconInbox size={14} />}>
                    Invite User
                    </Menu.Item>
                    <Menu.Item onClick={deleteTasks} disabled={toDelete.length <= 0} c="red" leftSection={<IconTrash size={14} />}>
                    Delete selected tasks
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item
                        leftSection={<IconArrowsLeftRight size={14} />}
                        onClick={() => window.location.replace("/")}
                    >
                    Go back home
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Flex>
      
        
        {tasks.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
                <Flex gap="md" wrap="wrap" maw={1250} style={{ overflowX: 'auto' }}>
                    {statusCategories.map((category) => (
                    <Box 
                        key={category.value} 
                        style={{ 
                        minWidth: 250, 
                        width: 250,
                        backgroundColor: '#f8f9fa',
                        padding: '10px',
                        borderRadius: '8px'
                        }}
                    >
                        <Group mb={15}>
                        <Title order={5}>{category.label}</Title>
                        <Badge color={category.color}>
                            {getTasksByStatus(category.value).length}
                        </Badge>
                        </Group>
                        
                        <Droppable droppableId={category.value}>
                        {(provided) => (
                            <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ minHeight: 200 }}
                            >
                            {getTasksByStatus(category.value).length > 0 ? (
                                <Flex direction="column" gap="md">
                                {getTasksByStatus(category.value).map((task, index) => (
                                    <Draggable 
                                    key={task.id} 
                                    draggableId={`task-${task.id}`} 
                                    index={index}
                                    >
                                    {(provided, snapshot) => (
                                        <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.8 : 1
                                        }}
                                        >
                                        <Card shadow="sm" p="md" radius="md" withBorder>
                                          <Flex justify="space-between">
                                            <Title order={5}>{task.name}</Title>
                                            <Checkbox onChange={(event) => {
                                              if (event.currentTarget.checked) {
                                                setToDelete([...toDelete, task.id])
                                              } else {
                                                let newToDelete = toDelete.filter(function( element ) {
                                                  return !!element && element != task.id
                                               })

                                                setToDelete(newToDelete)
                                              }
                                            }} />
                                          </Flex>

                                          <Text c="dimmed" size="sm" mt={5} lineClamp={2}>
                                          {task.desc || "No description"}
                                          </Text>
                                          <Group mt={5}>
                                              <IconCalendar size={14} color="gray" />
                                              <Text size="xs" c="dimmed">
                                              {formatDate(task.to_be_done_by)}
                                              </Text>
                                          </Group>
                                        </Card>
                                        </div>
                                    )}
                                    </Draggable>
                                ))}
                                </Flex>
                            ) : (
                                <Text c="dimmed" size="sm" mt={10}>
                                No tasks in this category
                                </Text>
                            )}
                            {provided.placeholder}
                            </div>
                        )}
                        </Droppable>
                    </Box>
                    ))}
                </Flex>
            </DragDropContext>
        ) : (
            <Text mt={50}>No tasks found.</Text>
        )}
    </Container>
  );
}