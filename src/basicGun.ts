import { PlayerWeapon } from './playerweapon'
import { Physics } from 'phaser-ce';
import { Enemy } from './enemy';
import { BasicBullet } from './basicBullet';
import { rpgItemSpriteKey } from './utils';
import { rpgItem } from './rpgItemEnum';

export class BasicGun extends PlayerWeapon{
    private coolDownFrame = 30;
    private coolDownCount = 0;
    private physics: Physics.Arcade;

    constructor(game: Phaser.Game, x: number, y:number, key:string, frame:number, power=5){
        super(game, x, y, key, frame, power);
        this.game = game;
        this.physics = game.physics.arcade;
    }

    setCoolDown(cd:number) {
        this.coolDownFrame = cd;
    }

    weaponUpdate(enemies: Enemy[]){
        this.followRotate();

        let closestEnemy = this.physics.closest(this, enemies);
        this.rotation = this.physics.angleBetween(this, closestEnemy) + this.faceNorthAngle;

        this.coolDownCount --;
        if(this.coolDownCount <=0){
            this.coolDownCount = this.coolDownFrame;

            let bb = new BasicBullet(this.game, this.x, this.y, rpgItemSpriteKey, rpgItem.Spear,
                                     1, 200, this.rotation - this.faceNorthAngle);
        }
    }
}
