import { Pickup } from "./pickup";
import { PlayerWeapon } from "./Weapons/playerweapon";

export class PowerPickUp extends Pickup {

    onPickUp(pickup: Pickup, weapon: PlayerWeapon) {
        if (pickup.canBePicked()) {
            pickup.destroy();
            weapon.onPowerUpgrade(pickup.getPower());
        }
    }
}
