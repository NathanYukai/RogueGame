import * as Phaser from 'phaser-ce'
import { Sprite, GameObjectFactory, Game } from 'phaser-ce';
import { Player } from './player';
import { Enemy } from './enemy';
import { PowerPickUp } from './powerPickUp';
import { rpgItemSpriteKey } from './utils';
import { rpgItem } from './rpgItemEnum';
import { PICKUP_DEFAULT_LIFE, TROLL_POWER_DROP_THRESH, TROLL_SPEED_DROP_THRESH } from './config';
import { pickupGroup } from './globals';
import { Pickup } from './pickup';
import { SpeedPickUp } from './SpeedPickUp';
import { SpecialPickUp } from './specialPickUp';

export class Troll extends Enemy{

    onOverlap(troll:Troll, player: Player){
        troll.destroy();
        player.damage(troll.getPower());
    }

    kill(): Sprite{
        super.kill();
        const roll = Math.random()*100
        const drop = roll < this.dropChanceInHundred;
        if(drop){
            const determin = Math.random()*100;
            let pickup: Pickup;
            if(determin<TROLL_POWER_DROP_THRESH){
                pickup = new PowerPickUp(this.game, this.x, this.y,
                                         rpgItemSpriteKey,
                                         rpgItem.PotionRedBig,
                                         PICKUP_DEFAULT_LIFE)
            }else if(determin < TROLL_SPEED_DROP_THRESH){
                 pickup = new SpeedPickUp(this.game, this.x, this.y,
                                         rpgItemSpriteKey,
                                         rpgItem.PotionBlueBig,
                                         PICKUP_DEFAULT_LIFE)
            }else{
                  pickup = new SpecialPickUp(this.game, this.x, this.y,
                                         rpgItemSpriteKey,
                                         rpgItem.ShieldGold,
                                         PICKUP_DEFAULT_LIFE)

            }
            pickupGroup.add(pickup)
        }
        return this
    }

}
