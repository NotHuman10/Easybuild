using AutoMapper;
using Easybuild.DAL.Entities;
using Easybuild.DAL.Models;
using Microsoft.Extensions.DependencyInjection;

namespace Easybuild.API
{
    internal static class MappingConfiguration
    {
        public static void AddMapping(this IServiceCollection services)
        {
            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.CreateMap<User, UserDTO>();
                mc.CreateMap<UserDTO, User>();

                mc.CreateMap<JobCategory, JobCategoryDTO>();
                mc.CreateMap<JobCategoryDTO, JobCategory>();

                mc.CreateMap<JobProposal, JobProposalDTO>();
                mc.CreateMap<JobProposalDTO, JobProposal>()
                    .ForMember(p => p.JobCategory, opt => opt.Ignore());

                mc.CreateMap<Advert, AdvertDTO>();
                mc.CreateMap<AdvertDTO, Advert>()
                    .ForMember(a => a.User, opt => opt.Ignore());

                mc.CreateMap<AdvertExtended, AdvertExtendedDTO>();
                mc.CreateMap<AdvertExtendedDTO, AdvertExtended>();

                mc.CreateMap<ChatUser, UserDTO>().IncludeMembers(cu => cu.User);
                mc.CreateMap<UserDTO, ChatUser>()
                    .ForMember(c => c.UserId, opt => opt.MapFrom(u => u.Id));

                mc.CreateMap<Chat, ChatDTO>();
                mc.CreateMap<ChatDTO, Chat>();

                mc.CreateMap<MessageDTO, Message>();
                mc.CreateMap<Message, MessageDTO>();

                mc.CreateMap<ChatInfo, ChatInfoDTO>();

                mc.CreateMap<ContractDTO, Contract>();
                mc.CreateMap<Contract, ContractDTO>();
            });

            services.AddSingleton(mappingConfig.CreateMapper());
        }
    }
}