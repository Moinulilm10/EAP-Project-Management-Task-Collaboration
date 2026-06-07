"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTeam = void 0;
const typeorm_1 = require("typeorm");
const Team_entity_1 = require("./Team.entity");
const Task_entity_1 = require("./Task.entity");
let TaskTeam = class TaskTeam {
    id;
    teamId;
    taskId;
    team;
    task;
};
exports.TaskTeam = TaskTeam;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TaskTeam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], TaskTeam.prototype, "teamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], TaskTeam.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_entity_1.Team, (team) => team.taskTeams, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "teamId" }),
    __metadata("design:type", Team_entity_1.Team)
], TaskTeam.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_entity_1.Task, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "taskId" }),
    __metadata("design:type", Task_entity_1.Task)
], TaskTeam.prototype, "task", void 0);
exports.TaskTeam = TaskTeam = __decorate([
    (0, typeorm_1.Entity)("task_teams"),
    (0, typeorm_1.Index)(["teamId"]),
    (0, typeorm_1.Index)(["taskId"]),
    (0, typeorm_1.Unique)(["teamId", "taskId"])
], TaskTeam);
