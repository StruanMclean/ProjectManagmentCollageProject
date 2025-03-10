import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class GetTasksDto {
  @IsNumber()
  @IsNotEmpty()
  group_id: number;
}

export class CreateTasksDto {
  @IsNumber()
  @IsNotEmpty()
  group_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsString()
  @IsNotEmpty()
  to_be_done_by: string;
}

export class UpdateTasksDto {
  @IsNumber()
  @IsNotEmpty()
  task_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsString()
  @IsNotEmpty()
  to_be_done_by: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  amount_complete: number;

  @IsString()
  @IsNotEmpty()
  emails: string;
}

export class DeleteTasksDto {
  @IsNotEmpty()
  task_ids: [number];
}