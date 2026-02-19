using ProjectEntity.Backend.Services;
using Microsoft.AspNetCore.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using ProjectEntity.Core.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

        // Enable polymorphic serialization for Card subtypes
        // This ensures Pawn properties (level, attack, defense) are included
        // when serializing from List<Card>
        options.JsonSerializerOptions.TypeInfoResolver = new DefaultJsonTypeInfoResolver
        {
            Modifiers =
            {
                static typeInfo =>
                {
                    if (typeInfo.Type != typeof(Card)) return;

                    // Find all concrete Card types in loaded assemblies
                    var cardTypes = AppDomain.CurrentDomain.GetAssemblies()
                        .SelectMany(a =>
                        {
                            try { return a.GetTypes(); }
                            catch { return Array.Empty<Type>(); }
                        })
                        .Where(t => t.IsSubclassOf(typeof(Card)) && !t.IsAbstract)
                        .ToList();

                    typeInfo.PolymorphismOptions = new JsonPolymorphismOptions
                    {
                        UnknownDerivedTypeHandling = JsonUnknownDerivedTypeHandling.FallBackToNearestAncestor
                    };

                    foreach (var ct in cardTypes)
                    {
                        typeInfo.PolymorphismOptions.DerivedTypes.Add(
                            new JsonDerivedType(ct));
                    }
                }
            }
        };
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register Game Logic Service (Singleton state for now)
builder.Services.AddSingleton<GameService>();

// CORS for Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
