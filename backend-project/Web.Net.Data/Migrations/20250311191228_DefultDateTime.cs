using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web.Net.Data.Migrations
{
    /// <inheritdoc />
    public partial class DefultDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileEntityTagEntity_Files_FilesId",
                table: "FileEntityTagEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_FileEntityTagEntity_Tags_TagsId",
                table: "FileEntityTagEntity");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.AddForeignKey(
                name: "FK_FileEntityTagEntity_Files_FilesId",
                table: "FileEntityTagEntity",
                column: "FilesId",
                principalTable: "Files",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FileEntityTagEntity_Tags_TagsId",
                table: "FileEntityTagEntity",
                column: "TagsId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileEntityTagEntity_Files_FilesId",
                table: "FileEntityTagEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_FileEntityTagEntity_Tags_TagsId",
                table: "FileEntityTagEntity");

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_FileEntityTagEntity_Files_FilesId",
                table: "FileEntityTagEntity",
                column: "FilesId",
                principalTable: "Files",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FileEntityTagEntity_Tags_TagsId",
                table: "FileEntityTagEntity",
                column: "TagsId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
