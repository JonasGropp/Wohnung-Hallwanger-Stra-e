export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export interface Furniture { id:string; name:string; kind:string; room:string; width:number; depth:number; height:number; position:Vec3; rotation:number; visible:boolean; fixed:boolean; originalDimensions:string; reference:string|null; placementReference:string|null; method:string; provenance:string; assumptions:string[] }
export interface Room {id:string;name:string;sourceArea:number;polygon:Vec2[];material:string;modelArea:number;deviationPercent:number;source:string;status:string}
export interface Opening {id:string;start:number;width:number;sill:number;height:number;kind:string;swing:number;status:string}
export interface Wall {id:string;a:Vec2;b:Vec2;thickness:number;height:number;openings:Opening[]}
export interface Part {shape:'box'|'cylinder'|'sphere';size:Vec3;position:Vec3;material:string;rotation?:Vec3;collision?:boolean}
export interface Solid {id:string;name:string;center:Vec3;size:Vec3;angle:number}
export interface Project {version:1;furniture:Furniture[];calibration:number;wallHeight:number}
export type Mode='orbit'|'walk'|'room'|'plan';
