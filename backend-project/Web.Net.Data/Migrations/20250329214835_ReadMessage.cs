using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web.Net.Data.Migrations
{
    /// <inheritdoc />
    public partial class ReadMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MessageEntityId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_MessageEntityId",
                table: "Users",
                column: "MessageEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Messages_MessageEntityId",
                table: "Users",
                column: "MessageEntityId",
                principalTable: "Messages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Messages_MessageEntityId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_MessageEntityId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MessageEntityId",
                table: "Users");
        }
    }
}
