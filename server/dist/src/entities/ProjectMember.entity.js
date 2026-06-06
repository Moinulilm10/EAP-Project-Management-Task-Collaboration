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
exports.ProjectMemberRoleHierarchy = exports.ProjectMember = exports.ProjectRoleName = void 0;
const typeorm_1 = require("typeorm");
const Project_entity_1 = require("./Project.entity");
const User_entity_1 = require("./User.entity");
const Role_entity_1 = require("./Role.entity");
var ProjectRoleName;
(function (ProjectRoleName) {
    ProjectRoleName["ADMIN"] = "Admin";
    ProjectRoleName["PROJECT_MANAGER"] = "Project Manager";
    ProjectRoleName["TEAM_MEMBER"] = "Team Member";
})(ProjectRoleName || (exports.ProjectRoleName = ProjectRoleName = {}));
let ProjectMember = class ProjectMember {
    id;
    projectId;
    userId;
    roleId;
    role;
    project;
    user;
};
exports.ProjectMember = ProjectMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ProjectMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], ProjectMember.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], ProjectMember.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], ProjectMember.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Role_entity_1.Role, { eager: true, onDelete: "SET NULL", nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "roleId" }),
    __metadata("design:type", Object)
], ProjectMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_entity_1.Project, (project) => project.projectMembers, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "projectId" }),
    __metadata("design:type", Project_entity_1.Project)
], ProjectMember.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.projectMemberships, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", User_entity_1.User)
], ProjectMember.prototype, "user", void 0);
exports.ProjectMember = ProjectMember = __decorate([
    (0, typeorm_1.Entity)("project_members"),
    (0, typeorm_1.Index)(["projectId"]),
    (0, typeorm_1.Index)(["userId"]),
    (0, typeorm_1.Unique)(["projectId", "userId"])
], ProjectMember);
/**
 * Role hierarchy for project members.
 * Higher values = more permissions.
 */
exports.ProjectMemberRoleHierarchy = {
    [ProjectRoleName.ADMIN]: 3,
    [ProjectRoleName.PROJECT_MANAGER]: 2,
    [ProjectRoleName.TEAM_MEMBER]: 1,
};
