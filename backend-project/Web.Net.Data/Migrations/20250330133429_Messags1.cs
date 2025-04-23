using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web.Net.Data.Migrations
{
    /// <inheritdoc />
    public partial class Messags1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMessageReads_Messages_MessageId",
                table: "UserMessageReads");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMessageReads_Messages_MessageId1",
                table: "UserMessageReads");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMessageReads_Users_UserId",
                table: "UserMessageReads");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMessageReads_Users_UserId1",
                table: "UserMessageReads");

            migrationBuilder.DropIndex(
                name: "IX_UserMessageReads_MessageId",
                table: "UserMessageReads");

            migrationBuilder.DropIndex(
                name: "IX_UserMessageReads_MessageId1",
                table: "UserMessageReads");

            migrationBuilder.DropIndex(
                name: "IX_UserMessageReads_UserId1",
                table: "UserMessageReads");

            migrationBuilder.DropColumn(
                name: "MessageId1",
                table: "UserMessageReads");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserMessageReads");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MessageId1",
                table: "UserMessageReads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "UserMessageReads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserMessageReads_MessageId",
                table: "UserMessageReads",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMessageReads_MessageId1",
                table: "UserMessageReads",
                column: "MessageId1");

            migrationBuilder.CreateIndex(
                name: "IX_UserMessageReads_UserId1",
                table: "UserMessageReads",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMessageReads_Messages_MessageId",
                table: "UserMessageReads",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMessageReads_Messages_MessageId1",
                table: "UserMessageReads",
                column: "MessageId1",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserMessageReads_Users_UserId",
                table: "UserMessageReads",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMessageReads_Users_UserId1",
                table: "UserMessageReads",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
