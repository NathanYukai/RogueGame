import { Sprite } from 'phaser-ce';
import { PlayerWeapon } from './Weapons/playerweapon';
import { ENEMY_DEFAULT_SPEED, ENEMY_DEFAULT_HP } from './Configs/config';
import { IWeaponOwner } from './player';

export function spreadWeaponOnRail(
    weapons: PlayerWeapon[],
    player: IWeaponOwner,
    radius: number,
    spd: number,
) {
    const numOfWeapon = weapons.length;
    const gapAngle = Math.PI * 2 / numOfWeapon;

    for (let i = 0; i < numOfWeapon; i++) {
        const thisAngle = i * gapAngle;
        const w = weapons[i];

        if (w.isUnderDirectControl()) {
            w.setDistance(radius * 2);

        } else {
            w.setDistance(radius);
        }
        w.setRotationSpeed(spd);
        w.x = player.x + radius * (Math.cos(thisAngle));
        w.y = player.y + radius * (Math.sin(thisAngle));

        //this is called last so that the angle is set correctly
        w.setOwner(player)
    }
}

export function myAngleBetween(a: { x: number, y: number }, b: { x: number, y: number }): number {
    return Math.atan2(b.y - a.y, b.x - a.x);
}

const secondWave = 50;
const thirdWave = 120;

const enemySpd = ENEMY_DEFAULT_SPEED;
const enemyHP = ENEMY_DEFAULT_HP;

export const waveNumMap = [[10, 5], [secondWave, 10], [thirdWave, 15]]
export const waveDropMap = [[10, 90], [secondWave, 50], [thirdWave, 10]]
export const waveSpeedMap = [[10, enemySpd], [secondWave, enemySpd * 1.5]]
export const waveHpMap = [[10, enemyHP], [secondWave, enemyHP * 1.5], [thirdWave, enemyHP * 3]]

export function waveDataDependsOnKillCount(waveMap: number[][], count: number): number {
    for (let tup of waveMap) {
        if (count < tup[0]) {
            return tup[1];
        }
    }
    const lastMap = waveMap[waveMap.length - 1];
    return lastMap[1];
}

export const rpgItemSpriteKey = 'rpgItems';


