import {PlayerWeapon} from './playerweapon'
import { Sprite } from 'phaser-ce';
import { Enemy } from './enemy';
import { SWORDPROTECTOR_DEFAULT_COOLDOWN, SWORDPROTECTOR_DEFAULT_ATTACKFRAME, SWORDPROTECTOR_DEFAULT_POWER, SWORDPROTECTOR_SPECIAL_ATTACK_TIME } from './config';
import { myAngleBetween } from './utils';

enum swordState {
    SPECIAL_ATTACK,
    SPECIAL_READY,
    READY,
    ATTACK,
    REST
}

export class SwordProtector extends PlayerWeapon {
    protected coolDownInFrame = SWORDPROTECTOR_DEFAULT_COOLDOWN
    private coolDownCount = this.coolDownInFrame
    private attackFrame = SWORDPROTECTOR_DEFAULT_ATTACKFRAME;
    private attackFrameCountDown = this.attackFrame;

    private state = swordState.REST;
    private damagedEnemy = new Set<Sprite>() ;
    private killCount = 0;
    private specialKillNumber = 1;
    private specialAnimTimeInFrame = SWORDPROTECTOR_SPECIAL_ATTACK_TIME;
    private specialAnimCount = this.specialAnimTimeInFrame

    constructor(game: Phaser.Game, x: number, y:number, key:string, frame:number,
                power=SWORDPROTECTOR_DEFAULT_POWER){
        super(game, x, y, key, frame, power);
    }

    setCoolDown(cd: number){
        this.coolDownInFrame = cd;
    }

    setAttackFrame(frame: number){
        this.attackFrame= frame;
        this.attackFrameCountDown = frame;
    }

    weaponUpdate(enemies: Set<Enemy>){
        this.followRotate();
        this.game.physics.arcade.overlap(this, Array.from(enemies), this.onOverlapWithEnemy);

        switch(this.state){
        case swordState.SPECIAL_ATTACK:
            this.specialAttackAnimation();
            return;
        case swordState.ATTACK:
            this.normalAttackAnimation();
            return;
        case swordState.READY:
            this.alpha = 1;
            return;
        case swordState.REST:
        default:
            if(this.killCount > this.specialKillNumber){
                this.state = swordState.SPECIAL_READY
                this.killCount = 0;
            }else{
                this.alpha = 0.5;
                this.coolDownCount++;
                if(this.coolDownCount >= this.coolDownInFrame){
                    this.state = swordState.READY;
                    this.coolDownCount = 0;
                }
            }
        }
    }

    normalAttackAnimation(){
        this.alpha = 1;
        this.rotation += 0.5;
        this.attackFrameCountDown --;

        const attackFinished = this.attackFrameCountDown <= 0;
        if(attackFinished){
            this.damagedEnemy.clear();
            this.state = swordState.REST;
            this.attackFrameCountDown = this.attackFrame;
        }
    }

    specialAttackAnimation(){
        console.log("special")
        const frame = this.specialAnimTimeInFrame - this.specialAnimCount;
        this.alpha = 1;
        this.specialAnimCount --;
        // if(frame < 1){
            this.rotation = myAngleBetween(this.owner,this) + this.faceNorthAngle;
        // }

        let attackFinished = this.specialAnimCount<= 0;
        if(attackFinished){
            this.damagedEnemy.clear();
            this.state = swordState.REST;
            this.specialAnimCount= this.specialAnimTimeInFrame;
        }
        return;
    }

    onOverlapWithEnemy(weapon: SwordProtector, enemy: Sprite){
        switch(weapon.state){
        case swordState.READY:
            weapon.state = swordState.ATTACK;
            break;
        case swordState.SPECIAL_READY:
            weapon.state = swordState.SPECIAL_ATTACK;
            break;
        }
        if(weapon.damagedEnemy.has(enemy)){
            return;
        }
        if( weapon.state == swordState.SPECIAL_ATTACK ){
            enemy.damage(weapon.power);
            weapon.damagedEnemy.add(enemy);
        }
        if( weapon.state == swordState.ATTACK){
            enemy.damage(weapon.power);
            weapon.damagedEnemy.add(enemy);
            if(!enemy.exists){
                weapon.killCount ++;
            }
        }
    }

    onPowerUpgrade(amount:number){
        this.power += amount;
    }

    onSpeedUpgrade(amount:number){
        this.coolDownInFrame *= 0.9
    }

    onSpecialUpgrade(amount:number){
        this.specialLevel += amount;
    }

}
