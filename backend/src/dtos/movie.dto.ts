import {
    IsString,
    IsNumber,
    IsArray
  } from 'class-validator';
  
  export class CreateMovieDto {
    @IsString()
    public title!:string;
    
    @IsString()
    public directorId!:string;
  
    @IsArray()
    public actorsIds!:string[];
    
  }
  
  export class UpdateMovieDto extends CreateMovieDto {}
  
  export class SearchFilmographyDto{
    @IsString()
    public title!:string;
  }