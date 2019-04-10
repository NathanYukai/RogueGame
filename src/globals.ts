import { Pickup } from "./ppickup";
import { DmgText } from "./dmgText";
import { Sprite } from "phaser-ce";

export let pickupGroup: Set<Pickup>;
export let dmgTextGroup: Set<DmgText>;
export let explodeGroup: Set<Sprite>;
pickupGroup = new Set();
dmgTextGroup = new Set();
explodeGroup = new Set();

export function clearGlobalGroups() {
    for (const p of pickupGroup) {
        p.destroy();
    }
    for (const t of dmgTextGroup) {
        t.destroy();
    }
    for (const e of explodeGroup) {
        e.destroy();
    }

    pickupGroup.clear();
    dmgTextGroup.clear();
    explodeGroup.clear();
}
