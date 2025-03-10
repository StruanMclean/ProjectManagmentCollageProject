import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateGroupGto {
  @IsString()
  @IsNotEmpty()
  name: string;
}


export class InviteGroupGto {
  @IsNumber()
  @IsNotEmpty()
  group_id: number;

  @IsString()
  @IsNotEmpty()
  email: string;
}