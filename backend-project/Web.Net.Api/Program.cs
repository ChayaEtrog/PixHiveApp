using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Web.Net.Api.Extensions;
using Web.Net.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDependencyInjectoions();

builder.Services.AddSwagger();
builder.Services.AddAllowAnyCors();
builder.AddJwtAuthentication();
builder.AddJwtAuthorization();


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(@"Data Source = DESKTOP-SSNMLFD; Initial Catalog = PicHive; Integrated Security = True; TrustServerCertificate=True"));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(CoresExtension.MyAllowSpecificOrigins);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
