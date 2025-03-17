using AutoMapper;
using Web.Net.Api.PostModels;
using Web.Net.Core.DTOs;

namespace Web.Net.Api
{
    public class MappingPostProfile:Profile
    {
        public MappingPostProfile()
        {
            CreateMap<UserPostModel, UserDto>();
            CreateMap<AlbumPostModel,AlbumDto >();
            CreateMap<FilePostModel, FileDto>();
            CreateMap<MessagePostModel, MessageDto>();
            CreateMap<TagPostModel, TagDto>();
        }
    }
}
