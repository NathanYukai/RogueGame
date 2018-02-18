import * as Phaser from 'phaser-ce';
import { Sprite, Physics, Key, Keyboard, } from 'phaser-ce';
import {Player} from './player'
import { TrollGenerator } from './trollGenerator';
import { Troll, sendDamage } from './troll';
import { PlayerWeapon } from './playerweapon';
import { Sword} from './sword'

window.onload = function() {

    let game: Phaser.Game;
    let objectFactory: Phaser.GameObjectFactory;
    let trollGenerator: TrollGenerator;

    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update:update, render:render});

    function preload () {
        game.load.pack('basic', 'assets/spriteReader.json');
    }

    let upKey: Key;
    let downKey: Key;
    let leftKey: Key;
    let rightKey: Key;

    let player: Player;
    let sword: PlayerWeapon;

    let trolls: Troll[] = [];
    function create () {

        game.stage.backgroundColor = '#182d3b';
        game.physics.startSystem(Physics.ARCADE);
        trollGenerator = new TrollGenerator(game);

        player = new Player(game, game.world.centerX, game.world.centerY, 'human');

        sword = new Sword(game, player.x+300, player.y, 'items');
        sword.setOwner(player);

        for(let i = 0; i < 9; i++){
            trolls[i] = trollGenerator.getOneTroll(50+i*20, 100);
        }

        game.physics.arcade.enable(player)
        game.physics.arcade.enable(trolls);
        game.physics.arcade.enable(sword);

        setUpKeys(game.input.keyboard);

   }

    function update() {
        player.controllPlayer(upKey, downKey, leftKey, rightKey);
        sword.followRotate();

        game.physics.arcade.collide(trolls, trolls)

        for(let troll of trolls){
            if(troll.exists){
                let close: boolean = game.physics.arcade.distanceBetween(troll, player) < 10;
                let speed = close? 0 : 200
                game.physics.arcade.moveToObject(troll, player, speed);
                game.physics.arcade.overlap(troll, player, sendDamage)
            }
        }
    }


    function render() {
    }

    function setUpKeys(keyboard:Keyboard){
        upKey = keyboard.addKey(Phaser.Keyboard.UP);
        downKey = keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

};



