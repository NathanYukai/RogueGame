import { PlayerWeapon } from './playerweapon'
import { Physics, Bullet, Sprite, Line } from 'phaser-ce';
import { Enemy } from './enemy';
import { BasicBullet } from './basicBullet';
import { rpgItemSpriteKey, myAngleBetween } from './utils';
import { rpgItem } from './rpgItemEnum';
import { BASICGUN_DEFAULT_COOLDOWN, BASICGUN_DEFAULT_POWER, BASICBULLET_DEFAULT_SPEED, WEAPON_45_CLOCKWISE_ROTATION } from './config';

export class BasicGun extends PlayerWeapon{
    private coolDownFrame = BASICGUN_DEFAULT_COOLDOWN
    private coolDownCount = 0;
    private bullets: Set<BasicBullet>;
    private angleAllow = 30/180 * Math.PI;

    private rangeEndA: Sprite;
    private rangeEndB: Sprite;
    constructor(game: Phaser.Game, x: number, y:number, key:string, frame:number,
                power=BASICGUN_DEFAULT_POWER){
        super(game, x, y, key, frame, power);
        this.bullets = new Set();

        this.rangeEndA = game.add.sprite(5,5,rpgItemSpriteKey, rpgItem.Spear);
        this.rangeEndB = game.add.sprite(10,10,rpgItemSpriteKey, rpgItem.Spear);
    }

    setCoolDown(cd:number) {
        this.coolDownFrame = cd;
    }

    private getAllEnemeyWithInAngle(enemies: Set<Enemy>): Set<Enemy>{
        let res = new Set;

        for(let e of enemies){
            const angleBetween = myAngleBetween(this, e)
            const upper = this.getUpperAngle();
            const lower = this.getLowerAngle();
            let withIn = lower < angleBetween && angleBetween < upper
            if(withIn){
                res.add(e);
            }
        }
        console.log(res.size)
        return res;
    }

    private getUpperAngle(){
        return this.getPointingOutAngle() + this.angleAllow
    }

    private getLowerAngle(){
        return this.getPointingOutAngle() - this.angleAllow
    }

    private getPointingOutAngle(){
        return myAngleBetween(this.owner, this)
    }

    private updateRange(){
        const upper = this.getUpperAngle();
        const lower = this.getLowerAngle();
        this.rangeEndA.x = this.x + 200*Math.cos(upper);
        this.rangeEndA.y = this.y + 200*Math.sin(upper);
        this.rangeEndB.x = this.x + 200*Math.cos(lower);
        this.rangeEndB.y = this.y + 200*Math.sin(lower);
    }

    weaponUpdate(allEnemies: Set<Enemy>){
        const enemies = this.getAllEnemeyWithInAngle(allEnemies);
        this.followRotate();
        this.updateRange();

        const closestEnemy = this.game.physics.arcade.closest(this, Array.from(enemies));
        this.rotation = closestEnemy? myAngleBetween(this,closestEnemy): this.getPointingOutAngle();
        this.rotation += this.faceNorthAngle;

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
