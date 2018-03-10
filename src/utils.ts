import * as Phaser from 'phaser-ce';
import { Sprite } from 'phaser-ce';
import { PlayerWeapon } from './playerweapon';
import { ENEMY_DEFAULT_SPEED, ENEMY_DEFAULT_HP } from './config';

export function spreadWeaponOnRail(
    weapons: PlayerWeapon[],
    player: Sprite,
    radius:number,
    spd: number,
){
    const numOfWeapon = weapons.length;
    const gapAngle = Math.PI * 2 / numOfWeapon;

    for(let i = 0; i < numOfWeapon; i++){
        const thisAngle = i*gapAngle;
        const w = weapons[i];
        w.setDistance(radius);
        w.setRotationSpeed(spd);
        w.x = player.x + radius * (Math.cos(thisAngle));
        w.y = player.y + radius * (Math.sin(thisAngle));

        //this is called last so that the angle is set correctly
        w.setOwner(player)
    }
}

export function myAngleBetween(a: Sprite, b:Sprite):number{
    return Math.atan2(b.y - a.y, b.x - a.x);
}

const secondWave = 50;

export const waveNumMap = [[10,5],[secondWave,10],[100,20]]
export const waveDropMap = [[20,90],[secondWave,60],[100,30]]
const enemySpd = ENEMY_DEFAULT_SPEED;
const enemyHP = ENEMY_DEFAULT_HP;
export const waveSpeedMap = [[10, enemySpd],[secondWave, enemySpd*2]]
export const waveHpMap = [[10,enemyHP],[secondWave, enemyHP*2]]
export function waveDataDependsOnKillCount(waveMap:number[][], count:number): number{
    for(let tup of waveMap){
        if(count < tup[0]){
            return tup[1];
        }
    }
    const lastMap = waveMap[waveMap.length-1];
    return lastMap[1];
}

export const rpgItemSpriteKey = 'rpgItems';


