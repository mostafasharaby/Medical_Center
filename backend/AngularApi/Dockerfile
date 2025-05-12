FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app
COPY . .

RUN dotnet restore

RUN dotnet build -c Release -o /app/build

RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=0 /app/publish .

EXPOSE 80
CMD ["dotnet", "AngularApi.dll"]


# the image name is  mvc-test-docker
# docker run -d --name TestDocker-app -p 8004:8080 mvc-test-docker     -> this was the issue :8080  not 80 
