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
using Web.Net.Data.Repositories;

namespace Web.Net.Service
{
    public class MessageService(IRepositoryManager repositoryManager, IMapper mapper) : IMessageService
    {
        private readonly IRepositoryManager _repositoryManager=repositoryManager;
        private readonly IMapper _mapper= mapper;

        public async Task<Result<MessageDto>> UpdateMessageAsync(int id)
        {
            var message = await _repositoryManager.Messages.GetByIdAsync(id);
            if (message == null)
                return Result<MessageDto>.NotFound("Message not found.");

            var result = await _repositoryManager.Messages.ToggleMessageStatusAsync(id);
            await _repositoryManager.Save();
            return Result<MessageDto>.Success(_mapper.Map<MessageDto>(result)); // Return updated message wrapped in Result
        }

        public async Task<Result<List<MessageDto>>> GetAllMessagesAsync()
        {
            var messages = await _repositoryManager.Messages.GetAllMessagesAsync();
            var dtoList = _mapper.Map<List<MessageDto>>(messages);
            return Result<List<MessageDto>>.Success(dtoList);
        }

        public async Task<Result<List<MessageDto>>> GetMessagesForUserAsync(int userId)
        {
            var messages = await _repositoryManager.Messages.GetMessagesForUserAsync(userId);

            var result = messages.Select(m =>
            {
                var dto = _mapper.Map<MessageDto>(m);
                dto.IsRead = m.UserMessages.FirstOrDefault(um => um.UserId == userId)?.IsRead ?? false;
                return dto;
            }).ToList();

            return Result<List<MessageDto>>.Success(result);
        }

        public async Task<Result<MessageDto>> AddMessageAsync(MessageDto entity)
        {
            entity.CreatedAt = DateTime.Now;
            var message = _mapper.Map<MessageEntity>(entity);

            await _repositoryManager.Messages.AddAsync(message);
            await _repositoryManager.Save();

            if (entity.ReceiverId == null)
            {
                var users = await _repositoryManager.Users.GetAllAsync();

                var userMessages = users.Select(user => new UserEntityMessageEntity
                {
                    UserId = user.Id,
                    MessageId = message.Id,
                    IsRead = false,
                    ReadAt = null
                }).ToList();

                foreach (var userMessage in userMessages)
                {
                    await _repositoryManager.UserMessages.AddAsync(userMessage);
                }

                await _repositoryManager.Save();
            }
            else
            {
                var userMessage = new UserEntityMessageEntity
                {
                    UserId = entity.ReceiverId.Value,
                    MessageId = message.Id,
                    IsRead = false,
                    ReadAt = null
                };

                await _repositoryManager.UserMessages.AddAsync(userMessage);
                await _repositoryManager.Save();
            }

            return Result<MessageDto>.Success(_mapper.Map<MessageDto>(message));
        }

        public async Task<Result<string>> MarkAsReadAsync(int userId, int messageId)
        {
            var message = await _repositoryManager.Messages.GetByIdAsync(messageId);
            if (message == null)
                return Result<string>.Failure("Message not found");

            await _repositoryManager.Messages.MarkAsReadAsync(userId, messageId);
            await _repositoryManager.Save();
            return Result<string>.Success("Sucsess");
        }

        public async Task<Result<string>> DeleteMessageAsync(int messageId)
        {
            var msg = await _repositoryManager.Messages.GetByIdAsync(messageId);
            if (msg == null)
                return Result<string>.Failure("Message not found");

            await _repositoryManager.Messages.DeleteMessageAsync(msg);
            await _repositoryManager.Save();
            return Result<string>.Success("Success");
        }


    }
}
