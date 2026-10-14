using AutoMapper;
using Application.DTOs;
using Domain.Models;

namespace Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Course -> list and detail DTOs
            CreateMap<Course, CourseDto>()
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name))
                .ForMember(d => d.InstructorName, o => o.MapFrom(s => s.Instructor.User.FirstName + " " + s.Instructor.User.LastName));

            CreateMap<Course, CourseDetailDto>()
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name))
                .ForMember(d => d.InstructorName, o => o.MapFrom(s => s.Instructor.User.FirstName + " " + s.Instructor.User.LastName));

            // AcademyProgram -> list and detail DTOs
            CreateMap<AcademyProgram, ProgramDto>()
                .ForMember(d => d.CourseCount, o => o.MapFrom(s => s.ProgramCourses.Count));

            CreateMap<AcademyProgram, ProgramDetailDto>()
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name))
                .ForMember(d => d.IncludedCourses, o => o.MapFrom(s => s.ProgramCourses.Select(pc => pc.Course)));

            // CareerPath -> list DTO (detail DTO's lists are filled manually in the service)
            CreateMap<CareerPath, CareerPathDto>();
            CreateMap<CareerPath, CareerPathDetailDto>();

            // Category
            CreateMap<Category, CategoryDto>();
        }
    }
}