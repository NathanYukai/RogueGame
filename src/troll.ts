import * as Phaser from 'phaser-ce'
import { Sprite, GameObjectFactory, Game } from 'phaser-ce';
import { Player } from './player';
import { Enemy } from './enemy';

export class Troll extends Enemy{

    onOverlap(troll:Troll, player: Player){
        troll.destroy();
        player.damage(troll.getPower());
    }

}
