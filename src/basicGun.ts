import { PlayerWeapon } from './playerweapon'
import { Physics, Bullet } from 'phaser-ce';
import { Enemy } from './enemy';
import { BasicBullet } from './basicBullet';
import { rpgItemSpriteKey } from './utils';
import { rpgItem } from './rpgItemEnum';
import { BASICGUN_DEFAULT_COOLDOWN, BASICGUN_DEFAULT_POWER, BASICBULLET_DEFAULT_SPEED } from './config';

export class BasicGun extends PlayerWeapon{
    private coolDownFrame = BASICGUN_DEFAULT_COOLDOWN
    private coolDownCount = 0;
    private bullets: Set<BasicBullet>;
    private angleAllow = 30/180 * Math.PI;

    constructor(game: Phaser.Game, x: number, y:number, key:string, frame:number,
                power=BASICGUN_DEFAULT_POWER){
        super(game, x, y, key, frame, power);
        this.bullets = new Set();
    }

    setCoolDown(cd:number) {
        this.coolDownFrame = cd;
    }

    private getAllEnemeyWithInAngle(enemies: Set<Enemy>): Set<Enemy>{
        let res = new Set;

        for(let e of enemies){
            let angleBetween = this.game.physics.arcade.angleBetween(this, e);
            let withIn = (angleBetween)/2 < this.angleAllow;
            if(withIn){
                res.add(e);
            }
        }

        return res;
    }

    weaponUpdate(allEnemies: Set<Enemy>){
        const enemies = this.getAllEnemeyWithInAngle(allEnemies);
        this.followRotate();

        const closestEnemy = this.game.physics.arcade.closest(this, Array.from(enemies));
        const angle = closestEnemy? this.game.physics.arcade.angleBetween(this, closestEnemy): 0;
        this.rotation = angle + this.faceNorthAngle;

        this.coolDownCount --;
        if(this.coolDownCount <=0){
            this.coolDownCount = this.coolDownFrame;

            let bb = new BasicBullet(this.game, this.x, this.y, rpgItemSpriteKey, rpgItem.Spear,
                                     this.power, BASICBULLET_DEFAULT_SPEED, this.rotation - this.faceNorthAngle);
            this.bullets.add(bb);
        }

        this.updateBullets();
        this.game.physics.arcade.overlap(enemies, Array.from(this.bullets.values()), this.onBulletOverlap);
    }

    private updateBullets(){
        for(let b of this.bullets){
            if(! b.alive){
                this.bullets.delete(b);
            }
        }
    }

    onBulletOverlap(enemy:Enemy, bullet:BasicBullet){
        bullet.kill();
        enemy.damage(bullet.getPower());
    }

}
