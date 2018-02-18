import * as Phaser from 'phaser-ce';
import { Sprite } from 'phaser-ce';
import { PlayerWeapon } from './playerweapon';

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
    }
}
