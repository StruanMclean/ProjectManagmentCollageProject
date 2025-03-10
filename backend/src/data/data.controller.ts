import { Controller, Get, UseGuards, Request, Post, Body, Delete } from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CreateGroupGto, InviteGroupGto } from './dto/groups-dto';
import { CreateTasksDto, DeleteTasksDto, GetTasksDto, UpdateTasksDto } from './dto/tasks-dto';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  // GROUPS
  @Get('get-groups')
  @UseGuards(JwtAuthGuard)
  getGroups(@Request() req) {
    return this.dataService.getGroups(req.user);
  }

  @Post('create-group')
  @UseGuards(JwtAuthGuard)
  createGroup(@Request() req, @Body() data: CreateGroupGto) {
    return this.dataService.createGroup(req.user, data.name);
  }

  @Post('invite-user-group')
  @UseGuards(JwtAuthGuard)
  inviteUserGroup(@Request() req, @Body() data: InviteGroupGto) {
    return this.dataService.inviteUserToGroup(req.user, data.group_id, data.email);
  }

  // TASKS
  @Post('get-tasks')
  @UseGuards(JwtAuthGuard)
  getTasks(@Request() req, @Body() data: GetTasksDto) {
    return this.dataService.getTasks(req.user, data.group_id);
  }

  @Post('create-task')
  @UseGuards(JwtAuthGuard)
  createTask(@Request() req, @Body() data: CreateTasksDto) {
    return this.dataService.createTask(req.user, data);
  }

  @Post('update-task')
  @UseGuards(JwtAuthGuard)
  updateTask(@Request() req, @Body() data: UpdateTasksDto) {
    return this.dataService.updateTask(req.user, data);
  }

  @Delete('delete-task')
  @UseGuards(JwtAuthGuard)
  deleteTask(@Request() req, @Body() data: DeleteTasksDto) {
    return this.dataService.deleteTasks(req.user, data.task_ids);
  }
}
