import { Pickup } from "./pickup";
import { DmgText } from "./dmgText";
import { Sprite } from "phaser-ce";

export let pickupGroup: Set<Pickup>;
export let dmgTextGroup: Set<DmgText>;
export let explodeGroup: Set<Sprite>;
pickupGroup = new Set();
dmgTextGroup = new Set();
explodeGroup = new Set();
