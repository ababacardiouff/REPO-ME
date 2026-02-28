import { Request, Response } from "express";
import { addressService } from "../services/address.service";
import { profileService } from "../services/profile.service";

class AddressController {
  getAddresses(req: Request, res: Response): void {
    const profile = profileService.getOrCreateByUserId(req.params.userId);
    res.status(200).json(addressService.list(profile.id));
  }

  addAddress(req: Request, res: Response): void {
    const profile = profileService.getOrCreateByUserId(req.params.userId);
    const address = addressService.create(profile.id, req.body);
    res.status(201).json(address);
  }

  updateAddress(req: Request, res: Response): void {
    const profile = profileService.getOrCreateByUserId(req.params.userId);
    const updated = addressService.update(profile.id, req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: "Address not found" });
      return;
    }
    res.status(200).json(updated);
  }

  deleteAddress(req: Request, res: Response): void {
    const profile = profileService.getOrCreateByUserId(req.params.userId);
    const removed = addressService.remove(profile.id, req.params.id);
    res.status(removed ? 204 : 404).send();
  }
}

export default new AddressController();
