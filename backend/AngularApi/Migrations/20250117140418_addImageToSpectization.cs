using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AngularApi.Migrations
{
    /// <inheritdoc />
    public partial class addImageToSpectization : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SpecializationImage",
                table: "Specializations",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpecializationImage",
                table: "Specializations");
        }
    }
}
