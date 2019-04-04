import * as Phaser from 'phaser-ce';
import { Sprite, Physics, Key, Keyboard, Group, Text, } from 'phaser-ce';
import {Player} from './player'
import { TrollGenerator } from './trollGenerator';
import { Troll } from './troll';
import { PlayerWeapon } from './playerweapon';
import { SwordProtector} from './swordProtector'
import { spreadWeaponOnRail, rpgItemSpriteKey, waveDataDependsOnKillCount, waveDropMap, waveNumMap, waveSpeedMap, waveHpMap} from './utils';
import { rpgItem } from './rpgItemEnum';
import { BasicGun } from './basicGun';
import { Pickup } from './pickup';
import { FreezeGun } from './freezeGun';
import { WEAPON_DISTANCE, WEAPON_ROTATION_SPD, PICKUP_DEFAULT_LIFE } from './config';
import { pickupGroup, dmgTextGroup, clearGlobalGroups} from './globals';
import EnemyController from './enemyController';

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
    let weaponInfo: Phaser.Text;
    let enemyController: EnemyController;


    let startButton: Phaser.Button;
    let gameStarted: boolean;

    function create () {
        arcadePhysics = game.physics.arcade;
        gameStarted = false;

        const bgColor = '#1a6286';
        const whiteCOlor = '#ffffff';
        game.stage.backgroundColor = whiteCOlor;
        startButton = game.add.button(200,200, rpgItemSpriteKey, buttonStartGame,undefined,
                                            rpgItem.ScrollBlue,rpgItem.ScrollRed);

        game.physics.startSystem(Physics.ARCADE);
        setUpKeys(game.input.keyboard);
        weapons = [];
    }

    function buttonStartGame(){
        startButton.kill();
        gameStarted = true;
        gameStartCreate();
    }

    function update () {
        if(gameStarted){
            gameStartUpdate();
        }
    }

    function gameStartCreate(){
        player = new Player(game, game.world.centerX, game.world.centerY, 'human');
        trollGenerator = new TrollGenerator(game);
        enemyController = new EnemyController(game, player, trollGenerator);

        player.alive = true;

        trollGenerator.setStats(player.x, player.y, 10, 5, 30);

        weapons[0] = new SwordProtector(game, player.x, player.y, rpgItemSpriteKey, rpgItem.BasicSword,10);
        weapons[1] = new BasicGun(game, 0,10, rpgItemSpriteKey, rpgItem.Bow,4);
        weapons[2] = new FreezeGun(game, 10,0, rpgItemSpriteKey, rpgItem.Wand, 1);
        spreadWeaponOnRail(weapons, player, WEAPON_DISTANCE, WEAPON_ROTATION_SPD)

        weaponInfo = game.add.text(100,50,"", {font: '16px'})
    }

    function gameOverClear(){
        gameStarted = false;
        startButton.revive();
        enemyController.clearAllEnemy();
        for(const w of weapons){
            w.destroy();
        }
        weapons = []

        clearGlobalGroups();
        weaponInfo.destroy();
    }

    function gameStartUpdate() {
        if(! player.alive){
            gameOverClear();
            return;
        }

        enemyController.update();
        player.update();

        const info = weapons[0].getWeaponInfo()
            + weapons[1].getWeaponInfo()
            + weapons[2].getWeaponInfo()
            + 'total kill:' + enemyController.totalKillCount + '\n'
        weaponInfo.text = info;

        player.controllPlayer(upKey, downKey, leftKey, rightKey);
        for(let w of weapons){
            w.weaponUpdate(enemyController.getAllTrolls());
        }

        const trolls = enemyController.getAllTrolls();
        arcadePhysics.collide(Array.from(trolls), Array.from(trolls))
        for(let pickUp of pickupGroup){
            arcadePhysics.overlap(pickUp, weapons, pickUp.onPickUp);
        }

        for(let dmgText of dmgTextGroup){
            dmgText.update();
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
