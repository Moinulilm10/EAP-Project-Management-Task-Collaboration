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
exports.TeamMember = exports.TeamRoleName = void 0;
const typeorm_1 = require("typeorm");
const Team_entity_1 = require("./Team.entity");
const User_entity_1 = require("./User.entity");
var TeamRoleName;
(function (TeamRoleName) {
    TeamRoleName["ADMIN"] = "Admin";
    TeamRoleName["MEMBER"] = "Member";
})(TeamRoleName || (exports.TeamRoleName = TeamRoleName = {}));
let TeamMember = class TeamMember {
    id;
    teamId;
    userId;
    role;
    team;
    user;
};
exports.TeamMember = TeamMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TeamMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], TeamMember.prototype, "teamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], TeamMember.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: TeamRoleName,
        default: TeamRoleName.MEMBER,
    }),
    __metadata("design:type", String)
], TeamMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Team_entity_1.Team, (team) => team.members, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "teamId" }),
    __metadata("design:type", Team_entity_1.Team)
], TeamMember.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", User_entity_1.User)
], TeamMember.prototype, "user", void 0);
exports.TeamMember = TeamMember = __decorate([
    (0, typeorm_1.Entity)("team_members"),
    (0, typeorm_1.Index)(["teamId"]),
    (0, typeorm_1.Index)(["userId"]),
    (0, typeorm_1.Unique)(["teamId", "userId"])
], TeamMember);
