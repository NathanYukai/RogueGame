import 'phaser-ce';
import { Sprite, Physics, Key, } from 'phaser-ce';
import {Player} from './player'
import { TrollGenerator } from './trollGenerator';
import { Troll } from './troll';

window.onload = function() {

    let game: Phaser.Game;
    let objectFactory: Phaser.GameObjectFactory;
    let trollGenerator: TrollGenerator;

    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update:update, render:render});

    function preload () {
        game.load.pack('basic', 'assets/sprites.json');
    }

    let upKey: Key;
    let downKey: Key;
    let leftKey: Key;
    let rightKey: Key;

    let player: Player;

    let troll: Troll;
    function create () {

        game.stage.backgroundColor = '#182d3b';
        game.physics.startSystem(Physics.ARCADE);
        objectFactory = game.add;
        trollGenerator = new TrollGenerator(objectFactory);

        player = new Player(objectFactory, game.world.centerX, game.world.centerY, 'human');
        troll = trollGenerator.getOneTroll(50,50);

        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

    function update() {
        player.controllPlayer(upKey, downKey, leftKey, rightKey);
        game.physics.arcade.moveToObject(troll.sprite, player.sprite,5)
    }

    function render() {
    }

};

