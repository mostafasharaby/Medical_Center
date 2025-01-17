using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AngularApi.Migrations
{
    /// <inheritdoc />
    public partial class changeClientReviewToPatientReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientReviews_AspNetUsers_PatientId",
                table: "ClientReviews");

            migrationBuilder.DropForeignKey(
                name: "FK_ClientReviews_Doctors_DoctorId",
                table: "ClientReviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ClientReviews",
                table: "ClientReviews");

            migrationBuilder.RenameTable(
                name: "ClientReviews",
                newName: "PatientReviews");

            migrationBuilder.RenameIndex(
                name: "IX_ClientReviews_PatientId",
                table: "PatientReviews",
                newName: "IX_PatientReviews_PatientId");

            migrationBuilder.RenameIndex(
                name: "IX_ClientReviews_DoctorId",
                table: "PatientReviews",
                newName: "IX_PatientReviews_DoctorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PatientReviews",
                table: "PatientReviews",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PatientReviews_AspNetUsers_PatientId",
                table: "PatientReviews",
                column: "PatientId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PatientReviews_Doctors_DoctorId",
                table: "PatientReviews",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PatientReviews_AspNetUsers_PatientId",
                table: "PatientReviews");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientReviews_Doctors_DoctorId",
                table: "PatientReviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PatientReviews",
                table: "PatientReviews");

            migrationBuilder.RenameTable(
                name: "PatientReviews",
                newName: "ClientReviews");

            migrationBuilder.RenameIndex(
                name: "IX_PatientReviews_PatientId",
                table: "ClientReviews",
                newName: "IX_ClientReviews_PatientId");

            migrationBuilder.RenameIndex(
                name: "IX_PatientReviews_DoctorId",
                table: "ClientReviews",
                newName: "IX_ClientReviews_DoctorId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClientReviews",
                table: "ClientReviews",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientReviews_AspNetUsers_PatientId",
                table: "ClientReviews",
                column: "PatientId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientReviews_Doctors_DoctorId",
                table: "ClientReviews",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id");
        }
    }
}
