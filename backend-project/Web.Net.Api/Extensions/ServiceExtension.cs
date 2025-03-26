using Web.Net.Core;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.InterfaceService;
using Web.Net.Data.Repositories;
using Web.Net.Service;

namespace Web.Net.Api.Extensions
{
    public static class ServiceExtension
    {
        public static void AddDependencyInjectoions(this IServiceCollection services)
        {


            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAlbumService, AlbumService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<ITagService, TagService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IAuthService, AuthService>();

            services.AddScoped<IRepositoryManager, RepositoryManager>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IFileRepository, FileRepository>();
            services.AddScoped<IAlbumRepository, AlbumRepository>();
            services.AddScoped<ITagRepository, TagRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();

            services.AddScoped<IS3Service, S3Service>();

            services.AddScoped<IStatisticsService, StatisticsService>();

            services.AddAutoMapper(typeof(MappingProfile), typeof(MappingPostProfile));
        }
    }
}
