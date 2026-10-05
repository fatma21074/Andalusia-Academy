using Domain.Models;

namespace AndalusiaAcademy.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(AppDbContext context)
        {
            // Already seeded — don't duplicate on every restart.
            if (context.Roles.Any()) return;

            // ---- Roles ----
            var adminRole = new Role { Name = "Admin" };
            var instructorRole = new Role { Name = "Instructor" };
            var contentManagerRole = new Role { Name = "ContentManager" };
            var learnerRole = new Role { Name = "Learner" };
            context.Roles.AddRange(adminRole, instructorRole, contentManagerRole, learnerRole);
            await context.SaveChangesAsync();

            // ---- Categories ----
            var webDev = new Category { Name = "Web Development" };
            var dataScience = new Category { Name = "Data Science" };
            var marketing = new Category { Name = "Digital Marketing" };
            var design = new Category { Name = "UI/UX Design" };
            context.Categories.AddRange(webDev, dataScience, marketing, design);
            await context.SaveChangesAsync();

            // ---- Instructor users ----
            // NOTE: PasswordHash is a placeholder — real hashing arrives in Sprint 3's auth work.
            var userSara = new User { FirstName = "Sara", LastName = "Nabil", Email = "sara.nabil@andalusia.academy", PasswordHash = "SEED_PLACEHOLDER", Role = instructorRole };
            var userOmar = new User { FirstName = "Omar", LastName = "Said", Email = "omar.said@andalusia.academy", PasswordHash = "SEED_PLACEHOLDER", Role = instructorRole };
            var userLayla = new User { FirstName = "Layla", LastName = "Ahmed", Email = "layla.ahmed@andalusia.academy", PasswordHash = "SEED_PLACEHOLDER", Role = instructorRole };
            context.Users.AddRange(userSara, userOmar, userLayla);
            await context.SaveChangesAsync();

            var instructorSara = new Instructor { User = userSara, Specialization = "Frontend Development", RatePerHour = 150m };
            var instructorOmar = new Instructor { User = userOmar, Specialization = "Data Science", RatePerHour = 180m };
            var instructorLayla = new Instructor { User = userLayla, Specialization = "UI/UX Design", RatePerHour = 140m };
            context.Instructors.AddRange(instructorSara, instructorOmar, instructorLayla);
            await context.SaveChangesAsync();

            // ---- Courses ----
            var course1 = new Course { Title = "React Fundamentals", ShortDescription = "Build modern UIs with React.", FullDescription = "A hands-on introduction to React, hooks, and component design.", Duration = "6 weeks", Schedule = "Sat & Mon, 6-8 PM", Location = "Cairo Branch", Price = 3500m, Status = "open", Type = "offline", Category = webDev, Instructor = instructorSara };
            var course2 = new Course { Title = "Advanced JavaScript", ShortDescription = "Deep dive into modern JS.", FullDescription = "Closures, async patterns, and the event loop, in depth.", Duration = "4 weeks", Schedule = "Sun & Wed, 6-8 PM", Location = "Cairo Branch", Price = 2800m, Status = "open", Type = "offline", Category = webDev, Instructor = instructorSara };
            var course3 = new Course { Title = "Python for Data Analysis", ShortDescription = "Pandas, NumPy, and real datasets.", FullDescription = "Practical data analysis workflows using the Python data stack.", Duration = "8 weeks", Schedule = "Tue & Thu, 5-7 PM", Location = "Alexandria Branch", Price = 4200m, Status = "open", Type = "offline", Category = dataScience, Instructor = instructorOmar };
            var course4 = new Course { Title = "Machine Learning Basics", ShortDescription = "Core ML concepts and models.", FullDescription = "Supervised learning, model evaluation, and your first ML project.", Duration = "10 weeks", Schedule = "Tue & Thu, 7-9 PM", Location = "Alexandria Branch", Price = 5500m, Status = "coming-soon", Type = "offline", Category = dataScience, Instructor = instructorOmar };
            var course5 = new Course { Title = "SEO Fundamentals", ShortDescription = "Rank higher, understand search.", FullDescription = "On-page SEO, keyword research, and technical SEO basics.", Duration = "3 weeks", Schedule = "Mon, 6-8 PM", Location = "Cairo Branch", Price = 1800m, Status = "open", Type = "offline", Category = marketing, Instructor = instructorLayla };
            var course6 = new Course { Title = "Social Media Strategy", ShortDescription = "Plan campaigns that convert.", FullDescription = "Audience research, content calendars, and performance tracking.", Duration = "3 weeks", Schedule = "Wed, 6-8 PM", Location = "Cairo Branch", Price = 1800m, Status = "open", Type = "offline", Category = marketing, Instructor = instructorLayla };
            var course7 = new Course { Title = "UI Design Principles", ShortDescription = "Layout, color, and typography.", FullDescription = "Foundational visual design skills for digital products.", Duration = "5 weeks", Schedule = "Sat, 2-5 PM", Location = "Cairo Branch", Price = 3000m, Status = "open", Type = "offline", Category = design, Instructor = instructorLayla };
            var course8 = new Course { Title = "UX Research Methods", ShortDescription = "Understand real user needs.", FullDescription = "Interviews, usability testing, and turning findings into design decisions.", Duration = "5 weeks", Schedule = "Sat, 10 AM-1 PM", Location = "Cairo Branch", Price = 3000m, Status = "closed", Type = "offline", Category = design, Instructor = instructorLayla };

            context.Courses.AddRange(course1, course2, course3, course4, course5, course6, course7, course8);
            await context.SaveChangesAsync();

            // ---- Programs (each bundles a few courses) ----
            var frontendProgram = new AcademyProgram { Title = "Frontend Development Program", Overview = "Go from HTML basics to building full React applications.", Requirements = "Basic computer literacy", Duration = "10 weeks", Location = "Cairo Branch", Price = 6000m, Status = "open", Category = webDev };
            var dataProgram = new AcademyProgram { Title = "Data Science Program", Overview = "Python, data analysis, and an introduction to machine learning.", Requirements = "Basic math background", Duration = "18 weeks", Location = "Alexandria Branch", Price = 9000m, Status = "open", Category = dataScience };
            var designProgram = new AcademyProgram { Title = "UI/UX Design Program", Overview = "Research, design, and prototype real digital products.", Requirements = "None", Duration = "10 weeks", Location = "Cairo Branch", Price = 5500m, Status = "open", Category = design };

            context.AcademyPrograms.AddRange(frontendProgram, dataProgram, designProgram);
            await context.SaveChangesAsync();

            context.ProgramCourses.AddRange(
                new ProgramCourse { Program = frontendProgram, Course = course1 },
                new ProgramCourse { Program = frontendProgram, Course = course2 },
                new ProgramCourse { Program = dataProgram, Course = course3 },
                new ProgramCourse { Program = dataProgram, Course = course4 },
                new ProgramCourse { Program = designProgram, Course = course7 },
                new ProgramCourse { Program = designProgram, Course = course8 }
            );
            await context.SaveChangesAsync();

            // ---- Career Paths ----
            var frontendCareerPath = new CareerPath { Title = "Frontend Developer", Description = "Build user-facing web applications.", RecommendedSkills = "HTML, CSS, JavaScript, React" };
            var dataCareerPath = new CareerPath { Title = "Data Analyst", Description = "Turn raw data into actionable insights.", RecommendedSkills = "Python, SQL, Statistics" };

            context.CareerPaths.AddRange(frontendCareerPath, dataCareerPath);
            await context.SaveChangesAsync();

            context.CareerPathPrograms.AddRange(
                new CareerPathProgram { CareerPath = frontendCareerPath, Program = frontendProgram },
                new CareerPathProgram { CareerPath = frontendCareerPath, Program = designProgram }, // deliberately overlaps — proves DistinctBy dedupe works
                new CareerPathProgram { CareerPath = dataCareerPath, Program = dataProgram }
            );
            await context.SaveChangesAsync();
        }
    }
}