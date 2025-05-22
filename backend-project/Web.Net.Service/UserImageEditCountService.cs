using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;
using Web.Net.Data.Repositories;


namespace Web.Net.Service
{
    public class UserImageEditCountService(IRepositoryManager repositoryManager) :IUserImageEditCountService
    {
        private readonly IRepositoryManager _repositoryManager = repositoryManager;

        public async Task<Result<int>> GetEditCountAsync(int userId)
        {
            var record = await _repositoryManager.UserImageEditCount.GetByUserIdAsync(userId);

            if (record == null)
                return Result<int>.Success(0);

            return Result<int>.Success(record.EditCount);
        }

        public async Task<Result<bool>> IncrementEditCountAsync(int userId)
        {
            var record = await _repositoryManager.UserImageEditCount.GetByUserIdAsync(userId);

            if (record == null)
            {
                var newRecord = new UserImageEditEntity
                {
                    UserId = userId,
                    EditCount = 1
                };

                await _repositoryManager.UserImageEditCount.AddAsync(newRecord);
                await _repositoryManager.Save();
                return Result<bool>.Success(true);
            }

            record.EditCount++;
            await _repositoryManager.UserImageEditCount.UpdateAsync(record);
            await _repositoryManager.Save();
            return Result<bool>.Success(true);
        }
    }
}
