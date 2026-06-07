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
exports.Team = void 0;
const typeorm_1 = require("typeorm");
const TeamMember_entity_1 = require("./TeamMember.entity");
const ProjectTeam_entity_1 = require("./ProjectTeam.entity");
const TaskTeam_entity_1 = require("./TaskTeam.entity");
let Team = class Team {
    id;
    name;
    description;
    maxMembers;
    createdAt;
    updatedAt;
    deletedAt;
    members;
    projectTeams;
    taskTeams;
};
exports.Team = Team;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Team.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 200 }),
    __metadata("design:type", String)
], Team.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], Team.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 10 }),
    __metadata("design:type", Number)
], Team.prototype, "maxMembers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Team.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Team.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Object)
], Team.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TeamMember_entity_1.TeamMember, (teamMember) => teamMember.team),
    __metadata("design:type", Array)
], Team.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProjectTeam_entity_1.ProjectTeam, (projectTeam) => projectTeam.team),
    __metadata("design:type", Array)
], Team.prototype, "projectTeams", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TaskTeam_entity_1.TaskTeam, (taskTeam) => taskTeam.team),
    __metadata("design:type", Array)
], Team.prototype, "taskTeams", void 0);
exports.Team = Team = __decorate([
    (0, typeorm_1.Entity)("teams")
], Team);
