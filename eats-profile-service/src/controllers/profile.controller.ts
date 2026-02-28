import { Request, Response } from "express";
import { profileService } from "../services/profile.service";

class ProfileController {
  getProfile(req: Request, res: Response): void {
    const profile = profileService.getOrCreateByUserId(req.params.userId);
    res.status(200).json(profile);
  }

  updateProfile(req: Request, res: Response): void {
    const profile = profileService.updateProfile(req.params.userId, req.body);
    res.status(200).json(profile);
  }

  updatePreferences(req: Request, res: Response): void {
    const profile = profileService.updatePreferences(req.params.userId, req.body);
    res.status(200).json(profile);
  }
}

export default new ProfileController();
