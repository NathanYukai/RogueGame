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
import { Pickup } from './Pickup';
import { FreezeGun } from './freezeGun';
import { WEAPON_DISTANCE, WEAPON_ROTATION_SPD } from './config';

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

    let trolls: Set<Troll> = new Set();

    function create () {
        weapons = [];
        arcadePhysics = game.physics.arcade;

        game.stage.backgroundColor = '#1a6286';
        game.physics.startSystem(Physics.ARCADE);
        trollGenerator = new TrollGenerator(game);

        player = new Player(game, game.world.centerX, game.world.centerY, 'human');

        weapons[0] = new SwordProtector(game, player.x, player.y-100, rpgItemSpriteKey, rpgItem.BasicSword,5);
        weapons[1] = new BasicGun(game, 0,0, rpgItemSpriteKey, rpgItem.Bow,1);
        weapons[2] = new FreezeGun(game, 0,0, rpgItemSpriteKey, rpgItem.Wand, 1);
        spreadWeaponOnRail(weapons, player, WEAPON_DISTANCE, WEAPON_ROTATION_SPD)

        for(let w of weapons){
            w.setOwner(player);
            arcadePhysics.enable(w);
        }

        let circleTrolls = trollGenerator.getTrollsInCircle(player.x,player.y,5,5,150);

        for(let i = 0; i < 1; i++){
            let t = trollGenerator.getOneTroll(50+i*20, 100, undefined, 20);
            trolls.add(t);
        }

        for(let t of circleTrolls){
            trolls = trolls.add(t);
        }

        let pickup = new Pickup(game, 300,300,rpgItemSpriteKey, rpgItem.ShieldGold, 600);

        setUpKeys(game.input.keyboard);
    }

    function update() {
        for(let troll of trolls){
             if(troll.exists){
                arcadePhysics.moveToObject(troll, player, troll.getSpeedCurrent());
                arcadePhysics.overlap(troll, player, troll.onOverlap)
            }
        }
        clearDeadEnemies();

        player.controllPlayer(upKey, downKey, leftKey, rightKey);
        for(let w of weapons){
            w.weaponUpdate(trolls);
            arcadePhysics.overlap(w, Array.from(trolls), w.onOverlap);
        }

        arcadePhysics.collide(Array.from(trolls), Array.from(trolls))

    }

    function render() {
    }

    function clearDeadEnemies(){
        for(let t of trolls){
            if(! t.exists){
                trolls.delete(t);
            }
        }
    }

    function setUpKeys(keyboard:Keyboard){
        upKey = keyboard.addKey(Phaser.Keyboard.UP);
        downKey = keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

};
