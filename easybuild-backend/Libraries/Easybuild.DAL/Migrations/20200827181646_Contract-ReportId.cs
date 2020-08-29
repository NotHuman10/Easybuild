using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Easybuild.DAL.Migrations
{
    public partial class ContractReportId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FilesMetadata_Users_OwnerId",
                table: "FilesMetadata");

            migrationBuilder.AlterColumn<int>(
                name: "OwnerId",
                table: "FilesMetadata",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<Guid>(
                name: "ReportId",
                table: "Contracts",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FilesMetadata_Users_OwnerId",
                table: "FilesMetadata",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FilesMetadata_Users_OwnerId",
                table: "FilesMetadata");

            migrationBuilder.DropColumn(
                name: "ReportId",
                table: "Contracts");

            migrationBuilder.AlterColumn<int>(
                name: "OwnerId",
                table: "FilesMetadata",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FilesMetadata_Users_OwnerId",
                table: "FilesMetadata",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
