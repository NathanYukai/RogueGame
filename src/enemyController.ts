import * as Phaser from 'phaser-ce'
import { Player } from './player';

export class EnemyController{
    private game: Phaser.Game;
    private player: Player;

    constructor(game: Phaser.Game, player: Player){
        this.game = game;
        this.player = player;
    }

    update(){
        
    }
}
