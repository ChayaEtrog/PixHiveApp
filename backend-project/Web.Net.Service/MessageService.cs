using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;

namespace Web.Net.Service
{
    public class MessageService(IRepositoryManager repositoryManager, IMapper mapper) : IMessageService
    {
        private readonly IRepositoryManager _repositoryManager=repositoryManager;
        private readonly IMapper _mapper= mapper;

        public async Task<Result<MessageDto>> AddMessageAsync(MessageDto entity)
        {
            entity.CreatedAt = DateTime.Now;
            var message = _mapper.Map<MessageEntity>(entity);
            await _repositoryManager.Messages.AddAsync(message);
            await _repositoryManager.Save();

            return Result<MessageDto>.Success(_mapper.Map<MessageDto>(message)); 
        }

        public async Task<Result<MessageDto>> DeleteMessageAsync(int messageId)
        {
            var message = await _repositoryManager.Messages.GetByIdAsync(messageId);
            if (message == null)
                return Result<MessageDto>.NotFound("Message not found.");

            _repositoryManager.Messages.DeleteMessage(messageId);
            await _repositoryManager.Save();

            return Result<MessageDto>.Success(null); 
        }

        public async Task<Result<MessageDto>> GetMessageByIdAsync(int id)
        {
            var message = await _repositoryManager.Messages.GetByIdAsync(id);
            if (message == null)
                return Result<MessageDto>.NotFound("Message not found.");

            return Result<MessageDto>.Success(_mapper.Map<MessageDto>(message)); 
        }

        public async Task<Result<IEnumerable<MessageDto>>> GetMessagesAsync()
        {
            var messages = await _repositoryManager.Messages.GetFullAsync();
            return Result<IEnumerable<MessageDto>>.Success(_mapper.Map<List<MessageDto>>(messages)); // Return messages wrapped in Result
        }

        public async Task<Result<MessageDto>> UpdateMessageAsync(int id)
        {
            var message = await _repositoryManager.Messages.GetByIdAsync(id);
            if (message == null)
                return Result<MessageDto>.NotFound("Message not found.");

            var result = await _repositoryManager.Messages.ToggleMessageStatusAsync(id);
            await _repositoryManager.Save();
            return Result<MessageDto>.Success(_mapper.Map<MessageDto>(result)); // Return updated message wrapped in Result
        }
    }
}
