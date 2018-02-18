import {PlayerWeapon} from './playerweapon'
import { Sprite } from 'phaser-ce';
import { Enemy } from './enemy';

enum swordState {
    ATTACK,
    REST
}

export class SwordProtector extends PlayerWeapon {
    private coolDownFrame = 60
    private coolDownCount = 0;
    private attackFrame = 20;
    private attackFrameCountDown = this.attackFrame;

    private state = swordState.REST;
    private damagedEnemy = new Set<Sprite>() ;

    setCoolDown(cd: number){
        this.coolDownFrame = cd;
    }

    setAttackFrame(frame: number){
        this.attackFrame= frame;
        this.attackFrameCountDown = frame;
    }

    weaponUpdate(enemies: Enemy[]){
        this.followRotate();

        if(this.state == swordState.ATTACK){
            this.rotation += 0.5;
            this.attackFrameCountDown --;

            let attackFinished = this.attackFrameCountDown <= 0;
            if(attackFinished){
                this.damagedEnemy.clear();
                this.state = swordState.REST;
                this.attackFrameCountDown = this.attackFrame;
            }
        }else{
            this.coolDownCount++;
            if(this.coolDownCount >= this.coolDownFrame){
                this.state = swordState.ATTACK;
                this.coolDownCount = 0;
            }
        }
    }

    onOverlap(weapon: SwordProtector, enemy: Sprite){
        if(weapon.state == swordState.ATTACK && !weapon.damagedEnemy.has(enemy)){
            console.log(weapon.power);
            console.log(enemy.health)
            enemy.damage(weapon.power);
            weapon.damagedEnemy.add(enemy);
            console.log("dmg")
        }
    }
}
