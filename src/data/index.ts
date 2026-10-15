import furniture from './furniture.json';
import roomData from './rooms.json';
import apartmentData from './apartment.json';
import type {Furniture, Room, Wall} from '../types';
export const initialFurniture=furniture as Furniture[];
export const rooms=roomData as Room[];
export const apartment=apartmentData as Omit<typeof apartmentData,'walls'> & {walls:Wall[]};
export const initialProject=()=>({version:1 as const,furniture:structuredClone(initialFurniture),calibration:1,wallHeight:2.5});

export const roomLabels:Record<string,[number,number]>={kitchen:[3.1,2.05],bath:[5.2,1.55],hall:[7.1,2.85],living:[2.6,5.9],bedroom:[6.05,4.65],office:[9.48,5.25],stairs:[8.2,1.2],balcony:[5.35,8.83]};
