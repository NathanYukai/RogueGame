import * as Phaser from 'phaser-ce'
import { Sprite, GameObjectFactory, Game } from 'phaser-ce';
import { Player } from './player';
import { Enemy } from './enemy';
import { PowerPickUp } from './powerPickUp';
import { rpgItemSpriteKey } from './utils';
import { rpgItem } from './rpgItemEnum';
import { PICKUP_DEFAULT_LIFE } from './config';

export class Troll extends Enemy{

    onOverlap(troll:Troll, player: Player){
        troll.destroy();
        player.damage(troll.getPower());
    }

    kill(): Sprite{
        super.kill();
        new PowerPickUp(this.game, this.x, this.y, rpgItemSpriteKey, rpgItem.PotionRed, PICKUP_DEFAULT_LIFE)
        return this
    }

}
