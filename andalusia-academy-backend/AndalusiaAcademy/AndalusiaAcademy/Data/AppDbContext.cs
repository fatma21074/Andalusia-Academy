using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace AndalusiaAcademy.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Role> Roles => Set<Role>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Instructor> Instructors => Set<Instructor>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Course> Courses => Set<Course>();
        public DbSet<AcademyProgram> AcademyPrograms => Set<AcademyProgram>();
        public DbSet<ProgramCourse> ProgramCourses => Set<ProgramCourse>();
        public DbSet<CareerPath> CareerPaths => Set<CareerPath>();
        public DbSet<CareerPathProgram> CareerPathPrograms => Set<CareerPathProgram>();
        public DbSet<EnrollmentApplication> Applications => Set<EnrollmentApplication>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Enrollment> Enrollments => Set<Enrollment>();
        public DbSet<Session> Sessions => Set<Session>();
        public DbSet<Attendance> Attendances => Set<Attendance>();
        public DbSet<Assignment> Assignments => Set<Assignment>();
        public DbSet<Submission> Submissions => Set<Submission>();
        public DbSet<Testimonial> Testimonials => Set<Testimonial>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            // Composite keys for join tables (Standards doc: "correct primary keys ... for relationships")
            b.Entity<ProgramCourse>().HasKey(pc => new { pc.ProgramId, pc.CourseId });
            b.Entity<CareerPathProgram>().HasKey(cp => new { cp.CareerPathId, cp.ProgramId });

            // Standards doc: "Do not duplicate data unnecessarily" -> uniqueness rules
            b.Entity<User>().HasIndex(u => u.Email).IsUnique();
            b.Entity<Instructor>().HasIndex(i => i.UserId).IsUnique();
            b.Entity<Category>().HasIndex(c => c.Name).IsUnique();

            // Decimal precision so EF doesn't silently truncate money values
            b.Entity<Course>().Property(c => c.Price).HasPrecision(18, 2);
            b.Entity<AcademyProgram>().Property(p => p.Price).HasPrecision(18, 2);
            b.Entity<Payment>().Property(p => p.Amount).HasPrecision(18, 2);
            b.Entity<Instructor>().Property(i => i.RatePerHour).HasPrecision(10, 2);

            // Default every relationship to Restrict, to avoid SQL Server's
            // "multiple cascade paths" errors once tables have more than one FK route.
            foreach (var fk in b.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                fk.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }
    }
}