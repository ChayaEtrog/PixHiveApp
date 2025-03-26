using Microsoft.Extensions.Options;

namespace Web.Net.Api.Extensions
{
    public static class CoresExtension
    {
        public const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public static void AddAllowAnyCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins, builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });
        }
    }
}
