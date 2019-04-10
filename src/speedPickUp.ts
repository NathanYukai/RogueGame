import { Pickup } from "./pickup";
import { PlayerWeapon } from "./Weapons/playerweapon";

export class SpeedPickUp extends Pickup {
    onPickUp(pickup: Pickup, weapon: PlayerWeapon) {
        if (pickup.canBePicked()) {
            pickup.destroy();
            weapon.onSpeedUpgrade(pickup.getPower())
        }
    }
}
