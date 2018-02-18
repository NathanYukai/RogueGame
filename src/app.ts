import * as Phaser from 'phaser-ce';
import { Sprite, Physics, Key, Keyboard, } from 'phaser-ce';
import {Player} from './player'
import { TrollGenerator } from './trollGenerator';
import { Troll } from './troll';
import { PlayerWeapon } from './playerweapon';
import { SwordProtector} from './swordProtector'
import { spreadWeaponOnRail, rpgItemSpriteKey} from './utils';
import { rpgItem } from './rpgItemEnum';
import { BasicGun } from './basicGun';

window.onload = function() {

    let trollGenerator: TrollGenerator;
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update:update, render:render});

    let arcadePhysics: Physics.Arcade;

    function preload () {
        game.load.pack('basic', 'assets/spriteReader.json');
    }

    let upKey: Key;
    let downKey: Key;
    let leftKey: Key;
    let rightKey: Key;

    let player: Player;
    let weapons: PlayerWeapon[];

    let trolls: Troll[] = [];

    function create () {
        weapons = [];
        arcadePhysics = game.physics.arcade;

        game.stage.backgroundColor = '#182d3b';
        game.physics.startSystem(Physics.ARCADE);
        trollGenerator = new TrollGenerator(game);

        player = new Player(game, game.world.centerX, game.world.centerY, 'human');

        weapons[0] = new SwordProtector(game, player.x, player.y-100, rpgItemSpriteKey, rpgItem.BasicSword,1);
        weapons[1] = new BasicGun(game, 0,0, rpgItemSpriteKey, rpgItem.Bow,1);

        spreadWeaponOnRail(weapons, player, 100, 0.02)

        for(let w of weapons){
            w.setOwner(player);
            arcadePhysics.enable(w);
        }

        for(let i = 0; i < 1; i++){
            trolls[i] = trollGenerator.getOneTroll(50+i*20, 100, undefined, 20);
        }

        setUpKeys(game.input.keyboard);
   }

    function update() {
        player.controllPlayer(upKey, downKey, leftKey, rightKey);
        for(let w of weapons){
            w.weaponUpdate(trolls);
            arcadePhysics.overlap(w, trolls, w.onOverlap);
        }

        arcadePhysics.collide(trolls, trolls)

        for(let troll of trolls){
            if(troll.exists){
                let close: boolean = arcadePhysics.distanceBetween(troll, player) < 10;
                let speed = close? 0 : 50
                arcadePhysics.moveToObject(troll, player, speed);
                arcadePhysics.overlap(troll, player, troll.onOverlap)
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



