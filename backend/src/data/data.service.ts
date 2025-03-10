import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfoDto } from './dto/user-info-dto';
import { CreateTasksDto, UpdateTasksDto } from './dto/tasks-dto';
import { sendTasksUpdates } from 'src/kafka/producer';

@Injectable()
export class DataService {
    constructor(
        private prisma: PrismaService,
    ) {}

    // GROUPS
    async getGroups(userInfoDto: UserInfoDto) {
        const data = await this.prisma.group.findMany({
            where: {
                user: {
                    some: {
                        email: userInfoDto.email
                    }
                }
            },
            include: {
                user: {
                    select: {
                        pfp: true
                    }
                },
                Tasks: {
                    select: {
                        id: true
                    }
                }
            }
        })
        return data
    }

    async createGroup(userInfoDto: UserInfoDto, name: string) {
        const data = await this.prisma.group.create({
            data: {
                name: name,
                user: {
                    connect: {
                        email: userInfoDto.email
                    }
                }
            }
        })
        return data
    }

    async inviteUserToGroup(userInfoDto: UserInfoDto, group_id: number, email: string) {

        let emails

        if (!email.match(",")) {
            emails = {
                email: email
            }            
        } else {
            emails = email.split(",").map((email) => {
                return {
                    email: email
                }
            })            
        }

        const data = await this.prisma.group.update({
            where: {
                id: group_id,
                user: {
                    some: {
                        email: userInfoDto.email
                    }
                }
            },
            data: {
                user: {
                    connect: emails
                }
            }
        })
        return data
    }

    // TASKS
    async getTasks(userInfoDto: UserInfoDto, group_id: number) {
        const data = await this.prisma.group.findFirst({
            where: {
                id: group_id
            },
            include: {
                Tasks: {
                    select: {
                        id: true,
                        name: true,
                        desc: true,
                        status: true,
                        to_be_done_by: true,
                        amount_complete: true,
                        users_assigned: {
                            select: {
                                name: true,
                                email: true,
                                pfp: true,
                            }
                        }
                    }
                }
            }
        })
        return data
    }

    async createTask(userInfoDto: UserInfoDto, createTaskDto: CreateTasksDto ) {
        const data = await this.prisma.tasks.create({
            data: {
                name: createTaskDto.name,
                desc: createTaskDto.desc,
                to_be_done_by: createTaskDto.to_be_done_by,
                groupid: createTaskDto.group_id,
                users_assigned: {
                    connect: {
                        email: userInfoDto.email
                    }
                }
            }
        })
        sendTasksUpdates(createTaskDto.group_id)
        return data
    }

    async updateTask(userInfoDto: UserInfoDto, updateTasksDto: UpdateTasksDto ) {
        const emails: any = updateTasksDto.emails.split(",").map((value): any => {
            return {
                email: value
            }
        });

        const data = await this.prisma.tasks.update({
            where: {
                id: updateTasksDto.task_id,
                group: {
                    user: {
                        some: {
                            email: userInfoDto.email
                        }
                    }
                }
            },
            data: {
                name: updateTasksDto.name,
                desc: updateTasksDto.desc,
                status: updateTasksDto.status,
                to_be_done_by: updateTasksDto.to_be_done_by,
                amount_complete: updateTasksDto.amount_complete,
                users_assigned: {
                    set: emails
                },
            },
        })

        sendTasksUpdates(data.groupid)

        return data
    }

    async deleteTasks(userInfoDto: UserInfoDto, task_ids: [number]) {
        const group_id = await this.prisma.tasks.findFirst({
            where: {
                id: {
                    in: task_ids
                }
            }
        })

        const data = await this.prisma.tasks.deleteMany({
            where: {
                id: {
                    in: task_ids
                },
                group: {
                    user: {
                        some: {
                            email: userInfoDto.email
                        }
                    }
                }
            }
        })
        
        sendTasksUpdates(group_id?.groupid)

        return data
    }
}
