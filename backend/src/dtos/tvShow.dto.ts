import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional
  } from 'class-validator';
  
  export class CreateEpisodeDto {
    @IsNumber()
    public number!:number;
  
    @IsString()
    public directorId!:string;
  }
  
  export class UpdateEpisodeDto {
    @IsString()
    public title!:string;
  
    @IsNumber()
    public number!:number;
  
    @IsNumber()
    public seasonId!:number;
  
    @IsString()
    public directorId!:string;
  }
  
  export class CreateSeasonDto {
    @IsNumber()
    public number!:number;
  
    @IsArray()
    public episodes!:CreateEpisodeDto[];
  
  }
  
  export class CreateTvShowDto {
    @IsString()
    public title!:string;
  
    @IsArray()
    @IsOptional()
    public actorsIds!:string[];
  
    @IsArray()
    @IsOptional()
    public seasons!:CreateSeasonDto[];
  }
  
  export class UpdateTvShowDto extends CreateTvShowDto {}
  
  