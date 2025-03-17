using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;

namespace Web.Net.Core
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<UserEntity, UserDto>().ReverseMap();
            CreateMap<FileEntity, FileDto>().ReverseMap();
            CreateMap<AlbumEntity, AlbumDto>().ReverseMap();
            CreateMap<MessageEntity, MessageDto>().ReverseMap();
            CreateMap<TagEntity, TagDto>().ReverseMap();
        }
    }
}
