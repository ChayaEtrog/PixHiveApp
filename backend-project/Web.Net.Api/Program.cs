using Amazon.Runtime;
using Amazon.S3;
using DotNetEnv;
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

Env.Load();

builder.Configuration["AWS:BucketName"] = Env.GetString("AWS_BUCKET_NAME");
builder.Configuration["AWS:Region"] = Env.GetString("AWS_REGION");
builder.Configuration["AWS:AccessKey"] = Env.GetString("AWS_ACCESS_KEY_ID");
builder.Configuration["AWS:SecretKey"] = Env.GetString("AWS_SECRET_ACCESS_KEY");

var credentials = new BasicAWSCredentials(
    builder.Configuration["AWS:AccessKey"],
    builder.Configuration["AWS:SecretKey"]
);

var region = Amazon.RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"]);
var s3Client = new AmazonS3Client(credentials, region);

builder.Services.AddSingleton<IAmazonS3>(s3Client);

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
