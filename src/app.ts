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
import { pickupGroup, dmgTextGroup} from './globals';

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
    let trolls_regular: Set<Troll> = new Set();
    let trolls_formation: Set<Troll> = new Set();

    let trollWaveGapInFrame = 600;
    let trollWaveCount = 0;

    let weaponInfo: Phaser.Text;

    let totalKillCount = 0;

    function create () {
        arcadePhysics = game.physics.arcade;

        const bgColor = '#1a6286';
        const whiteCOlor = '#ffffff';
        game.stage.backgroundColor = whiteCOlor;
        game.physics.startSystem(Physics.ARCADE);
        player = new Player(game, game.world.centerX, game.world.centerY, 'human');

        trollGenerator = new TrollGenerator(game);
        trollGenerator.setStats(player.x, player.y, 10, 5, 30);

        weapons = [];
        weapons[0] = new SwordProtector(game, player.x, player.y, rpgItemSpriteKey, rpgItem.BasicSword,10);
        weapons[1] = new BasicGun(game, 0,10, rpgItemSpriteKey, rpgItem.Bow,4);
        weapons[2] = new FreezeGun(game, 10,0, rpgItemSpriteKey, rpgItem.Wand, 1);
        spreadWeaponOnRail(weapons, player, WEAPON_DISTANCE, WEAPON_ROTATION_SPD)

        weaponInfo = game.add.text(100,100,"", {font: '16px'})

        setUpKeys(game.input.keyboard);
    }

    function update() {

        const info = weapons[0].getWeaponInfo()
            + weapons[1].getWeaponInfo()
            + weapons[2].getWeaponInfo();
        weaponInfo.text = info;

        enemyWaveControl();
        player.controllPlayer(upKey, downKey, leftKey, rightKey);
        for(let w of weapons){
            w.weaponUpdate(trolls);
        }

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

    function clearDeadEnemies(){
        //qq clear all set of trolls

        for(let t of trolls){
            if(! t.exists){
                trolls.delete(t);
                totalKillCount ++;
            }
        }

        for(let t of trolls_regular){
            if(! t.exists){
                trolls_regular.delete(t);
            }
        }

        for(let t of trolls_formation){
             if(! t.exists){
                trolls_regular.delete(t);
            }
        }
    }

    function enemyWaveControl(){
        trollWaveCount --;
        let circleTrolls: Troll[] = [];
        let formationTrolls: Troll[] = [];
        if(trollWaveCount<0){
            const numberOfEnemy = waveDataDependsOnKillCount(waveNumMap, totalKillCount);
            const dropChance = waveDataDependsOnKillCount(waveDropMap, totalKillCount);
            const speed = waveDataDependsOnKillCount(waveSpeedMap, totalKillCount);
            const hp = waveDataDependsOnKillCount(waveHpMap, totalKillCount);
            trollGenerator.setDropChance(dropChance);
            trollGenerator.setSpeed(speed);
            trollGenerator.setHp(hp);

            // circleTrolls = trollGenerator.getTrollsInCircle(numberOfEnemy,250);
            formationTrolls = trollGenerator.getTrollsInFormation(5,5,100,100,30);

            trollWaveCount = trollWaveGapInFrame;
        }

        // for(let t of circleTrolls){
        //     trolls = trolls.add(t);
        // }
        for(let t of formationTrolls){
            trolls.add(t);
            trolls_formation.add(t);
        }

        clearDeadEnemies();
        trollsMoveToOneDirection(trolls_formation, 2,-0.5);
    }

    function trollsMoveTowardsPlayer(trolls_control: Set<Troll>){
        for(let troll of trolls_control){
            arcadePhysics.moveToObject(troll, player, troll.getSpeedCurrent());
            arcadePhysics.overlap(troll, player, troll.onOverlap)
        }
    }

    function trollsMoveToOneDirection(trolls_control: Set<Troll>, x:number, y:number){
        if(trolls_control.size == 0){
            return;
        }
        for(let troll of trolls_control){
            if(! troll.exists){
                continue;
            }
            const spd = troll.getSpeedCurrent();
            const angle = Math.atan2(-y, x);
            const n_x = spd * Math.cos(angle);
            const n_y = spd * Math.sin(angle);

            troll.body.velocity.x = n_x;
            troll.body.velocity.y = n_y;
            arcadePhysics.overlap(troll, player, troll.onOverlap)
        }
    }

    function setUpKeys(keyboard:Keyboard){
        upKey = keyboard.addKey(Phaser.Keyboard.UP);
        downKey = keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

};
