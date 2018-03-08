import { PlayerWeapon } from './playerweapon'
import { Physics, Bullet, Sprite, Line } from 'phaser-ce';
import { Enemy } from './enemy';
import { BasicBullet } from './basicBullet';
import { rpgItemSpriteKey, myAngleBetween } from './utils';
import { rpgItem } from './rpgItemEnum';
import { BASICGUN_DEFAULT_COOLDOWN, BASICGUN_DEFAULT_POWER, BASICBULLET_DEFAULT_SPEED, WEAPON_45_CLOCKWISE_ROTATION, BASICGUN_ANGEL_UPGRADE_IN_DEGREE } from './config';

export class BasicGun extends PlayerWeapon{
    protected coolDownInFrame = BASICGUN_DEFAULT_COOLDOWN
    private coolDownCount = 0;
    private bullets: Set<BasicBullet>;
    private angleAllow = 0;

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
        this.coolDownInFrame = cd;
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
        const enemiesInRange = this.getAllEnemeyWithInAngle(allEnemies);
        this.followRotate();
        this.updateRange();

        this.rotateToClosestEnemy(enemiesInRange)
        this.fireBullet();
        this.updateBullets();
        this.game.physics.arcade.overlap(Array.from(allEnemies),
                                         Array.from(this.bullets),
                                         this.onBulletOverlap);
    }

    private rotateToClosestEnemy(enemies: Set<Enemy>){
        const closestEnemy = this.game.physics.arcade.closest(this, Array.from(enemies));
        this.rotation = closestEnemy? myAngleBetween(this,closestEnemy): this.getPointingOutAngle();
        this.rotation += this.faceNorthAngle;
    }

    private fireBullet(){
        this.coolDownCount --;
        if(this.coolDownCount <=0){
            this.coolDownCount = this.coolDownInFrame;
            let bb = new BasicBullet(this.game, this.x, this.y, rpgItemSpriteKey, rpgItem.Spear,
                                     this.power, BASICBULLET_DEFAULT_SPEED, this.rotation - this.faceNorthAngle);
            this.bullets.add(bb);
        }
    }

    private updateBullets(){
        for(let b of this.bullets){
            if(! b.alive){
                this.bullets.delete(b);
            }
        }
    }

    onBulletOverlap(enemy:Enemy, bullet:BasicBullet){
        enemy.damage(bullet.getPower());
        bullet.destroy();
    }

    onPowerUpgrade(amount:number){
        this.power++;
    }

    onSpeedUpgrade(amount:number){
        this.coolDownInFrame = Math.max(10, this.coolDownInFrame - amount*10);
    }

    onSpecialUpgrade(amount:number){
        this.angleAllow += BASICGUN_ANGEL_UPGRADE_IN_DEGREE/180 * Math.PI;
    }

    getWeaponInfo(): string{
        let info = super.getWeaponInfo();
        info += "Aim angle: " + this.angleAllow*180/Math.PI + '\n'
        return info
    }


}
