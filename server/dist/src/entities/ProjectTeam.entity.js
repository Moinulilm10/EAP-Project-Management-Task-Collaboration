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
exports.ProjectTeam = void 0;
const typeorm_1 = require("typeorm");
const Team_entity_1 = require("./Team.entity");
const Project_entity_1 = require("./Project.entity");
let ProjectTeam = class ProjectTeam {
    id;
    teamId;
    projectId;
    team;
    project;
};
exports.ProjectTeam = ProjectTeam;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ProjectTeam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], ProjectTeam.prototype, "teamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], ProjectTeam.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_entity_1.Team, (team) => team.projectTeams, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "teamId" }),
    __metadata("design:type", Team_entity_1.Team)
], ProjectTeam.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_entity_1.Project, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "projectId" }),
    __metadata("design:type", Project_entity_1.Project)
], ProjectTeam.prototype, "project", void 0);
exports.ProjectTeam = ProjectTeam = __decorate([
    (0, typeorm_1.Entity)("project_teams"),
    (0, typeorm_1.Index)(["teamId"]),
    (0, typeorm_1.Index)(["projectId"]),
    (0, typeorm_1.Unique)(["teamId", "projectId"])
], ProjectTeam);
