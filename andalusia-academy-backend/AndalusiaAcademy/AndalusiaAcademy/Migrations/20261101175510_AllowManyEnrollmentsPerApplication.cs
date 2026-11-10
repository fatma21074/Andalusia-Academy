using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AndalusiaAcademy.Migrations
{
    /// <inheritdoc />
    public partial class AllowManyEnrollmentsPerApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Enrollments_ApplicationId",
                table: "Enrollments");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollments_ApplicationId",
                table: "Enrollments",
                column: "ApplicationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Enrollments_ApplicationId",
                table: "Enrollments");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollments_ApplicationId",
                table: "Enrollments",
                column: "ApplicationId",
                unique: true);
        }
    }
}
