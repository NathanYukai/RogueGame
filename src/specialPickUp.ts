import { Pickup } from "./pickup";
import { PlayerWeapon } from "./Weapons/playerweapon";

export class SpecialPickUp extends Pickup {
    onPickUp(pickup: Pickup, weapon: PlayerWeapon) {
        if (pickup.canBePicked()) {
            pickup.destroy();
            weapon.onSpecialUpgrade(pickup.getPower());
        }
    }
}
