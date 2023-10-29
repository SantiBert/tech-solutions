import {
    IsString,
    IsNumber,
    IsArray
  } from 'class-validator';
    
  export class GetFilmMakersDto{
    @IsString()
    public name!:string;
  }