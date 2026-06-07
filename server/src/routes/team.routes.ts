import { Router } from "express";
import { teamController } from "../controllers/team.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", teamController.createTeam);
router.get("/", teamController.getTeams);
router.get("/:id", teamController.getTeamById);
router.post("/:id/members", teamController.addMember);
router.post("/:id/projects", teamController.assignProject);
router.post("/:id/tasks", teamController.assignTask);
router.put("/:id/capacity", teamController.updateCapacity);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);
router.delete("/:id/members/:userId", teamController.removeMember);

export default router;
