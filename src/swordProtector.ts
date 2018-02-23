import {PlayerWeapon} from './playerweapon'
import { Sprite } from 'phaser-ce';
import { Enemy } from './enemy';

enum swordState {
    READY,
    ATTACK,
    REST
}

export class SwordProtector extends PlayerWeapon {
    private coolDownFrame = 120
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

        switch(this.state){
        case swordState.ATTACK:
            this.alpha = 1;
            this.rotation += 0.5;
            this.attackFrameCountDown --;

            let attackFinished = this.attackFrameCountDown <= 0;
            if(attackFinished){
                this.damagedEnemy.clear();
                this.state = swordState.REST;
                this.attackFrameCountDown = this.attackFrame;
            }
            return;
        case swordState.READY:
            this.alpha = 1;
            return;
        case swordState.REST:
        default:
            this.alpha = 0.5;
            this.coolDownCount++;
            if(this.coolDownCount >= this.coolDownFrame){
                this.state = swordState.READY;
                this.coolDownCount = 0;
            }
        }
    }

    onOverlap(weapon: SwordProtector, enemy: Sprite){
        if(weapon.state == swordState.READY){
            weapon.state = swordState.ATTACK
        }
        if(weapon.state == swordState.ATTACK && !weapon.damagedEnemy.has(enemy)){
            enemy.damage(weapon.power);
            weapon.damagedEnemy.add(enemy);
        }
    }
}
