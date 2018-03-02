import * as Phaser from 'phaser-ce'
import { Sprite, GameObjectFactory, Game } from 'phaser-ce';
import { Player } from './player';
import { Enemy } from './enemy';
import { PowerPickUp } from './powerPickUp';
import { rpgItemSpriteKey } from './utils';
import { rpgItem } from './rpgItemEnum';
import { PICKUP_DEFAULT_LIFE } from './config';
import { pickupGroup } from './globals';

export class Troll extends Enemy{

    private dropChanceInHundred = 80;

    onOverlap(troll:Troll, player: Player){
        troll.destroy();
        player.damage(troll.getPower());
    }

    kill(): Sprite{
        super.kill();
        if(Math.random()*100 < this.dropChanceInHundred){
            const pickup = new PowerPickUp(this.game, this.x, this.y,
                            rpgItemSpriteKey,
                            rpgItem.PotionRedBig,
                            PICKUP_DEFAULT_LIFE)
            pickupGroup.add(pickup)
        }
        return this
    }

}
