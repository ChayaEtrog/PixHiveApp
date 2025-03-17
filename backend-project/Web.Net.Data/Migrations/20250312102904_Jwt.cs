using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web.Net.Data.Migrations
{
    /// <inheritdoc />
    public partial class Jwt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_Roles_RolesId",
                table: "Permissions");

            migrationBuilder.DropTable(
                name: "RolesUserEntity");

            migrationBuilder.RenameColumn(
                name: "RolesId",
                table: "Permissions",
                newName: "RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_Permissions_RolesId",
                table: "Permissions",
                newName: "IX_Permissions_RoleId");

            migrationBuilder.CreateTable(
                name: "RoleUserEntity",
                columns: table => new
                {
                    UserRolesId = table.Column<int>(type: "int", nullable: false),
                    UserRolesId1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleUserEntity", x => new { x.UserRolesId, x.UserRolesId1 });
                    table.ForeignKey(
                        name: "FK_RoleUserEntity_Roles_UserRolesId",
                        column: x => x.UserRolesId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoleUserEntity_Users_UserRolesId1",
                        column: x => x.UserRolesId1,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RoleUserEntity_UserRolesId1",
                table: "RoleUserEntity",
                column: "UserRolesId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_Roles_RoleId",
                table: "Permissions",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_Roles_RoleId",
                table: "Permissions");

            migrationBuilder.DropTable(
                name: "RoleUserEntity");

            migrationBuilder.RenameColumn(
                name: "RoleId",
                table: "Permissions",
                newName: "RolesId");

            migrationBuilder.RenameIndex(
                name: "IX_Permissions_RoleId",
                table: "Permissions",
                newName: "IX_Permissions_RolesId");

            migrationBuilder.CreateTable(
                name: "RolesUserEntity",
                columns: table => new
                {
                    UserRolesId = table.Column<int>(type: "int", nullable: false),
                    UserRolesId1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolesUserEntity", x => new { x.UserRolesId, x.UserRolesId1 });
                    table.ForeignKey(
                        name: "FK_RolesUserEntity_Roles_UserRolesId1",
                        column: x => x.UserRolesId1,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolesUserEntity_Users_UserRolesId",
                        column: x => x.UserRolesId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RolesUserEntity_UserRolesId1",
                table: "RolesUserEntity",
                column: "UserRolesId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_Roles_RolesId",
                table: "Permissions",
                column: "RolesId",
                principalTable: "Roles",
                principalColumn: "Id");
        }
    }
}
