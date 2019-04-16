import { Sprite } from 'phaser-ce';
import { PlayerWeapon } from './Weapons/playerweapon';
import { ENEMY_DEFAULT_SPEED, ENEMY_DEFAULT_HP } from './Configs/config';
import { IWeaponOwner } from './player';
import _ = require('underscore');

export function spreadWeaponOnRail(
    weapons: PlayerWeapon[],
    player: IWeaponOwner,
    distanceToOwner: number,
    spd: number,
) {
    const passiveWeapons = _.filter(weapons, w => !w.isUnderDirectControl());
    const numOfPassiveWeapon = passiveWeapons.length;
    const gapAngle = Math.PI * 2 / numOfPassiveWeapon;

    for (let i = 0; i < numOfPassiveWeapon; i++) {
        const thisAngle = i * gapAngle;
        const w = passiveWeapons[i];
        setWeaponPosition(w, distanceToOwner, thisAngle, player, spd);
    }

    const activeWeapon = _.find(weapons, w => w.isUnderDirectControl());
    setWeaponPosition(activeWeapon, distanceToOwner * 2, 0, player, spd);
}

function setWeaponPosition(w: PlayerWeapon, dist: number, angle: number, owner: IWeaponOwner, rotateSpd: number) {
    w.setDistance(dist);

    w.x = owner.x + dist * (Math.cos(angle));
    w.y = owner.y + dist * (Math.sin(angle));

    w.setRotationSpeed(rotateSpd);

    //this is called last so that the angle is set correctly
    w.setOwner(owner)
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


